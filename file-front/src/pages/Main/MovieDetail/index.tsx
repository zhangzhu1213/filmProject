import { useState, useEffect, useContext } from 'react'
import { Modal, message, Input, Tooltip, Empty } from 'antd'
import { EditFilled } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { ReactComponent as FullStarIcon } from '../../../assets/images/fullStar.svg'
import { ReactComponent as EmptyStarIcon } from '../../../assets/images/emptyStar.svg'
import SearchTop from '../../../components/SearchTop'
import useMovie from '../../../hooks/useMovie'
import useComment from '../../../hooks/useComment'
import useUser from '../../../hooks/useUser'
import useScore from '../../../hooks/useScore'
import useLook from '../../../hooks/useLook'
import JudgeStar from '../../../components/JudgeStar.tsx'
import getImg from '../../../lib/getImgUrl'
import styles from './style.module.scss'
import { context } from '../../../hooks/store'
import { IComment, IMovie } from '../../../lib/types'
import { deleteLook } from '../../../services/look'
import { log } from 'console'
import { userInfo } from 'os'

export default function MovieDetail() {
  const navigate = useNavigate()
  const { userInfo } = useContext(context)
  const { id } = useParams()
  const { userLogout, getUserInfo } = useUser()
  const [modalType, setModalType] = useState('create')
  const [score, setScore] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [commentTitle, setCommentTitle] = useState('')
  const [commentContent, setCommentContent] = useState('')
  const { TextArea } = Input
  const [messageApi, contextHolder] = message.useMessage()
  const { movieDetail, getMovieDetail } = useMovie()
  const {
    movieCommentList,
    movieCommentCount,
    movieUserCommentList,
    commentError,
    createComment,
    starComment,
    updateComment,
    deleteComment,
    getMovieCommentList,
    getMovieUserCommentList,
  } = useComment()
  const { createScore, scoreDetail, getScoreDetail } = useScore()
  const {
    getLookDetail,
    getLookList,
    lookDetail,
    lookList,
    lookError,
    createLook,
    deleteLook,
  } = useLook()

  const judgeStatus = (data: [] | undefined) => {
    if (!data) {
      return false
    } else if (data.length === 0) {
      return false
    } else {
      return true
    }
  }

  const handleOk = async () => {
    if (commentTitle === '') {
      return error('请输入标题')
    } else if (commentContent === '') {
      return error('请输入内容')
    }
    if (modalType === 'create') {
      // 创建影评
      await createComment(id as string, commentContent, commentTitle)
    } else if (modalType === 'update') {
      await updateComment({
        movieId: id as string,
        content: commentContent,
        title: commentTitle,
      })
    }

    await getMovieUserCommentList((movieDetail as IMovie)._id)
    await getMovieCommentList({ movieId: id as string, userId: userInfo._id })
    setIsModalOpen(false)
    setCommentTitle('')
    setCommentContent('')
  }

  // const handleLookOk = async () => {}
  const handleCancel = () => {
    setIsModalOpen(false)
    setCommentTitle('')
    setCommentContent('')
  }
  const error = (message: string) => {
    messageApi.open({
      type: 'error',
      content: `${message}`,
    })
  }

  useEffect(() => {
    getMovieDetail(id as string)
    getScoreDetail(id as string)
    getMovieUserCommentList(id as string)
    getMovieCommentList({
      movieId: id as string,
      userId: userInfo._id
    })
    getLookDetail(id as string)
    getUserInfo()
  }, [id])
  return (
    <>
      {contextHolder}
      <SearchTop onSearchTop={(value) => navigate('/searchMovie/' + value)} />
      {movieDetail ? (
        <div className={styles.movie_detail_container}>
          <h2>
            <span className={styles.movie_name}>{movieDetail.name}</span>
            <span className={styles.movie_year}>
              （{movieDetail.publicYear}）
            </span>
          </h2>
          <div className={styles.content}>
            <div className={styles.movie_introduction}>
              <div className={styles.info}>
                <div className={styles.left}>
                  <div className={styles.poster}>
                    <img src={getImg(movieDetail.posterUrl)} alt="" />
                  </div>
                  <div className={styles.detail}>
                    <div className={styles.detail_item}>
                      {movieDetail.director ? (
                        <>
                          <span className={styles.title}>导演:</span>
                          <span className={styles.item_content}>
                            {movieDetail.director.map((item, index) => {
                              if (index === 0) {
                                return <span key={item.avatar}>{item.name}</span>
                              } else {
                                return <span key={item.avatar}> / {item.name}</span>
                              }
                            })}
                          </span>
                        </>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className={styles.detail_item}>
                      {movieDetail.writer ? (
                        <>
                          <span className={styles.title}>编剧:</span>
                          <span className={styles.item_content}>
                            {movieDetail.writer.map((item, index) => {
                              if (index === 0) {
                                return <span key={index}>{item.name}</span>
                              } else {
                                return <span key={index}> / {item.name}</span>
                              }
                            })}
                          </span>
                        </>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className={styles.detail_item}>
                      {movieDetail.actor ? (
                        <>
                          <span className={styles.title}>主演:</span>
                          <span className={styles.item_content}>
                            {movieDetail.actor.map((item, index) => {
                              if (index === 0) {
                                return <span key={index}>{item.name}</span>
                              } else {
                                return <span key={index}> / {item.name}</span>
                              }
                            })}
                          </span>
                        </>
                      ) : (
                        ''
                      )}
                    </div>
                    <div className={styles.detail_item}>
                      <span className={styles.title}>类型:</span>
                      <span className={styles.item_content}>
                        {movieDetail.type}
                      </span>
                    </div>
                    <div className={styles.detail_item}>
                      <span className={styles.title}>制作国家/地区:</span>
                      <span className={styles.item_content}>
                        {movieDetail.country}
                      </span>
                    </div>
                    <div className={styles.detail_item}>
                      <span className={styles.title}>语言:</span>
                      <span className={styles.item_content}>
                        {movieDetail.language}
                      </span>
                    </div>
                    <div className={styles.detail_item}>
                      <span className={styles.title}>上映日期:</span>
                      <span className={styles.item_content}>
                        {movieDetail.publicYear}
                      </span>
                    </div>
                    <div className={styles.detail_item}>
                      <span className={styles.title}>片长:</span>
                      <span className={styles.item_content}>
                        {movieDetail.lengthFilm}分钟
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.right}></div>
              </div>
              <div className={styles.judge}>
                <span>电影评分:</span>
                <JudgeStar
                  judgeScore={movieDetail.filmScore as number}
                  type={false}
                />
                <div>（{movieDetail.commentCount} 人已评价）</div>
              </div>
              {lookDetail ? (
                <div className={styles.unlook}>
                  <span
                    onClick={async () => {
                      await createLook({
                        type: 'want',
                        movieId: id as string,
                      })
                    }}
                  >
                    我{lookDetail.type === 'looked' ? '看过' : '想看'}这部电影
                  </span>
                  <span
                    style={{
                      marginLeft: '10px',
                      marginRight: '10px',
                      color: '#999999',
                    }}
                  >
                    {new Date(lookDetail.cTime).toLocaleDateString()}
                  </span>
                  <span
                    className={styles.unlook_delete}
                    onClick={async () => {
                      await deleteLook(lookDetail._id)
                      await getLookDetail(id as string)
                    }}
                  >
                    删除
                  </span>
                </div>
              ) : (
                <div className={styles.look}>
                  <div>
                    <span
                      className={styles.look_item}
                      onClick={async () => {
                        await createLook({
                          type: 'want',
                          movieId: id as string,
                        })
                        await getLookDetail(id as string)
                      }}
                    >
                      想看
                    </span>
                    <span
                      className={styles.look_item}
                      onClick={async () => {
                        await createLook({
                          type: 'looked',
                          movieId: id as string,
                        })
                        await getLookDetail(id as string)
                      }}
                    >
                      看过
                    </span>
                  </div>
                </div>
              )}
              <div className={styles.undo}>
                {/* 渲染评分或者打分 */}
                {scoreDetail ? (
                  <div>
                    <span>我的评分:</span>
                    <JudgeStar judgeScore={scoreDetail.score} type={false} />
                  </div>
                ) : (
                  <div className={styles.edit}>
                    <span>打分:</span>
                    <div>
                      {score >= 1 ? (
                        <FullStarIcon
                          className={styles.icon_item}
                          onClick={() => {
                            setScore(1)
                          }}
                        />
                      ) : (
                        <EmptyStarIcon
                          className={styles.icon_item}
                          onClick={() => {
                            setScore(1)
                          }}
                        />
                      )}
                      {score >= 2 ? (
                        <FullStarIcon
                          className={styles.icon_item}
                          onClick={() => {
                            setScore(2)
                          }}
                        />
                      ) : (
                        <EmptyStarIcon
                          className={styles.icon_item}
                          onClick={() => {
                            setScore(2)
                          }}
                        />
                      )}
                      {score >= 3 ? (
                        <FullStarIcon
                          className={styles.icon_item}
                          onClick={() => {
                            setScore(3)
                          }}
                        />
                      ) : (
                        <EmptyStarIcon
                          className={styles.icon_item}
                          onClick={() => {
                            setScore(3)
                          }}
                        />
                      )}
                      {score >= 4 ? (
                        <FullStarIcon
                          className={styles.icon_item}
                          onClick={() => {
                            setScore(4)
                          }}
                        />
                      ) : (
                        <EmptyStarIcon
                          className={styles.icon_item}
                          onClick={() => {
                            setScore(4)
                          }}
                        />
                      )}
                      {score >= 5 ? (
                        <FullStarIcon
                          className={styles.icon_item}
                          onClick={() => {
                            setScore(5)
                          }}
                        />
                      ) : (
                        <EmptyStarIcon
                          className={styles.icon_item}
                          onClick={() => {
                            setScore(5)
                          }}
                        />
                      )}
                    </div>
                    {score === 0 ? (
                      ''
                    ) : (
                      <>
                        <span
                          className={styles.operate_item}
                          onClick={async () => {
                            // 添加打分
                            await createScore(movieDetail._id, score * 2)
                            await getScoreDetail(movieDetail._id)
                            await getLookDetail(id as string)
                            await getMovieDetail(id as string)
                            console.log('添加打分', score * 2)
                          }}
                        >
                          打分完成
                        </span>
                        <span
                          className={styles.operate_item}
                          onClick={() => {
                            setScore(0)
                          }}
                        >
                          打分取消
                        </span>
                      </>
                    )}
                  </div>
                )}
                {/* 渲染评论内容 */}
                {movieUserCommentList ? (
                  movieUserCommentList.length !== 0 ? (
                    <div className={styles.my_comment}>
                      <span className={styles.title}>我的影评：</span>
                      {movieUserCommentList.map((item) => {
                        return (
                          <div key={item.cTime}>
                            <header>
                              <div className={styles.comment_title}>
                                {item.title}
                              </div>
                              <div className={styles.comment_edit}>
                                <span
                                  className={styles.edit_item_update}
                                  onClick={() => {
                                    setModalType('update')
                                    setCommentContent(item.content)
                                    setCommentTitle(item.title)
                                    setIsModalOpen(true)
                                    // await updateComment()
                                  }}
                                >
                                  修改
                                </span>
                                <span
                                  className={styles.edit_item_delete}
                                  onClick={async () => {
                                    await deleteComment(item._id)
                                    await getMovieCommentList({
                                      movieId: id as string,
                                      userId: userInfo._id
                                    })
                                    await getMovieUserCommentList(id as string)
                                  }}
                                >
                                  删除
                                </span>
                              </div>
                            </header>
                            <div className={styles.comment_content}>
                              &nbsp;&nbsp;&nbsp;
                              {item.content}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <></>
                  )
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className={styles.movie_plot}>
              <div className={styles.title}>
                {movieDetail.name}的剧情简介······
              </div>
              <div className={styles.content}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {movieDetail.plot}
              </div>
            </div>
            <div className={styles.movie_actors}>
              <div className={styles.title}>
                {movieDetail.name}的演职员······
              </div>
              <div className={styles.content}>
                {movieDetail.director?.map((item) => {
                  return (
                    <div className={styles.actor_item} key={item.avatar}>
                      <div className={styles.img}>
                        <img src={getImg(item.avatar as string)} alt="" />
                      </div>
                      <Tooltip placement='bottom' title={item.name}>
                      <div className={styles.item_name}>{ item.name }</div>
                      </Tooltip>
                      <div className={styles.item_role}>导演</div>
                    </div>
                  )
                })}
                 {movieDetail.actor?.map((item) => {
                  return (
                    <div className={styles.actor_item} key={item.avatar}>
                      <div className={styles.img}>
                        <img src={getImg(item.avatar as string)} alt="" />
                      </div>
                      <Tooltip placement='bottom' title={item.name}>
                      <div className={styles.item_name}>{ item.name }</div>
                      </Tooltip>
                      <div className={styles.item_role}>演员</div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className={styles.movie_comment}>
              <div className={styles.title}>
                <span className={styles.name}>
                  {movieDetail.name}的影评······
                </span>
                <div
                  className={styles.comment_edit}
                  onClick={() => {
                    setModalType('create')
                    setIsModalOpen(true)
                  }}
                >
                  <EditFilled />
                  <span style={{ marginLeft: '4px' }}>我要写影评</span>
                </div>
              </div>
              <div className={styles.content}>
                {/* 渲染当前电影影评 */}
                {movieCommentCount !== 0 ? (
                  movieCommentList?.map((item) => {
                    return (
                      <div className={styles.comment_item} key={item._id}>
                        <header>
                          <div className={styles.user}>
                            {item.user.nickname}
                          </div>
                          <div className={styles.score}>
                            {item.score === 0 ? (
                              <></>
                            ) : (
                              <>
                                <JudgeStar
                                  judgeScore={item.score}
                                  type={true}
                                />
                              </>
                            )}
                          </div>
                          <div className={styles.time}>
                            {new Date(item.mTime).toLocaleDateString()}{' '}
                            {new Date(item.mTime).toLocaleTimeString()}
                          </div>
                          <div className={styles.position}>
                            {item.user.basePosition}
                          </div>
                          <div className={styles.empty}></div>
                          <div className={styles.use}>
                            <span style={{ color: '#111111' }}>
                              {item.usefulCount}
                            </span>
                            {item.isLike ? (
                              <span style={{ color: '#666666' }}>已投票</span>
                            ) : (
                              <span
                                className={styles.comment_use}
                                onClick={async () => {
                                  console.log('item', item)
                                  await starComment(item._id)
                                  await getMovieCommentList({
                                    movieId: id as string,
                                    userId: userInfo._id
                                  })
                                }}
                              >
                                有用
                              </span>
                            )}
                          </div>
                        </header>
                        <div className={styles.comment_item_content}>
                          {item.content}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div
                    style={{
                      height: '50px',
                      lineHeight: '50px',
                      textAlign: 'center',
                      fontSize: '12px',
                      color: '#666666',
                    }}
                  >
                    {' '}
                    <span>暂无影评，快来抢占影评第一宝座啊！</span>{' '}
                  </div>
                )}
              </div>
              {/* <div
                className={styles.movie_more}
                onClick={() => {
                  console.log('加载更多')
                }}
              >
                加载更多
              </div> */}
            </div>
          </div>
          <Modal
            title={`${movieDetail.name}${
              modalType === 'create' ? '影评撰写' : '影评修改'
            }`}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            className={styles.modal_comment}
          >
            <div
              style={{
                display: 'flex',
                gap: '2px',
                alignItems: 'center',
                marginBottom: '15px',
              }}
            >
              <span>标题：</span>
              <Input
                type="text"
                value={commentTitle}
                maxLength={80}
                placeholder="影评标题"
                style={{ flex: '1' }}
                onChange={(e) => setCommentTitle(e.target.value.trim())}
              />
            </div>
            <div style={{ display: 'flex', gap: '2px', marginBottom: '15px' }}>
              <span>内容：</span>
              <TextArea
                value={commentContent}
                rows={4}
                placeholder="输入影评内容"
                style={{ flex: '1' }}
                onChange={(e) => setCommentContent(e.target.value.trim())}
              />
            </div>
          </Modal>
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </>
  )
}
