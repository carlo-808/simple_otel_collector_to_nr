'use strict'
const express = require('express')
const metricsMiddleware = require('./metrics')
const randomWords = require('random-words')
const http = require('http')

const app = express()

const PORT = 9125

const getService1Opts = () => {
  return {
    hostname: 'service_one',
    port: 9123,
    path: '/two',
    method: 'GET'
  }
}

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
    pony: randomWords({exactly:1, wordsPerString:3, separator:'-'})[0]
  })
})

app.get('/ponies', async (req, res) => {
  const results = await doRequest(getService1Opts())

  res.send(results)
})

app.listen(PORT, () => {
  console.log(`app listening at port: ${PORT}`)
})

