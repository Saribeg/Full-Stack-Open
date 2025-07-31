import { useQuery } from "@apollo/client"
import { BOOKS_BY_GENRE } from '../graphql/operations'

const RecommendedBooks = ({ user, show }) => {
  const { data, loading } = useQuery(BOOKS_BY_GENRE, {
    variables: user ? { genre: user.favoriteGenre } : {},
  });

  const books = data?.allBooks ?? [];

  if (!show) return null;
  if (loading) return <div>Loading...</div>;

    return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favourite genre: <b>{user.favoriteGenre}</b></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
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

export default RecommendedBooks;