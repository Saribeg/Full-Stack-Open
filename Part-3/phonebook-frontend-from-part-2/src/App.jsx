import { useState, useEffect } from 'react'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'
import Notification from './Notification'

import personService from './services/persons'

import './index.css'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filterPhrase, setFilterPhrase] = useState('')
  const [notification, setNotification] = useState('')
  const [notificationType, setNotificationType] = useState('')

  const showNotification = (message, messageType) => {
    setNotification(message)
    setNotificationType(messageType)

    setTimeout(() => {
      setNotification('')
      setNotificationType('')
    }, 5000)
  }

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        showNotification(`Could not retrieve persons. ${error.message}`, 'error')
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} messageType={notificationType}/>
      <Filter filterPhrase={filterPhrase} setFilterPhrase={setFilterPhrase} />
      <h2>Add a new</h2>
      <PersonForm formState={{ newName, setNewName, newPhone, setNewPhone, persons, setPersons, showNotification }} />
      <h2>Numbers</h2>
      <Persons filterPhrase={filterPhrase} persons={persons} setPersons={setPersons} showNotification={showNotification}/>
    </div>
  )
}

export default App