import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Carousel, Tabs, Empty, Popover } from 'antd'
import type { TabsProps } from 'antd'
import SearchTop from '../../../components/SearchTop'
import { ITag } from '../../../lib/types'
import JudgeStar from '../../../components/JudgeStar.tsx'
import useMovie from '../../../hooks/useMovie'
import getImg from '../../../lib/getImgUrl'
import styles from './style.module.scss'
import classNames from 'classnames'
export default function MovieHot() {
  const navigate = useNavigate()
  const { getMovieList, loadMore, movieCount, movieHotList, movieError } =
    useMovie()
  const [country, setCountry] = useState('全部地区')
  const [year, setYaer] = useState('全部年代')
  const [type, setType] = useState('全部类型')
  const [tag, setTag] = useState('all')
  const judgeTag = (value: string) => {
    if (value === 'all') return '全部标签'
    if (value === 'hot') return '热门'
    if (value === 'highScore') return '高分佳片'
    if (value === 'latest') return '最新'
  }
  const movieTypeList = [
    '全部类型',
    '喜剧',
    '爱情',
    '动作',
    '科幻',
    '动画',
    '悬疑',
    '犯罪',
    '惊悚',
    '冒险',
    '音乐',
    '历史',
    '奇幻',
    '恐怖',
    '战争',
    '传记',
    '歌舞',
    '武侠',
    '情色',
    '灾难',
    '西部',
    '纪录片',
    '短片',
  ]
  const moviePositionList = [
    '全部地区',
    '华语',
    '欧美',
    '韩国',
    '日本',
    '中国大陆',
    '美国',
    '中国香港',
    '中国台湾',
    '法国',
    '德国',
    '意大利',
    '西班牙',
    '印度',
    '泰国',
    '俄罗斯',
    '加拿大',
    '澳大利亚',
    '爱尔兰',
    '瑞典',
    '巴西',
    '丹麦',
  ]
  const movieYearList = [
    '全部年代',
    '2023',
    '2022',
    '2021',
    '2020',
    '2019',
    '2018',
    '2017',
    '2016',
    '2015',
    '2014',
    '更早',
  ]
  const movieTagList = ['all', 'highScore', 'hot', 'latest']

  const renderMovieYear = (data: string[]) => {
    return (
      <>
        <div className={styles.content}>
          {data.map((item) => {
            return (
              <>
                <span
                  className={classNames(
                    styles.content_item,
                    item === year ? styles.active : ''
                  )}
                  onClick={async () => {
                    setYaer((year) => item)
                    await getMovieList('hot', {
                      type,
                      country,
                      tag: tag as string,
                      year: item,
                    })
                  }}
                  key={item}
                >
                  {item}
                </span>
              </>
            )
          })}
        </div>
      </>
    )
  }
  const renderMoviePosition = (data: string[]) => {
    return (
      <>
        <div className={styles.content}>
          {data.map((item) => {
            return (
              <>
                <span
                  className={classNames(
                    styles.content_item,
                    item === country ? styles.active : ''
                  )}
                  onClick={async () => {
                    setCountry((country) => item)
                    await getMovieList('hot', {
                      type,
                      country: item,
                      tag,
                      year,
                    })
                  }}
                  key={item}
                >
                  {item}
                </span>
              </>
            )
          })}
        </div>
      </>
    )
  }
  const renderMovieType = (data: string[]) => {
    return (
      <>
        <div className={styles.content}>
          {data.map((item, index) => {
            return (
              <>
                <span
                  className={classNames(
                    styles.content_item,
                    item === type ? styles.active : ''
                  )}
                  onClick={async () => {
                    setType((type) => item)
                    await getMovieList('hot', {
                      type: item,
                      country,
                      tag,
                      year,
                    })
                  }}
                  key={item}
                >
                  {item}
                </span>
              </>
            )
          })}
        </div>
      </>
    )
  }
  const renderMovieTag = (data: string[]) => {
    return (
      <>
        <div className={styles.content}>
          {data.map((item, index) => {
            return (
              <>
                <span
                  className={classNames(
                    styles.content_item,
                    item === tag ? styles.active : ''
                  )}
                  onClick={async () => {
                    setTag((tag) => item)
                    await getMovieList('hot', {
                      type,
                      country,
                      tag: item,
                      year,
                    })
                  }}
                  key={item}
                >
                  {judgeTag(item)}
                </span>
              </>
            )
          })}
        </div>
      </>
    )
  }
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `类型`,
      children: renderMovieType(movieTypeList),
    },
    {
      key: '2',
      label: `地区`,
      children: renderMoviePosition(moviePositionList),
    },
    {
      key: '3',
      label: `年代`,
      children: renderMovieYear(movieYearList),
    },
    {
      key: '4',
      label: `标签`,
      children: renderMovieTag(movieTagList),
    },
  ]

  useEffect(() => {
    getMovieList('hot', {})
  }, [])
  return (
    <>
      <SearchTop onSearchTop={(value) => navigate('/searchMovie/' + value)}  />
      <div className={styles.movie_hot_container}>
        <h2>选电影</h2>
        <div className={styles.content}>
          <header>
            <Tabs defaultActiveKey="1" items={items}></Tabs>
          </header>
          {movieHotList.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <div className={styles.content_body}>
              <div className={styles.movie_list}>
                {movieHotList.map((item) => {
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
                        <div className={styles.movie_name}>{item.name}</div>
                        {/* <div className={styles.movie_info}> */}
                        {item.publicYear} / {item.country?.split('/').join(' ')}{' '}
                        / {item.type?.split('/').join(' ')} /{' '}
                        {item.director ? item.director[0].name : ''} /{' '}
                        {item.actor
                          ? `${item.actor[0]?.name} ${item.actor[1]?.name} ${item.actor[2]?.name} ${item.actor[3]?.name}`
                          : ''}
                        {/* 1987 / 英国 意大利 中国大陆 法国 / 剧情 传记 历史 /
                        贝纳尔多 / 尊龙 陈冲 */}
                        {/* </div> */}
                        <div className={styles.movie_judge}>
                          <JudgeStar
                            judgeScore={item.filmScore as number}
                            type={false}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        {  movieHotList.length < movieCount  && (
          <div style={{ paddingBottom: '30px' }}>
            <div
              className={styles.movie_more}
              onClick={() => {
                loadMore(
                  'hot',
                  { type, year, tag, country },
                  movieHotList.length
                )
                console.log('加载更多')
              }}
            >
              加载更多
            </div>
          </div>
        )}
      </div>
    </>
  )
}
