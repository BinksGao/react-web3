'use strict'

import axios, { AxiosRequestConfig, AxiosStatic } from 'axios'
import { createHashHistory } from 'history'
import { SysUtilAuth as SysUtil, SysUtil as SysUtils, globalEnum, ComUtil as JudgeUtil, ConfigUtil } from '@utils/index'
import { KeyValue } from '@src/typings/global'

export { AxiosRequestConfig } from 'axios'

export enum HttpsReaponseEnum {
  /** 请求成功 */
  CODE_SUCCESS = 200,
  /** 1、语义有误，当前请求无法被服务器理解。除非进行修改，否则客户端不应该重复提交这个请求。 2、请求参数有误 */
  CODE_PARAMS_ERROR = 400,
  /** 当前请求需要用户验证 */
  CODE_UNAUTHORIZED = 401,
  /** 服务器已经理解请求，但是拒绝执行它 */
  CODE_FORBIDDEN = 403,
  /** 请求失败，请求所希望得到的资源未被在服务器上发现 */
  CODE_NOT_FOUND = 404,
  /** 请求行中指定的请求方法不能被用于请求相应的资源 */
  CODE_METHOD_NOT_ALLOWED = 405,
  /** 服务器遇到了一个未曾预料的状况，导致了它无法完成对请求的处理 */
  CODE_INTERNAL_SERVER_ERROE = 500,
  /** 由于临时的服务器维护或者过载，服务器当前无法处理请求。 */
  CODE_SERVICE_UNAVAILABLE = 503,
  /** 作为网关或者代理工作的服务器尝试执行请求时，未能及时从上游服务器（URI标识出的服务器，例如HTTP、FTP、LDAP）或者辅助服务器（例如DNS）收到响应。 */
  CODE_GATEWAY_TIMEOUT = 504
}

/** 业务的返回的代码 */
export enum ResponseStatusEnum {
  CODE_200 = 200,
  /** 操作失败 */
  CODE_417 = 417,
  CODE_10033 = 10033,
  /** 参数错误！ */
  CODE_400 = 400,
  CODE_411 = 411,
  /** 友情提示 */
  CODE_4001 = 4001,
  CODE_500 = 500,
  /** token失效 */
  CODE_401 = 401,
  CODE_ZERO_1000 = -1000,
  /** 当前用户没有此请求所需权限 */
  CODE_4011 = 4011,
  /** 访问太频繁了！ */
  CODE_1002 = 1002
}

export interface Response {
  code: number
  data: any
  msg: Array<string>
  [key: string]: any
}

/**
 * url 的格式限制
 * @description
 * @param {Method}type?: Method
 * @param {string}path: string
 */
export interface URLInterface {
  type?: any
  path: string
  [key:string]: any
}

class Axios {
  constructor () {
    this.interceptors()
  }

  /** 自定义创建的实例 */
  public instance: AxiosStatic = axios

  public all = axios.all

  /** 对应的项目的实例 */
  private projectAry: Array<string> = ['james/', 'tagore/', 'stallone/', 'aladdin/', 'powell/', 'arnold/', 'flash/', 'joseph/', 'address/', 'flick/']

  /** 需要进行不通的替换的 */
  private peojectNameReplace:Array<string> = ['stallone/']

  /**
   * 对请求进行拦截, 对错误的信息进行拦截
   */
  private interceptors () {
    axios.interceptors.request.use((config: any) => config)
    // 响应 拦截器
    axios.interceptors.response.use(
      (response:any) => response,
      (err:any) => {
        return this.responseConfigError(err)
      })
    this.instance = axios
  }

