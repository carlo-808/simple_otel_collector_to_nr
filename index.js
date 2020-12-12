const express = require('express')
const metricsMiddleware = require('./metrics')

const app = express()

const PORT = 9123

app.use(metricsMiddleware())

app.get('/', (req, res) => {
  res.send('Route1')
})

app.get('/two', (req, res) => {
  res.send('Route2')
})

app.listen(PORT, () => {
  console.log(`app listening at port: ${PORT}`)
})
