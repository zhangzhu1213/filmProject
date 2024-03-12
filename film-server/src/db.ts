import { MongoClient, Collection } from 'mongodb'
import { ISession, IUser, IMovie, IComment, ILike, IHaveLook, IWant, IMovieScore } from './models/types'

export let users: Collection<IUser>
export let sessions: Collection<ISession>
export let movies: Collection<IMovie>
export let comments: Collection<IComment>
export let looks: Collection<IHaveLook>
export let wants: Collection<IWant>
export let likes: Collection<ILike>
export let scores: Collection<IMovieScore>

export async function init() {
  // 连接数据库
  const client = new MongoClient(`${process.env.MONGO_URL}`)

  await client.connect()
  // 获取db
  const db = client.db()
  // 连接users集合
  users = db.collection('users')
  // 连接session集合
  sessions = db.collection('session')
  movies = db.collection('movies')
  comments = db.collection('comments')
  looks = db.collection('looks')
  wants = db.collection('wants')
  scores = db.collection('scores')
  likes = db.collection('likes')
  // 设置ttl索引自动清除
  // sessions.createIndex(
  //   {
  //     createdAt: 1,
  //   },
  //   {
  //     expireAfterSeconds: 14 * 24 * 3600,
  //   }
  // )
}