import personService from './services/persons'

const DeletePerson = ({ person, setPersons, showNotification }) => {
  const deletePerson = (person) => {
    const { id, name } = person

    if (window.confirm(`Delete ${name}?`)) {
      personService
        .deletePerson(id)
        .then(deletedPerson => {
          setPersons(prev => prev.filter(person => person.id !== deletedPerson.id))
          showNotification(`${deletedPerson.name} is deleted`, 'success')
        })
        .catch(error => {
          showNotification(`Could not delete person with id ${id}. ${error.message}`, 'error')
        })
    }
  }

  return <button onClick={() => deletePerson(person)}>Delete</button>
}

export default DeletePerson