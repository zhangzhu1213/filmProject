import { ObjectId } from 'mongodb'
import * as crypto from 'crypto'

import * as db from '../db'
import { stats } from '../libs/stats'
import { IMovie, MovieListType, ISearch, IWant } from '../models/types'

// 创建想看记录
export async function create(movieId: string, userId: string, tag?: string, comment?: string) {
  const want: IWant = {
    movieId: new ObjectId(movieId),
    userId: new ObjectId(userId),
    cTime: Date.now(),
    mTime: Date.now()
  }
  if (tag !== undefined) want.tag = tag
  if (comment !== undefined) want.comment = comment
  const result = await db.wants.insertOne(want)
  return result.insertedId
}

// 删除想看记录
export async function deleteWant(wantId: string) {
  await db.wants.findOneAndDelete({
    _id: new ObjectId(wantId)
  })
}

interface IContent {
  tag?: string
  comment?: string
}
// 修改
export async function update(wantsId: string, content: IContent) {
  let updateData: IContent = {}
  if (content.tag !== undefined) updateData.tag = content.tag
  if (content.comment !== undefined) updateData.comment = content.comment
  await db.wants.findOneAndUpdate({
    _id: new ObjectId(wantsId)
  }, {
    $set: {
      ...updateData,
      mTime: Date.now()
    }
  })
}

// 用户获取想看记录
export async function wantList(userId) {
  const wantList = await db.wants.aggregate([
    {
      $match: {
        userId: new ObjectId(userId)
      }
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
        mTime: -1
      }
    }
  ]).toArray()
  return wantList
}