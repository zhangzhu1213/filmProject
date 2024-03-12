import Joi from 'joi'
import Router from 'koa-router'
import * as crypto from 'crypto'

import validate from '../libs/validate'
import { JsonResp } from '../libs/stats'
import * as userService from '../services/user'

const router = new Router({
  prefix: '/api/user',
})

router.post('/register', async (ctx) => {
  const { account, password } = validate(
    ctx.request.body,
    Joi.object({
      account: Joi.string().required(),
      password: Joi.string()
        .regex(/^[a-zA-Z][a-zA-Z0-9_]{5,11}$/)
        .required(),
    })
  )
  const _id = await userService.create(account, password)
  ctx.body = new JsonResp({
    message: '账号注册成功',
    userId: _id,
  })
})

router.post('/login', async (ctx) => {
  const { account, password } = validate(
    ctx.request.body,
    Joi.object({
      account: Joi.string().required(),
      password: Joi.string()
        .regex(/^[a-zA-Z][a-zA-Z0-9_]{5,11}$/)
        .required(),
    })
  )
  const cookie = ctx.cookies.get('session_id', {
    signed: true,
  })
  let ip = ctx.request.ip
  const { session_id, userId } = await userService.login(
    account,
    password,
    cookie,
    ip
  )
  ctx.cookies.set('session_id', session_id, {
    signed: true,
    expires: new Date(Date.now() + 14 * 24 * 3600 * 1000),
  })
  ctx.body = new JsonResp({
    message: '登录成功',
    userId,
  })
})

router.get('/info', async (ctx) => {
  const user = await userService.getUserInfo(ctx.state.user.userId)
  ctx.body = new JsonResp(user)
})

router.post('/update', async (ctx) => {
  const userId = ctx.state.user.userId
  const value = validate(
    ctx.request.body,
    Joi.object({
      oldPassword: Joi.string().regex(/^[a-zA-Z][a-zA-Z0-9_]{5,11}$/),
      newPassword: Joi.string().regex(/^[a-zA-Z][a-zA-Z0-9_]{5,11}$/),
      nickname: Joi.string(),
      basePosition: Joi.string(),
      isUpdatePassword: Joi.boolean().required(),
    })
  )
  const session_id = ctx.cookies.get('session_id', {
    signed: true,
  })
  const userInfo = await userService.update(value, userId, session_id)
  if (value.isUpdatePassword) {
    // 清除浏览器对应kookie
    ctx.cookies.set('session_id', '', {
      signed: true,
      expires: new Date(Date.now() + 1),
    })
    ctx.body = new JsonResp('密码修该成功')
  } else {
    ctx.body = new JsonResp({
      message: '信息修改成功',
      userInfo
    })
  }
})

router.get('/logout', async (ctx) => {
  const sid = ctx.cookies.get('session_id', {
    signed: true,
  })
  await userService.logout(sid)
  // 清除浏览器对应kookie
  ctx.cookies.set('session_id', '', {
    signed: true,
    expires: new Date(Date.now() + 1),
  })
  ctx.body = new JsonResp('退出成功')
})

export default router.routes()
