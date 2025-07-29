import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { SET_BIRTH_YEAR, ALL_AUTHORS } from '../queries'

const AuthorBirthForm = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [setBirthYear] = useMutation(SET_BIRTH_YEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const submit = (e) => {
    e.preventDefault()
    setBirthYear({
      variables: {
        name,
        setBornTo: Number(born)
      }
    })
    setName('')
    setBorn('')
  }

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={(e) => setBorn(e.target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default AuthorBirthForm