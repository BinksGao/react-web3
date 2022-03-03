export default class NumberFormatUtils {
  /**
   * 对金额进行格式化
   * @method doubleFormat
   * @param {*} number   要格式化的数字
   * @param {*} decimals 保留几位小数
   * @returns            返回格式化之后的金额
   */
  static doubleFormat (number:any, decimals:any) {
    decimals = decimals >= 0 && decimals <= 20 ? decimals : 2
    number = parseFloat((number + '').replace(/[^\d.-]/g, '')).toFixed(decimals) + ''
    let l = number.split('.')[0].split('').reverse()
    let r = number.split('.')[1]
    r = r == null ? '' : '.' + r
    var t = ''
    if (l[l.length - 1] === '-') { // 负数不需要分隔号,
      for (var i = 0; i < l.length; i++) {
        if (l[i] === '-') {
          t += l[i] + ''
          continue
        }
        // 不是数组的倒数第二个元素才加"," ["0", "4", "5", "-"]
        t += l[i] + ((i + 1) % 4 === 0 && i + 1 !== l.length - 1 ? ',' : '')
        // i + 1 != l.length会变成-,540.00,因为在5时元素位置2+1为3非数组长度
        // t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
      }
    } else {
      for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 4 === 0 && i + 1 !== l.length ? ',' : '')
      }
    }
    return (t.split('').reverse().join('') + r)
  }

  // 自己实现toFixed
  static toFixed = (num: number, n: number) => {
    if (num < 0) {
      num = -num
      return -(parseInt(String((num * (Math.pow(10, n))) + 0.5), 10) / Math.pow(10, n))
    }
    return parseInt(String((num * (Math.pow(10, n))) + 0.5), 10) / Math.pow(10, n)
  }
  // 两个浮点数求和
  static add = (num1: number, num2: number) => {
    let r1, r2, m
    try {
      r1 = `${num1}`.split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = `${num2}`.split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    return Math.round(num1 * m + num2 * m) / m
  }
  // 两个浮点数相减
  static sub = (num1: number, num2: number) => {
    let r1, r2, m, n
    try {
      r1 = `${num1}`.split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = `${num2}`.split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    n = (r1 >= r2) ? r1 : r2
    return NumberFormatUtils.toFixed((Math.round(num1 * m - num2 * m) / m), n)
  }
  // 两个浮点数相乘
  static mul = (num1: number, num2: number) => {
    let m = 0
    let s1 = `${num1}`
    let s2 = `${num2}`
    try {
      m += s1.split('.')[1].length
    } catch (e) {}
    try {
      m += s2.split('.')[1].length
    } catch (e) {}
    return Number(s1.replace('.', '')) *
    Number(s2.replace('.', '')) /
    Math.pow(10, m)
  }
  // 两个浮点数相除
  static div = (num1: number, num2: number) => {
    let t1, t2, r1, r2
    try {
      t1 = `${num1}`.split('.')[1].length
    } catch (e) {
      t1 = 0
    }
    try {
      t2 = `${num2}`.toString().split('.')[1].length
    } catch (e) {
      t2 = 0
    }
    r1 = Number(`${num1}`.replace('.', ''))
    r2 = Number(`${num2}`.toString().replace('.', ''))
    return (r1 / r2) * Math.pow(10, t2 - t1)
  }
}
