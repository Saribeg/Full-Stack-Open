const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(cors())
app.use(express.static('dist'))

let persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

const generateId = () => {
  return Math.floor(Math.random() * 10000000).toString()
}

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people.</p>
    <p>${new Date().toString()}</p>
  `)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const relevantPerson = persons.find(person => person.id === id)

  if (relevantPerson) {
    res.json(relevantPerson)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const deletedPerson = persons.find(person => person.id === id)
  persons = persons.filter(person => person.id !== id)

  // I am sending back deleted person instead of res.status(204).end() because my frontend uses that data
  res.status(200).json(deletedPerson)
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({ 
      error: 'The name of person is required' 
    })
  }

  if (!body.number) {
    return res.status(400).json({ 
      error: 'The telephone number of person is required' 
    })
  }

  if (persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())) {
    return res.status(400).json({ 
      error: 'The name of a person must be unique' 
    })
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(newPerson)

  res.status(201).json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})