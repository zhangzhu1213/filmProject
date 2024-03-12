import { Middleware } from 'koa'
import * as db from '../db'
import { stats } from '../libs/stats'

// 路由白名单
const whiteList = [
  '/api/user/login',
  '/api/user/register',
  '/api/user/logout',
  '/api/movie/list',
  '/api/movie/detail',
  // '/api/comment/movieComment/list',
]

/**
 * 检测用户是否登录，或被禁用
 * @param ctx
 * @param next
 */
const checkLogin: Middleware = async (ctx, next) => {
  const isWhiteList = whiteList.indexOf(ctx.request.url.split('?')[0])
  if (ctx.request.url.split('?')[0] === '/api/comment/movieComment/list') {
    const sid = ctx.cookies.get('session_id')
    if (!sid) {
      console.log('11');
      
      ctx.state.user = {userId: ''}
      console.log('22');
      
    } else {
      const userSession = await db.sessions.findOne({ sid })
      if (userSession) {
        ctx.state.user = userSession
      } else {
        ctx.state.user = {userId: ''}
      }
    }

  } else if (isWhiteList === -1) {
    // 如果不在白名单
    const sid = ctx.cookies.get('session_id')
    // 检查用户是否登录
    if (!sid) throw stats.ErrUserNotLogin
    const userSession = await db.sessions.findOne({ sid })
    // 检查会话中是否有对应数据
    if (!userSession) throw stats.ErrSessionNotFound
    // 将用户会话信息存到ctx.state.user中
    ctx.state.user = userSession
  }
  await next()
}

export default checkLogin
