import Joi from 'joi'
import Router from 'koa-router'
import * as crypto from 'crypto'

import validate from '../libs/validate'
import { JsonResp } from '../libs/stats'
import * as scoreServices from '../services/score'

const router = new Router({
  prefix: '/api/score',
})

router.post('/create', async ctx => {
  const {score, movieId} = validate(
    ctx.request.body,
    Joi.object({
      score: Joi.number().required(),
      movieId: Joi.string().required()
    })
  )
  const userId = ctx.state.user.userId
  await scoreServices.create(score, movieId, userId)
  ctx.body = new JsonResp(score as number)
})

router.post('/detail', async ctx => {
  const { movieId } = validate(
    ctx.request.body,
    Joi.object({
      movieId: Joi.string().required()
    })
  )
  const userId = ctx.state.user.userId
  
  const result = await scoreServices.detail(movieId, userId)
  ctx.body = new JsonResp(result)
})

export default router.routes()