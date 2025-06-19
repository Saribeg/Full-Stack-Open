import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filterPhrase, setNewFilterPhrase] = useState('')

  const onFilterChange = (event) => {
    setNewFilterPhrase(event.target.value)
  }

  const onNameChange = (event) => {
    setNewName(event.target.value)
  }

  const onPhoneChange = (event) => {
    setNewPhone(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault();
    const isPersonAlreadyExists = persons.find(person => person.name === newName)

    if (isPersonAlreadyExists) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    setPersons(persons.concat({ name: newName, number: newPhone }))
  }

  const personsToShow = filterPhrase
  ? persons.filter(person =>
      person.name.toLowerCase().includes(filterPhrase.toLowerCase())
    )
  : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <div>Filter shown with: <input value={filterPhrase} onChange={onFilterChange}/></div>
      <h2>Add a new</h2>
      <form onSubmit={addPerson}>
        <div>name: <input value={newName} onChange={onNameChange}/></div>
        <div>number: <input value={newPhone} onChange={onPhoneChange}/></div>
        <div><button type="submit">add</button></div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {personsToShow.map(person =>
          <li key={person.name}>{person.name}: {person.number}</li>
        )}
      </ul>
    </div>
  )
}

export default App