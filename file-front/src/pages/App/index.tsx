import { useState, useEffect } from 'react'
import { useRoutes } from 'react-router-dom'

// 导入路由表
import routerConfig from '../../routers'
import { StoreProvider } from '../../hooks/store'
import { IMovie, IUser } from '../../lib/types'
import useUser from '../../hooks/useUser'
export default function App() {
  const element = useRoutes(routerConfig)
  const { getUserInfo } = useUser()
  
  // 用户信息
  const [userInfo, setUserInfo] = useState<IUser>({
    _id: '',
    account: '',
    nickname: '',
    createdAt: 0,
    basePosition: '',
  })
  // 搜索历史
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  // 路由历史
  const [routerUrl, setRouterUrl] =  useState('/')

  const [ movieHotList, setMovieHotList ] = useState<IMovie[]>([])

  // useEffect(() => {
  //   getUserInfo()
  // }, [])
  return (
    <>
      <StoreProvider
        value={{
          userInfo,
          setUserInfo,
          searchHistory,
          setSearchHistory,
          routerUrl,
          setRouterUrl,
          movieHotList,
          setMovieHotList
        }}
      >
        {element}
      </StoreProvider>
    </>
  )
}
