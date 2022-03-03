import { observable, action } from 'mobx'
import { SysUtil, globalEnum, ComUtil, SysUtilAuth } from '@utils/index'
import { KeyValue } from '@src/typings/global'

const { getLocalStorage } = SysUtil

const packMode = (function () {
  const mode = process.env.mode
  return /pre|prod/.test(mode!)
}())

interface Admin {
  id: number
  phone: string
  name: string
  nickname: string
}

const defaultAdmin = {
  id: 0,
  phone: '',
  name: '',
  nickname: ''
}

export class GlobalStore {
  @observable // 登录角色信息
  admin: Admin = getLocalStorage(globalEnum.admin) || defaultAdmin

  @observable
  structures: KeyValue[] = SysUtilAuth.getLocalStorage(globalEnum.structures) || []

  @observable
  structureId: string | undefined = SysUtilAuth.getLocalStorage(globalEnum.structureId) || undefined

  @observable // 当前角色权限列表
  adminAuthorityList: string[] = SysUtilAuth.getLocalStorage(globalEnum.auth) || []

  @action
  setAdminInfo = (admin: Admin) => { this.admin = admin }

  @action
  setAuthorityList = (adminAuthorityList: string[]) => { this.adminAuthorityList = adminAuthorityList }

  @action // 判断权限，支持列表形式权限判断
  hasAuthority = (key: string | ReadonlyArray<string>): boolean | boolean[] => {
    // 根据环境判断是否需要将功能权限（按钮）添加进去
    const admin = SysUtil.getLocalStorage(globalEnum.admin) || {}
    if (packMode && (!admin.admin)) {
      const adminAuthorityList = this.adminAuthorityList
      if (typeof key === 'string') return ComUtil.inArray(key, adminAuthorityList).include
      const tempList = [...adminAuthorityList, ...key]
      if (tempList.length === adminAuthorityList.length) return Array(key.length).fill(true)
      const tempArr: boolean[] = []
      key.forEach(item => {
        tempArr.push(ComUtil.inArray(item, adminAuthorityList).include)
      })
      return tempArr
    } else {
      return Array(key.length).fill(true)
    }
  }

  @action
  setStructures = (structures: KeyValue[]) => (this.structures = structures || [])

  @action
  setStructureId = (structureId: string | undefined) => (this.structureId = structureId || undefined)

  @action
  clearStore = () => {
    this.admin = defaultAdmin
    this.structures = []
    this.structureId = undefined
    this.adminAuthorityList = []
  }
}

export default new GlobalStore()
