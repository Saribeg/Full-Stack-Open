import DeletePerson from './DeletePerson'

const Person = ({ person, setPersons, showNotification }) => {
  return <li>{person.name}: {person.number}    |   <DeletePerson person={person} setPersons={setPersons} showNotification={showNotification}/></li>
}

export default Person