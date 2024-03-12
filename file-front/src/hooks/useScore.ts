import { useCallback, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { IMovie, ISearch, MovieListType, IMovieScore } from '../lib/types'
import { context } from './store'
import * as scoreServices from '../services/score'

export default function useScore() {
  // const navigate = useNavigate()
  const [scoreError, setScoreError] = useState('')
  const [scoreDetail, setScoreDetail] = useState<IMovieScore>()

  const createScore = useCallback(async (movieId: string, score: number) => {
    try {
      setScoreError('')
      const { data, message, code } = await scoreServices.create(movieId, score)
      if (code !== 0) {
        setScoreError(message)
      }
    } catch (error: any) {
      setScoreError(error.message)
    }
  }, [])

  const getScoreDetail = useCallback(async (movieId: string) => {
    try {
      setScoreError('')
      const { data, message, code } = await scoreServices.detail(movieId)
      if (code !== 0) {
        setScoreError(message)
      } else if (code === 0) {
        setScoreDetail(data)
      }
    } catch (error: any) {
      setScoreError(error.message)
    }
  }, [])

  return {
    scoreDetail,
    createScore,
    getScoreDetail
  }
}


