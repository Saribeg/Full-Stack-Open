const CountryList = ({ countries }) => {
  return (
    <ul>
      {countries.map(({ id, name }) => (
        <li key={id}>{name}</li>
      ))}
    </ul>
  )
}

export default CountryList