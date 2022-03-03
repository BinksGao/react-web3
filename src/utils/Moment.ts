import moment from 'moment'

export default class Moment {
  /* date 格式转为 moment 格式，失败回退原始值 */
  static dateToMoment (date: any) {
    try {
      if (date) return moment(date)
      return date
    } catch (e) {
      return date
    }
  }

  /* moment 格式转为 date 格式，默认为 YYYY-MM-DD，失败回退原始值 */
  static momentToDate (moments: moment.Moment, format = 'YYYY-MM-DD') {
    try {
      if (moments) return moment(moments).format(format)
      return moments
    } catch (e) {
      return moments
    }
  }

  /* 获取时间差值 */
  static getTimeDiff (startTime: number, endTime: number) {
    const interval = endTime / 1000 - startTime / 1000
    let d: any = parseInt((interval / 3600 / 24) + '')
    let h: any = parseInt(((interval - d * 24 * 3600) / 3600) + '')
    let m: any = parseInt(((interval - d * 24 * 3600 - h * 3600) / 60) + '')
    let s: any = parseInt((interval - d * 24 * 3600 - h * 3600 - m * 60) + '')
    d = d < 10 ? ('0' + d) : d
    h = h < 10 ? ('0' + h) : h
    m = m < 10 ? ('0' + m) : m
    s = s < 10 ? ('0' + s) : s
    return [ d, h, m, s ]
  }
}
