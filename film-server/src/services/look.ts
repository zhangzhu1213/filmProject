import { ObjectId } from 'mongodb'
import * as crypto from 'crypto'

import * as db from '../db'
import { stats } from '../libs/stats'
import {
  IMovie,
  MovieListType,
  ISearch,
  IHaveLook,
  TLook,
} from '../models/types'

// 创建 想看/看过 记录
export async function create(
  type: TLook,
  movieId: string,
  userId: string,
  score?: number,
  tag?: string,
  comment?: string
) {
  const look: IHaveLook = {
    movieId: new ObjectId(movieId),
    userId: new ObjectId(userId),
    cTime: Date.now(),
    mTime: Date.now(),
    type
  }
  if (tag !== undefined) look.tag = tag
  if (comment !== undefined) look.comment = comment
  const result = await db.looks.insertOne(look)
  return result.insertedId
}

// 删除 想看/看过 记录
export async function deleteWant(wantId: string) {
  await db.looks.findOneAndDelete({
    _id: new ObjectId(wantId),
  })
}

interface IContent {
  tag?: string
  comment?: string
}
// 修改  想看/看过 内容
export async function update(wantsId: string, content: IContent) {
  let updateData: IContent = {}
  if (content.tag !== undefined) updateData.tag = content.tag
  if (content.comment !== undefined) updateData.comment = content.comment
  await db.looks.findOneAndUpdate(
    {
      _id: new ObjectId(wantsId),
    },
    {
      $set: {
        ...updateData,
        mTime: Date.now(),
      },
    }
  )
}

// 用户获取 想看/看过 记录
export async function wantList(userId: string, type: TLook) {
  const wantList = await db.looks
    .aggregate([
      {
        $match: {
          userId: new ObjectId(userId),
          type
        },
      },
      {
        $lookup: {
          from: 'movies',
          localField: 'movieId',
          foreignField: '_id',
          as: 'movie',
        },
      },
      {
        $unwind: {
          path: '$movie',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          mTime: -1,
        },
      },
    ])
    .toArray()
  return {
    wantList,
    wantCount: wantList.length
  }
}

// 用户获取 想看/看过 记录
export async function wantDetail(userId: string, movieId: string) {
  const want = await db.looks.findOne({
    movieId:  new ObjectId(movieId),
    userId: new ObjectId(userId)
  })
  
  return want
}