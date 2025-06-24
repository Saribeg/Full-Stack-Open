require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const errorHandler = require('./middlewares/errorHandler')
require('./db/connection')()
const Person = require('./models/person')

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

app.get('/api/persons', async (req, res, next) => {
  try {
    const persons = await Person.find({})
    res.json(persons)
  } catch (err) {
    next(err)
  }
})

app.get('/info', (req, res, next) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people.</p>
    <p>${new Date().toString()}</p>
  `)
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const relevantPerson = persons.find(person => person.id === id)

  if (relevantPerson) {
    res.json(relevantPerson)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    const deletedPerson = await Person.findByIdAndDelete(req.params.id)

    if (!deletedPerson) {
      return res.status(404).json({ error: 'Person not found' })
    }

    // I am sending back deleted person instead of res.status(204).end() because my frontend uses that data
    res.status(200).json(deletedPerson)
  } catch (err) {
    next(err)
  }
})

app.post('/api/persons', async (req, res, next) => {
  const { name, number } = req.body

  if (!name) {
    return res.status(400).json({ 
      error: 'The name of person is required' 
    })
  }

  if (!number) {
    return res.status(400).json({ 
      error: 'The telephone number of person is required' 
    })
  }

  try {
    const newPerson = new Person({
      name,
      number
    })

    const savedPerson = await newPerson.save()
  
    res.status(201).json(savedPerson)
  } catch (err) {
    next(err)
  }
})

app.put('/api/persons/:id', async (req, res, next) => {
  const { name, number } = req.body

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      { name, number },
      {
        new: true,           // Return updated document
        runValidators: true, // Apply schema validations when updating
      }
    )

    if (!updatedPerson) {
      return res.status(404).json({ error: 'Person not found' })
    }

    res.json(updatedPerson)
  } catch (error) {
    next(error)
  }
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})