import { log } from 'console'
import request from '../lib/request'
import { ApiResp, IMovie, ISearch, MovieListType } from '../lib/types'

// 获取电影列表
export async function movieList(
  movieType: MovieListType,
  search: ISearch,
  skip: number = 0,
  limit: number = 10
) {
  console.log('接口打印skip', skip);
  
  const newSearch: any = {}
  if (search.country !== undefined) newSearch.country = search.country
  if (search.keyword !== undefined) newSearch.keyword = search.keyword
  if (search.tag !== undefined) newSearch.tag = search.tag
  if (search.type !== undefined) newSearch.type = search.type
  if (search.year !== undefined) newSearch.year = search.year
  newSearch.movieType = movieType
  newSearch.skip = skip
  newSearch.limit = limit
  const query = new URLSearchParams(newSearch)
  const { data } = await request.get<ApiResp<{
    movieList: IMovie[],
    movieCount: number
  }>>(
    '/movie/list?' + query.toString()
  )
  console.log(data, '获取数据');
  
  return data
}

// 获取电影详情
export async  function movieDetail(movieId: string) {
  const { data } = await request.get<ApiResp<IMovie>>('/movie/detail?movieId=' + movieId)
  console.log('电影详情', data);
  
  return data
}
