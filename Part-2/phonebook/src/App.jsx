import { useState, useEffect } from 'react'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'

import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filterPhrase, setFilterPhrase] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

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