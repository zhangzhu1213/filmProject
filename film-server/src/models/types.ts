import { ObjectId } from "mongodb";

export interface ISession {
  // session_id
  sid: string
  // 用户id
  userId: ObjectId,
  // ip
  ip: string,
  // session_id创建时间
  // createdAt: Date
}

export interface IUser {
  // 账号
  account: string
  // 昵称
  nickname: string
  // 密码
  password: string
  // yan
  salt: string
  // 常居地
  basePosition: string
  // 账号创建时间
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
  avater?: string
}

export interface IMovie {
  name: string
  posterUrl: string
  publicYear: string
  publicTime: string
  actor?: IPeople[]
  director?: IPeople[],
  writer?: IPeople[]
  type: string
  country: string,
  language: string
  lengthFilm: number
  filmScore: number
  plot: string,
  isPlaying: boolean
  tag: string
  commentCount: number
}

export interface IComment {
  userId: ObjectId,
  movieId: ObjectId
  score: number
  content: string
  title: string
  usefulCount: number
  cTime: number,
  mTime: number
}

export interface IMovieScore {
  userId: ObjectId,
  movieId: ObjectId,
  score: number,
  createdAt: number
}

export interface IWant {
  userId: ObjectId,
  movieId: ObjectId,
  tag?: string
  comment?:  string 
  cTime: number,
  mTime: number
}

export type TLook = 'want' | 'looked'
export interface IHaveLook {
  userId: ObjectId,
  movieId: ObjectId,
  tag?: string,
  comment?:  string
  cTime: number,
  mTime: number,
  type: TLook
}

type ITag = 'hot' | 'highScore' | 'latest' | 'all'

export interface ISearch {
  keyword?: string
  type?: string
  country?: string
  year?: string
  tag?: ITag
}

export type MovieListType = 'hot' | 'playing' | 'search'

export interface ILike {
  commentId: ObjectId
  userId: ObjectId
  createdAt:  number
}