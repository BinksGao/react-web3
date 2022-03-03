import React, { useEffect, useState } from 'react'
import { KeyValue } from '@src/typings/global'
import { useWeb3React } from '@web3-react/core'
import { notification } from 'antd'
import { SysUtilAuth as SysUtil } from '@utils/index'
import { injected } from './connectors'
import './index.less'

interface WalletConnectProps {
  walletInfo: KeyValue
  closeConnect: () => void
  modifyAccount: (account: any) => void
}
interface WindowChain {
  ethereum?: {
    isMetaMask?: true
    request?: (...args: any[]) => void
  }
}
export const WalletCard = (props: WalletConnectProps) => {
  const { walletInfo, modifyAccount } = props
  const [ wallet, setWallet ] = useState(walletInfo)
  const { active, account, activate, deactivate } = useWeb3React()
  // 链接钱包
  const connectWallet = async () => {
    const provider = (window as WindowChain).ethereum
    if (provider) {
      try {
        await activate(injected)
        SysUtil.setLocalStorage('isWalletConnected', true)
      } catch (err) {
        console.log(err)
      }
    } else {
      notification.error({
        message: 'Notification Title',
        description: 'There is no an available Wallet, Please install a Wallet '
      })
    }
  }
  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (SysUtil.getLocalStorage('isWalletConnected')) {
        try {
          await activate(injected)
          SysUtil.setLocalStorage('isWalletConnected', true)
          account && SysUtil.setLocalStorage('walletAccount', account)
          modifyAccount && modifyAccount(account || '')
        } catch (err) {
          console.log(err)
        }
      }
    }
    connectWalletOnPageLoad()
  }, [active])
  return (
    <div className='wallet-card' onClick={connectWallet}>
      <div className='wallet-icon'>{walletInfo?.icon}</div>
      <span className='wallet-title'>{walletInfo?.title}</span>
    </div>
  )
}
