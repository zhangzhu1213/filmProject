import { useCallback, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { IMovie, ISearch, MovieListType } from '../lib/types'
import { context } from './store'
import * as movieServices from '../services/movie'

export default function useMovie() {
  // const navigate = useNavigate()
  // const { movieHotList, setMovieHotList } = useContext(context)
  const [movieError, setMoiveError] = useState('')
  const [moviePlayingList, setMoviePlayingList] = useState<IMovie[]>([])
  const [movieHotList, setMovieHotList] = useState<IMovie[]>([])
  const [movieDetail, setMoiveDetail] = useState<IMovie>()
  const [movieCount, setMovieCount] = useState(0)
  // const [skip,  setSkip] = useState(0)

  const getMovieList = useCallback(
    async (
      movieType: MovieListType,
      search: ISearch,
      limit: number = 10,
      skip: number = 0
    ) => {
      console.log('打印选项', search)

      try {
        setMoiveError('')
        const { data, message, code } = await movieServices.movieList(
          movieType,
          search,
          skip,
          limit
        )
        if (code !== 0) {
          setMoiveError(message)
        } else if (code === 0) {
          if (movieType === 'hot') {
            setMovieHotList([...data.movieList])
            // setSkip(data.movieList.length)
            setMovieCount(data.movieCount)
            console.log('打印拿到数据', data)
          } else if (movieType === 'playing') {
            setMoviePlayingList(data.movieList)
            // setSkip(skip => skip + data.movieList.length)
            setMovieCount(data.movieCount)
            console.log(data.movieCount, 'movieCount')
          } else if (movieType === 'search') {
            setMovieHotList(data.movieList)
            // setSkip(data.movieList.length)
            setMovieCount(data.movieCount)
          }
        }
      } catch (error: any) {
        setMoiveError(error.message)
      }
    },
    []
  )

  const getMovieDetail = useCallback(async (movieId: string) => {
    try {
      setMoiveError('')
      const { data, message, code } = await movieServices.movieDetail(movieId)
      if (code !== 0) {
        setMoiveError(message)
      } else if (code === 0) {
        setMoiveDetail(data)
        console.log(data, '电影详情');
      }
    } catch (error: any) {
      setMoiveError(error.message)
    }
  }, [])

  const loadMore = useCallback(
    async (movieType: MovieListType, search: ISearch, skipLength: number) => {
      try {
        // console.log(skip, skipLength, 'hahahah1');

        setMoiveError('')
        if (movieType === 'hot') {
          const { data, message, code } = await movieServices.movieList(
            movieType,
            search,
            skipLength,
            10
          )
          if (code === 0) {
            // setMovieHotList(movieHotList.concat(data.movieList))
            // const oldData = [...movieHotList]
            setMovieHotList(movieHotList.concat(data.movieList))
            setMovieCount(data.movieCount)
            // setSkip(skip => skip + data.movieList.length)
          }
        } else if (movieType === 'playing') {
          // console.log(skip, 'skip');
          const { data, message, code } = await movieServices.movieList(
            movieType,
            search,
            skipLength,
            12
          )
          if (code === 0) {
            // setMoviePlayingList(moviePlayingList.concat(data.movieList))
            setMoviePlayingList(moviePlayingList.concat(data.movieList))
            setMovieCount(data.movieCount)
            // setSkip(skip + data.movieList.length)
          }
        } else if (movieType === 'search') {
          const { data, message, code } =  await movieServices.movieList(movieType, search, skipLength)
          if (code === 0) {
            setMovieHotList(movieHotList.concat(data.movieList))
            setMovieCount(data.movieCount)
          }
        }
      } catch (error: any) {
        setMoiveError(error.message)
      }
    },
    [movieHotList, moviePlayingList]
  )

  return {
    movieHotList,
    moviePlayingList,
    movieDetail,
    movieCount,
    movieError,
    getMovieList,
    getMovieDetail,
    loadMore,
  }
}
