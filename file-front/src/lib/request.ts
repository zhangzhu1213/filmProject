import axios from 'axios'
import { message } from 'antd'
const instance = axios.create({
  baseURL: '/api',
  validateStatus: (status) => status < 500,
  withCredentials: false,
})

const error = () => {
  message.open({
    type: 'error',
    content: '用户未登录，请先登录！',
    duration: 2,
  })
}

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // if (res.config.url !== '/user/register') {
    //   // 当前路由不在登录以及注册页面，并且返回状态码为未登录或会话不存在时，跳转登录页面
    //   if (
    //     window.location.pathname !== '/login' &&
    //     window.location.pathname !== '/register' &&
    //     (res.data.code === 40001 || res.data.code === 20006)
    //   ) {
    //     window.location.href = '/login'
    //   }

    //   // 当前路由在登录或注册页面，并且返回的状态码为成功时，跳转首页
    //   // 注册页面有个获取用户详细信息的接口，因此状态码会为真，无法作为判断是否注册成功的依据
    //   if (
    //     (window.location.pathname === '/login' && res.data.code === 0) ||
    //     (window.location.pathname === '/register' && res.data.data.account)
    //   ) {
    //     window.location.href = '/'
    //   }
    // }
    console.log(res.config, 'ddd')
    const url = res.config.url?.split('?')[0]
    console.log(url, res.data.code,  'lll');
    
    if (res.data.code === 20006 || res.data.code === 40001) {
      if (
        url === '/user/info' ||
        url === '/comment/movieUserComment/list' ||
        url === '/score/detail' ||
        url === '/look/list' ||
        url === '/look/detail'
      ) {
        // if (res.data.code === 20006 || res.data.code === 40001) {
        //   error()
        //   // console.log(window.location.pathname, 'pathname');
        //   localStorage.setItem('loginTo', JSON.stringify({status: true}))
        //   window.location.href = '/login'
        // }
      } else {
        error()
        window.location.href = '/login'
        // localStorage.setItem('loginTo', JSON.stringify(true))
      }
    }

    return res
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance
