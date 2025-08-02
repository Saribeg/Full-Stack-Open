import { useState } from "react"
import { useQuery } from "@apollo/client"
import { ALL_AUTHORS } from '../graphql/operations'
import AuthorBirthForm from './AuthorBirthForm'

const Authors = (props) => {
  const [page, setPage] = useState(1);
  const limit = 20;
  const { data, loading } = useQuery(ALL_AUTHORS, {
    variables: { offset: (page - 1) * limit, limit }
  });

  if (!props.show) {
    return null
  }

  if (loading) {
    return <div>Loading...</div>
  }

  const authors = data?.allAuthors ?? []
  const authorCount = data?.authorCount ?? 0
  const pagesCount = Math.ceil(authorCount / 20)
  const pages = Array.from({ length: pagesCount }, (_, i) => i + 1)

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
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul style={{ display: 'flex', margin: '20px 0', listStyleType: 'none', gap: '10px' }}>
        <li key="pagination-prev-button">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
        </li>
        
        {pages.map(p => (
          <li key={p} onClick={() => setPage(p)} >
            <button
              onClick={() => setPage(p)}
              style={{ fontWeight: page === p ? 'bold' : 'normal' }}
            >
              {p}
            </button>
          </li>
        ))}

        <li key="pagination-next-button">
          <button disabled={page === pagesCount} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </li>
      </ul>

      { props.token ? <AuthorBirthForm authors={authors}/> : null}
    </div>
  )
}

export default Authors
