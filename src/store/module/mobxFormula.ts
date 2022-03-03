import { observable, action, computed } from 'mobx'

export class MobxFormula {
  @observable // 公式一、公式六单位
  units = {
    unit: '方', // 单位，用于主要条件计算展示所需
    unitOne: '总方数',
    unitTwo: '总方数<=限定方数'
  }

  @observable // 计算公式单选类型
  formulaType: number = 0

  @observable // 是否选择了任意单选项
  isSelectedRadio = false

  @observable // 是否选择了多选项
  isSelectedCheckbox = false

  @observable // 是否要在计算公式页面显示多选框组件
  isShowCheckbox = false

  @observable // 保底价
  bottomPrice: string = ''

  @observable // 单位数
  unitNumber: string = ''

  @computed
  get disabledList () {
    let list = new Array(5).fill(false)
    if (!this.isSelectedRadio) return list
    list = list.filter((v, i) => (this.formulaType - 1) !== i)
    return list
  }

  @action
  selectUnit = (v: { unit: string, unitOne: string, unitTwo: string }) => (this.units = v)

  @action
  setFormulaType = (t: number) => (this.formulaType = t)

  @action
  setSelectedRadio = (v: boolean) => (this.isSelectedRadio = v)

  @action
  setShowCheckbox = (t: boolean) => (this.isShowCheckbox = t)

  @action
  setCheckbox = (v: boolean) => (this.isSelectedCheckbox = v)

  @action
  setBottomPrice = (v: string) => (this.bottomPrice = v)

  @action
  setUnitNumber = (v: string) => (this.unitNumber = v)
}

export default new MobxFormula()
