import { useState } from 'react'
import { ReactComponent as FullStarIcon } from '../../assets/images/fullStar.svg'
import { ReactComponent as EmptyStarIcon } from '../../assets/images/emptyStar.svg'
import { ReactComponent as HalfStarIcon } from '../../assets/images/halfStar.svg'
import styles from './style.module.scss'

interface IProps {
  judgeScore: number
  type: boolean
}

export default function JudgeStar({ judgeScore, type }: IProps) {
  const typeArray = ['很差', '较差', '还行', '推荐', '力荐']
  const judge = (value: number) => {
    if (judgeScore > value - 2 && judgeScore <= value - 1) {
      return <HalfStarIcon />
    } else if (judgeScore > value - 1) {
      return <FullStarIcon />
    } else {
      return <EmptyStarIcon />
    }
  }

  return (
    <>
      <div className={styles.star_container}>
        {judgeScore === 0 ? (
          <div className={styles.no_score}>暂无评分</div>
        ) : (
          <ul className={styles.list}>
            <li>{judge(2)}</li>
            <li>{judge(4)}</li>
            <li>{judge(6)}</li>
            <li>{judge(8)}</li>
            <li>{judge(10)}</li>
            {type ? (
              <li>
                <span className={styles.score}>
                  {typeArray[judgeScore / 2 - 1]}
                </span>
              </li>
            ) : (
              <li>
                <span className={styles.score}>{judgeScore}</span>
              </li>
            )}
          </ul>
        )}
      </div>
    </>
  )
}
