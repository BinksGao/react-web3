import React from 'react'
import * as RenderDom from 'react-dom'
import { ConfigProvider } from 'antd'
import store from './store/index'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import { hot } from 'react-hot-loader/root'
import './index.css'
import Root from './router'
import '@assets/style/common.less'
import Providers from './providers'

let configProvider = {
  csp: { nonce: new Date().getTime().toString() },
  locale: zhCN,
  getPopupContainer: (node: any) => {
    if (node) return node.parentNode
    return document.body
  }
}

let Common = hot(Root)
RenderDom.render(
  <Providers {...store}>
    <ConfigProvider {...configProvider}>
      <Common />
    </ConfigProvider>
  </Providers>,
  document.getElementById('app')
)
