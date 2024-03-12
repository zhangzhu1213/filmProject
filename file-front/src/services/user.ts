import request from '../lib/request'
import { ApiResp, IUserInfo, IUser } from '../lib/types'

// 用户注册
export async function register(account: string, password: string) {
  const { data } = await request.post<
    ApiResp<{ message: string; userId: string }>
  >('/user/register', {
    account,
    password,
  })

  return data
}

// 用户登录
export async function login(account: string, password: string) {
  const { data } = await request.post<
    ApiResp<{ message: string; userId: string }>
  >('/user/login', {
    account,
    password,
  })
  return data
}

// 获取用户信息
export async function userInfo() {
  const { data } = await request.get<ApiResp<IUser>>('/user/info', {})
  return data
}

// 更新用户信息
export async function update(user: IUserInfo) {
  const { data } = await request.post<ApiResp<{message: string, userInfo: IUser}>>('/user/update', user)
  return data
}

// 退出登录
export async function logout() {
  const { data } = await request.get<ApiResp<string>>('/user/logout', {})
  return data
}
