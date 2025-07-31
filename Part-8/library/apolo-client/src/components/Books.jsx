import { useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client"
import Select from 'react-select';
import { ALL_BOOKS, BOOKS_BY_GENRE } from '../graphql/operations'


const Books = (props) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const { data: allBooksData, loading: allBooksLoading } = useQuery(ALL_BOOKS); // All books and genres
  const [fetchBooksByGenre, { data: filteredData, loading: filteredLoading }] = useLazyQuery(BOOKS_BY_GENRE, { fetchPolicy: 'cache-and-network' });

  const handleGenreChange = (option) => {
    setSelectedOption(option);
    if (option) {
      fetchBooksByGenre({ variables: { genre: option.value } });
    }
  };


  if (!props.show) return null
  if (selectedOption && filteredLoading) return <div>Loading...</div>;

  const allBooks = allBooksData?.allBooks ?? [];
  const booksToShow = filteredData?.allBooks && selectedOption ? (filteredData?.allBooks ?? []) : allBooks;
  const genreOptions = allBooks.length > 0
    ? Array.from(new Set(allBooks.flatMap(b => b.genres)))
        .map(g => ({ value: g, label: g }))
    : [];


  return (
    <div>
      <h2>books</h2>
      <p>in genre</p>
      <Select
        onChange={handleGenreChange}
        options={genreOptions}
        placeholder="Filter by genre"
      />
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
