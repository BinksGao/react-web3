import * as React from 'react'
import { message, Modal } from 'antd'
import AxiosAuth from '@components/axiosAuth'
import { Axios } from '../axios'
import ServerApi from '@server/ServerApi'
import { globalEnum, HttpUtil, SysUtilAuth } from '@utils/index'

export class RootComponent<P = {}, S = {}> extends React.Component<P, S> {
  $message = message // 消息组件
  axios = Axios
  axiosAuth = AxiosAuth
  api = ServerApi // api 的调用
  /** 功能权限的判断 */
  isAuthenticated = isAuthenticated
  /** 数据权限的判断 */
  isAuthData = isAuthenticatedData
  error = error // model 弹出框的Error
  warning = warning // model 弹出框的Waring
  confirm = confirm // model 弹出框的confirm
  openTab = HttpUtil.openTab
}

/**
 * 判断权限
 * @param code 权限的code, 可以为数据或者字符串
 * @param type  当为数组的时必传 'contain' (包含的关系)| 'must' (必须都有) 默认： contain
 */
export function isAuthenticated (code: string|Array<string>, type: 'contain' | 'must' = 'contain'): boolean {
  if (!(process.env.mode === 'prod' || process.env.mode === 'test')) { // 开发环境
    return true
  } else {
    const auth:Array<string> = SysUtilAuth.getLocalStorage(globalEnum.auth)
    if (typeof code === 'string') {
      return auth && auth.includes(code)
    } else if (auth) {
      if (type === 'contain') {
        for (let index = 0; index < code.length; index++) {
          const pow = code[index]
          if (auth.includes(pow)) {
            return true
          }
        }
        return false
      } else {
        for (let index = 0; index < code.length; index++) {
          const pow = code[index]
          if (!auth.includes(pow)) {
            return false
          }
        }
        return true
      }
    }
    return false
  }
}

/**
 * 判断权限
 * @param code 权限的code, 可以为数据或者字符串
 * @param type  当为数组的时必传 'contain' (包含的关系)| 'must' (必须都有) 默认： contain
 */
export function isAuthenticatedData (code: string|Array<string>, type: 'contain' | 'must' = 'contain'): boolean {
  if (!(process.env.mode === 'prod' || process.env.mode === 'test')) { // 开发环境
  // if (process.env.NODE_ENV === 'development') { // 开发环境
    return true
  } else {
    const auth:Array<string> = SysUtilAuth.getLocalStorage(globalEnum.authdata)
    if (typeof code === 'string') {
      return auth && auth.includes(code)
    } else if (auth) {
      if (type === 'contain') {
        for (let index = 0; index < code.length; index++) {
          const pow = code[index]
          if (auth.includes(pow)) {
            return true
          }
        }
        return false
      } else {
        for (let index = 0; index < code.length; index++) {
          const pow = code[index]
          if (!auth.includes(pow)) {
            return false
          }
        }
        return true
      }
    }
    return false
  }
}

/**
 * 错误的输出等
 * @param msg   输出的消息
 * @param title 标题
 */
function error (msg:any, title?:string) {
  Modal.error({
    title: title || '消息提示',
    centered: true,
    content: msg,
    onOk () {
      return new Promise<void>((resolve, reject) => (resolve()))
    }
  })
}
function warning (msg:any, title?:string) {
  Modal.warning({
    title: title || '消息提示',
    centered: true,
    content: msg,
    onOk () {
      return new Promise<void>((resolve, reject) => (resolve()))
    }
  })
}

function confirm (msg:any, onConfirm?: () => void, onCancel?: () => void, title?:string) {
  Modal.confirm({
    title: title || '消息提示',
    centered: true,
    content: msg,
    onOk () {
      onConfirm && onConfirm()
    },
    onCancel () {
      onCancel && onCancel()
    }
  })
}

export { hot } from 'react-hot-loader'
