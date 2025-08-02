import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_BOOK } from '../graphql/operations';
import { updateCachesAfterBookAdded } from '../graphql/cache/handleNewBookCaches';

const NewBook = (props) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  const [createBook] = useMutation(CREATE_BOOK, {
    update: (cache, { data }) => {
      const addedBook = data.addBook;
      updateCachesAfterBookAdded(cache, addedBook);
    },
    onCompleted: () => {
      setTitle('');
      setPublished('');
      setAuthor('');
      setGenres([]);
      setGenre('');
    },
    onError: () => {}
  });


  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();
    createBook({  variables: { title, author, published: Number(published), genres } });
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre('');
  };

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
  );
};

export default NewBook;