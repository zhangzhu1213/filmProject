import { log } from 'console'
import request from '../lib/request'
import {
  ApiResp,
  IMovie,
  ISearch,
  MovieListType,
  IHaveLook,
  TLook,
  ILookList,
} from '../lib/types'

// 创建 想看 / 看过 记录
export async function create(record: {
  
}) {
  const { data } = await request.post<ApiResp<string>>('/look/create', {
    ...record,
  })
  return data
}

// 删除 想看 / 看过 记录
export async function deleteLook(wantId: string) {
  const { data } = await request.post<ApiResp<string>>('/look/delete', {
      wantId,
  })
  return data
}

// 修改 想看 / 看过 记录
export async function update(record: {
  wantId: string
  tag?: string
  comment?: string
}) {
  const { data } = await request.post<ApiResp<string>>('/look/update', {
    ...record,
  })
  return data
}

// 获取 想看 / 看过 记录
export async function list(type: TLook) {
  const { data } = await request.post<ApiResp<{
    wantList: ILookList[],
    wantCount: number
  }>>('/look/list', {
      type
  })
  return data
}

// 获取 想看 / 看过 详情
export async function detail(movieId: string) {
  const { data } = await request.post<ApiResp<IHaveLook>>('/look/detail', {
      movieId
  })
  return data
}
