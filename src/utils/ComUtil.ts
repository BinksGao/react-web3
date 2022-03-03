import moment from 'moment'
import { uniq } from 'lodash'
import { KeyValue } from '@src/typings/global'
export class ComUtil {
  /**
   * 判断目标元素是否存在指定数组中
   * @param ele 目标元素
   * @param array 目标数组
   */
  static inArray (ele: string | number, array: (string|number)[]) {
    const i = array.indexOf(ele)
    return {
      include: i !== -1,
      index: i
    }
  }

  /**
   * @desc 函数防抖
   * @param func 函数
   * @param wait 延迟执行毫秒数
   * @param immediate true 表立即执行，false 表非立即执行
   */
  static debounce (func: Function, wait: number, immediate: boolean) {
    let timeout: NodeJS.Timeout | null = null

    return (...args: any[]) => {
      if (timeout) clearTimeout(timeout)
      if (immediate) {
        var callNow = !timeout
        timeout = setTimeout(() => {
          timeout = null
        }, wait)
        if (callNow) func.apply(this, args)
      } else {
        timeout = setTimeout(() => {
          func.apply(this, args)
        }, wait)
      }
    }
  }

  /**
 * @desc 函数节流
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1 表时间戳版，2 表定时器版
 */
  static throttle (func: Function, wait: number, type: number) {
    let previous = 0
    let timeout: NodeJS.Timeout | null = null
    return (...args: any[]) => {
      if (type === 1) {
        let now = Date.now()

        if (now - previous > wait) {
          func.apply(this, args)
          previous = now
        }
      } else if (type === 2) {
        if (!timeout) {
          timeout = setTimeout(() => {
            timeout = null
            func.apply(this, args)
          }, wait)
        }
      }
    }
  }

  /**
   * 自定义字符串长度
   * @param str 待处理字符串
   * @param defaultLen 默认限制长度
   * @param limitTable 是否仅限制于表格处理，表格处理主要限制 projectName 长度
   */
  static sliceStr (str: string, defaultLen = 19, limitTable = false) {
    if (str) {
      if (str.length > defaultLen) {
        str = str.substr(0, defaultLen) + '...'
      }
      return str
    }
    if (!str && limitTable) return '/'
    return str
  }

  /**
   * 判读是否为空
   * @returns true 为空 false 不为空
   */
  static isEmpty (val:any) {
    return (typeof val === 'undefined' || val === null || val === '')
  }
  // 判断空对象或者空数组
  static isEmptyObjOrArr = function (obj: any) {
    if (!obj && obj !== 0 && obj !== '') {
      return true
    }
    if (Array.prototype.isPrototypeOf(obj) && obj.length === 0) {
      return true
    }
    if (Object.prototype.isPrototypeOf(obj) && Object.values(obj).filter(v => !ComUtil.isEmpty(v)).length === 0) {
      return true
    }
    return false
  }
  /**
   * 格式化时间
   * @param value 格式化的值
   */
  static formatTime (value:string, format:string = 'YYYY-MM-DD HH:mm'):string {
    return JudgeUtil.isEmpty(value) ? '---' : moment(value).format(format)
  }

  /* 深度对比两个对象是否相同 */
  static compareDeep (origin: any, target: any) {
    let p
    if (typeof origin === 'number' && typeof target === 'number' && isNaN(origin) && isNaN(target)) {
      return true
    }
    if (origin === target) {
      return true
    }
    if (typeof origin === 'function' && typeof target === 'function') {
      if ((origin instanceof RegExp && target instanceof RegExp) ||
      (origin instanceof String || target instanceof String) ||
      (origin instanceof Number || target instanceof Number)) {
        return origin.toString() === target.toString()
      } else {
        return false
      }
    }
    if (origin instanceof Date && target instanceof Date) {
      return origin.getTime() === target.getTime()
    }
    if (!(origin instanceof Object && target instanceof Object)) {
      return false
    }
    if (origin.prototype !== target.prototype) {
      return false
    }
    if (origin.constructor !== target.constructor) {
      return false
    }
    for (p in target) {
      if (!origin.hasOwnProperty(p)) {
        return false
      }
    }
    for (p in origin) {
      if (!target.hasOwnProperty(p)) {
        return false
      }
      if (typeof target[p] !== typeof origin[p]) {
        return false
      }
      if (!ComUtil.compareDeep(origin[p], target[p])) {
        return false
      }
    }
    return true
  }

