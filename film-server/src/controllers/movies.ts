import Joi from 'joi'
import Router from 'koa-router'
import * as crypto from 'crypto'

import validate from '../libs/validate'
import { JsonResp } from '../libs/stats'
import * as movieServices from '../services/movies'

const router = new Router({
  prefix: '/api/movie',
})

router.get('/list', async (ctx) => {
  console.log('111');
  
  const {movieType, type, country, keyword, tag, year, limit, skip } = validate(
    ctx.query,
    Joi.object({
      movieType: Joi.string().required(),
      type: Joi.string(),
      year: Joi.string(),
      country: Joi.string(),
      tag: Joi.string(),
      keyword: Joi.string(),
      limit: Joi.number().required(),
      skip: Joi.number().required()
    })
  )
  const data = await movieServices.movieList(movieType, {
    type, country, year, tag, keyword
  }, limit, skip)
  ctx.body = new JsonResp(data)
})

router.get('/detail', async ctx => {
  const { movieId } = validate(
    ctx.query,
    Joi.object({
      movieId: Joi.string().required()
    })
  )

  const data = await movieServices.movieDetail(movieId, ctx.state.user?.userId)
  ctx.body = new JsonResp(data)
})

export default router.routes()
