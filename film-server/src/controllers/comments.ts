import Joi from 'joi'
import Router from 'koa-router'
import * as crypto from 'crypto'

import validate from '../libs/validate'
import { JsonResp } from '../libs/stats'
import * as commentServices from '../services/comment'

const router = new Router({
  prefix: '/api/comment',
})

router.post('/create', async ctx => {
  const { movieId, content, title } = validate(
    ctx.request.body,
    Joi.object({
      movieId: Joi.string().required(),
      content: Joi.string().required(),
      title: Joi.string().required()
    })
  )
  const userId = ctx.state.user.userId
  const data = await commentServices.create(movieId, userId, content, title)
  ctx.body = new JsonResp(data)
})

router.post('/delete', async ctx => {
  const { commentId } = validate(
    ctx.request.body,
    Joi.object({
      commentId: Joi.string().required()
    })
  )
  await commentServices.deleteComment(commentId)
  ctx.body = new JsonResp('删除成功')
})

router.post('/update', async ctx => {
  const { movieId, content, title } = validate(
    ctx.request.body,
    Joi.object({
      movieId: Joi.string().required(),
      content: Joi.string(),
      title: Joi.string()
    })
  )
  const userId = ctx.state.user.userId
  await commentServices.updateContent(movieId, userId, content, title)
  ctx.body = new JsonResp('修改成功')
})

router.post('/star', async ctx => {
  const { commentId } = validate(
    ctx.request.body,
    Joi.object({
      commentId: Joi.string().required()
    })
  )
  const userId = ctx.state.user.userId
  await commentServices.commentSatr(commentId, userId)
  ctx.body = new JsonResp('点赞成功')
})

router.post('/cancelSate', async ctx => {
  const { commentId } = validate(
    ctx.request.body,
    Joi.object({
      commentId: Joi.string().required()
    })
  )
  const userId = ctx.state.user.userId
  await commentServices.commentCancelSatr(commentId, userId)
  ctx.body = new JsonResp('取消点赞成功')
})

router.get('/userComment/list', async ctx => {
  const { skip, limit } = validate(
    ctx.query,
    Joi.object({
      skip: Joi.number(),
      limit: Joi.number()
    })
  )
  const userId = ctx.state.user.userId
  console.log(888, userId);
  
  const data = await commentServices.userCommentList(userId, skip,  limit)
  ctx.body = new JsonResp(data)
})

router.get('/movieComment/list', async ctx => {
  const {  movieId, skip, limit, userId } = validate(
    ctx.query,
    Joi.object({
      movieId: Joi.string().required(),
      skip: Joi.number(),
      limit: Joi.number(),
      userId: Joi.string()
    })
  )
  // console.log(1);
  console.log('00');
  
  let sessionUserId = ctx.state.user.userId
  console.log(2, userId);
  
  const data =await commentServices.movieCommentList(movieId, sessionUserId, skip, limit)
  ctx.body = new JsonResp(data)
})

router.get('/movieUserComment/list', async ctx => {
  const {  movieId, skip, limit } = validate(
    ctx.query,
    Joi.object({
      movieId: Joi.string().required(),
      skip: Joi.number(),
      limit: Joi.number()
    })
  )
  const userId = ctx.state.user.userId
  const data =await commentServices.movieUserCommentList(movieId, userId)
  ctx.body = new JsonResp(data)
})

export default router.routes()