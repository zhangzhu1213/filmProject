import { ObjectId } from 'mongodb'
import * as crypto from 'crypto'

import * as db from '../db'
import { IUser, IUserInfo } from '../models/types'
import { stats } from '../libs/stats'
import shal from '../libs/shal'
import run from '../libs/demo'
// 创建账户
export async function create(
  account: string,
  password: string
): Promise<ObjectId> {
  const user = await db.users.findOne({
    account,
  })
  if (user) throw stats.ErrAccountExist
  const salt = crypto.randomUUID()
  password = shal(salt, password)
  const userInfo: IUser = {
    account,
    nickname: account,
    password,
    salt,
    basePosition: '',
    createdAt: Date.now(),
  }
  const result = await db.users.insertOne(userInfo)
  return result.insertedId
}

// 登录
export async function login(
  account: string,
  password: string,
  cookie: string = '',
  ip: string
) {
  run()
  // 查询用户信息
  const user = await db.users.findOne(
    {
      account,
    },
    {
      projection: {
        account: 0,
        nickname: 0,
        basePosition: 0,
        createdAt: 0,
      },
    }
  )
  // 判断账号是否存在
  if (!user) throw stats.ErrUserNotExist
  // 通过盐加密来验证用户登录密码是否正确
  const pwd = shal(user.salt, password)
  if (pwd !== user.password) throw stats.ErrUserPassword
  const session = await db.sessions.findOne({
    sid: cookie,
  })
  if (!session) {
    // 不存在cookie， 生成cookie并存入数据库
    const sid = crypto.randomBytes(12).toString('hex')
    const sessionData = {
      sid,
      userId: new ObjectId(user._id),
      ip,
      createdAt: new Date(),
    }
    await db.sessions.insertOne(sessionData)
    // 设置ttl索引自动清除
    await db.sessions.createIndex(
      { createdAt: 1 },
      {
        expireAfterSeconds: 14 * 24 * 60 * 60,
      }
    )
    return { session_id: sid, userId: user._id }
  } else {
    return {
      session_id: session.sid,
      userId: user._id,
    }
  }
}

// 获取用户信息
export async function getUserInfo(userId: string) {
  const user = await db.users.findOne(
    {
      _id: new ObjectId(userId),
    },
    {
      projection: {
        password: 0,
        salt: 0,
      },
    }
  )
  return user
}

// 退出登录
export async function logout(sid: string | undefined) {
  await db.sessions.findOneAndDelete({ sid })
}

interface IUpdateInfo {
  basePosition?: string
  nickname?: string
}

// 更新用户信息
export async function update(
  record: IUserInfo,
  userId: string,
  sid: string | undefined
) {
  console.log('大手印数据', record)

  if (record.isUpdatePassword) {
    // 更新密码
    const set: IUserInfo = {
      isUpdatePassword: true,
    }
    const user = await db.users.findOne(
      {
        _id: new ObjectId(userId),
      },
      {
        projection: {
          salt: 1,
          password: 1,
        },
      }
    )
    // 用户不存在
    if (!user) throw stats.ErrUserNotExist
    const pwd = shal(user.salt, record.oldPassword)
    if (pwd !== user.password) throw stats.ErrUserOldPassword
    // 新密码生成新的密文和盐
    const salt = crypto.randomUUID()
    const newPwd = shal(salt, record.newPassword)
    // 更新数据库中用户密码
    await db.users.findOneAndUpdate(
      {
        _id: new ObjectId(userId),
      },
      {
        $set: {
          password: newPwd,
          salt: salt,
        },
      }
    )
    // 清除对应session
    const session = await db.sessions.findOneAndDelete({
      sid: sid,
      userId: new ObjectId(userId),
    })
    if (!session) throw stats.ErrSessionNotFound
    // if (!session.value) throw stats.ErrSessionNotFound
  } else {
    // 更新其他信息
    const set: IUpdateInfo = {}
    if (record.basePosition !== undefined)
      set.basePosition = record.basePosition
    if (record.nickname !== undefined) set.nickname = record.nickname
    console.log(set, 'set', userId)

    const result = await db.users.findOneAndUpdate(
      {
        _id: new ObjectId(userId),
      },
      {
        $set: set,
      }
    )
  }
  const userInfo = await db.users.findOne(
    { _id: new ObjectId(userId) },
    {
      projection: {
        password: 0,
        salt: 0,
      },
    }
  )
  return userInfo
}
