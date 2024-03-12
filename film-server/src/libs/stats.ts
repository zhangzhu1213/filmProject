/**
 * 统一JSON返回封装类
 */
export class JsonResp {
  // 成功的code以及数据，如果成功code为0
  code: number
  data?: any

  constructor(data?: any, code = 0) {
    this.data = data
    this.code = code
  }
}

/**
 * 错误状态
 */
export class ErrorStat extends JsonResp {
  // 错误需要额外返回状态码和错误信息
  message: string
  status: number

  constructor(code: number, message: string, status = 200) {
    super(undefined, code)
    this.message = message
    this.status = status
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
    }
  }
}

/**
 * 业务状态错误码
 * 2开头user相关， 3开头帖子post相关，4开头会话相关，5开头通知notice相关，6开头关注follow相关，7开头私信message相关
 */
export const stats = {
  ErrAccountExist: new ErrorStat(20001, '账户已存在'),
  ErrUserExist: new ErrorStat(20002, '用户已存在'),
  ErrUserPassword: new ErrorStat(20003, '用户密码错误'),
  ErrUserOldPassword: new ErrorStat(20004, '旧密码错误'),
  // ErrUserPassword: new ErrorStat(20005, '用户密码错误'),
  ErrUserNotLogin: new ErrorStat(20006, '用户未登录'),
  ErrUserNotExist: new ErrorStat(20007, '用户不存在', 404),
  ErrImpowerFail: new ErrorStat(20008, '获取用户授权信息失败'),
  ErrPostCreateFail: new ErrorStat(30001, '帖子创建失败'),
  ErrPostDeleteFail: new ErrorStat(30002, '帖子删除失败'),
  ErrPostNotFound: new ErrorStat(30003, '帖子未找到', 404),
  ErrPostLikeFail: new ErrorStat(30004, '帖子点赞信息添加失败'),
  ErrPostLikeDeleteFail: new ErrorStat(30005, '帖子点赞信息删除失败'),
  ErrSessionNotFound: new ErrorStat(40001, '会话不存在'),
  ErrNoticeCreateFail: new ErrorStat(50001, '通知信息添加失败'),
  ErrNoticeDeleteFail: new ErrorStat(50002, '通知删除失败'),
  ErrNoticeNotFound: new ErrorStat(50003, '通知不存在', 404),
  ErrFollowCreateFail: new ErrorStat(60001, '关注信息添加失败'),
  ErrFollowNotFound: new ErrorStat(60002, '该关注信息未找到', 404),
  ErrMessageCreateFail: new ErrorStat(70001, '私信信息添加失败'),
  ErrMessageKeyCreateFail: new ErrorStat(70002, '私信唯一标识表创建失败'),
  ErrMessageNotFound: new ErrorStat(70003, '私信信息未找到', 404),
  ErrMessageDeleteFail: new ErrorStat(70004, '删除私信失败'),
  ErrMessageKeyNotFound: new ErrorStat(70005, '私信唯一标识未找到'),
  ErrMessageKeyDeleteFail: new ErrorStat(70006, '私信唯一标识删除失败'),
}
