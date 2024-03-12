import { useContext, useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { context } from '../../hooks/store'
import useUser from '../../hooks/useUser'
import Header from '../../components/Header'
import styles from './style.module.scss'
export default function Main() {
  // const { getUserInfo } = useUser()
  const { userInfo} = useContext(context)
  // useEffect(() => {
  //   getUserInfo()
  // }, [])
  return (
    <>
      <div>
        <Header userInfo={userInfo} isHeaderContent={true}></Header>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </>
  )
}
