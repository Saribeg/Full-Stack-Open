import Person from './Person'

const Persons = ({ filterPhrase, persons }) => {
  const personsToShow = filterPhrase
  ? persons.filter(person =>
      person.name.toLowerCase().includes(filterPhrase.toLowerCase())
    )
  : persons

  return (
    <ul>{personsToShow.map(person => <Person key={person.name} person={person}/>)}</ul>
  )
}

export default Persons