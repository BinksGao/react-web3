import * as React from 'react'
import notFound from '@assets/images/notfound.png'
import './index.less'
import { BaseProps } from '@src/typings/global'
import { RootComponent } from '@components/index'

interface BaseNotFoundProps extends BaseProps {
}

interface BaseNotFoundState {}
export default class NotFound extends RootComponent<BaseNotFoundProps, BaseNotFoundState> {
  time: any
  constructor (props: any) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div className='not-found'>
        <img src={notFound} alt=""/>
      </div>
    )
  }
}
