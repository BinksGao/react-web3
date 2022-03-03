import AesUtil from './AesUtil'
import { ComUtil as JudgeUtil, globalEnum, ConfigUtil, ComUtil } from '@utils/index'
import { KeyValue } from '@src/typings/global'

// 对 IE 的 Object.assign 进行修改
if (typeof Object.assign !== 'function') {
  Object.assign = function (target:any, varArgs:any) { // .length of function is 2
    'use strict'
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object')
    }
    var to = Object(target)
    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index]
      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey]
          }
        }
      }
    }
    return to
  }
}

export default class SysUtil {
  /**
   * 对象的拷贝
   * @param {*} obj 需要拷贝的对象
   */
  static deepCopyObj (obj:any) {
    if (obj === null) {
      return null
    }
    if (typeof obj !== 'object') {
      return obj
    }
    let newObj:any = {}
    for (const key in obj) {
      newObj[key] = SysUtil.deepCopyObj(obj[key])
    }
    return newObj
  }

  static tableSessionInfoCopy = (sessionKey: string, params: KeyValue = {}):KeyValue => {
    let searchObj = SysUtil.getSessionStorage(sessionKey)
    if (searchObj && searchObj.params) params = { ...searchObj.params, ...params }
    return params
  }

  /**
   * uuid
   */
  static uuid () {
    let s:any = []
    let hexDigits = '0123456789abcdef'
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-'
    return s.join('')
  }

  /**
   *  traceId
   */
  static traceId () {
    return 'WebPage_' + SysUtil.uuid() + '_' + new Date().getTime()
  }

  /**
   * 获取对应的文件信息  sessionStorage
   * @param name  对应保存信息的名称
   */
  static getSessionStorage (name:string) {
    name = ConfigUtil.projectStorageKey + '_' + name
    if (process.env.mode === 'prod') name = AesUtil.md5(name)
    let o = sessionStorage.getItem(name)
    if (typeof o !== 'undefined' && o !== null) {
      let obj:any = {}
      if (process.env.mode === 'prod') {
        obj = AesUtil.decryptECB(o)
      } else {
        obj = o
      }
      return JSON.parse(obj)
    }
    return null
  }

  /**
   * 设置保存信息  sessionStorage
   * @param name  保存的姓名
   * @param obj   需要存储的对象
   * @param time  存在时间
   */
  static setSessionStorage (name:string, obj:any, time?:number) {
    name = ConfigUtil.projectStorageKey + '_' + name
    if (obj) {
      obj = JSON.stringify(obj)
      if (process.env.mode === 'prod') {
        obj = AesUtil.encryptECB(obj)
        name = AesUtil.md5(name)
      }
      sessionStorage.setItem(name, obj)
    }
  }

  /**
   * 移除信息
   */
  static clearSession (name:string) {
    name = ConfigUtil.projectStorageKey + '_' + name
    if (process.env.mode === 'prod') {
      name = AesUtil.md5(name)
    }
    sessionStorage.removeItem(name)
  }

  /**
   * 获取对应的文件信息  localStorage
   * @param name  对应保存信息的名称
   */
  static getLocalStorage (name:string) {
    name = ConfigUtil.projectStorageKey + '_' + name
    if (process.env.mode === 'prod') name = AesUtil.md5(name)
    let o = localStorage.getItem(name)
    if (typeof o !== 'undefined' && o !== null) {
      let objN:any = {}
      if (process.env.mode === 'prod') {
        objN = AesUtil.decryptECB(o)
      } else {
        objN = o
      }
      objN = JSON.parse(objN)
      let { obj, time } = objN
      if (!JudgeUtil.isEmpty(time)) {
        let tm = new Date().getTime()
        if (tm > time) { // 过期了
          if (name === globalEnum.userID) {
            SysUtil.clearLocalStorageAsLoginOut()
          }
          obj = null
        }
      }
      return obj
    }
    return null
  }

  /**
   * 设置保存信息     localStorage
   * @param name     保存的姓名
   * @param obj      需要存储的对象
   * @param timeout  设置过期时间(天)
   * @param {'day'|'time'}timeType 过期时间的类型
   */
  static setLocalStorage (name:string, obj:any, timeout?:number, timeType: 'day'|'time' = 'day') {
    name = ConfigUtil.projectStorageKey + '_' + name
    if (obj) {
      let objN:any = {
        obj: obj
      }
      if (timeout) { // 存在时间的
        let addTime = 1000 * 60 * 60 * 24 * timeout
        let nowTime = new Date().getTime()
        objN['time'] = nowTime + (timeType === 'day' ? addTime : timeout)
      }
      objN = JSON.stringify(objN)
      if (process.env.mode === 'prod') {
        objN = AesUtil.encryptECB(objN)
        name = AesUtil.md5(name)
      }
      localStorage.setItem(name, objN)
    }
  }
  /**
   * 权限包含关系判断
   */
  static hasAuthority = (key: string[], adminAuthorityList: string[]): boolean[] => {
    const tempList = [...adminAuthorityList, ...key]
    if (tempList.length === adminAuthorityList.length) return Array(key.length).fill(true)
    const tempArr: boolean[] = []
    key.forEach(item => {
      tempArr.push(ComUtil.inArray(item, adminAuthorityList).include)
    })
    return tempArr
  }

  /**
   * 移除信息
   */
  static clearLocalStorage (name:string) {
    name = ConfigUtil.projectStorageKey + '_' + name
    if (process.env.mode === 'prod') {
      name = AesUtil.md5(name)
    }
    localStorage.removeItem(name)
  }

  /** 登录退出的时候需要清除的信息 */
  static clearLocalStorageAsLoginOut () {
    sessionStorage.clear()
    SysUtil.clearLocalStorage('isWalletConnected')
    SysUtil.clearLocalStorage('walletAccount')
  }

  /**
   * 判断是否是允许登录的状态
   * @returns {boolean} true 不允许登录 false 在登录状态或者可以登录
   */
  static isAuthExit ():boolean {
    let userId = SysUtil.getLocalStorage(globalEnum.userID)
    let token = SysUtil.getLocalStorage(globalEnum.token)
    return JudgeUtil.isEmpty(userId) || JudgeUtil.isEmpty(token)
  }

  /** 判断是否是电脑或者手机 */
  static isPcOrPhone () {
    return /(iPhone|iPad|iPod|iOS|Android|Windows Phone)/i.test(navigator.userAgent)
  }

  /**
   * 判断浏览器类型
   * @param val
   */
  static getBrowserInfo (val:string):boolean {
    let ua:any = navigator.userAgent.toLocaleLowerCase()
    let browserType:string = ''
    let browserVersion:string = ''
    if (ua.match(/msie/) != null || ua.match(/trident/) != null) {
      browserType = 'IE'
      browserVersion = ua.match(/msie ([\d.]+)/) != null ? ua.match(/msie ([\d.]+)/)[1] : ua.match(/rv:([\d.]+)/)[1]
    } else if (ua.match(/firefox/) != null) {
      browserType = '火狐'
    } else if (ua.match(/ubrowser/) != null) {
      browserType = 'UC'
    } else if (ua.match(/opera/) != null) {
      browserType = '欧朋'
    } else if (ua.match(/bidubrowser/) != null) {
      browserType = '百度'
    } else if (ua.match(/metasr/) != null) {
      browserType = '搜狗'
    } else if (ua.match(/tencenttraveler/) != null || ua.match(/qqbrowse/) != null) {
      browserType = 'QQ'
    } else if (ua.match(/maxthon/) != null) {
      browserType = '遨游'
    } else if (ua.match(/chrome/) != null) {
      var is360 = SysUtil._mime('type', 'application/vnd.chromium.remoting-viewer')
      browserType = is360 ? '360' : 'Chrome'
    } else if (ua.match(/safari/) != null) {
      browserType = 'Safari'
    }
    return val === browserType
  }

  static _mime (option:string, value:string) {
    let mimeTypes:any = navigator.mimeTypes
    for (var mt in mimeTypes) {
      if (mimeTypes[mt][option] === value) {
        return true
      }
    }
    return false
  }
}
