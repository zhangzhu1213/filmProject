export interface IAccount {
  account: string,
  password: string,
  remember: boolean
}

export interface ApiResp<T = any> {
  code: number
  message: string
  data: T
}

export interface IUser {
  _id: string
  account: string
  nickname: string
  basePosition: string,
  createdAt: number
}

export interface IUserInfo {
  // 昵称
  nickname?: string
  // 旧密码
  oldPassword?: string
  // 新密码
  newPassword?: string
  // 常居地
  basePosition?: string
  // 是否更新密码操作
  isUpdatePassword: boolean
}

interface IPeople {
  name: string,
  avatar?: string
}

export interface IMovie {
  _id: string
  name: string
  posterUrl: string
  publicYear?: string
  publicTime?: string
  actor?: IPeople[]
  director?: IPeople[],
  writer?: IPeople[]
  type?: string
  country?: string,
  language?: string
  lengthFilm?: number
  filmScore?: number
  plot?: string,
  isPlaying?: boolean
  tag?: string,
  commentCount?: number
}

export type ITag = 'hot' | 'highScore' | 'latest' | 'all'

export interface ISearch {
  keyword?: string
  type?: string
  country?: string
  year?: string
  tag?: string
}

export interface IComment {
  _id: string
  userId: string,
  movieId: string
  content: string,
  title: string
  usefulCount: number
  cTime: number,
  mTime: number,
  score: number
}

export interface IMovieScore {
  _id: string
  userId: string,
  movieId: string,
  score: number,
  createdAt: number
}

export type TLook = 'want' | 'looked'
export interface IHaveLook {
  _id: string
  userId: string,
  movieId: string,
  tag?: string,
  comment?:  string
  cTime: number,
  mTime: number,
  type: TLook
}

export interface IUserComment extends IComment {
  movie: IMovie
}

export interface ILookList extends IHaveLook {
  movie: IMovie
}

export interface IMovieComment extends IComment {
  user: IUser,
  isLike: boolean
}

export type MovieListType = 'hot' | 'playing' | 'search'