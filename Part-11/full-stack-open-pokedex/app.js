const express = require('express')
const app = express()

// Get the port from env variable.
const PORT = process.env.PORT || 5000

app.use(express.static('dist'))

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server started on port ${PORT}`)
})

app.get('/version', (req, res) => {
  res.send('1')
})

app.get('/health', (req, res) => {
  res.send('ok')
})

// let counter = 0

// app.get('/periodic-health', (req, res) => {
//   counter++
//   if (counter % 10 === 0) {
//     res.status(500).send('simulated error')
//   } else {
//     res.send('ok')
//   }
// })

let toggle = false

app.get('/periodic-health', (req, res) => {
  toggle = !toggle
  if (toggle) {
    res.send('ok')
  } else {
    res.status(500).send('simulated error')
  }
})