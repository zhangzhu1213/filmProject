import { log } from 'console'
import request from '../lib/request'
import {
  ApiResp,
  IMovie,
  ISearch,
  MovieListType,
  IComment,
  IUserComment,
  IMovieComment,
} from '../lib/types'

// 获取电影评论列表
export async function movieCommentList(
  movieId: string,
  userId: string,
  skip: number = 0,
  limit: number = 10
) {
  const newSearch: any = {}
  newSearch.movieId = movieId
  newSearch.skip = skip
  newSearch.limit = limit
  if (userId !== '') newSearch.userId = userId
  const query = new URLSearchParams(newSearch)
  const { data } = await request.get<
    ApiResp<{
      commentList: IMovieComment[]
      commentCount: number
    }>
  >('/comment/movieComment/list?' + query.toString())
  return data
}

// 获取用户评论列表
export async function userCommentList(skip: number = 0, limit: number = 10) {
  const newSearch: any = {}
  newSearch.skip = skip
  newSearch.limit = limit
  const query = new URLSearchParams(newSearch)
  const { data } = await request.get<
    ApiResp<{
      commentList: IUserComment[]
      commentCount: number
    }>
  >('/comment/userComment/list?' + query.toString())
  return data
}

// 获取当前用户当前页面评论列表
export async function movieUserCommentList(movieId: string) {
  const { data } = await request.get<
    ApiResp<{
      commentList: IComment[]
    }>
  >('/comment/movieUserComment/list?movieId=' + movieId)
  console.log('是否', data);
  
  return data
}

// 创建评论
export async function create(movieId: string, content: string, title: string) {
  const { data } = await request.post<ApiResp<string>>('/comment/create', {
    movieId,
    content,
    title,
  })
  return data
}

// 修改评论
export async function update(record: {
  movieId: string
  content?: string
  title?: string
}) {
  const { data } = await request.post<ApiResp<string>>('/comment/update', {
    ...record,
  })
  return data
}

// 删除评论
export async function deleteComment(commentId: string) {
  const { data } = await request.post<ApiResp<string>>('/comment/delete', {
      commentId,
  })
  return data
}

// 评论点赞
export async function star(commentId: string) {
  const { data } = await request.post<ApiResp<string>>('/comment/star', {
      commentId,
  })
  return data
}

// 取消评论点赞
export async function cancelStar(commentId: string) {
  const { data } = await request.post<ApiResp<string>>('/comment/cancelStar', {
      commentId,
  })
  return data
}
