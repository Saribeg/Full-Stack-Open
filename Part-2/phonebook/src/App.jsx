import { useState } from 'react'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filterPhrase, setFilterPhrase] = useState('')

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterPhrase={filterPhrase} setFilterPhrase={setFilterPhrase} />
      <h2>Add a new</h2>
      <PersonForm formState={{ newName, setNewName, newPhone, setNewPhone, persons, setPersons }} />
      <h2>Numbers</h2>
      <Persons filterPhrase={filterPhrase} persons={persons}/>
    </div>
  )
}

export default App