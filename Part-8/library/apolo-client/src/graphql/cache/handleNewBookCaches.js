import { ALL_BOOKS, BOOKS_BY_GENRE, ALL_AUTHORS } from '../operations'

const uniqById = (books) => {
  const seen = new Set()
  return books.filter((book) => {
    if (seen.has(book.id)) return false
    seen.add(book.id)
    return true
  })
}

export const updateCachesAfterBookAdded = (cache, addedBook) => {
  cache.updateQuery({ query: ALL_BOOKS }, (data) => {
    if (!data) return
    return {
      allBooks: uniqById(data.allBooks.concat(addedBook))
    }
  })

  if (addedBook.genres) {
    addedBook.genres.forEach((genre) => {
      cache.updateQuery({
        query: BOOKS_BY_GENRE,
        variables: { genre },
      }, (data) => {
        if (!data) return
        return {
          allBooks: uniqById(data.allBooks.concat(addedBook))
        }
      })
    })
  }

  if (addedBook.author) {
    cache.updateQuery({ query: ALL_AUTHORS }, (data) => {
      const authors = data.allAuthors;
      const isExists = authors.some(a => a.name === addedBook.author.name);

      if (isExists) {
        return {
          allAuthors: authors.map(a => a.name === addedBook.author.name ? { ...a, bookCount: a.bookCount + 1 } : a)
        }
      }

      return {
        allAuthors: authors.concat({ ...addedBook.author, bookCount: 1 })
      }
    })
  }
}
