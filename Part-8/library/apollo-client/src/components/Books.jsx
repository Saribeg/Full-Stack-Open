import { useState } from 'react';
import Select from 'react-select';
import { useQuery } from '@apollo/client';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ALL_BOOKS, ALL_GENRES } from '../graphql/operations';

const Books = ({ show }) => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const { data: genresData, loading: genresLoading } = useQuery(ALL_GENRES);

  const {
    data: booksData,
    loading: booksLoading,
    fetchMore,
    refetch,
  } = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre?.value ?? null, first: 30 }
  });

  const books = booksData?.allBooks?.edges.map((e) => e.node) ?? [];
  const endCursor = booksData?.allBooks?.pageInfo?.endCursor;
  const hasMore = booksData?.allBooks?.pageInfo?.hasNextPage ?? false;

  const defaultOption = { value: null, label: 'All genres' };
  const genreOptions = genresData?.allGenres.map((g) => ({
    value: g,
    label: g,
  })) ?? [];
  const allOptions = [defaultOption, ...genreOptions];

  const loadMore = () => {
    if (!hasMore) return;
    fetchMore({
      variables: {
        genre: selectedGenre?.value ?? null,
        first: 20,
        after: endCursor,
      },
    });
  };

  const handleGenreChange = (selected) => {
    setSelectedGenre(selected?.value ? selected : null);
    refetch({ genre: selected?.value ?? null, first: 30 });
  };

  if (!show || genresLoading || booksLoading) return null;

  return (
    <div>
      <h2>books</h2>
      <p>in genre</p>
      <Select
        onChange={handleGenreChange}
        options={allOptions}
        placeholder="Filter by genre"
        isClearable
        value={selectedGenre ?? defaultOption}
      />
      <InfiniteScroll
        dataLength={books.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more books</p>}
      >
        <table>
          <thead>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
};

export default Books;