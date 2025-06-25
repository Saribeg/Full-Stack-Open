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

app.get('/api/persons', async (req, res, next) => {
  try {
    const persons = await Person.find({})
    res.json(persons)
  } catch (err) {
    next(err)
  }
})

app.get('/info', async (req, res, next) => {
  try {
    const count = await Person.countDocuments({})

    res.send(`
      <p>Phonebook has info for ${count} people.</p>
      <p>${new Date().toString()}</p>
    `)
  } catch (err) {
    next(err)
  }
})

app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id)

    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  } catch(err) {
    next(err)
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
        context: 'query' // For correct work of custom validators
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