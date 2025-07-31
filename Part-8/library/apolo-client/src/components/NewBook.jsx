import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK, BOOKS_BY_GENRE } from '../queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

const [createBook] = useMutation(CREATE_BOOK, {
  update: (cache, { data }) => {
    const addedBook = data.addBook;

    cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
      return { allBooks: allBooks.concat(addedBook) };
    });

    addedBook.genres.forEach((genre) => {
      cache.updateQuery(
        {
          query: BOOKS_BY_GENRE,
          variables: { genre },
        },
        (data) => {
          if (!data) return;
          return {
            allBooks: data.allBooks.concat(addedBook),
          };
        }
      );
    });
  },
  refetchQueries: [{ query: ALL_AUTHORS }],
  onCompleted: () => {
    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }
});


  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    createBook({  variables: { title, author, published: Number(published), genres } })
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook