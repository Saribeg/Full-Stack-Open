import DeletePerson from './DeletePerson'

const Person = ({ person, setPersons }) => {
  return <li>{person.name}: {person.number}    |   <DeletePerson person={person} setPersons={setPersons}/></li>
}

export default Person