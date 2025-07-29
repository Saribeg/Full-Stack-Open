import { useQuery } from "@apollo/client"
import { ALL_AUTHORS } from '../queries'
import AuthorBirthForm from './AuthorBirthForm'

const Authors = (props) => {
  const { data, loading } = useQuery(ALL_AUTHORS)

  if (!props.show) {
    return null
  }

  if (loading) {
    return <div>Loading...</div>
  }

  const authors = data?.allAuthors ?? []

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <AuthorBirthForm />
    </div>
  )
}

export default Authors
