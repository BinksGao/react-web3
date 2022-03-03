import Loadable from 'react-loadable'
import Loading from '@components/loading/Loading'
import { BaseProps } from '@src/typings/global'

export default (loader: () => Promise<React.ComponentType<BaseProps> | { default: React.ComponentType<BaseProps> | any}>) => {
  return Loadable({
    loader,
    loading: Loading,
    delay: 10000
  })
}
