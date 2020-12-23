'use strict'
const express = require('express')
const metricsMiddleware = require('./metrics')
const randomWords = require('random-words')
const http = require('http')

const app = express()

const PORT = 9123

app.use(metricsMiddleware())

app.get('/', (req, res) => {
  res.json({
    ponyId: Math.floor(Math.random()*Math.exp(20)),
    name: randomWords({exactly:1, wordsPerString:2, separator:'-'})[0]
  })
})

app.get('/two', (req, res) => {
  res.json({
    HowManyPonies: Math.floor(Math.random()*Math.exp(5))
  })
})

app.listen(PORT, () => {
  console.log(`app listening at port: ${PORT}`)
})
