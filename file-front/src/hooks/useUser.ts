import { useCallback, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import * as userServices from '../services/user'
import { IUserInfo } from '../lib/types'
import { context } from './store'
export default function useUser() {
  const navigate = useNavigate()
  const [userError, setUserError] = useState('')
  const { userInfo, setUserInfo, routerUrl } = useContext(context)
  const success = (value: string) => {
    message.open({
      type: 'success',
      content: `${value}`,
      duration: 1,
    })
  }
  const userRegister = useCallback(
    async (account: string, password: string) => {
      console.log(account, password)
      try {
        setUserError('')
        const { data, message, code } = await userServices.register(
          account,
          password
        )
        if (code !== 0) {
          setUserError(message)
        } else {
          success(data.message)
          navigate('/login')
        }
      } catch (error: any) {
        setUserError(error.message)
      }
    },
    [navigate]
  )

  const userLogin = useCallback(
    async (account: string, password: string) => {
      try {
        setUserError('')
        const { data, message, code } = await userServices.login(
          account,
          password
        )
        if (code !== 0) {
          console.log(message, 'message')

          setUserError(message)
        } else {
          success(data.message)
          // const loginTo = JSON.parse(localStorage.getItem('loginTo') as string) ? {status: false} : JSON.parse(localStorage.getItem('loginTo') as string)
          // console.log(loginTo, 'login');
          // let loginTo  = localStorage.getItem('loginTo') ? true : JSON.parse(localStorage.getItem('loginTo') as string)
          // if (loginTo) {
          //   navigate(-1)
          //   localStorage.setItem('loginTo', JSON.stringify(false))
          // } else {

          //   console.log('777777', loginTo);
          //   navigate('/')
          // }
          navigate(routerUrl)
        }
      } catch (error: any) {
        setUserError(error.message)
      }
    },
    [navigate]
  )

  const userLogout = useCallback(async () => {
    try {
      setUserError('')
      const { data, message, code } = await userServices.logout()
      if (code !== 0) {
        setUserError(message)
      } else {
        success(data)
        setUserInfo({
          _id: '',
          account: '',
          nickname: '',
          basePosition: '',
          createdAt: 0,
        })
        navigate('/login')
      }
    } catch (error: any) {
      setUserError(error.message)
    }
  }, [navigate])
  const userInfoUpdate = useCallback(
    async (record: IUserInfo) => {
      try {
        setUserError('')
        const { data, message, code } = await userServices.update(record)
        if (code !== 0) {
          setUserError(message)
        } else {
          if (record.isUpdatePassword) {
            // 修改密码操作
            success('密码修改成功，请重新登录')
            navigate('/login')
          } else {
            success(data.message)
            setUserInfo(data.userInfo)
          }
        }
      } catch (error: any) {
        setUserError(error.message)
      }
    },
    [setUserInfo, navigate]
  )

  const getUserInfo = useCallback(async () => {
    try {
      setUserError('')
      const { data, code } = await userServices.userInfo()
      if (code === 0) {
        setUserInfo({ ...data })
      }
    } catch (error: any) {
      setUserError(error.message)
    }
  }, [setUserInfo])

  return {
    userRegister,
    userLogin,
    userLogout,
    userInfoUpdate,
    getUserInfo,
    userError,
  }
}
