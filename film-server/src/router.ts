import Router from 'koa-router'
import users from './controllers/user'
import movies from './controllers/movies'
import comments from './controllers/comments'
import scores from './controllers/scores'
import looks from './controllers/looks'
// 创建路由实例
const router = new Router()

// 汇总子路由，从这跳转到-->controllers文件夹
router.use(users)
router.use(movies)
router.use(comments)
router.use(scores)
router.use(looks)

// 默认暴露
export default router.routes()