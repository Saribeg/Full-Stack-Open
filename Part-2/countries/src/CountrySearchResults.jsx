import CountryList from './CountryList'

const CountrySearchResults = ({ countrySearchPhrase, countries }) => {
  if (!countrySearchPhrase) return null

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter.</p>
  }

  if (countries.length > 1) {
    return <CountryList countries={countries}/>
  }

  return null
}

export default CountrySearchResults
