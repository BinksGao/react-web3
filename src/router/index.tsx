/*
 * @Description: 路由管理
 * @author: gaohuan
 * @Date: 2022-01-27 13:31:12
 * @LastEditTime: 2022-03-03 22:16:38
 */
import { RootComponent } from '@components/root'
import * as React from 'react'
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Loadable from './loadable'

const Home = Loadable(() => import(/* webpackChunkName: "login" */ '@pages/home/index'))
const NotFound = Loadable(() => import(/* webpackChunkName: "notFound" */ '@pages/noFound/index'))

export default class Root extends RootComponent {
  /** 自定义离开的提示信息 */
  getUserConfirmation = (message: string, callback: Function) => {
    let flag = true
    callback(flag)
  }

  render () {
    return (
      <div style={{ height: '100%' }}>
        <Router hashType="noslash" getUserConfirmation={this.getUserConfirmation}>
          <Switch>
            <Route path="/home" exact component={Home} />
            <Redirect from="/" exact to='/home'/>
            <Route component={NotFound} />
          </Switch>
        </Router>
      </div>
    )
  }
}
