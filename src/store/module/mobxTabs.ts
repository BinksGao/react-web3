import _ from 'lodash'
import { observable, action, computed } from 'mobx'
import { routes as routeList } from '@router/module/index'
import { createHashHistory } from 'history'
import { KeyValue, RouteOption } from '@src/typings/global'
import { SysUtil, ComUtil, globalEnum } from '@utils/index'

interface TabPaneData {
  title: string
  routePath: string
  refresh: boolean
  close: boolean
  selected: boolean
  realPath: string
}

const defaultPath = '/home/homeInfo'
const history = createHashHistory()

const tabPaneList = [{
  title: '首页',
  routePath: defaultPath,
  realPath: defaultPath,
  refresh: false,
  close: false,
  selected: true
}]

const packMode = (function () {
  const mode = process.env.mode
  return /pre|prod/.test(mode!)
  // return /pre|prod|whydemo|testdev/.test(mode!)
}())
const sort = (data: RouteOption[]) => {
  return data.map(({ title, parent, path, key, index, icon, children }) => {
    return { title, parent, path, key, index, icon, children }
  }).sort((a: KeyValue, b: KeyValue) => a.index - b.index)
}

const getDerivedSiderFromRoutes = () => {
  const siderDataList: KeyValue[] = []
  const parentRoutes = routeList.filter((el: KeyValue) => el.level === 1 && el.path !== defaultPath)
  const sonRoutes = routeList.filter((el: KeyValue) => el.level === 2)
  const grandSonRoutes = routeList.filter((el: KeyValue) => el.level === 3)
  parentRoutes.forEach((el: KeyValue) => {
    const two = sonRoutes.filter((sub: KeyValue) => sub.parent === el.key)
    two.forEach((elt: KeyValue) => {
      elt['children'] = grandSonRoutes.filter((sub: KeyValue) => sub.parent === elt.key)
      elt['children'] = sort(elt.children)
    })
    const obj = { title: el.title, key: el.key, parent: el.parent, path: el.path, icon: el.icon, children: sort(two) }
    siderDataList.push(obj)
  })
  return siderDataList
}

/* 开发和打包过滤不同权限 */
const filterAuth = (siderDataList: any[], authList: string[]) => {
  let list: any[] = []
  const admin = SysUtil.getLocalStorage(globalEnum.admin) || {}
  if ((!admin.admin) && packMode) {
    for (const siderData of siderDataList) {
      const { title, key, parent, path, icon, children } = siderData
      const hasChildren = children && children.length > 0
      if (ComUtil.inArray(key, authList).include) {
        const sider: KeyValue = { title, key, parent, path, icon, hasChildren }
        children && (sider.children = filterAuth(children, authList))
        list.push(sider)
      }
    }
  } else {
    for (const siderData of siderDataList) {
      const { title, key, parent, path, icon, children } = siderData
      const hasChildren = children && children.length > 0
      const sider: KeyValue = { title, key, parent, path, icon, hasChildren }
      children && (sider.children = filterAuth(children, authList))
      list.push(sider)
    }
  }
  return list
}

export class MobxTabs {
  // 侧边栏数据
  siderDataList: any[] = []

  @observable
  tabPaneList: TabPaneData[] = SysUtil.getLocalStorage('tabPaneList') || tabPaneList

  @observable.struct
  activeRoutePath: string = SysUtil.getLocalStorage('activeRoutePath') || defaultPath

  // 判断选中 tabPane 位置，用来设置左右点击按钮状态 0 - 左右都禁用，1 - 禁用左侧，2 - 不禁用， 3 - 禁用右侧
  @observable.struct
  tabPanePosition: number = SysUtil.getLocalStorage('tabPanePosition') || 0

  @observable
  openKeyList: string[] = []

