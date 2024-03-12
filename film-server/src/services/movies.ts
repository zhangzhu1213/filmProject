import { ObjectId } from 'mongodb'
import * as crypto from 'crypto'

import * as db from '../db'
import { stats } from '../libs/stats'
import { IMovie, MovieListType, ISearch } from '../models/types'
import * as commentServices from './comment'
// 创建电影信息
export async function create(record: IMovie) {
  // let movie: IMovie = {
  //   name: record.name,
  //   posterUrl: record.posterUrl,
  //   publicTime: record.publicTime,
  //   publicYear: record.publicYear,
  //   type: record.type,
  //   country: record.country,
  //   commentCount: record.commentCount,
  //   language: record.language,
  //   lengthFilm: record.lengthFilm,
  //   isPlaying: record.isPlaying
  // }
  const result = await db.movies.insertOne(record)
}

// 电影列表数据
export async function movieList(
  movieType: MovieListType,
  search: ISearch,
  limit: number,
  skip: number
) {
  if (movieType === 'playing') {
    const data = await db.movies
      .find({
        isPlaying: true,
      })
      .skip(skip)
      .limit(limit)
      .toArray()
    const hotMovieCount = await db.movies.countDocuments({ isPlaying: true })
    return { movieList: data, movieCount: hotMovieCount }
  } else if (movieType === 'hot') {
    let match: any = {}
    // 国家
    if (search.country === '华语') {
      let country = {
        $in: [/中国大陆/i, /中国香港/i, /中国台湾/i],
      }
      match.country = country
    } else if (search.country === '欧美') {
      let country = {
        $in: [
          /美国/i,
          /英国/i,
          /法国/i,
          /德国/i,
          /意大利/i,
          /西班牙/i,
          /加拿大/i,
          /爱尔兰/i,
          /瑞典/i,
          /丹麦/i,
        ],
      }
      match.country = country
    } else if (search.country !== undefined && search.country !== '全部地区') {
      match.country = {
        $regex: search.country,
        $options: 'i',
      }
    }
    // 年份
    if (
      search.year !== '全部年代' &&
      search.year !== '更早' &&
      search.year !== undefined
    ) {
      match.publicYear = {
        $regex: search.year,
        $options: 'i',
      }
    } else if (search.year === '更早') {
      match.publicYear = {
        $lt: '2014',
      }
    }
    // 类型
    if (search.type !== undefined && search.type !== '全部类型') {
      match.type = {
        $regex: search.type,
        $options: 'i',
      }
    }
    // 标签
    if (search.tag !== undefined && search.tag !== 'all') {
      if (search.tag === 'highScore') {
        match.filmScore = {
          $gt: 8.0,
        }
      } else if (search.tag === 'hot') {
        match = {
          $and: [{ commentCount: { $gt: 100000 } }],
        }
      } else if (search.tag === 'latest') {
        match.publicYear = {
          $in: [/2022/i, /2023/i],
        }
      }
    }
    const data = await db.movies
      .aggregate([
        {
          $match: match,
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ])
      .toArray()
    const hotMovieCount = await db.movies.countDocuments(match)
    return { movieList: data, movieCount: hotMovieCount }
  } else if ((movieType = 'search')) {
    if (search.keyword) {
      const match: any = {
        $or: [
          { name: { $regex: search.keyword, $options: 'i' } },
          { country: { $regex: search.keyword, $options: 'i' } },
          { publicYear: { $regex: search.keyword, $options: 'i' } },
          { type: { $regex: search.keyword, $options: 'i' } },
          { language: { $regex: search.keyword, $options: 'i' } },
          { plot: { $regex: search.keyword, $options: 'i' } }
        ],
      }
      const data = await db.movies
        .aggregate([
          {
            $match: match,
          },
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
        ])
        .toArray()
      const movieCount = await db.movies.countDocuments(match)
      return {
        movieList: data,
        movieCount,
      }
    }
  }
}

// 电影详情
export async function movieDetail(movieId: string, userId?: string) {
  const movieDetail = await db.movies.findOne({
    _id: new ObjectId(movieId),
  })
  return movieDetail
}
