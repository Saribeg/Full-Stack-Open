import personService from './services/persons'

const PersonForm = ({ formState }) => {
  const { newName, setNewName, newPhone, setNewPhone, persons, setPersons } = formState

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

    const newPerson = {
      name: newName,
      number: newPhone
    }

    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewPhone('')
      })
  }

  return (
    <form onSubmit={addPerson}>
      <div>name: <input value={newName} onChange={onNameChange}/></div>
      <div>number: <input value={newPhone} onChange={onPhoneChange}/></div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

export default PersonForm