  @action
  setOpenKeys = (activeRoutePath: string = this.activeRoutePath) => {
    const result = routeList.find((v: KeyValue) => v.path === activeRoutePath)
    const keys: string[] = []
    if (result) {
      const { parent, level } = result
      if (level === 3) {
        const parentResult = routeList.find((v: KeyValue) => v.key === parent)
        if (parentResult) keys.push(parentResult.parent + '-1')
        keys.push(parent + '-2')
      } else {
        keys.push(parent + '-1')
      }
    }
    this.openKeyList = keys
  }

  @action
  setOpenKeyList = (keys: string[]) => {
    this.openKeyList = keys
  }

  @action
  setSiderDataList = (authList: any[]) => {
    const siderDataList = getDerivedSiderFromRoutes()
    let list = filterAuth(siderDataList, authList)
    list = list.filter(l => {
      const { children, hasChildren } = l
      if (hasChildren) {
        l.children = children.filter((v: KeyValue) => !v.hasChildren || (v.children && v.children.length))
      }
      return !!l.children.length
    })
    this.siderDataList = list
  }

  @action
  findRouteParentByPath = (path: string) => {
    let activeRoutePath: any
    const route = this.findRouteItemByRoutePath(path)
    // 当路由不存在的时候进入404页面
    if (!route) {
      history.replace('/NotFound')
      return
    }
    // 2019/12/9时燕自浩修改 由if (route.level === 2) 改为if (route.level === 2 || route.level === 3)
    if (route.level === 2 || route.level === 3 || route.level === 1) {
      activeRoutePath = route.path
    } else {
      // 2019/12/9时燕自浩修改 由routeItem.key === route.parent && routeItem.level === 2 改为routeItem.key === route.parent && (routeItem.level === 2 || routeItem.level === 3))
      const parentRoute = routeList.find((routeItem: RouteOption) => routeItem.key === route.parent && (routeItem.level === 2 || routeItem.level === 3))
      activeRoutePath = parentRoute && parentRoute.path
    }
    activeRoutePath && this.addTabPaneToPaneList(activeRoutePath)
  }

  @action
  setRealPath = (path: string, search: string = '', level: number = 3) => {
    let realPath = path
    if (level === 3) {
      const result = routeList.find((v: KeyValue) => path === v.path)
      if (!result) return
      const resultParent = routeList.find((v: KeyValue) => v.key === result.parent)
      if (!resultParent) return
      realPath = resultParent.path
    }
    const tmpRes = this.tabPaneList.find((v: KeyValue) => realPath === v.routePath)
    if (!tmpRes) return
    tmpRes.realPath = path + (search || '')
    SysUtil.setLocalStorage('tabPaneList', this.tabPaneList)
  }

  /* 根据 route path 查找对应的 routeItem */
  @action
  findRouteItemByRoutePath = (path: string) => {
    const routeItem = routeList.find((routeItem: RouteOption) => routeItem.path === path)
    if (routeItem) return routeItem
    for (const routeItem of routeList) {
      const { children } = routeItem
      if (children && children.length) {
        const routeItemSon = children.find((routeItemSon: RouteOption) => routeItemSon.path === path)
        return routeItemSon
      }
    }
    return {}
  }

  @action
  setTabPaneSelectStatus = (path: string) => {
    this.tabPaneList.forEach(item => {
      if (item.routePath !== path) item.selected = false
      else item.selected = true
    })
  }

