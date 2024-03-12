import { useCallback, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import {
  IMovie,
  ISearch,
  MovieListType,
  TLook,
  ILookList,
  IHaveLook,
} from '../lib/types'
import { context } from './store'
import * as lookServices from '../services/look'

export default function useLook() {
  // const navigate = useNavigate()
  const [lookError, setLookError] = useState('')
  const [wantList, setWantList] = useState<ILookList[]>()
  const [wantCount, setWantCount] = useState(0)
  const [lookCount, setLookCount] = useState(0)
  const [lookList, setLookList] = useState<ILookList[]>()
  const [lookDetail, setLookDetail] = useState<IHaveLook>()

  const createLook = useCallback(
    async (record: {
      type: TLook
      movieId: string
      score?: number
      tag?: string
      comment?: string
    }) => {
      try {
        setLookError('')
        const { data, message, code } = await lookServices.create(record)
        if (code !== 0) {
          setLookError(message)
        }
      } catch (error: any) {
        setLookError(error.message)
      }
    },
    []
  )

  const deleteLook = useCallback(async (wantId: string) => {
    try {
      setLookError('')
      const { data, message, code } = await lookServices.deleteLook(wantId)
      if (code !== 0) {
        setLookError(message)
      }
    } catch (error: any) {
      setLookError(error.message)
    }
  }, [])

  const updateLook = useCallback(
    async (record: { wantId: string; tag?: string; comment?: string }) => {
      try {
        setLookError('')
        const { data, message, code } = await lookServices.update(record)
        if (code !== 0) {
          setLookError(message)
        }
      } catch (error: any) {
        setLookError(error.message)
      }
    },
    []
  )

  const getLookList = useCallback(async (type: TLook) => {
    try {
      setLookError('')
      const { data, message, code } = await lookServices.list(type)
      if (code !== 0) {
        setLookError(message)
      } else if (code === 0) {
        console.log('打印获取的想看数据:',  data);
        
        if (type === 'looked') {
          setLookList(data.wantList)
          setLookCount(data.wantCount)
        } else if (type === 'want') {
          setWantList(data.wantList)
          setWantCount(data.wantCount)
        }
      }
    } catch (error: any) {
      setLookError(error.message)
    }
  }, [])

  const getLookDetail = useCallback(async (movieId: string) => {
    try {
      setLookError('')
      const { data, message, code } = await lookServices.detail(movieId)
      if (code !== 0) {
        setLookError(message)
      } else if (code === 0) {
        setLookDetail(data)
      }
    } catch (error: any) {
      setLookError(error.message)
    }
  }, [])

  return {
    lookDetail,
    lookList,
    lookCount,
    wantCount,
    wantList,
    lookError,
    getLookList,
    getLookDetail,
    createLook,
    deleteLook,
    updateLook,
  }
}
