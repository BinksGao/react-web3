/*
 * @Description: axios配置
 * @author: gaohuan
 * @Date: 2022-01-27 13:38:29
 * @LastEditTime: 2022-01-27 17:18:06
 */
import axios, { CancelToken } from 'axios'
import { Modal } from 'antd'
import { SysUtilAuth, SysUtil, globalEnum, JudgeUtil, ConfigUtil } from '@utils/index'
import { URLInterface } from '../axiosAuth'

// 类型检查
interface UrlInterface {
  path:string
  type?:string
}

/* 方法请求的参数检查 */
interface Params {
  type:string
  path:string
  params?:object
  config?:object
  cancelToken?: CancelToken
}

/* request 返回值类型 */
interface Response {
  code: number
  data: any
  msg: (string|number)[]
  [key: string]: any
}

const ServerURL = ConfigUtil.axiosBasePath
const WebUrl = ConfigUtil.webUrl

export class Axios {
  static traceId: string

  static authorization: string

  static showTipsOnce: boolean = true

  static axios:any = axios

  static path:string = ServerURL
  static structureId?: string

  // 普通
  static instance = Axios.create()
  // 上传
  static upload:any = Axios.create(true)

  static create (upload: boolean = false, path = Axios.path) {
    let axiosN = axios.create({
      baseURL: path,
      timeout: 90000
    })

    // 请求拦截
    axiosN.interceptors.request.use((config: any) => {
      return Axios.requestConfig(config, upload)
    })
    // http response 拦截器 响应
    axiosN.interceptors.response.use((response:any) => {
      return response // token 验证失败
    }, (err:any) => {
      return Axios.responseConfigError(err)
    })
    return axiosN
  }

  /**
   * 请求的整合
   * @param {string}baseURL             请求的域名
   * @param {URLInterface}url           请求地址
   * @param {Object}params              请求的参数
   * @param {AxiosRequestConfig}config  请求配置
   * @param {Object}param               在post 的情况下传递 get 的参数
   */
  static integration (baseURL:string, url: URLInterface, AxiosObj: any, params?: Object): Promise<any> {
    const { type, path } = url
    return AxiosObj({
      url: path,
      baseURL,
      method: type || 'POST',
      params: type === 'GET' || type === 'get' ? params : {},
      data: !type || type === 'POST' || type === 'post' || type === 'patch' || type === 'PATCH' || type === 'delete' || type === 'DELETE' ? params : {},
      timeout: ConfigUtil.axiosTimeout
    })
  }

  static request (url:UrlInterface, interceptor?: boolean): Promise<Response>
  static request (url:UrlInterface, param?:object | Boolean, interceptor?: boolean): Promise<Response>
  static request (url:UrlInterface, param?:object | Boolean, interceptor?: boolean, mock?:Boolean): Promise<Response>
  static request (url:UrlInterface, param?:object | Boolean, interceptor?: boolean, mock?:Boolean): Promise<Response> {
    interceptor = interceptor || false
    // 访问路径:访问类型（post|get）:添加参数(data|params):添加额外的配置
    let obj:Params = {
      path: '',
      type: url.type || 'post',
      params: (typeof param !== 'boolean' && typeof param !== 'undefined') ? param : undefined
    }
    if (url.path.includes('{export}')) {
      url.path = url.path.replace('{export}', '')
    }
    // 是否进行mockJS 模拟数据
    if (typeof param === 'boolean' || mock) {
      obj.path = (param || mock) ? url.path + '.mock' : url.path
      // 发起请求返回请求的对象
      return Axios.OpenRequest(obj, axios, false, true)
    } else {
      obj.path = url.path
      // 发起请求返回请求的对象
      return Axios.OpenRequest(obj, Axios.instance, interceptor)
    }
  }

