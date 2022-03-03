import { message } from 'antd'
import * as H from 'history'

export default class HttpUtil {
  /* 将 url 查询参数解析成为对象 */
  static parseUrl (url: string) {
    const query = url.split('?')[1]
    if (query) {
      const queryList = query.split('&')
      const obj: any = {}
      queryList.forEach(item => {
        const [key, value] = item.split('=')
        obj[key] = decodeURIComponent(value)
      })
      return obj
    }
    return {}
  }

  /* 浏览器中打开新的 tab */
  static openTab (url: string, history: H.History) {
    // console.log(url)
    history.push(url.replace('#', '/'))
  }
}
