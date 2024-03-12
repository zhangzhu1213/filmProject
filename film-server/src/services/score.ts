import { ObjectId } from 'mongodb'
import * as crypto from 'crypto'

import * as db from '../db'
import { stats } from '../libs/stats'
import { IMovie, MovieListType, ISearch, IMovieScore } from '../models/types'
import * as lookServices from './look'
import { login } from './user'

// 创建打分
export async function create(score: number, movieId: string, userId: string) {
  const scoreData: IMovieScore = {
    movieId: new ObjectId(movieId),
    userId: new ObjectId(userId),
    score,
    createdAt: Date.now(),
  }
  await db.scores.insertOne(scoreData)
  // 修改电影评分数据
  const movieData = await db.movies.findOne({
    _id: new ObjectId(movieId),
  })
  if (movieData !== null) {
    let newScore = movieData.filmScore * movieData.commentCount
    newScore = ( newScore + score) / (movieData.commentCount +1)
    console.log(newScore, 'newScore', movieData);
    newScore = parseFloat(newScore.toFixed(1))
    console.log(newScore, 'newScore');
    await db.movies.findOneAndUpdate(
      {
        _id: new ObjectId(movieId),
      },
      {
        $set: {
          commentCount: movieData.commentCount +1,
          filmScore: newScore,
        },
      }
    )
  }
  await db.comments.updateMany(
    {
      userId: new ObjectId(userId),
      movieId: new ObjectId(movieId)
    }, {
      $set: {
        score
      }
    }
  )

  await lookServices.create('looked', movieId, userId)
}

export async function detail(movieId: string, userId: string) {
    const data = await db.scores.findOne({
      movieId: new ObjectId(movieId),
      userId: new ObjectId(userId),
    })
    return data
}
