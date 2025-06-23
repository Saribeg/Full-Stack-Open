import Person from './Person'

const Persons = ({ filterPhrase, persons, setPersons, showNotification }) => {
  const personsToShow = filterPhrase
  ? persons.filter(person =>
      person.name.toLowerCase().includes(filterPhrase.toLowerCase())
    )
  : persons

  return (
    <ul>{personsToShow.map(person => <Person key={person.name} person={person} setPersons={setPersons} showNotification={showNotification}/>)}</ul>
  )
}

export default Persons