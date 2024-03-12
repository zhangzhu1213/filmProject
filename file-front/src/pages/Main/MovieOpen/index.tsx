import { useEffect } from 'react'
import { Carousel, Empty, Popover } from 'antd'
import { useNavigate } from 'react-router-dom'
import SearchTop from '../../../components/SearchTop'
import JudgeStar from '../../../components/JudgeStar.tsx'
import getImg from '../../../lib/getImgUrl'
import useMovie from '../../../hooks/useMovie'
import styles from './style.module.scss'
import classNames from 'classnames'
export default function MovieOpen() {
  const navigate = useNavigate()
  const { getMovieList, moviePlayingList, movieCount, loadMore } = useMovie()
  useEffect(() => {
    getMovieList('playing', {}, 12)
  }, [])
  return (
    <>
      <SearchTop onSearchTop={(value) => navigate('/searchMovie/' + value)} />
      <div className={styles.movie_container}>
        <div className={classNames(styles.hot_movie, styles.movie_item)}>
          <header>
            <span className={styles.title}>正在上映</span>
            {/* <div className={styles.option}></div> */}
            {/* <span className={styles.more}></span> */}
          </header>
          <div>
            <ul className={styles.banner_item}>
              {moviePlayingList.map((item) => {
                return (
                  <li className={styles.movie_item} key={item._id}>
                    <Popover
                      placement="right"
                      title={
                        <>
                          <div style={{ width: '200px' }}>{item.name}</div>
                        </>
                      }
                      content={
                        <>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                            }}
                          >
                            <div style={{ display: 'flex', gap: '15px' }}>
                              <span>{item.publicYear}</span>
                              <JudgeStar
                                judgeScore={item.filmScore as number}
                                type={false}
                              />
                              <span>{item.commentCount} 人已评价</span>
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                              <span>导演:</span>
                              {item.director?.map((el, index) => {
                                if (index === 0) {
                                  return <span key={el.avatar}>{el.name}</span>
                                } else {
                                  return (
                                    <span key={el.avatar}> / {el.name}</span>
                                  )
                                }
                              })}
                            </div>
                          </div>
                        </>
                      }
                      key={item._id}
                    >
                      <div
                        className={styles.img}
                        onClick={() => navigate('/movieDetail/' + item._id)}
                      >
                        <img src={getImg(item.posterUrl)} alt="" />
                      </div>
                    </Popover>
                    <div
                      className={styles.title}
                      onClick={() => navigate('/movieDetail/' + item._id)}
                    >
                      {item.name}
                    </div>
                    <div className={styles.judgement}>
                      <JudgeStar
                        judgeScore={item.filmScore as number}
                        type={false}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
            {moviePlayingList.length < movieCount ? (
              <div
                className={styles.movie_more}
                onClick={async () => {
                  await loadMore('playing', {}, moviePlayingList.length)
                  // console.log('加载更多', moviePlayingList, moviePlayingList.length)
                }}
              >
                加载更多
              </div>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
