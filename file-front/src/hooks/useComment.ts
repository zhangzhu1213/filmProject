import { useCallback, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import {
  IMovie,
  ISearch,
  MovieListType,
  TLook,
  ILookList,
  IComment,
  IMovieComment,
  IUserComment,
} from '../lib/types'
import { context } from './store'
import * as commentServices from '../services/comment'
import { error, log } from 'console'

export default function useComment() {
  const navigate = useNavigate()
  const [commentError, setCommentError] = useState('')
  const [ movieUserCommentList, setMovieUserCommentList] = useState<IComment[]>()
  const [ movieCommentList, setMovieCommentList] = useState<IMovieComment[]>()
  const [movieCommentCount, setMovieCommentCount] = useState(0)
  const [ userCommentList, setuserCommentList] = useState<IUserComment[]>()
  const [userCommentCount, setuserCommentCount] = useState(0)

  const createComment = useCallback(
    async (movieId: string, content: string, title: string) => {
      try {
        setCommentError('')
        const { data, message, code } = await commentServices.create(
          movieId,
          content,
          title
        )
        if (code !== 0) {
          setCommentError(message)
        }
      } catch (error: any) {
        setCommentError(error.message)
      }
    },
    []
  )

  const deleteComment = useCallback(async (commentId: string) => {
    try {
      setCommentError('')
      const { data, message, code } = await commentServices.deleteComment(
        commentId
      )
      if (code !== 0) {
        setCommentError(message)
      }
    } catch (error: any) {
      setCommentError(error.message)
    }
  }, [])

  const updateComment = useCallback(
    async (record: { movieId: string; content?: string; title?: string }) => {
      try {
        setCommentError('')
        const { data, message, code } = await commentServices.update(record)
        if (code !== 0) {
          setCommentError(message)
        }
      } catch (error: any) {
        setCommentError(error.message)
      }
    },
    []
  )

  const starComment = useCallback(async (commentId: string) => {
    try {
      setCommentError('')
      const { data, message, code } = await commentServices.star(commentId)
      if (code !== 0) {
        setCommentError(message)
      }
    } catch (error: any) {
      setCommentError(error.message)
    }
  }, [])

  const cancelStarComment = useCallback(async (comment: string) => {
    try {
      setCommentError('')
      const { data, message, code } = await commentServices.star(comment)
      if (code !== 0) {
        setCommentError(message)
      }
    } catch (error: any) {
      setCommentError(error.message)
    }
  }, [])

  const getMovieCommentList = useCallback(
    async (record: {
      movieId: string,
      userId: string,
      skip?: number,
      limit?: number
    }) => {
      try {
        console.log('但因userId', record.userId);
        
        setCommentError('')
        const { data, message, code } = await commentServices.movieCommentList(record.movieId, record.userId, record.skip, record.limit)
        if (code !== 0) {
          setCommentError(message)
        } else if (code === 0) {
          setMovieCommentList(data.commentList)
          setMovieCommentCount(data.commentCount)
        }
      } catch (error: any) {
        setCommentError(error.message)
      }
    },
    []
  )

  const getUserCommentList = useCallback(
    async (record: {
      skip?: number,
      limit?: number
    }) => {
      try {
        setCommentError('')
        const { data, message, code } = await commentServices.userCommentList(record.skip, record.limit)
        if (code !== 0) {
          setCommentError(message)
        } else if (code === 0) {
          setuserCommentList(data.commentList)
          setuserCommentCount(data.commentCount)
        }
      } catch (error: any) {
        setCommentError(error.message)
      }
    },
    []
  )

  const getMovieUserCommentList = useCallback(
    async (movieId: string) => {
      try {
        setCommentError('')
        const { data, message, code } = await commentServices.movieUserCommentList(movieId)
        if (code === 20006  || code === 40001) {
          
        } else if (code === 0) {
          setMovieUserCommentList(data.commentList)
        } else {
          setCommentError(message)
        }
      } catch (error: any) {
        setCommentError(error.message)
      }
    },
    []
  )
  return {
    commentError,
    movieCommentCount,
    movieCommentList,
    movieUserCommentList,
    userCommentCount,
    userCommentList,
    createComment,
    deleteComment,
    updateComment,
    starComment,
    cancelStarComment,
    getMovieCommentList,
    getMovieUserCommentList,
    getUserCommentList
  }
}
