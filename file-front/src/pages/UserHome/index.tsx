import { useContext, useEffect } from 'react'
import { context } from '../../hooks/store'
import { Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header'
import JudgeStar from '../../components/JudgeStar.tsx'
import classNames from 'classnames'
import styles from './style.module.scss'
import UserHomeImg from '../../assets/images/userHomes.jpg'
import getImg from '../../lib/getImgUrl'
// import useUser from '../../hooks/useUser'
import useComment from '../../hooks/useComment'
import useLook from '../../hooks/useLook'
export default function UserHome() {
  const naviagte = useNavigate()
  const { userInfo } = useContext(context)
  const { userCommentCount, userCommentList, getUserCommentList } = useComment()
  const { lookList, wantList, wantCount, lookCount, getLookList } = useLook()
  useEffect(() => {
    getUserCommentList({})
    getLookList('looked')
    getLookList('want')
  }, [])
  return (
    <>
      <div className={styles.user_home}>
        <Header userInfo={userInfo} isHeaderContent={false} />
        <div className={styles.content}>
          <div className={styles.banner}>好看电影，让你我看世界！</div>
          <div className={styles.body}>
            <img src={UserHomeImg} alt="" className={styles.img} />
            <div className={styles.self_introduction}>
              <span className={styles.title}>
                这里是{userInfo.nickname}的个人主页
              </span>
              <div className={styles.self_info}>
                <div>
                  <span>昵称:</span> <span>{userInfo.nickname}</span>
                </div>
                <div>
                  <span>账号:</span> <span>{userInfo.account}</span>
                </div>
                <div>
                  <span>居住地:</span> <span>{userInfo.basePosition}</span>
                </div>
              </div>
            </div>
            <div className={styles.self_comment}>
              <div>
                <span className={styles.title}>我的评论 · · · · · · · · ·</span>
                <span style={{ color: '#111111' }}>
                  （{userCommentCount}评论）
                </span>
              </div>
              <div className={styles.self_comment_content}>
                {userCommentCount !== 0 ? (
                  userCommentList?.map((item) => {
                    return (
                      <div className={styles.comment_item} key={item._id}>
                        <div className={styles.left} onClick={() => {
                          naviagte('/movieDetail/' + item.movieId)
                        }} >
                          <img src={getImg(item.movie.posterUrl)} alt="" />
                        </div>
                        <div className={styles.right}>
                          <span>{item.title}</span>
                          <div className={styles.tag}>
                            <span>{userInfo.nickname}</span>
                            <span>评论: {item.movie.name}</span>
                            <JudgeStar judgeScore={item.score} type={true} />
                          </div>
                          <div className={styles.comment}>{item.content}</div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
            </div>
            <div className={styles.self_comment}>
              <div>
                <span className={styles.title}>我想看 · · · · · · · · ·</span>
                <span style={{ color: '#111111' }}>
                  （{wantCount}部想看）
                </span>
              </div>
              <div className={styles.self_comment_content}>
                {wantCount !== 0 ? (
                  wantList?.map((item) => {
                    return (
                      <div className={styles.comment_item} key={item._id}>
                        <div className={styles.left} onClick={() => {
                          naviagte('/movieDetail/' + item.movieId)
                        }} >
                          <img src={getImg(item.movie.posterUrl)} alt="" />
                        </div>
                        <div className={styles.right}>
                          <div>
                            <span style={{ color: '#111111', marginRight: '5px' }}  >影名:</span>
                            <span>{item.movie.name}</span>
                          </div>
                          <div className={styles.comment}>
                          <span style={{ color: '#111111', marginRight: '5px' }}  >简介:</span>
                            <span>{item.movie.plot}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
            </div>
            <div className={styles.self_comment}>
              <div>
                <span className={styles.title}>我看过 · · · · · · · · ·</span>
                <span style={{ color: '#111111' }}>
                  （{lookCount}部看过）
                </span>
              </div>
              <div className={styles.self_comment_content}>
                {lookCount !== 0 ? (
                  lookList?.map((item) => {
                    return (
                      <div className={styles.comment_item} key={item._id}>
                        <div className={styles.left} onClick={() => {
                          naviagte('/movieDetail/' + item.movieId)
                        }} >
                          <img src={getImg(item.movie.posterUrl)} alt="" />
                        </div>
                        <div className={styles.right}>
                          <div>
                            <span style={{ color: '#111111', marginRight: '5px' }}  >影名:</span>
                            <span>{item.movie.name}</span>
                          </div>
                          <div className={styles.comment}>
                          <span style={{ color: '#111111', marginRight: '5px' }}  >简介:</span>
                            <span>{item.movie.plot}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
