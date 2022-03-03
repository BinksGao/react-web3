import { BaseProps, RootComponent } from '@components/index'
import { Layout } from 'antd'
import React from 'react'
import HeaderPage from './header'
import HomeContent from './content'
import './index.less'

const { Header, Content } = Layout
interface HomeProps extends BaseProps {
  routes: []
}
interface HomeState {
  refresh: boolean // 是否刷新页面
  minHeight: number // 页面最小高度
}
export default class Home extends RootComponent<HomeProps, HomeState> {
  private timer: NodeJS.Timeout | null = null
  constructor (props: any) {
    super(props)
    let minHeight = document.body.clientHeight
    this.state = {
      refresh: false,
      minHeight
    }
  }
  componentDidMount () {
    window.addEventListener('resize', this.setPageHeight)
  }
  componentWillUnmount () {
    window.removeEventListener('resize', this.setPageHeight)
  }

  refreshRoutes = () => {
    this.setState(
      {
        refresh: true
      },
      () => {
        this.timer = setTimeout(() => {
          this.setState({ refresh: false })
        }, 1500)
      }
    )
  }
  setPageHeight = () => {
    this.setState({
      minHeight: document.body.clientHeight
    })
  }
  render () {
    return (
      <Layout className="home-content">
        <Layout hasSider>
          <Layout>
            <Header className="cus-header">
              <HeaderPage {...this.props} refreshRoutes={this.refreshRoutes}/>
            </Header>
            <Content className="cus-tabs-content" style={{ height: this.state.minHeight + 'px' }}>
              <HomeContent {...this.props}></HomeContent>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}
