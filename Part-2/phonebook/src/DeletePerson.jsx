import personService from './services/persons'

const DeletePerson = ({ person, setPersons }) => {
  const deletePerson = (person) => {
    const { id, name } = person

    if (window.confirm(`Delete ${name}?`)) {
      personService
        .deletePerson(id)
        .then(deletedPerson => {
          setPersons(prev => prev.filter(person => person.id !== deletedPerson.id))
        })
    }
  }

  return <button onClick={() => deletePerson(person)}>Delete</button>
}

export default DeletePerson