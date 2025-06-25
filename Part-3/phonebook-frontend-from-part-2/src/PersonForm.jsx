import personService from './services/persons'

const PersonForm = ({ formState }) => {
  const {
    newName,
    setNewName,
    newPhone,
    setNewPhone,
    persons,
    setPersons,
    showNotification
  } = formState

  const onNameChange = (event) => {
    setNewName(event.target.value)
  }

  const onPhoneChange = (event) => {
    setNewPhone(event.target.value)
  }

  const resetForm = () => {
    setNewName('')
    setNewPhone('')
  }

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        const personToUpdate = {
          ...existingPerson,
          number: newPhone
        }

        personService
          .update(existingPerson.id, personToUpdate)
          .then(updatedPerson => {
            setPersons(persons.map(person => person.id === updatedPerson.id ? updatedPerson : person))
            resetForm()
            showNotification(`Number for ${updatedPerson.name} is updated`, 'success')
          })
          .catch(error => {
            if (error.status === 404) {
              showNotification(`Information of ${existingPerson.name} has already been removed from server`, 'error')
            } else {
              showNotification(`Could not update the person with id ${existingPerson.id}. ${error.response.data.error}`, 'error')
            }
          })
      } else {
        showNotification(`${newName} is already added to phonebook. Won't duplicate.`, 'error')
      }

      return
    }

    const personObject = {
      name: newName,
      number: newPhone
    }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        resetForm()
        showNotification(`${returnedPerson.name} is created`, 'success')
      })
      .catch(error => {
        showNotification(`Could not add the person ${personObject.name}. ${error.response.data.error}`, 'error')
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