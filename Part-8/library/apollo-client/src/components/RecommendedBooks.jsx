import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../graphql/operations';

const RecommendedBooks = ({ user, show }) => {
  const { data, loading } = useQuery(ALL_BOOKS, {
    variables: { genre: user?.favoriteGenre },
    skip: !user?.favoriteGenre
  });

  const books = data?.allBooks?.edges.map((e) => e.node) ?? [];

  if (!show) return null;
  if (!user?.favoriteGenre) {
    return (
      <p>
        books in your favourite genre: <b>{user?.favoriteGenre ?? 'not set'}</b>
      </p>
    );
  }
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
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecommendedBooks;