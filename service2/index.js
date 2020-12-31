'use strict'
const express = require('express')
const metricsMiddleware = require('./metrics')
const randomWords = require('random-words')
const http = require('http')

const app = express()

const PORT = 9124

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
    name: randomWords({exactly:1, wordsPerString:2, separator:'-'})[0]
  })
})

app.get('/ponies', async (req, res) => {
  const results = await doRequest(getService1Opts())

  res.send(results)
})

app.get('/callServiceOneErr', async (req, res) => {
  const results = await doRequest({
    hostname: 'service_one',
    port: 9123,
    path: '/err',
    method: 'GET'
  })

  res.send('woopsie')
})

app.get('/callServiceThree', async (req, res) => {
  const results = await doRequest({
    hostname: 'service_three',
    port: 9125,
    path: '/',
    method: 'GET'
  })

  res.send(results)
})

app.listen(PORT, () => {
  console.log(`app listening at port: ${PORT}`)
})

