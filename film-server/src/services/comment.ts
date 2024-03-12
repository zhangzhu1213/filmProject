import { ObjectId } from 'mongodb'
import * as crypto from 'crypto'

import * as db from '../db'
import { stats } from '../libs/stats'
import { IMovie, MovieListType, ISearch, IComment } from '../models/types'
import user from '../controllers/user'

// 创建评论
export async function create(movieId: string, userId: string, content: string, title: string) {
  const comment: IComment = {
    movieId: new ObjectId(movieId),
    userId: new ObjectId(userId),
    usefulCount: 0,
    cTime: Date.now(),
    mTime: Date.now(),
    content,
    title,
    score: 0
  }
  const result = await db.scores.findOne({
    movieId: new ObjectId(movieId),
    userId: new ObjectId(userId)
  })
  if (result) {
    comment.score = result.score
  }
  const data = await db.comments.insertOne(comment)
  return data.insertedId
}

// 删除评论
export async function deleteComment(commentId: string) {
  await db.comments.findOneAndDelete({
    _id: new ObjectId(commentId)
  })
}

// 修改评论内容
export async function updateContent(
  movieId: string,
  userId: string,
  content?: string,
  title?: string
) {
  const set: any = {}
  if (content) set.content = content
  if (title) set.title = title
  await db.comments.findOneAndUpdate(
    {
      movieId: new ObjectId(movieId),
      userId: new ObjectId(userId),
    },
    {
      $set: {
        ...set,
        mTime: Date.now(),
      },
    }
  )
}

// 评论点赞
export async function commentSatr(commentId: string, userId: string) {
  let count = 0
  const result = await db.comments.findOne({_id: new ObjectId(commentId)})
  if (result !== null) {
    count = result.usefulCount +1
  }
  await db.comments.findOneAndUpdate(
    {
      _id: new ObjectId(commentId)
    },
    {
      $set: {
        usefulCount: count
      },
    }
  )
  await db.likes.insertOne({
    userId: new ObjectId(userId),
    commentId: new ObjectId(commentId),
    createdAt: Date.now()
  })
}
// 取消评论点赞
export async function commentCancelSatr(commentId: string, userId: string) {
  await db.comments.findOneAndUpdate(
    {
      _id: new ObjectId(commentId)
    },
    {
      $set: {
        usefulCount: -1,
      },
    }
  )
  await db.likes.findOneAndDelete({
    userId: new ObjectId(userId),
    commentId: new ObjectId(commentId),
  })
}

// 获取用户评论列表
export async function userCommentList(
  userId: string,
  skip: number = 0,
  limit: number = 10
) {
  const commentList = await db.comments
    .aggregate([
      {
        $match: {
          userId: new ObjectId(userId),
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
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ])
    .toArray()
  const commentCount = await db.comments.countDocuments({
    userId: new ObjectId(userId),
  })
  return {
    commentCount, commentList
  }
}

// 获取评论列表
export async function movieCommentList(
  movieId: string,
  userId: string,
  skip: number = 0,
  limit: number = 10
) {
  console.log('comment');
  console.log(3);
  
  const commentList = await db.comments
    .aggregate([
      {
        $match: {
          movieId: new ObjectId(movieId)
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          usefulCount: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ])
    .toArray()
  const commentCount = await db.comments.countDocuments({
    movieId: new ObjectId(movieId)
  })
  for (let item of commentList) {
    item.isLike = await commentIsLike(item._id, userId)
  }
  console.log(4);
  
  return {
    commentList,
    commentCount
  }
}

// commentIsLike
async function commentIsLike(commentId: string, userId?: string) {
  if (userId === '') {
    console.log('步骤1false', );
    return false
  }
  const result = await db.likes.findOne({
    userId: new ObjectId(userId),
    commentId: new ObjectId(commentId)
  })
  if (result) {
    console.log('步骤2true', );

    return true
  } else {
    console.log('步骤3false', );

    return false
  }
}

// 获取当前用户当前电影详情页面评论列表
export async function movieUserCommentList(
  movieId: string,
  userId: string,
) {
  console.log('comment');
  
  const commentList = await db.comments
    .aggregate([
      {
        $match: {
          movieId: new ObjectId(movieId),
          userId: new ObjectId(userId)
        },
      },
      {
        $sort: {
          mTime: -1
        },
      }
    ])
    .toArray()
  
  return {
    commentList: commentList,
  }
}
