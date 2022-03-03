import { JudgeUtil } from './JudgeUtil'

class RegExpInfo {
  /**
   * 身份证号
   * @value /(^\d{18}$)|(^\d{17}(\d|X|x)$)/
   */
  idCard: RegExp = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  /**
   * 中文
   * @value /^\S[\u0391-\uFFE5]+$/
   */
  Zh: RegExp = /^\S[\u0391-\uFFE5]+$/
  /**
   * 英文
   * @value /^\S[a-zA-Z]+$/
   */
  En: RegExp = /^\S[a-zA-Z]+$/
  /**
   * 电话
   * @value /^1(3|4|5|6|7|8|9)\d{3,9}$/
   */
  Phone: RegExp = /^1(3|4|5|6|7|8|9)\d{3,9}$/
  /**
   * 电话
   * @value /^1(3|4|5|6|7|8|9)\d{9}$/
   */
  PhoneTwo: RegExp = /^1(2|3|4|5|6|7|8|9)\d{9}$/
  /**
   * 电话
   * @value /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/
   */
  PhoneThree: RegExp = /^[\d-]{7,13}$/
  /**
   * 电话
   * @value /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/
   */
  PhoneFour: RegExp = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/
  /**
   * 非0 0. 0.0
   * @value /^[^0]|0[\d\.]*[^0\.]{1}|0\.([^0]\d)+\d$/
   */
  // eslint-disable-next-line no-useless-escape
  NotZero: RegExp = /^[^0]|0[\d\.]*[^0\.]{1}|0\.([^0]\d)+\d$/
  /**
   * 温度
   * @value /^[\d-]{1}\d+[\.]{0,1}\d*$/
   */
  // eslint-disable-next-line no-useless-escape
  Temperature: RegExp = /^(\-{0,1}\d{1,4}[\.]{1}\d{1,2})$|^(-{1}\d{1,4})$|^(\d{1,4})$/
  /**
   * 数字
   * @value /^[0-9]*$/
   */
  Num: RegExp = /^[0-9]*$/
  /**
   * 数字
   * @value /^\d+$/
   */
  NumTwo: RegExp = /^\d+$/
  /** 正整数的正则表达式(不包括0) */
  PositiveIntegerOne: RegExp = /^[+]{0,1}(\d+)$/
  /** 正整数不包括0 */
  PositiveIntegerTwo: RegExp = /^[1-9]\d*$/
  /** 正数的正则表达式(不包括0，小数保留两位) */
  PositiveIntegerThree: RegExp = /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/
  /** 正数的正则表达式(包括0，小数保留两位) */
  PositiveIntegerFour: RegExp = /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/
  /** 正数的正则表达式 保留小数点前8位 小数点后两位 */
  PositiveIntegerFive = /^\d{1,8}(\.\d{2,2})?$/
  /** 标点符号 */
  Punctuate: RegExp = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g
  /** 字符串必须以数字结尾 */
  mustNumber: RegExp = /(\d+)$/g
  /**
   * 中文|英文
   * @value /^\S[\u0391-\uFFE5a-zA-Z]+$/
   */
  ZhEn: RegExp = /^\S[\u0391-\uFFE5a-zA-Z]+$/
  /**
   * 中文|数字
   * @value /^\S[\u0391-\uFFE50-9]+$/
   */
  ZhNum: RegExp = /^\S[\u0391-\uFFE50-9]+$/
  /**
   * 中文|数字
   * @value /^\S[\u0391-\uFFE5`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]+$/
   */
  ZhPunctuate: RegExp = /^\S[\u0391-\uFFE5`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]+$/
  /**
   * 邮箱
   * @value /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
   */
  Email: RegExp = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
  /**
   * 英文|数字
   * @value /^\S[a-zA-Z0-9]+$/
   */
  EnNum: RegExp = /^[a-zA-Z0-9]+$/
  /**
   * 判断是否是11位数字
   */
  IsEvNum: RegExp = /^\d{11}$/
  /**
   * 英文|数字
   * @value /^\S[a-zA-Z`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]+$/
   */
  EnPunctuate: RegExp = /^\S[a-zA-Z`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]+$/
  /** 匹配不能只为0的数字 数值为01-09但不能为00 */
  NumberWithZeroOrNot: RegExp = /^[0]*[1-9]+[0]*$/
  /** 数字字母组合切最后一位必须是数字 */
  MustEndNumber = /^[\d]$|[0-9A-Za-z]+(\d+)$/
}

export default class ValidateUtil {
  /** 正则的表达式 */
  static reg: RegExpInfo = new RegExpInfo()
  /**
   * 通用的验证
   * @param rule 验证的规则： pattern 写了就必须写message
   * @param value 值
   */
  static validatorCommon = (rule: any, value: any) => {
    if (rule.required) {
      if (!value || value === '' || value === null) {
        return Promise.reject(rule.message || '请输入')
      } else {
        return ValidateUtil.validatorRules(rule, value)
      }
    } else {
      if (value) return ValidateUtil.validatorRules(rule, value)
    }
    return Promise.resolve()
  }

  /**
   * 进行验证
   * @param rules 验证的规则： pattern 写了就必须写message
   * @param value 值
   * @returns 返回 Promise
   */
  static validatorRules = (rules: any, value: any) => {
    // 字段长度,  最大长度 校验文案 最小长度 正则表达式校验 是否必选 校验前转换字段值
    const { len, max, message, min, pattern, type } = rules
    if (pattern && !pattern.test(value)) {
      return Promise.reject(message || '验证不通过！')
    } else if (len && value.length !== len) {
      // 存在长度的判断则只做
      return Promise.reject(new Error(`输入长度为${len}字符`))
    } else {
      let len: number = value.length
      if (max && min && (len > max || max < min)) {
        return Promise.reject(new Error(`输入长度在${min}~${max}之间`))
      } else if (max && len > max) {
        return Promise.reject(new Error(`输多输入${max}字符`))
      } else if (min && len < min) {
        return Promise.reject(new Error(`最少输入${min}字符`))
      } else {
        return Promise.resolve()
      }
    }
  }

  /**
   * 对值进行处理: 第一个值不能为空
   */
  static getValueFromEventFirstNotNull = (e: any) => {
    let value = e.target.value
    return value.replace(/^\s*/g, '').replace(/^\s*|\s*$/g, '')
  }

  /**
   * 验证中文和数字
   */
  static validateChineseAndNumber = (rule: any, value: any) => {
    let reg = /^\S[\u0391-\uFFE5\d]+$/
    if (!reg.test(value)) {
      return Promise.reject(new Error('请输入中文或数字'))
    }
    return Promise.resolve()
  }

  /** 验证中英文 */
  static validateName = (rule: any, value: any) => {
    let reg = /^\S[\u0391-\uFFE5a-zA-Z\s]+$/
    if (!reg.test(value) || JudgeUtil.isEmpty(value)) {
      return Promise.reject(new Error('请输入中文或英文'))
    }
    return Promise.resolve()
  }

  /** 限制首位不为空格 且 不能 输入特殊字符 */
  static getValueFromEventName = (e: any) => {
    let value = e.target.value
    return value
      .replace(/^\s*/g, '')
      .replace(/^\s*|\s*$/g, '')
      .replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g, '')
  }
  /** 限制不能 输入特殊字符 */
  static getValueFromEventNameChar = (e: any, maxLen?: number) => {
    let value = e.target.value
    value = value.replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g, '')
    return maxLen ? value.substr(0, maxLen) : value
  }
  /** 联系地址限制不能输入特殊字符 */
  static clearValueFromEventNameChar = (e: any, maxLen?: number) => {
    let value = e.target.value
    // eslint-disable-next-line no-useless-escape
    value = value.replace(/[`~!@$%^&*_\-+=<>?:"{}|.\\/;\\[\]·~！@￥%……&*——\+={}|《》？：“”【】、；‘’。、]/g, '')
    return maxLen ? value.substr(0, maxLen) : value
  }
  /** 限制只能输入数字和字母 */
  static getValueFromNumEn = (e: any) => {
    let value = e.target.value
    return value
      .replace(/^\s*/g, '')
      .replace(/^\s*|\s*$/g, '')
      .replace(/[^a-zA-Z\d]/g, '')
  }

