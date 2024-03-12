import { useState, useEffect } from 'react'
import { Input, Dropdown, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import SearchTop from '../SearchTop'
import { useNavigate } from 'react-router-dom'
import { IUser } from '../../lib/types'
import useUser from '../../hooks/useUser'
import styles from './style.module.scss'

interface IProps {
  isHeaderContent: boolean
  userInfo: IUser
}

export default function Header({ isHeaderContent, userInfo }: IProps) {
  const navigate = useNavigate()
  const { userLogout, getUserInfo } = useUser()
  // const [isAsign, setIsAsign] = useState(true)
  console.log(userInfo, 'userInfo头部拿到了')
  const { Search } = Input
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <span
          onClick={() => {
            navigate('/user/home')
          }}
        >
          个人主页
        </span>
      ),
    },
    {
      key: '2',
      label: (
        <span
          onClick={() => {
            navigate('/account/setting')
          }}
        >
          账号管理
        </span>
      ),
    },
    {
      key: '3',
      label: <span onClick={async () => {
        await userLogout()
      }}>退出登录</span>,
    },
  ]
  const onSearchTop = (value: string) => {
    navigate('/searchMovie/' +value.trim())
  }

  useEffect(() => {
    getUserInfo()
  }, [])

  return (
    <>
      <div className={styles.header}>
        <div className={styles.header_top}>
          <div className={styles.content}>
            <span className={styles.content_item} onClick={() => navigate('/')} >首页</span>
            <span className={styles.content_item} onClick={() => navigate('/movieOpen')} >热映电影</span>
            <span className={styles.content_item} onClick={() => navigate('/movieHot')} >热门电影</span>
          </div>
          <div className={styles.account}>
            {userInfo._id !== '' ? (
              <Dropdown menu={{ items }}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    {userInfo.nickname}
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            ) : (
              <span onClick={() => {
                navigate('/login')
              }} >登录/注册</span>
            )}
          </div>
        </div>
        {/* {isHeaderContent ? (
          <SearchTop onSearchTop={(value) =>  onSearchTop(value)} />
        ) : (
          ''
        )} */}
      </div>
    </>
  )
}
