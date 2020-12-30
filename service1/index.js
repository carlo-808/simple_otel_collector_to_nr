'use strict'
const express = require('express')
const metricsMiddleware = require('./metrics')
const randomWords = require('random-words')
const http = require('http')

const app = express()

const PORT = 9123

const doRequest = (options) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      res.setEncoding('utf8')
      let responseBody = ''

      res.on('data', (chunk) => {
        responseBody += chunk
      })

      res.on('end', () => {
        resolve(responseBody)
      })
    })

    req.on('error', (err) => {
      console.log(err)
      reject(err)
    })

    req.end()
  })
}

app.use(metricsMiddleware())

app.get('/', (req, res) => {
  res.json({
    ponyId: Math.floor(Math.random()*Math.exp(20)),
    name: randomWords({exactly:1, wordsPerString:2, separator:'-'})[0]
  })
})

app.get('/callServiceTwo', async (req, res) => {
  const results = await doRequest({
    hostname: 'service_two',
    port: 9124,
    path: '/ponies',
    method: 'GET'
  })

  res.send(results)
})

app.get('/err', (req, res) => {
  const j = joker
})

app.get('/two', (req, res) => {
  res.json({
    HowManyPonies: Math.floor(Math.random()*Math.exp(5))
  })
})

app.listen(PORT, () => {
  console.log(`app listening at port: ${PORT}`)
})
