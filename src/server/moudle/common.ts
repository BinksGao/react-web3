export default {
  // 获取图片验证码最新
  getPictureCode: { // 获取图片验证码Base64
    type: 'get',
    path: 'stallone/imageVerify/getImageCodeBase64/why'
  },
  sendPhoneCode2: { // 发送 登录/注册 验证码（app）
    path: 'stallone/sms/sendCode/app/v2/{projectName}'
  }
}