  static OpenRequest ({ type, path, params }: Params, AxiosObj: any, interceptor: boolean, mock?: boolean): Promise<Response> {
    return new Promise((resolve, reject) => {
      let ax: Promise<any>
      let basePath: string = ''
      const { serverPaths, serverPathsPort, defaultPath, axiosBasePath, exportBasePath, serverPath, demoServerPaths } = ConfigUtil
      const isDemo = process.env.mode === 'why'
      const result = serverPaths.findIndex((v: any) => path.startsWith(v))
      const isIp = JudgeUtil.isIP(axiosBasePath)
      if (result !== -1) {
        if (isIp) {
          path = path.replace(serverPaths[result], '')
          basePath = `${axiosBasePath}:${serverPathsPort[result]}`
        } else {
          basePath = serverPath ? `${axiosBasePath}/${serverPath}` : axiosBasePath
          path = isDemo ? path.replace(serverPaths[result], demoServerPaths[result]) : path
        }
      } else {
        if (isIp) {
          basePath = exportBasePath
        } else {
          basePath = `${axiosBasePath}/${defaultPath}`
        }
      }
      ax = this.integration(basePath, { type, path }, AxiosObj, params)
      ax.then((res:any) => {
        const { headers: { authorization } } = res
        if (authorization && !JudgeUtil.isEmpty(authorization)) {
          const token = authorization.startsWith('Bearer') ? authorization : 'Bearer ' + authorization
          SysUtilAuth.setLocalStorage(globalEnum.token, token, 5)
          SysUtil.setLocalStorage(globalEnum.token, token)
        }
        const { code, msg, data, message } = res.data
        if (code && code === 1001) { // token 失效
          SysUtil.clearLocalStorageAsLoginOut()
          SysUtilAuth.clearLocalStorageAsLoginOut()
          window.location.href = `${WebUrl}#login`
        }
        if (code && code !== 200 && code !== 4001 && code !== 10033) {
          let a = { code: code, msg: msg || message, data: data }
          if (!interceptor && Axios.showTipsOnce) {
            Axios.showTipsOnce = false
            if (typeof a.msg === 'string') Axios.errorTips(a.msg)
            else Axios.errorTips(a.msg[0])
          }
          if (interceptor || code === 1001) reject(a)
          resolve(res.data)
        } else {
          resolve(res.data)
        }
      }).catch((err:any) => {
        let a = { msg: err.message }
        if (!interceptor && Axios.showTipsOnce) {
          Axios.showTipsOnce = false
          if (typeof a.msg === 'string') Axios.errorTips(a.msg)
          else Axios.errorTips(a.msg[0])
        }
        if (interceptor) reject(a)
        else reject(a)
      })
    })
  }

  static requestConfig (config: any, upload: boolean = false) {
    const headers = {
      ...ConfigUtil.axiosHeaders,
      traceId: SysUtilAuth.traceId() + '_' + (SysUtilAuth.getLocalStorage(globalEnum.userID) || -1),
      structureId: SysUtilAuth.getLocalStorage(globalEnum.structureId),
      Authorization: SysUtilAuth.getLocalStorage(globalEnum.token) || '',
      platform: 'web',
      projectName: 'WHY',
      version: '1',
      userId: SysUtilAuth.getLocalStorage(globalEnum.userID),
      device: 'WebPage',
      sysUpVersion: SysUtil.getLocalStorage(globalEnum.systemVersion),
      'Content-Type': upload ? 'multipart/form-data' : 'application/json;charset=utf-8'
    }
    if (!config.url.includes('WHY')) {
      delete headers.projectName
    }
    config.headers = headers
    return config
  }
  // 错误码修改
  static switchResponse (code: number): string {
    let message = '出错啦'
    switch (code) {
      case 400 : message = '请求错误(400), 最大的可能参数传错了'
        break
      case 401 : message = '请重新登录(401)'
        break
      case 403 : message = '您没有权限'
        break
      case 404 : message = '请求出错(404)'
        break
      case 408 : message = '请求超时(408)'
        break
      case 409 : message = '未查询到数据信息！'
        break
      case 500 : message = '请求方式错误，服务器错误(500)'
        break
      case 501 : message = '服务未实现(501)'
        break
      case 503 : message = '跨域的问题或是其他的'
        break
      default : message = `连接出错!`
    }
    return message
  }

  static responseConfigError (err:any) {
    if (err.message.indexOf('Network') >= 0) {
      err.message = '404 找不到服务器啦'
    } else if (err.message.indexOf('timeout') >= 0) {
      err.message = '请求超时啦'
    } else if (err.response) {
      err.message = Axios.switchResponse(err.response.status)
    }
    return Promise.reject(err) // 返回接口返回的错误信息
  }

  // 提示信息
  static errorTips (msg: any, title?:string) {
    Modal.error({
      title: title || '消息提示',
      centered: true,
      content: msg,
      onOk () {
        Axios.showTipsOnce = true
        return Promise.resolve()
      }
    })
  }
}
