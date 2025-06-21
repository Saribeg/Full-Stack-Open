const CountryDetails = ({ country }) => {
  const { id, name, capital, area, languages, flag } = country

  return (
    <div className="country-details">
      <h1>{name}</h1>
      <p>Capital: {capital}</p>
      <p>Area: {area}</p>
      <h3>Languages:</h3>
      <ul>
        {languages.map(language => <li key={id + language}>{language}</li>)}
      </ul>
      <img src={flag} alt={`Flag of ${name}`} />
    </div>
  )
}

export default CountryDetails