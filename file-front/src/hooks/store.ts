import { createContext } from 'react'

import { IUser, IMovie } from '../lib/types'

interface IContext {
  // 用户信息
  userInfo: IUser
  setUserInfo: (userInfo: IUser) => void
  // 搜索历史
  searchHistory: string[]
  setSearchHistory: (searchHistory: string[]) => void
  // 路由历史
  routerUrl: string,
  setRouterUrl: (routerUrl: string) => void
  movieHotList:  IMovie[]
  setMovieHotList: (movieHotList: IMovie[]) => void
  // // 标签key值
  // key: string
  // setKey: (key: string) => void
  // // 未读通知数+
  // newNoticeNum: number
  // setNewNoticeNum: (newNoticeNum: number) => void
  // // 未读私信数
  // newMessageNum: number
  // setNewMessageNum: (newMessageNum: number) => void
}

// 创建context对象
const context = createContext<IContext>({
  userInfo: {
    _id: '',
    account: '',
    nickname: '',
    // avatar: '',
    // banner: '',
    // bio: '',
    createdAt: 0,
    basePosition: ''
    // follow: '',
    // followNum: 0,
    // followingNum: 0,
  },
  setUserInfo: () => {},
  searchHistory: [],
  setSearchHistory: () => {},
  routerUrl: '/',
  setRouterUrl: () => {},
  movieHotList: [],
  setMovieHotList: () => {}
  // key: '',
  // setKey: () => {},
  // newNoticeNum: 0,
  // setNewNoticeNum: () => {},
  // newMessageNum: 0,
  // setNewMessageNum: () => {},
})

// 创建生产者
const StoreProvider = context.Provider

export { context, StoreProvider }