  /** 限制只能输入数字和- */
  static getValueFromNumRod = (e: any) => {
    let value = e.target.value
    return value
      .replace(/^\s*/g, '')
      .replace(/^\s*|\s*$/g, '')
      .replace(/[^\d-]/g, '')
  }

  /** 过滤出数字和字母 */
  static valueToNumEn = (value: string) => {
    return value
      .replace(/^\s*/g, '')
      .replace(/^\s*|\s*$/g, '')
      .replace(/[^a-zA-Z\d]/g, '')
  }

  /** 限制只能输入数字、字母、- */
  static getValueFromNumEnRod = (e: any) => {
    let value = e.target.value
    return value
      .replace(/^\s*/g, '')
      .replace(/^\s*|\s*$/g, '')
      .replace(/[^a-zA-Z\-\d]/g, '')
  }

  /** 限制首位不为空格 */
  static getValueFromMessagePush = (e: any) => {
    let value = e.target.value
    return value.replace(/^\s*/g, '').replace(/^\s*|\s*$/g, '')
  }

  /** 限制首位不为空格 */
  static getValueFromEventFirstEmpty = (e: any) => {
    let value = e.target.value
    return value.replace(/^\s*/g, '')
  }

  /** 限制首位不为空格 */
  static getValueFromEventFirstEmptyThere = (e: any) => {
    let value = e.target.value
    return value.replace(/^\s*/g, '').replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g, '')
  }

  /** 验证电话 */
  static validatePhone = (rule: any, value: any) => {
    let reg = /^1(3|4|5|6|7|8|9)\d{3,9}$/
    if (!reg.test(value)) {
      return Promise.reject(new Error('请输入正确的手机号'))
    }
    return Promise.resolve()
  }

  /** 验证电话 */
  static validatePhoneTwo = (rule: any, value: any) => {
    let reg = /^1(3|4|5|6|7|8|9)\d{9}$/
    if (!reg.test(value)) {
      return Promise.reject(new Error('请输入正确的手机号'))
    }
    return Promise.resolve()
  }

  /** 联系方式 */
  static validateContactInformation = (rule: any, value: any) => {
    let regOne = /^1(3|4|5|6|7|8|9)\d{3,9}$/
    let regThere = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/
    if (!(regOne.test(value) || regThere.test(value))) {
      return Promise.reject(new Error('请输入正确的联系方式'))
    }
    return Promise.resolve()
  }

  /** 限制不能输入空格 */
  static getValueFromEventPhone = (e: any) => {
    let value = e.target.value
    return value.replace(/^\s*/g, '').replace(/[^\d]/g, '')
  }

  /** 验证中文 */
  static validateChinese = (rule: any, value: any) => {
    let reg = /^\S[\u0391-\uFFE5]+$/
    if (!reg.test(value) || JudgeUtil.isEmpty(value)) {
      return Promise.reject(new Error('请输入中文名称'))
    }
    return Promise.resolve()
  }

  /** 验证中文英文数字 */
  static validateChEnNumber = (rule: any, value: any) => {
    let reg = /^\S[\u0391-\uFFE5a-zA-Z0-9]+$/
    if (!reg.test(value) || JudgeUtil.isEmpty(value)) {
      return Promise.reject(new Error('请输入中文英文数字'))
    }
    return Promise.resolve()
  }

  /** 验证岗位 */
  static validatePostName = (rule: any, value: any) => {
    let reg = /^\S[\u0391-\uFFE5a-zA-Z]+$/
    if (!reg.test(value) || JudgeUtil.isEmpty(value)) {
      return Promise.reject(new Error('请输入中文名称'))
    }
    return Promise.resolve()
  }

  /** 验证地址 */
  static validateAddress = (rule: any, value: any) => {
    let reg = /^\S[\u0391-\uFFE5a-zA-Z]+$/
    if (!reg.test(value) || JudgeUtil.isEmpty(value)) {
      return Promise.reject(new Error('请输入中文'))
    }
    return Promise.resolve()
  }

  /** 验证输入数字 */
  static validateSalary = (rule: any, value: any) => {
    let reg = /^\d+$/
    if (!reg.test(value)) {
      return Promise.reject(new Error('请输入数字'))
    }
    return Promise.resolve()
  }
  /** 限制输入数字，不能输入小数点， 不能为负，不能为00 */
  static getValueFromEventNumberNoTwoZero = (e: any) => {
    let value = e.target.value
    value = value.replace(/^\s*/g, '').replace(/[^\d]/g, '')
    if (Number(value) < 0 || value === '00') {
      return 0
    }
    return JudgeUtil.isEmpty(value) ? undefined : value
  }

  /** 限制输入数字，不能输入小数点， 不能为负 */
  static getValueFromEventNumberHasZero = (e: any) => {
    let value = e.target.value
    value = value.replace(/^\s*/g, '').replace(/[^\d]/g, '')
    return value
  }

  /** 限制输入数字，不能输入小数点， 不能为负 */
  static getValueFromEventNumber = (e: any) => {
    let value = e.target.value
    value = value.replace(/^\s*/g, '').replace(/[^\d]/g, '')
    if (Number(value) < 0) {
      return 0
    }
    return JudgeUtil.isEmpty(value) ? value : Number(value)
  }

  /** 限制输入数字，不能输入小数点， 不能为负, 不能为0 */
  static getValueFromEventNumberNoZero = (e: any) => {
    let value = e.target.value
    value = value.replace(/^\s*/g, '').replace(/[^\d]/g, '')
    if (Number(value) <= 0) {
      return ''
    }
    return JudgeUtil.isEmpty(value) ? value : Number(value)
  }
  static getValueFromEventNumberZero = (e: any) => {
    let value = e.target.value
    value = value.replace(/^\s*/g, '').replace(/[^\d]/g, '')
    if (Number(value) < 0) {
      return 0
    }
    return JudgeUtil.isEmpty(value) ? value : Number(value)
  }
  /**
   * 保留小数点，默认保留两位
   * @param v 待处理字符串
   * @param decimalsLen 小数点位数
   * @param intLen 整数位数
   */
  static toFixed (v: string, decimalsLen: number = 2, intLen: number = 2) {
    v = v
      .substr(0, intLen + decimalsLen + 1)
      .replace(/[^\d.]/g, '')
      .replace(/^\./, '')
      .replace(/\.{2,}/g, '.')
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
      .replace(new RegExp(`^(\\d+)\\.(\\d{0,${decimalsLen}}).*$`), '$1.$2')
      .replace(/^\d+/, (match: string) => {
        return (parseFloat(match) + '').substr(0, intLen)
      })
    return v
  }
  /**
   * 保留小数点，默认保留两位 除去0
   * @param v 待处理字符串
   * @param decimalsLen 小数点位数
   * @param intLen 整数位数
   */
  static toFixedTemperature (v: string, decimalsLen: number = 2, intLen: number = 2) {
    let startStr = ''
    if (v.startsWith('-')) {
      startStr = '-'
      intLen += 1
    }
    v = v
      .substr(0, intLen + decimalsLen + 1)
      .replace(/[^\d.]/g, '')
      .replace(/^\./, '')
      .replace(/\.{2,}/g, '.')
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
      .replace(new RegExp(`^(\\d+)\\.(\\d{0,${decimalsLen}}).*$`), '$1.$2')
      .replace(/^\d+/, (match: string) => {
        return (parseFloat(match) + '').substr(0, intLen)
      })
    return startStr + v
  }

  /**
   * 保留小数点，默认保留两位, 且限制数值大小
   * @param v 待处理字符串
   * @param decimalsLen 小数点位数
   * @param intLen 整数位数
   */
  static toFixedLimit (v: string, decimalsLen: number = 2, intLen: number = 2, min: number, max: number) {
    v = v
      .substr(0, intLen + decimalsLen + 1)
      .replace(/[^\d.]/g, '')
      .replace(/^\./, '')
      .replace(/\.{2,}/g, '.')
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
      .replace(new RegExp(`^(\\d+)\\.(\\d{0,${decimalsLen}}).*$`), '$1.$2')
      .replace(/^\d+/, (match: string) => {
        return (parseFloat(match) + '').substr(0, intLen)
      })
    const value = Number(v) < min || Number(v) > max ? '' : v
    return value
  }
  /**
   * 转换成时间戳的数组
   * @param {any}           time 时间数组
   * @param {string|number} type 时间类型
   */
  static timeArrayFormat = (time: any, type: 'string' | 'number' = 'string', str: string | string[] = 'YYYY-MM-DD') => {
    if (type === 'number') {
      return time ? [time[0].valueOf(), time[1].valueOf()] : undefined
    }
    if (typeof str === 'string') {
      return time ? [time[0].format(str), time[1].format(str)] : undefined
    } else {
      return time ? [time[0].format(str[0]), time[1].format([str[1]])] : undefined
    }
  }
  /** 限制只能输入数字和字母 尾数必须为数字 */
  static getValueFromNumEndWithNumber = (e: any) => {
    let value = e.target.value
    let reg = /^[0-9A-Za-z]+(\d+)$/g
    return reg.test(value)
  }
  static getValueFromNumEndWithNumberVal = (e: any) => {
    let value = e.target.value
    let reg = /^[0-9A-Za-z]+(\d+)$/g
    return !reg.test(value) ? '' : value
  }
}

export const formItemCol = { sm: 9, lg: 9, xl: 8, xxl: 6 }
