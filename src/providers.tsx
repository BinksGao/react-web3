import React from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { Provider } from 'mobx-react'
import store from './store'
import { getLibrary } from './utils/web3React'

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        {children}
      </Provider>
    </Web3ReactProvider>
  )
}

export default Providers
