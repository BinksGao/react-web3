 interface ConfigInterface {
  /** 请求的地址 */
  axiosBasePath: string
  /** 导出请求的地址 */
  exportBasePath: string
  /** 请求头 */
  axiosHeaders: any
  /** web地址 */
  webUrl: string
  /** 水印 */
  watermark: string
  /** 核心服务地址 */
  coreBasePath: string
  OSSURL: string
  ossUrlPre: string
  /** 私有的oss */
  OSSPrivateBucket: string
  /** 共有的oss */
  OSSPublicBucket: string
  defaultPath: string
  serverPath: string
}

class ConfigUtils {
  constructor () {
    let obj:ConfigInterface = this.init()
    this.axiosBasePath = obj.axiosBasePath
    this.axiosHeaders = obj.axiosHeaders
    this.watermark = obj.watermark
    this.webUrl = obj.webUrl
    this.coreBasePath = obj.coreBasePath
    this.OSSURL = obj.OSSURL
    this.ossUrlPre = obj.ossUrlPre
    this.OSSPrivateBucket = obj.OSSPrivateBucket
    this.OSSPublicBucket = obj.OSSPublicBucket
    this.exportBasePath = obj.exportBasePath
    this.defaultPath = obj.defaultPath
    this.serverPath = obj.serverPath
  }

  /** axios basepath */
  axiosBasePath: string
  /** 导出请求的地址 */
  exportBasePath: string
  /** 请求头 */
  axiosHeaders: any = {}
  /** web地址 */
  webUrl: string
  /** 普通请求的超时时间 */
  axiosTimeout:number = 30000
  /** 路由请求超时时间 */
  reactRouterTimeout:number = 30000
  /** 用户服务的（翟顺辉） */
  coreBasePath: string

  OSSURL: string

  ossUrlPre: string

  /** 项目Storage key */
  projectStorageKey = 'WHY'

  /** 水印 */
  watermark:string

  /** OSS 服务 */
  OSSRegion: string = 'oss-cn-hangzhou'
  OSSPrivateBucket: string
  OSSPublicBucket: string

  /** 日志访问host */
  loggerHost:string = 'cn-hangzhou.log.aliyuncs.com'

  /** 日志访问Topic */
  loggerTopic:string = 'why'
  defaultPath: string = ''
  serverPath: string = ''
  defaultPort: string = '8082'
  serverPaths: string[] = ['vettel', 'ricciardo', 'fernando', 'russell', 'kimi', 'magnussen']
  serverPathsPort: string[] = ['8082', '8088', '8089', '8090', '8091', '8092']
  demoServerPaths: string[] = ['demovettel', 'demoricciardo', 'demofernando', 'demorussell']