  @action
  addTabPaneToPaneList = (activeRoutePath: string) => {
    if (this.activeRoutePath === activeRoutePath) return ''
    this.activeRoutePath = activeRoutePath
    this.setOpenKeys(activeRoutePath)
    const tabPaneList = _.cloneDeep(this.tabPaneList)
    const routeItem = this.findRouteItemByRoutePath(activeRoutePath)
    const { title, path } = routeItem
    const result = tabPaneList.find((tabPane: TabPaneData) => tabPane.routePath === path)
    let realPath = result?.realPath
    if (!result) {
      // 2019/12/9时燕自浩修改 添加if (path === '/home/datamanage/contract') return 作用： 过滤基础数据管理点击合同资料子节点会添加合同资料的TabPane
      // if (path === '/home/datamanage/contract') return
      tabPaneList.push({ title, realPath: path, routePath: path, refresh: true, close: true, selected: true })
      this.tabPaneList = tabPaneList
      this.setTabPaneSelectStatus(path)
      realPath = path
      SysUtil.setLocalStorage('tabPaneList', tabPaneList)
    } else {
      this.setTabPaneSelectStatus(result.routePath)
    }
    SysUtil.setLocalStorage('activeRoutePath', this.activeRoutePath)
    return realPath
  }

  @action
  removeTabPane = (routePath: string) => {
    const { tabPaneList } = this
    const len = tabPaneList.length
    const index = tabPaneList.findIndex(tabPane => routePath === tabPane.routePath && routePath !== '/home')
    const { selected } = tabPaneList[index]
    if (selected) {
      if (index + 1 < len) this.activeRoutePath = tabPaneList[index + 1].routePath
      else this.activeRoutePath = tabPaneList[index - 1].routePath
    } else {
      tabPaneList.some(({ selected, routePath }) => {
        if (selected) {
          this.activeRoutePath = routePath
          return true
        } else {
          return false
        }
      })
    }
    tabPaneList.splice(index, 1)
    this.setOpenKeys()
    this.setTabPaneSelectStatus(this.activeRoutePath)
    SysUtil.setLocalStorage('tabPaneList', tabPaneList)
    SysUtil.setLocalStorage('activeRoutePath', this.activeRoutePath)
    // const leftLen = tabPaneList.length
    // const tabPaneIndex = tabPaneList.findIndex(({ routePath }) => routePath === this.activeRoutePath)
    // if (leftLen <= 1) this.tabPanePosition = 0
    // else if (tabPaneIndex <= 0) this.tabPanePosition = 1
    // else if (tabPaneIndex >= tabPaneList.length - 1) this.tabPanePosition = 3
    // else this.tabPanePosition = 2
    // SysUtil.setLocalStorage('tabPanePosition', this.tabPanePosition)
  }

  @action
  selectNextTabPane = (t: number) => {
    const { tabPaneList, setTabPaneSelectStatus } = this
    const index = tabPaneList.findIndex(({ selected }) => selected)
    const len = tabPaneList.length
    // if (len <= 1) this.tabPanePosition = 0
    // else if (t < 0 && (index - 1 <= 0)) this.tabPanePosition = 1
    // else if (t > 0 && (index + 1 >= tabPaneList.length - 1)) this.tabPanePosition = 3
    // else this.tabPanePosition = 2
    // SysUtil.setLocalStorage('tabPanePosition', this.tabPanePosition)
    if (t < 0) {
      if (index <= 0) return
      this.activeRoutePath = tabPaneList[index - 1].routePath
    } else {
      if (index >= len - 1) return
      this.activeRoutePath = tabPaneList[index + 1].routePath
    }
    this.setOpenKeys()
    setTabPaneSelectStatus(this.activeRoutePath)
  }

  @action
  resetAllData = () => {
    this.tabPaneList = tabPaneList
    this.activeRoutePath = defaultPath
    this.setOpenKeys()
    this.tabPanePosition = 0
    SysUtil.setLocalStorage('tabPaneList', tabPaneList)
    SysUtil.setLocalStorage('activeRoutePath', this.activeRoutePath)
  }

  @action
  closeOtherTab = () => {
    const tabItem = this.tabPaneList.find((v: KeyValue) => v.routePath === this.activeRoutePath && v.routePath !== defaultPath)
    this.tabPaneList = [...tabPaneList]
    tabItem && (this.tabPaneList.push(tabItem))
    this.setOpenKeys()
    SysUtil.setLocalStorage('tabPaneList', this.tabPaneList)
  }
}

export default new MobxTabs()
