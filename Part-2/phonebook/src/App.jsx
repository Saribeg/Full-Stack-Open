import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', phone: '39-44-5323523' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')

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

    setPersons(persons.concat({ name: newName, phone: newPhone }))
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>name: <input value={newName} onChange={onNameChange}/></div>
        <div>number: <input value={newPhone} onChange={onPhoneChange}/></div>
        <div><button type="submit">add</button></div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map(person =>
          <li key={person.name}>{person.name}: {person.phone}</li>
        )}
      </ul>
    </div>
  )
}

export default App