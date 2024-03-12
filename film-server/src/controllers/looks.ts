import Joi from 'joi'
import Router from 'koa-router'
import * as crypto from 'crypto'

import validate from '../libs/validate'
import { JsonResp } from '../libs/stats'
import * as movieServices from '../services/movies'
import * as lookServices from '../services/look'
import { wants } from '../db'

const router = new Router({
  prefix: '/api/look',
})

router.post('/create',  async ctx => {
  const  {type, movieId, score, tag, comment} = validate(
    ctx.request.body,
    Joi.object({
      type: Joi.string().required(),
      movieId: Joi.string().required(),
      score: Joi.number(),
      tag:  Joi.string(),
      comment: Joi.string()
    })
  )
  const userId = ctx.state.user.userId
  const data = await lookServices.create(type, movieId, userId,  score, tag, comment)
  ctx.body = new JsonResp(data)
})

router.post('/delete',  async ctx => {
  const  {wantId} = validate(
    ctx.request.body,
    Joi.object({
      wantId: Joi.string().required()
    })
  )
  const data = await lookServices.deleteWant(wantId)
  ctx.body = new JsonResp(data)
})

router.post('/update',  async ctx => {
  const  {tag, comment, wantId} = validate(
    ctx.request.body,
    Joi.object({
      wantId: Joi.string().required(),
      tag:  Joi.string(),
      comment: Joi.string()
    })
  )
  await lookServices.update(wantId, {
    tag, comment
  })
  ctx.body = new JsonResp('更新成功')
})

router.post('/list',  async ctx => {
  const  {type} = validate(
    ctx.request.body,
    Joi.object({
      type: Joi.string().required()
    })
  )
  const userId = ctx.state.user.userId
  const data = await lookServices.wantList(userId, type)
  ctx.body = new JsonResp(data)
})


router.post('/detail',  async ctx => {
  const  {movieId} = validate(
    ctx.request.body,
    Joi.object({
      movieId: Joi.string().required()
    })
  )
  const userId = ctx.state.user.userId
  const data = await lookServices.wantDetail(userId, movieId)
  ctx.body = new JsonResp(data)
})

export default router.routes()