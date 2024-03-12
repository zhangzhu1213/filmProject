import { Middleware } from "koa";
import { ErrorStat } from "../libs/stats";

/**
 * 检查执行过程中的异常
 * @param ctx
 * @param next
 */
const checkError: Middleware = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (err instanceof ErrorStat) {
      ctx.status = err.status
      ctx.body = err
    } else {
      throw err
    }
  }
}

export default checkError