  /**
   * 过滤对象中改变的key
   * @param obj 对象
   * @param targetObj 目标对象
   * @param ignoreList 忽略比较的key
   */
  static compareDifferentKey = (obj: KeyValue = {}, targetObj: KeyValue = {}, ignoreList?: string[]) => {
    return Object.keys(obj).filter(key => {
      if (ignoreList && Array.isArray(ignoreList)) {
        return !ignoreList.includes(key)
      }
      return true
    }).filter(key => !ComUtil.compareDeep(obj[key], targetObj[key])).map(key => {
      const currentVal = obj[key]
      if (Array.isArray(currentVal) && currentVal.length) {
        const targetVal = targetObj[key]
        if (!targetVal || !targetVal.length) return currentVal.map((v, i) => Object.keys(v).map(k => `${key}${i}${k}`).join(',')).join(',')
        let str = ''
        currentVal.forEach((v, i) => {
          const targetItem = targetVal[i] || []
          Object.keys(v).forEach(k => {
            if (!ComUtil.compareDeep(v[k], targetItem[k])) {
              str = `${str ? `${str},` : ''}${key}${i}${k}`
            }
          })
        })
        return str
      } else {
        return key
      }
    }).join(',')
  }

  /**
   * 过滤数组中相同的对象
   * 使用类型为[{}, {}, {}]
   * @param obj 对象数组
   */
  static deteleObject = (arr: any = [], keys: any = []) => {
    return keys.reduce((r: any, k: any) => [...r.reduce((m: any, x: any) => m.set(x[k], x), new Map()).values()], arr)
  }

  /**
   * 过滤数组中多种属性值都相同的对象
   * 使用类型为[{}, {}, {}]
   * @param arr 对象数组
   * @param keys 属性数组
   */
  static deteleAllKeysSame = (arr: any = [], keys: any = []) => {
    // return keys.reduce((r: any, k: any) => [...r.reduce((m: any, x: any) => m.set(x[k], x), new Map()).values()], arr)
    return Array.from(arr.reduce((m: any, value: any) => {
      let key = ''
      keys.forEach((v: string) => {
        key += value[v]
      })
      return m.set(key, value)
    }, new Map()).values())
  }

  /**
   * 过滤数组中相同的对象
   * 使用类型为[1, '2'])
   * @param obj 需要处理的数组
   */
  static deteleSingle = (arr: any[]) => {
    const newArr = arr.filter(function (element, index, array) {
      return array.indexOf(element) === index
    })
    return newArr
  }
  /**
   * 获取数组中不同的元素
   * arr1, arr2 需要处理的数组
   */
  static getArrDifference = (arr1: any[], arr2: any[]) => {
    return arr1.concat(arr2).filter((v: any, i: number, arr: any[]) => {
      return arr.indexOf(v) === arr.lastIndexOf(v)
    })
  }
  /**
   * 检测一个元素在数组元素中出现的次数
   */
  static elementCount = (arr: any[], element: string | number) => {
    let count: any = 0
    count = arr.filter((item) => item === element)
    return count.length
  }

  /**
   * url上添加搜索查询字段
   */

  static addQueryToUrl = (searchParams: KeyValue) => {
    const keys = Object.keys(searchParams)
    const hash = window.location.hash
    if (keys.length === 0) return hash
    const querys = keys.map(v => {
      const value = searchParams[v]
      if (value) return `${v}=${value}`
      return ''
    })
    const hashUrl = `${hash.replace(/\?.*/, '')}?${querys.filter(v => !!v).join('&')}`
    window.history.pushState(null, '', window.location.pathname + hashUrl)
    return hashUrl
  }

  /**
   * 获取url上查询字段
   */

  static getQueryFromUrl = () => {
    const params: KeyValue = {}
    const query = window.location.hash.split('?')[1]
    if (query) {
      query.split('&').forEach(item => {
        const [key, value] = item.split('=')
        if (key === 'status') {
          params[key] = Number(value) || decodeURIComponent(value)
        } else if (key !== 'page' && key !== 'pageSize') {
          params[key] = decodeURIComponent(value)
        }
      })
    }
    return params
  }
}

export class JudgeUtil {
  static compareDeep (params: KeyValue | undefined) {
    throw new Error('Method not implemented.')
  }
  /*  获取原始类型 */
  static toRawType (v: any) {
    return Object.prototype.toString.call(v).slice(8, -1).toLowerCase()
  }

  /**
   * 判断是否是数字
   * @param obj 需要判断的值
   */
  static isNumber (v: any) {
    return JudgeUtil.toRawType(v) === 'number'
  }

  /** 判读是否是数组 */
  static isArrayFn (v: any) {
    return JudgeUtil.toRawType(v) === 'array'
  }

  /* 判断是否为纯对象 */
  static isPlainObj (obj: any) {
    return JudgeUtil.toRawType(obj) === 'object'
  }

  /**
   * 判读是否为空
   */
  static isEmpty (obj: any) {
    return (typeof obj === 'undefined' || obj === null || obj === '' || obj === undefined)
  }

  /* 判断字符串是否能转为数字 */
  static strHasToNum (v: string) {
    return !isNaN(parseFloat(v))
  }

  /**
   * 判读是否为IP地址
   * @returns true 为 false 不为
   */
  static isIP (val: string) {
    return /(http|https):\/\/[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}\.[\d]{1,3}/.test(val)
  }

