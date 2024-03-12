// const fs = require('fs')
import fs from 'fs'
import * as movieServices from '../services/movies'
const  { create } = require('../services/movies')
export default async function run() {
  const data = fs.readFileSync('./src/libs/data.json', 'utf-8')
  let newData = JSON.parse(data)
  // console.log(newData, 'data');
  for (let item of newData) {
    await movieServices.create(item)
  }
}