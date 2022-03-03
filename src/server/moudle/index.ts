/**
 * @author minjie
 * @createTime 2019/03/20
 * @description 获取所有的 api 配置模块
 * @copyright Copyright ©2020Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
const files = (require as any).context('.', true, /\.ts$/)
let modules:any = {}

files.keys().forEach((key:string) => {
  if (key === './index.ts') return
  Object.assign(modules, files(key).default)
})

export default modules