  /** 初始化组件信息 */
  init ():ConfigInterface {
    // 服务访问域名
    // 非生产：hfwt-api.sj56.com.cn
    // 正式：hfw-api.sj56.com.cn
    switch (process.env.mode) {
      case 'whydemo':
        return {
          axiosBasePath: 'https://whyt-api.sj56.com.cn',
          exportBasePath: 'https://whyt-api.sj56.com.cn/demoalonso',
          axiosHeaders: { },
          defaultPath: 'demoalonso',
          serverPath: '',
          watermark: '演示',
          webUrl: 'https://why.sj56.com.cn/whydemo/index.html',
          coreBasePath: 'https://coret-api.sj56.com.cn',
          OSSPrivateBucket: 'file-oss-why-demo',
          OSSPublicBucket: 'file-oss-why-demo',
          OSSURL: 'https://file-oss-why-demo.oss-cn-hangzhou.aliyuncs.com',
          ossUrlPre: 'IMG/web_'
        }
      case 'test':
        return {
          axiosBasePath: 'https://whyt-api.sj56.com.cn',
          exportBasePath: 'https://whyt-api.sj56.com.cn/senna2',
          axiosHeaders: { 'X-Ca-Stage': 'TEST' },
          defaultPath: 'senna2',
          serverPath: 'tes',
          watermark: '测试',
          webUrl: 'https://why.sj56.com.cn/tes/index.html',
          OSSPrivateBucket: 'file-oss-why-np',
          OSSPublicBucket: 'file-oss-why-np',
          coreBasePath: 'https://coret-api.sj56.com.cn',
          OSSURL: 'https://file-oss-why-np.oss-cn-hangzhou.aliyuncs.com',
          ossUrlPre: 'test/IMG/web_'
        }
      case 'pre':
        return {
          axiosBasePath: 'https://whyt-api.sj56.com.cn/senna2',
          exportBasePath: 'https://whyt-api.sj56.com.cn/senna3',
          axiosHeaders: { 'X-Ca-Stage': 'PRE' },
          watermark: '预发',
          defaultPath: 'senna2',
          serverPath: '',
          OSSPrivateBucket: 'file-oss-why-np',
          OSSPublicBucket: 'file-oss-why-np',
          webUrl: 'https://why.sj56.com.cn/pre/index.html',
          coreBasePath: 'https://coret-api.sj56.com.cn',
          OSSURL: 'https://file-oss-why-np.oss-cn-hangzhou.aliyuncs.com',
          ossUrlPre: 'pre/img/'
        }
      case 'prod':
        return {
          axiosBasePath: 'https://why-api.sj56.com.cn/senna2',
          exportBasePath: 'https://why-api.sj56.com.cn/senna2r/web',
          axiosHeaders: {},
          watermark: '',
          serverPath: '',
          defaultPath: 'web',
          OSSPrivateBucket: 'file-oss-why',
          OSSPublicBucket: 'file-oss-why',
          webUrl: 'https://why.sj56.com.cn/why/index.html',
          coreBasePath: 'https://core-api.sj56.com.cn',
          OSSURL: 'https://file-oss-why.oss-cn-hangzhou.aliyuncs.com',
          ossUrlPre: 'IMG/web_'
        }
      case 'dev':
        return {
          // axiosBasePath: 'https://why-api.sj56.com.cn/senna2',
          // exportBasePath: 'https://why-api.sj56.com.cn/senna2r/web',
          // axiosBasePath: 'http://192.170.1.34',
          // axiosBasePath: 'http://192.170.2.74',
          // exportBasePath: 'http://192.170.1.34:8082',
          axiosBasePath: 'https://whyt-api.sj56.com.cn',
          exportBasePath: 'https://whyt-api.sj56.com.cn/alonsodev',
          axiosHeaders: {},
          // serverPath: 'tes',
          serverPath: '',
          // axiosHeaders: { 'X-Ca-Stage': 'TEST' },
          defaultPath: 'alonsodev',
          // defaultPath: 'senna2',
          // defaultPath: '',
          // defaultPath: '',
          watermark: '开发',
          OSSPrivateBucket: 'file-oss-why-np',
          OSSPublicBucket: 'file-oss-why-np',
          webUrl: '',
          coreBasePath: 'https://coret-api.sj56.com.cn',
          OSSURL: 'https://file-oss-why-np.oss-cn-hangzhou.aliyuncs.com',
          ossUrlPre: 'dev/img/'
        }
      case 'testdev':
        return {
          // axiosBasePath: 'http://127.0.0.1',
          // exportBasePath: 'http://127.0.0.1:8082',
          // exportBasePath: 'http://172.18.32.55:8080',
          // axiosBasePath: 'http://127.0.0.1', // 启双
          // exportBasePath: 'http://127.0.0.1:8080', // 启双
          axiosBasePath: 'https://whyt-api.sj56.com.cn',
          exportBasePath: 'https://whyt-api.sj56.com.cn/alonsodev',
          serverPath: '',
          // exportBasePath: 'https://whyt-api.sj56.com.cn/senna2',
          // axiosBasePath: 'http://172.18.32.89',
          // exportBasePath: 'http://192.170.3.226:8082',
          // exportBasePath: 'http://172.18.32.28:8080', // 启双
          // axiosBasePath: 'http://172.18.12.51:12580', // 阿强
          // axiosBasePath: 'http://172.18.12.92:8080', // 王卓
          // axiosBasePath: 'http://172.18.32.51:8080', // 雪雨
          // axiosBasePath: 'http://172.18.32.51:8080', // 乔俊
          // exportBasePath: 'http://172.18.32.51:8080', // 乔俊
          // axiosBasePath: 'http://172.18.12.72:8080', // 牛程程
          // axiosBasePath: 'http://172.18.32.33:8080', // 韩卉
          // exportBasePath: 'http://172.18.32.33:8080', // 韩卉
          // exportBasePath: 'http://172.18.32.51:8080',
          axiosHeaders: {},
          // axiosHeaders: { 'X-Ca-Stage': 'TEST' },
          defaultPath: 'alonsodev',
          watermark: '测试',
          OSSPrivateBucket: 'file-oss-why-np',
          OSSPublicBucket: 'file-oss-why-np',
          webUrl: '',
          coreBasePath: 'https://coret-api.sj56.com.cn',
          OSSURL: 'https://file-oss-why-np.oss-cn-hangzhou.aliyuncs.com',
          ossUrlPre: 'dev/img'
        }
      default:
        return {
          axiosBasePath: 'http://47.111.37.128:9092',
          exportBasePath: 'https://whyt-api.sj56.com.cn/senna3',
          axiosHeaders: {},
          defaultPath: 'senna2',
          watermark: '开发',
          serverPath: '',
          webUrl: '',
          OSSPrivateBucket: 'file-oss-why-np',
          OSSPublicBucket: 'file-oss-why-np',
          coreBasePath: 'http://coret-api.sj56.com.cn',
          OSSURL: 'https://file-oss-why-np.oss-cn-hangzhou.aliyuncs.com',
          ossUrlPre: 'test/IMG/web_'
        }
    }
  }
}

export default new ConfigUtils()
