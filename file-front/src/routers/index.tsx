import Main from '../pages/Main'
import Login from '../pages/Login'
import Register from '../pages/Register'
import MovieList from '../pages/Main/MovieList'
import MovieDetail from '../pages/Main/MovieDetail'
import MovieHot from '../pages/Main/MovieHot'
import MovieOpen from '../pages/Main/MovieOpen'
import UserHome from '../pages/UserHome'
import AccountManagement from '../pages/AccountManagement'
import Search from '../pages/Main/Search'
const routerConfig = [
  {
    path: '',
    element: <Main />,
    children: [
      {
        path: '',
        element: <MovieList />,
      },
      {
        path: '/movieDetail/:id',
        element: <MovieDetail />,
      },
      {
        path: '/movieHot',
        element: <MovieHot />,
      },
      {
        path: '/movieOpen',
        element: <MovieOpen />,
      },
      {
        path: '/searchMovie/:keyword',
        element: <Search />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/account/setting',
    element: <AccountManagement />
  },
  {
    path: '/user/home',
    element: <UserHome />
  }
]

export default routerConfig