  /**
   * 判读是否为重复
   * @returns true 为 false 不为
   */
  static hasDuplicates (arr: (string | number) []) {
    return uniq(arr).length !== arr.length
  }
}

/* 格式化 input 表单框数据 */
export class FormatInputValue {
  static intLen: number = 8
  static decimalsLen: number = 2

  /* 只允许输入整数 */
  static parsetInt (v: string, intLen = FormatInputValue.intLen) {
    return v.substr(0, intLen).replace(/[^\d]/g, '')
  }

  /* 只允许输入整数且支持可以保留负号 */
  static parsetIntAndKeepMinus (v: string, intLen = FormatInputValue.intLen) {
    v = v
      .replace(/[^\d-]/g, '')
      .replace(/-{1,}/g, '-')
      .replace(/^-/, '$#$')
      .replace(/-/g, '')
      .replace('$#$', '-')
    if (v.indexOf('-') > -1) intLen += 1
    return v.substr(0, intLen)
  }

  /* 保留两位小数点，处理简单数字的转化，不处理表单数据格式化 */
  static toFixedDecimal (v: string | number, decimalsLen = FormatInputValue.decimalsLen) {
    if (!v) return '0.00'
    return parseFloat(v + '').toFixed(decimalsLen)
  }

  /**
   * 对参数判断为0时返回0.00，为空时返回/，其他情况直接返回
   * @param num 待处理参数
   */
  static numFormat (num: number | null | undefined) {
    if (typeof num === 'number' && num === 0) return num.toFixed(2)
    return num
  }

  /**
   * 保留小数点，默认保留两位
   * @param v 待处理字符串
   * @param decimalsLen 小数点位数
   * @param intLen 整数位数
   */
  static toFixed (v: string, decimalsLen = FormatInputValue.decimalsLen, intLen = FormatInputValue.intLen) {
    v = v
      .substr(0, intLen + decimalsLen + 1)
      .replace(/[^\d.]/g, '')
      .replace(/^\./, '')
      .replace(/\.{2,}/g, '.')
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
      .replace(new RegExp(`^(\\d+)\\.(\\d{0,${decimalsLen}}).*$`), '$1.$2')
      .replace(/^\d+/, (match: string) => {
        return (parseFloat(match) + '').substr(0, intLen)
      })
    return v
  }

  /* 保留小数点和负号，小数点默认保留两位 */
  static toFixedAndKeepMinus (v: string, decimalsLen = FormatInputValue.decimalsLen, intLen = FormatInputValue.intLen) {
    v = v
      .replace(/[^\d.-]/g, '')
      .replace(/^\./, '')
      .replace(/\.{2,}/g, '.')
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
      .replace(/-{1,}/g, '-')
      .replace(/^-/, '$#$')
      .replace(/-/g, '')
      .replace('$#$', '-')
      .replace(new RegExp(`^(-?\\d+)\\.(\\d{0,${decimalsLen}}).*$`), '$1.$2')
    if (v.indexOf('-') > -1) intLen += 1
    v = v
      .replace(/^-?\d+/, (match: string) => match.substr(0, intLen))
    return v.substr(0, intLen + decimalsLen + 1)
  }

  /**
   * 千分位数字
   * @param v 数字
   * @param decimalsLen 保留的小数点
   */
  static formatMoney (v: string, decimalsLen = FormatInputValue.decimalsLen) {
    if (!v) return v
    v = parseFloat(v.replace(/[^\d.-]/g, '')).toFixed(decimalsLen)
    const [int, decimal] = v.split('.')
    const reverseInt = int.split('').reverse()
    let t = ''
    for (let i = 0, len = reverseInt.length; i < len; i++) {
      t += reverseInt[i] + ((i + 1) % 3 === 0 && (i + 1) !== len ? ',' : '')
    }
    if (decimal) return t.split('').reverse().join('') + '.' + decimal
    return t.split('').reverse().join('')
  }

  /**
   * 转换限制
   * @param reg 表达式
   * @param val 转换值
   * @param len 长度
   */
  static conversionOf (reg:any, val:string, len?:number):string {
    val = val.replace(reg, '')
    if (len) {
      val = val.length > len ? val.substr(0, len) : val
    }
    return val
  }

  /**
   * 去除空格
   */
  static removeEmpty = (val:any) => {
    return val.replace(/(^\s*)|(\s*$)/g, '')
  }

  // 限制输入框输入---只能输入1-100后面保留两位小数
  static formatInputValue = (value: any) => {
    value = value.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
    value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    value = value.replace(/^(\\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
    if (value.indexOf('.') < 0 && value !== '') {
    // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02
      value = parseFloat(value)
    }
    if (value > 100 || value === '100.') {
      const sl2 = String(value).slice(0, 2)
      const sl3 = String(value).slice(0, 3)
      if (sl3 === '100') return '10.00'
      return sl2
    }
    if (value === 100) return '10.00'
    return value
  }
}
