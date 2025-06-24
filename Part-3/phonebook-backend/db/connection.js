const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const connectToDatabase = async () => {
  const url = process.env.MONGODB_URI
  console.log('connecting to', url)

  try {
    await mongoose.connect(url)
    console.log('connected to MongoDB')
  } catch (error) {
    console.error('error connecting to MongoDB:', error.message)
  }
}

  module.exports = connectToDatabase