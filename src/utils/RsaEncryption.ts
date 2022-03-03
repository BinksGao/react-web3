const key = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC53vJDPWWwU21nliu9uneN1hT354xdMF+84vGson7TSiugzn7XPR4GKOOMdqqFVs18nFPc5UGxZzkfNmaiWvQUhhQu8IOItoQ60ER/5103sqq6e1K7vGYxt+cpb3iL1RKR/BzKuq2moYyjJ6NbsRhHbVTqs3KMS24CAVL6S1gwdwIDAQAB'

export const encryptedString = (pwd:string) => {
  let JSEncrypt = (window as any).JSEncrypt
  let encrypt = new JSEncrypt()
  encrypt.setPublicKey(key)
  return encrypt.encrypt(pwd)
}
