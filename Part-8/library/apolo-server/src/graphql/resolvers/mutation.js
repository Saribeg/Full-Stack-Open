const Author = require('../../models/author')
const Book = require('../../models/book')

module.exports = {
  addBook: async (_root, args) => {
    let author = await Author.findOne({ name: args.author })

    if (!author) {
      author = new Author({ name: args.author })
      await author.save()
    }

    const book = new Book({ ...args, author: author._id })
    await book.save()

    return book.populate('author')
  },

  editAuthor: async (_root, { name, setBornTo }) => {
    const author = await Author.findOne({ name })
    if (!author) return null

    author.born = setBornTo
    await author.save()

    return author
  }
}
