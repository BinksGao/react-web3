import * as H from 'history'
declare interface KeyValue {
  [key: string]: any
}

declare interface RouteOption extends KeyValue {
  children: any[]
  readonly title: string
  readonly path: string
  readonly exact: boolean
  readonly key: string
  readonly icon: string
  readonly level: number
  readonly index: number
  readonly parent: string
  readonly component: any
  readonly routes: Array<RouteOption> | undefined
}

declare interface BaseProps {
  history: H.History
  location: Location
  match: RouteMatch
  routes: Array<RouteOption> | undefined
  isFind?: boolean
  staticContext?: StaticContext
  [key: string]: any
}

interface RouteMatch {
  params: KeyValue
  isExact: boolean
  path: string
  url: string
}

interface StaticContext {
  statusCode?: number
}

interface Location extends H.Location {
  query?: KeyValue
}

declare global {
  interface Window {
    AMapUI: any
    AMap: any
  }
}
