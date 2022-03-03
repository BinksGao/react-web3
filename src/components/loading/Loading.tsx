import * as React from 'react'
import { RootComponent } from '@components/root'
import { Spin, Button } from 'antd'
import './index.less'
import { LoadingComponentProps } from 'react-loadable'

interface LoadingState {
}

export default class Loading extends RootComponent<LoadingComponentProps, LoadingState> {
  constructor (props:LoadingComponentProps) {
    super(props)
  }

  /** 重新加载 */
  reload = () => {
    window.location.reload()
  }

  render () {
    const { error, timedOut, pastDelay, isLoading } = this.props
    if (error) {
      return (
        <div className="loading-content">
          <Button className="loading-btn" size="small" onClick={this.reload}>重新加载</Button>
        </div>
      )
    } else if (timedOut) {
      return (
        <div className="loading-content">
          <Button className="loading-btn" size="small" onClick={this.reload}>重新加载</Button>
        </div>
      )
    } else if (pastDelay || isLoading) {
      return (
        <div className="loading-content">
          <Spin size="large" className="loading-spin" tip="加载中......"/>
        </div>
      )
    } else {
      return null
    }
  }
}
