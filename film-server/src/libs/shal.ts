import * as crypto from 'crypto'

// 盐加密
export default function shal(salt: string, pwd: string | undefined) {
  const md5 = crypto.createHash('md5')
  const shalPwd = md5.update(pwd + salt).digest('hex')
  return shalPwd
}