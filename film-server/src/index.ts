import 'dotenv/config'
import Koa from 'koa'
import cors from 'koa2-cors'
import KoaBody from 'koa-body'

import * as db from './db'
import checkError from './middlewares/checkError'
import checkLogin from './middlewares/checkLogin'
import logger from './middlewares/logger'
import router from './router'

// 创建app实例
const app = new Koa({
  // 设置签名cookie密钥
  keys: JSON.parse(`${process.env.KEYS}`),
})

// 允许跨域访问
app.use(cors())
// 第一个中间件，日志中间件
app.use(logger)
// 第二个中间件，捕捉异常中间件
app.use(checkError)
// 注册koa-body
app.use(KoaBody())
// 检测是否登录中间件
app.use(checkLogin)
// 注册路由
app.use(router)

async function run() {
  // 等待数据库连接
  await db.init()
  // 监听端口
  app.listen(process.env.PORT, () => {
    console.log(`正在监听${process.env.PORT}端口`)
  })
}

run()
