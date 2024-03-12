import axios from 'axios'

import { API_KEY, API_URL, BACKDROP_SIZE, POSTER_SIZE } from './config'

async function getData() {

  const {data} = await axios.get(`${API_URL}movie/popular?api_key=${API_KEY}&page=1&language=zh-CN`)

  console.log(data);
  
  
}

export async function getMovieList(page: number = 1) {
  const data = await axios.get(`${API_URL}movie/now_playing?api_key=${API_KEY}&page=${page}&language=zh-CN`)
  console.log(data, 'imdb');
}