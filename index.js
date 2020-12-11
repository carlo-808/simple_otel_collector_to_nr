const express = require('express')
const metricsMiddleware = require('./metrics')

const app = express()

const PORT = 9321

app.use(metricsMiddleware())

app.get('/', (req, res) => {
  res.send('Chrimbus!')
})

app.get('/monolith', (req, res) => {
  res.send('yup')
})

app.listen(PORT, () => {
  console.log(`app listening at port: ${PORT}`)
})
