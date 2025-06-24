const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: `Mongoose validation error: ${err.message}` })
  }

  next(err)
}

module.exports = errorHandler