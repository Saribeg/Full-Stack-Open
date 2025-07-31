import { useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client"
import Select from 'react-select';
import { ALL_BOOKS } from '../queries'


const Books = (props) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const { data: allBooksData, loading: allBooksLoading } = useQuery(ALL_BOOKS); // All books and genres
  const [fetchBooksByGenre, { data: filteredData, loading: filteredLoading }] = useLazyQuery(ALL_BOOKS);

  const handleGenreChange = (option) => {
    setSelectedOption(option);
    if (option) {
      fetchBooksByGenre({ variables: { genre: option.value } });
    }
  };


  if (!props.show) return null
  if (selectedOption && filteredLoading) return <div>Loading...</div>;

  const allBooks = allBooksData?.allBooks ?? [];
  const booksToShow = selectedOption ? (filteredData?.allBooks ?? []) : allBooks;
  const genreOptions = Array.from(new Set(allBooks.flatMap(b => b.genres))).map(g => ({ value: g, label: g }));

  return (
    <div>
      <h2>books</h2>
      <p>in genre</p>
      <Select
        defaultValue={selectedOption}
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
          {booksToShow.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
