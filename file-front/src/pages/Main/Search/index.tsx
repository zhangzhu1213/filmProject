import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Empty } from 'antd'
import SearchTop from '../../../components/SearchTop'
import useMovie from '../../../hooks/useMovie'
import getImg from '../../../lib/getImgUrl'
import JudgeStar from '../../../components/JudgeStar.tsx'
import styles from './style.module.scss'
import { IMovie } from '../../../lib/types'

export default function Search() {
  const navigate = useNavigate()
  const { keyword } = useParams()
  const [ keywords, setKeywords] = useState(keyword)
  // const 
  const { movieHotList, getMovieList, loadMore, movieCount } = useMovie()

  useEffect(() => {
    getMovieList('search', { keyword })
  }, [])

  return (
    <>
      <SearchTop onSearchTop={async (value) => {
        setKeywords(keywords)
        await getMovieList('search', {keyword: value})
      }}  />
      <div className={styles.search_container}>
        <header>
          <span className={styles.title}>搜索</span>
          <span className={styles.keyword}>{keywords}</span>
        </header>
        <div className={styles.content}>
          {movieHotList.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            movieHotList.map((item) => {
              return (
                <div
                  className={styles.movie_list_item}
                  key={item._id}
                  onClick={() => navigate('/movieDetail/' + item._id)}
                >
                  <div className={styles.img}>
                    <img src={getImg(item.posterUrl)} alt="" />
                  </div>
                  <div className={styles.item_content}>
                    <div className={styles.movie_name}>
                      <span className={styles.name}>{item.name} （{item.publicYear}）</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        marginBottom: '10px',
                      }}
                    >
                      <JudgeStar judgeScore={item.filmScore as number} type={false} />{' '}
                      <span>({item.commentCount}人评价)</span>
                    </div>
                    {/* <div className={styles.movie_info}> */}
                    <div>
                      {item.publicYear}
                      {item.country?.split('/').join(' ')} /{' '}
                      {item.type?.split('/').join(' ')} / {item.name} /{' '}
                      {item.lengthFilm}
                    </div>
                    <div>
                      {item.director ? item.director[0].name : ''} /{' '}
                      {item.actor
                        ? `${item.actor[0]?.name} ${item.actor[1]?.name} ${item.actor[2]?.name} ${item.actor[3]?.name}`
                        : ''}
                    </div>
                    {/* 1987 / 英国 意大利 中国大陆 法国 / 剧情 传记 历史 /
                        贝纳尔多 / 尊龙 陈冲 */}
                    {/* </div> */}
                    {/* <div className={styles.movie_judge}>
                <JudgeStar judgeScore={8.5} type={false} />
              </div> */}
                  </div>
                </div>
              )
            })
          )}

          {movieHotList.length < movieCount && (
            <div style={{ paddingBottom: '30px' }}>
              <div
                className={styles.movie_more}
                onClick={() => {
                  loadMore('hot', { keyword }, movieHotList.length)
                  console.log('加载更多')
                }}
              >
                加载更多
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
