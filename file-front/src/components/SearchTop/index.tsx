import { Input } from 'antd'
import styles from  './style.module.scss'

interface IProps {
  onSearchTop: (value: string) => void
  // keyword: string
}

export default function SearchTop({onSearchTop}: IProps) {
  const { Search } = Input

  const onSearch = (value: string) => {
    if (value.trim()  === '') return
    onSearchTop(value.trim())
  }

  return (
    <div className={styles.search_top_container}>
      <div className={styles.header_content}>
      <div className={styles.website_name}>好看电影</div>
      <div className={styles.search}>
        <Search
        // value={keyword}
          placeholder="搜索电影"
          onSearch={onSearch}
          // size="large"
          enterButton
        />
      </div>
    </div>
    </div>
  )
}