  /** 请求失败响应的处理 */
  private responseConfigError (err:any) {
    const { response } = err
    if (response) {
      const { status, message, config: { url, method, data, params } } = response
      switch (status) {
        case HttpsReaponseEnum.CODE_PARAMS_ERROR:
          err.message = message || (response.data && response.data.message) || `响应状态(status)：${status} 消息(message): 请求参数有误`
          break
        case HttpsReaponseEnum.CODE_UNAUTHORIZED:
          err.message = message || (response.data && response.data.message) || `响应状态(status)：${status} 消息(message): 当前请求需要用户验证`
          break
        case HttpsReaponseEnum.CODE_FORBIDDEN:
          err.message = message || (response.data && response.data.message) || `响应状态(status)：${status} 消息(message): 服务器已经理解请求，但是拒绝执行它`
          break
        case HttpsReaponseEnum.CODE_NOT_FOUND:
          err.message = message || (response.data && response.data.message) || `响应状态(status)：${status} 消息(message): 请求路径不存在`
          break
        case HttpsReaponseEnum.CODE_METHOD_NOT_ALLOWED:
          err.message = message || (response.data && response.data.message) || `响应状态(status)：${status} 消息(message): 请求行中指定的请求方法不能被用于请求相应的资源`
          break
        case HttpsReaponseEnum.CODE_INTERNAL_SERVER_ERROE:
          err.message = message || (response.data && response.data.message) || `响应状态(status)：${status} 消息(message): 服务器遇到了一个未曾预料的状况，导致了它无法完成对请求的处理`
          break
        case HttpsReaponseEnum.CODE_SERVICE_UNAVAILABLE:
          err.message = message || (response.data && response.data.message) || `响应状态(status)：${status} 消息(message): 由于临时的服务器维护或者过载，服务器当前无法处理请求。`
          break
        case HttpsReaponseEnum.CODE_GATEWAY_TIMEOUT:
          err.message = message || (response.data && response.data.message) || `响应状态(status)：${status} 消息(message): 响应超时`
          break
        default: err.message = message || (response.data && response.data.message) || `响应状态(status)：${status} 消息(message): ${message}`
          break
      }
      if (process.env.NODE_ENV === 'development') {
        console.info(`[axios-cus] 响应状态(status)：${status}`)
        console.info(`[axios-cus] url(${method})：${url}`)
        console.info(`[axios-cus] 参数：${method === 'get' ? JSON.stringify(params) : JSON.stringify(data)}`)
        console.info(`[axios-cus] 消息(message)：${message}`)
      }
    } else {
      if (err.message.indexOf('Network') >= 0) {
        err.message = '请求出错了'
      } else if (err.message.indexOf('timeout') >= 0) {
        err.message = '请求超时啦'
      } else if (err.response) {
        const { message } = err.response.data
        if (message) err.message = message
      }
    }
    if (axios.isCancel(err)) {
      console.log('Request canceled', err.message)
    } else {
      return Promise.reject(err)
    }
  }

  /**
   * 请求的整合
   * @param {string}baseURL             请求的域名
   * @param {URLInterface}url           请求地址
   * @param {Object}params              请求的参数
   * @param {AxiosRequestConfig}config  请求配置
   * @param {Object}param               在post 的情况下传递 get 的参数
   */
  integration (baseURL:string, url: URLInterface, params?: Object, config?: AxiosRequestConfig, param:Object = {}): Promise<any> {
    const { type, path } = url
    return this.instance({
      url: path,
      baseURL,
      method: type || 'POST',
      params: type ? params : param,
      data: type ? {} : params,
      timeout: ConfigUtil.axiosTimeout,
      ...config
    })
  }

