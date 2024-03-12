import { useEffect, useState } from 'react'
import { Carousel, Popover } from 'antd'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import SearchTop from '../../../components/SearchTop/index'
import JudgeStar from '../../../components/JudgeStar.tsx'
import useMovie from '../../../hooks/useMovie'
import getImg from '../../../lib/getImgUrl'
import styles from './style.module.scss'
import classNames from 'classnames'
export default function MovieList() {
  const { movieError, movieHotList, moviePlayingList, getMovieList, loadMore } =
    useMovie()
  const navigate = useNavigate()

  useEffect(() => {
    if (movieError !== '') {
      error(movieError)
    }
  }, [movieError])

  useEffect(() => {
    getMovieList('playing', {})
    getMovieList('hot', {})
  }, [])

  const error = (value: string) => {
    message.open({
      type: 'error',
      content: `${value}`,
      duration: 2,
    })
  }
  return (
    <>
      <SearchTop onSearchTop={(value) => navigate('/searchMovie/' + value)} />
      <div className={styles.movie_container}>
        <div className={classNames(styles.hot_movie, styles.movie_item)}>
          <header>
            <span className={styles.title}>正在热映</span>
            <div className={styles.option}>
              {/* <span className={styles.all_hot_movie}>全部正在热映</span> */}
              {/* <span className={styles.movie_later}>即将上映</span> */}
            </div>
            <span
              className={styles.more}
              onClick={() => {
                console.log(moviePlayingList, 'aaa')
                navigate('/movieOpen')
              }}
            >
              更多
            </span>
          </header>
          <div>
            <Carousel autoplay className={styles.content}>
              <ul className={styles.banner_item}>
                {moviePlayingList.map((item, index) => {
                  if (index < 5) {
                    return (
                      <>
                        <li className={styles.movie_item} key={item._id}>
                          <Popover
                            placement="right"
                            title={
                              <>
                                <div style={{ width: '200px' }}>
                                  {item.name}
                                </div>
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
                                        return (
                                          <span key={el.avatar}>{el.name}</span>
                                        )
                                      } else {
                                        return (
                                          <span key={el.avatar}>
                                            {' '}
                                            / {el.name}
                                          </span>
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
                              onClick={() =>
                                navigate('/movieDetail/' + item._id)
                              }
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
                      </>
                    )
                  } else {
                    return ''
                  }
                })}
              </ul>
              <ul className={styles.banner_item}>
                {moviePlayingList.map((item, index) => {
                  if (index >= 5) {
                    return (
                      <>
                        <li className={styles.movie_item} key={item._id}>
                          <Popover
                            placement="right"
                            title={
                              <>
                                <div style={{ width: '200px' }}>
                                  {item.name}
                                </div>
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
                                    <span>
                                      {item.publicYear ? item.publicYear : ''}
                                    </span>
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
                                        return (
                                          <span key={el.avatar}>{el.name}</span>
                                        )
                                      } else {
                                        return (
                                          <span key={el.avatar}>
                                            {' '}
                                            / {el.name}
                                          </span>
                                        )
                                      }
                                    })}
                                  </div>
                                </div>
                              </>
                            }
                          >
                            <div
                              className={styles.img}
                              onClick={() =>
                                navigate('/movieDetail/' + item._id)
                              }
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
                      </>
                    )
                  } else {
                    return ''
                  }
                })}
              </ul>
            </Carousel>
          </div>
        </div>
        <div className={classNames(styles.later_movie, styles.movie_item)}>
          <header>
            <span className={styles.title}>最近热门电影</span>
            <div className={styles.option}>
              <span
                className={styles.all_hot_movie}
                onClick={() => {
                  getMovieList('hot', { tag: 'hot' })
                }}
              >
                热门
              </span>
              <span
                className={styles.movie_later}
                onClick={() => {
                  getMovieList('hot', { tag: 'latest' })
                }}
              >
                最新
              </span>
              <span
                className={styles.movie_later}
                onClick={() => {
                  getMovieList('hot', { tag: 'highScore' })
                }}
              >
                高分
              </span>
              {/* <span className={styles.movie_later}>冷门佳片</span> */}
              <span
                className={styles.movie_later}
                onClick={() => {
                  getMovieList('hot', { country: '华语' })
                }}
              >
                华语
              </span>
              <span
                className={styles.movie_later}
                onClick={() => {
                  getMovieList('hot', { country: '欧美' })
                }}
              >
                欧美
              </span>
              <span
                className={styles.movie_later}
                onClick={() => {
                  getMovieList('hot', { country: '韩国' })
                }}
              >
                韩国
              </span>
              <span
                className={styles.movie_later}
                onClick={() => {
                  getMovieList('hot', { country: '日本' })
                }}
              >
                日本
              </span>
            </div>
            <span
              className={styles.more}
              onClick={() => {
                navigate('/movieHot')
              }}
            >
              更多
            </span>
          </header>
          <div>
            <Carousel className={styles.content}>
              <ul className={styles.banner_item}>
                {movieHotList.map((item) => {
                  return (
                    <>
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
                                  <span>
                                    {item.publicYear ? item.publicYear : ''}
                                  </span>
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
                                      return (
                                        <span key={el.avatar}>{el.name}</span>
                                      )
                                    } else {
                                      return (
                                        <span key={el.avatar}>
                                          {' '}
                                          / {el.name}
                                        </span>
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
                        <div className={styles.bottom}>
                          <span
                            className={styles.title}
                            onClick={() => navigate('/movieDetail/' + item._id)}
                          >
                            {item.name}
                          </span>
                          <span className={styles.judgement}>
                            {item.filmScore}
                          </span>
                        </div>
                      </li>
                    </>
                  )
                })}
              </ul>
            </Carousel>
          </div>
        </div>
      </div>
    </>
  )
}
