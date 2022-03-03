import * as React from 'react'
import { RootComponent, BaseProps, WalletModal } from '@components/index'
import { Col, Dropdown, Menu, Row } from 'antd'
import { SysUtilAuth as SysUtil } from '@utils/index'
import { DownOutlined } from '@ant-design/icons'
import './index.less'

const { Item } = Menu
interface HomeHeaderProps extends BaseProps {
  refreshRoutes: () => void
}
interface HomeHeaderState {
  visible: boolean // 链接钱包弹窗是否显示
  walletAccount: any // 钱包账户
}
export default class HomeHeader extends RootComponent<HomeHeaderProps, HomeHeaderState> {
  private timer: NodeJS.Timeout | null = null
  constructor (props: HomeHeaderProps) {
    super(props)
    this.state = {
      visible: false,
      walletAccount: undefined
    }
  }
  componentDidMount () {
    const walletAccount = SysUtil.getLocalStorage('walletAccount')
    this.setState({
      walletAccount: walletAccount ? this.splitStr(walletAccount, 0, 6) : undefined
    })
  }
  /**
   * 字符串截取
   * @param str 字符串
   * @param start 开始位置
   * @param end 结束为止
   */
  splitStr = (str: string, start: number, end: number) => {
    return str.substr(start, end) + '****' + str.substr(str.length - end, str.length)
  }
  // 点击链接钱包
  connectWalletHandler = () => {
    this.setState({
      visible: true
    })
  }
  // 关闭钱包链接
  closeWalletConnect = () => {
    this.setState({
      visible: false
    })
  }
  // 设置钱包账户
  setAccount = (account: string) => {
    this.setState({
      visible: false,
      walletAccount: account ? this.splitStr(account, 0, 6) : undefined
    })
  }
  // 断开钱包链接
  logOut = () => {
    SysUtil.clearLocalStorageAsLoginOut()
    this.setState({
      walletAccount: ''
    })
  }
  render () {
    const { state: { visible, walletAccount } } = this
    const menu = (
      <Menu>
        <Menu.Item key="0" onClick={this.logOut}>
        断开链接
        </Menu.Item>
      </Menu>
    )
    return (
      <React.Fragment>
        <Row className='header-container'>
          {!walletAccount ? <Col>
            <div className='no-connect' onClick={this.connectWalletHandler}>Connect Wallet</div>
          </Col> : <div className='no-connect'>
            <Dropdown overlay={menu} className="custom-menu" trigger={['click']}>
              <div>
                <span className='account' onClick={e => e.preventDefault()}>{walletAccount}</span>
              </div>
            </Dropdown>
          </div>}
        </Row>
        <WalletModal visible={visible} closeWalletConnect={this.closeWalletConnect} setAccount={this.setAccount}></WalletModal>
      </React.Fragment>
    )
  }
}
