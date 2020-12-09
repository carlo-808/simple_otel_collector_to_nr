const express = require('express')

const app = express()

const PORT = 9090

app.get('/', (req, res) => {
  res.send('Chrimbus!')
})

app.listen(PORT, () => {
  console.log(`app listening at port: ${PORT}`)
})
