import React from 'react'
import { MetaMaskIcon, RootComponent, TrustWalletIcon, WalletConnectIcon } from '@components/index'
import { KeyValue } from '@src/typings/global'
import { Modal } from 'antd'

import './index.less'
import { BscIcon, SafePalIcon, TokenPocketIcon } from './icons'
import { WalletCard } from './walletCard'
interface WalletConnectProps {
  visible: boolean // 弹窗显示
  closeWalletConnect: () => void
  setAccount: (account: string) => void
}
interface WalletConnectState {
  WalletConfig: KeyValue[]
  active: boolean // 钱包是否被激活
  account: any // 钱包账户
}
export default class WalletConnect extends RootComponent<WalletConnectProps, WalletConnectState> {
  constructor (props: any) {
    super(props)
    this.state = {
      WalletConfig: [{
        id: 1,
        title: 'MetaMask',
        icon: <MetaMaskIcon></MetaMaskIcon>
      }, {
        id: 2,
        title: 'WalletConnect',
        icon: <WalletConnectIcon></WalletConnectIcon>
      }, {
        id: 3,
        title: 'Trust Wallet',
        icon: <TrustWalletIcon></TrustWalletIcon>
      }, {
        id: 4,
        title: 'TokenPocket',
        icon: <TokenPocketIcon></TokenPocketIcon>
      }, {
        id: 5,
        title: 'Binance Chain',
        icon: <BscIcon></BscIcon>
      }, {
        id: 6,
        title: 'SafePal',
        icon: <SafePalIcon></SafePalIcon>
      }],
      active: false,
      account: undefined
    }
  }
  // 关闭钱包链接
  closeConnect = () => {
    const { props: { closeWalletConnect } } = this
    closeWalletConnect && closeWalletConnect()
  }
  // 设置钱包账户
  modifyAccount = (account: any) => {
    const { props: { setAccount } } = this
    setAccount && setAccount(account)
  }
  render () {
    const { props: { visible }, state: { WalletConfig } } = this
    return (
      <Modal title='Connect to a Wallet' width={400} footer={null} centered visible={visible} onCancel={this.closeConnect} maskClosable={false}>
        <div className='wallet-container'>
          {WalletConfig.map((v: KeyValue, id: number) => {
            return <WalletCard walletInfo={v} key={id} closeConnect={this.closeConnect} modifyAccount={this.modifyAccount}></WalletCard>
          })}
        </div>
      </Modal>
    )
  }
}
