import countryService from './services/countries'
import countryUtils from './utils/countries'

const CountryList = ({ countries, setSelectedCountry }) => {
  const showDetails = async (countryName) => {
    const apiCountry = await countryService.getByFullName(countryName)
    const country = countryUtils.extractCountryData(apiCountry)
    setSelectedCountry(country)
  }

  return (
    <ul>
      {countries.map(({ id, name }) => (
        <li key={id}>{name} <button onClick={() => showDetails(name)}>Show</button></li> 
      ))}
    </ul>
  )
}

export default CountryList