  /**
   * 发送请求
   * @param {URLInterface}url     请求地址
   * @param {URLInterface}params  请求的参数
   * @param {URLInterface}options 请求配置
   * @param {URLInterface}param   get 请求参数
   */
  request = (url: URLInterface, params?: Object, config: AxiosRequestConfig = {}, param: Object = {}) => {
    let urls = SysUtil.deepCopyObj(url)
    urls.path = this.URlFilter(urls.path)
    // 查询对应需要切换请求的项目的域名
    let project = this.projectAry.find((project:string) => urls.path.includes(project))
    let basePath:string = project ? ConfigUtil.coreBasePath : ConfigUtil.axiosBasePath
    console.log(basePath)
    let flg: boolean = urls.path.includes('stallone/')
    let dataObj: any = flg ? { authSys: 'why', ...params } : params
    let paramObj: any = flg ? { authSys: 'why', ...param } : param
    return this.resltData(this.integration(basePath, urls, dataObj, {
      headers: {
        device: 'WebPage',
        platform: 'web',
        token: SysUtils.getLocalStorage(globalEnum.token) || 'ss', // 存在token 则发送token
        Authorization: SysUtils.getLocalStorage(globalEnum.token) || '',
        traceId: SysUtil.traceId() + '_' + (SysUtil.getLocalStorage(globalEnum.userID) || -1),
        ...ConfigUtil.axiosHeaders
      },
      ...config
    }, paramObj))
  }

  /** 对URL 进行筛选过滤 */
  private URlFilter = (url:string, version: string = 'v1'):string => {
    if (url.includes('{projectName}')) {
      // 查询需要特许替换的（中心服务的）
      let peroj:any = this.peojectNameReplace.find((el:any) => url.includes(el))
      // 根据项目进行替换的（业务逻辑的）
      let project = 'why'
      let p:string = 'why'
      if (peroj) {
        p = 'why'
      } else if (project && project.includes('物美')) {
        p = 'wm'
      } else if (project && project.includes('盒马')) {
        p = 'hm'
      } else if (project && project.includes('每日优鲜')) {
        p = 'mryx'
      } else {
        p = 'sj'
      }
      url = url.replace('{projectName}', p)
    }
    if (url.includes('{version}')) url = url.replace('{version}', version)
    return url
  }

  /**
   * 对返回的结果进行处理
   */
  private resltData = (obj:any) => {
    return new Promise<KeyValue>((resolve, reject) => {
      obj.then((res:any) => {
        const { headers: { authorization }, config: { responseType }, data: { code, data, message, msg, token } } = res // 获取到token
        if (authorization && !JudgeUtil.isEmpty(authorization)) {
          SysUtil.setLocalStorage(globalEnum.token, authorization, 5)
          SysUtils.setLocalStorage(globalEnum.token, authorization)
        }
        if (token && !JudgeUtil.isEmpty(token)) {
          SysUtil.setLocalStorage(globalEnum.token, token, 5)
        }
        // 根据不同的响应类型返回不同的
        if (responseType && responseType === 'blob') {
          resolve(res.data)
        } else {
          let a:Response = { code: code, msg: message || msg, data: data }
          if (a.msg && a.msg.length === 0 && code === 400) {
            a.msg = ['未知错误']
          }
          switch (code) {
            case ResponseStatusEnum.CODE_200: resolve(a); break
            case ResponseStatusEnum.CODE_10033: resolve(a); break
            case ResponseStatusEnum.CODE_400: reject(a); break // 操作失败
            case ResponseStatusEnum.CODE_417: reject(a); break // 操作失败
            case ResponseStatusEnum.CODE_411: reject(a); break // 参数错误！
            case ResponseStatusEnum.CODE_500: reject(a); break // 服务器错误
            case ResponseStatusEnum.CODE_1002: reject(a); break // 访问太频繁了！
            case ResponseStatusEnum.CODE_4001: reject(a); break // 友情提示
            case ResponseStatusEnum.CODE_4011: reject(a); break // 当前用户没有此请求所需权限
            case ResponseStatusEnum.CODE_401: // token 失效
            case ResponseStatusEnum.CODE_ZERO_1000: // token 失效
              SysUtil.clearLocalStorageAsLoginOut()
              const history = createHashHistory()
              SysUtil.setSessionStorage('token_msg', 1)
              history.replace('/') // 跳转到登录的界面
              break
            default: reject(a); break
          }
        }
      }).catch((err:any) => {
        let a = { msg: err.message }
        reject(a)
      }).finally(() => {
        SysUtil.setSessionStorage('token_msg', 2)
      })
    })
  }
}

export default new Axios()
