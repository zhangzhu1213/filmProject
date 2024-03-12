import { log } from 'console'
import request from '../lib/request'
import {
  ApiResp,
  IMovie,
  ISearch,
  MovieListType,
  IMovieScore,
} from '../lib/types'
// 创建打分
export async function create(movieId: string, score: number) {
  const { data } = await request.post<ApiResp<number>>('/score/create', {
    movieId,
    score,
  })
  return data
}

// 创建打分
export async function detail(movieId: string) {
  const { data } = await request.post<ApiResp<IMovieScore>>('/score/detail', {
    movieId,
  })
  return data
}
