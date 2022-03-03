import { observable, action, computed } from 'mobx'
import _ from 'lodash'
import { KeyValue } from '@src/typings/global'

export class MobxMainCondition {
  @observable // 计算条件组件所需要的单位等信息
  units: KeyValue = {
    unit: '方', // 单位，用于主要条件计算展示所需
    unitOne: '总方数',
    unitTwo: '总方数<=限定方数'
  }

  @observable // 计算条件单选类型
  conditionType: number = 0

  @observable // 是否选择了任意单选项
  isSelectedConditionRadio = false

  @observable // 是否选择了多选项
  isSelectedConditionCheckbox = false

  @observable // 是否要在计算公式页面显示多选框组件
  isShowConditionCheckbox = false

  @observable // 单价
  unitPrice: string = ''

  @observable // 费率
  priceRation: string = ''

  @observable // 固定价
  fixedPrice: string = ''

  /* 区间段数据处理 */
  @observable // 计算字段
  intervalField: number = 0
  /* 区间段数据处理 */

  @action // 设置计算条件单位信息等，用于派生表格信息
  setConditionUnits = (t: KeyValue) => (this.units = t)

  @action // 设置计算条件类型
  setConditionType = (t: number) => (this.conditionType = t)

  @action // 设置是否勾选了必选的计算条件
  setSelectedRadio = (v: boolean) => (this.isSelectedConditionRadio = v)

  @action // 设置是否在计算条件页面显示复选框对应的信息
  setShowCheckbox = (t: boolean) => (this.isShowConditionCheckbox = t)

  @action // 设置计算条件弹窗是否勾选了复选框状态
  setCheckbox = (v: boolean) => (this.isSelectedConditionCheckbox = v)

  @action // 设置单价
  setUnitPrice = (v: string) => (this.unitPrice = v)

  @action // 设置费率
  setPriceRation = (v: string) => (this.priceRation = v)

  @action // 设置固定价
  setFixedPrice = (v: string) => (this.fixedPrice = v)

  /* 区间段数据处理 */
  @action // 设置计算字段
  setIntervalField = (t: number) => (this.intervalField = t)
  /* 区间段数据处理 */
}

export default new MobxMainCondition()
