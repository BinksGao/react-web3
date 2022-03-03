import { SysUtilAuth, globalEnum } from './index'
import moment from 'moment'
import ConfigUtil from './Config'
import { Axios } from '@components/axios/index'

const OSSClient = require('ali-oss')
// oss使用规则
// 从根目录到文件共分为4级
// 第一级文件：类型 EXCEL\PHOTO\VIDEO\ZIP   大写
// 第二级文件：用途  error_excel\export_excel\feedback  ^^^^ 小写
// 第三级文件：创建时间  2019_01_01   标准的

export default class OssUtil {
  /**
   * 获取oss的key
   */
  static getOssKey () {
    // STS安全令牌-临时授权
    const url = 'vettel/common/getAliBaBaCopyright'
    return new Promise((resolve) => {
      const ossKey = SysUtilAuth.getSessionStorage(globalEnum.ossKey)
      // 判断存在且是否超时
      if (ossKey) {
        if (new Date().getTime() < new Date(ossKey.expiration).getTime()) {
          resolve(ossKey)
        } else {
          Axios.request({ path: url, type: 'get' }, {}).then((res: any) => {
            // accessKeyId, accessKeySecret, expiration, securityToken
            SysUtilAuth.setSessionStorage(globalEnum.ossKey, res.data)
            resolve(res.data)
          }).catch((err: any) => {
            console.log(err)
          })
        }
      } else {
        Axios.request({ path: url, type: 'get' }, {}).then((res: any) => {
          SysUtilAuth.setSessionStorage(globalEnum.ossKey, res.data)
          resolve(res.data)
        }).catch((err: any) => {
          console.log(err)
        })
      }
    })
  }

  /**
   * 获取oss 的请求的值
   * @param {'private'|'public'} type 类型
   */
  static getClient (type: 'private'|'public' = 'private') {
    return new Promise((resolve:any, reject:any) => {
      OssUtil.getOssKey().then(async ({ accessKeyId, accessKeySecret, expiration, securityToken }:any) => {
        resolve(new OSSClient({
          region: ConfigUtil.OSSRegion,
          accessKeyId,
          accessKeySecret,
          bucket: type === 'private' ? ConfigUtil.OSSPrivateBucket : ConfigUtil.OSSPublicBucket,
          stsToken: securityToken,
          secure: true
        }))
      }).catch((err:any) => reject(err))
    })
  }

  /**
   * oss 上传文件
   * @param file   文件对象
   * @param folder 文件保存地址
   * @param {'public'|'private'}   type 默认私有地址
   */
  static uploadFileStream (client: any, file:any, folder:string, type: 'public'|'private' = 'private', progress?: Function) {
    return new Promise(async (resolve, reject) => {
      try {
        let name = `${ConfigUtil.ossUrlPre}${folder}/${moment().format('YYYY-MM-DD')}/${moment().format('ss:mm:HH_DD-MM-YYYY') + '_file_' + file.name}`
        let result = await client.multipartUpload(name, file, {
          progress
        })
        console.log(name)
        resolve(result)
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  }

  /**
   * oss 上传文件夹对应文件
   * @param file   文件对象
   * @param folder 文件保存地址
   * @param {'public'|'private'}   type 默认私有地址
   */
  static uploadFileStreamAll (client: any, file:any, folder:string, hash: string = '', progress?: Function) {
    return new Promise(async (resolve, reject) => {
      try {
        let name = `${ConfigUtil.ossUrlPre}${hash}/${folder}`
        let result = await client.multipartUpload(name, file, {
          progress
        })
        result.folder = folder
        resolve(result)
      } catch (e) {
        console.log(e)
        reject(e)
      }
    })
  }

  /**
   * 获取后缀名
   * @param filename 文件名
   */
  static getSuffix (filename: string) {
    const pos = filename.lastIndexOf('.')
    let suffix = ''
    if (pos !== -1) {
      suffix = filename.substring(pos)
    }
    return suffix
  }
}
