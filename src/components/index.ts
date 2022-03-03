/*
 * @Description: 组件导出
 * @author: gaohuan
 * @Date: 2022-01-27 13:29:05
 * @LastEditTime: 2022-03-02 21:01:14
 */
import { Axios } from './axios/index' // Axios
import Loading from './loading/loading'

export { Loading, Axios }
export * from './root'
export { BaseProps } from '@src/typings/global'
export { MetaMaskIcon, WalletConnectIcon, TrustWalletIcon, TokenPocketIcon, BscIcon, SafePalIcon } from './WalletModal/icons/index'
export { default as WalletModal } from './WalletModal/index'
export * from './WalletModal/walletCard'
