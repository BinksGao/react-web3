/*
 * @Description: 所有路由集合
 * @author: gaohuan
 * @Date: 2022-01-27 13:31:57
 * @LastEditTime: 2022-01-27 15:05:53
 */
import { RouteOption } from '@src/typings/global'
import Loadable from '../loadable'

const files = require.context('.', true, /\.ts$/)
const routes: RouteOption[] = []

files.keys().forEach((key: string) => {
  if (key === './index.ts') return
  routes.push(...files(key).default)
})

export { routes }

export default [
  {
    path: '/home',
    title: '首页',
    exact: false,
    isAuthenticated: true, // 需要权限
    component: Loadable(() => import(/* webpackChunkName: "home" */ '@pages/home/index')),
    routes
  }
]
