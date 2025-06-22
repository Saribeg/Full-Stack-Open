import { useState, useEffect } from 'react'

import countryService from './services/countries'
import countryUtils from './utils/countries'

import CountrySearchForm from './CountrySearchForm'
import CountrySearchResults from './CountrySearchResults'
import CountryDetails from './CountryDetails'
import Weather from './Weather'

function App() {
  const [countrySearchPhrase, setCountrySearchPhrase] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weatherData, setWeatherData] = useState(null)

  const setCountryState = (relevantCountries) => {
    if (relevantCountries.length > 1) {
      setCountries(relevantCountries)
      setSelectedCountry(null)
    } else {
      setSelectedCountry(relevantCountries[0] || null)
      setCountries([])
    }
  }

  const fetchCountries = async () => {
    try {
      const countries = await countryService.getAll()
      const relevantCountries = countryUtils.filterCountriesBySearchPhrase(countries, countrySearchPhrase)
      setCountryState(relevantCountries)
    } catch (error) {
      window.alert(`Error when loading countries: ${error.message}`)
    }
  }

  useEffect(() => {
    fetchCountries()
  }, [countrySearchPhrase])

  return (
    <div>
      <CountrySearchForm countrySearchPhrase={countrySearchPhrase} setCountrySearchPhrase={setCountrySearchPhrase}/>
      <div className="country-search-result">
        <CountrySearchResults countrySearchPhrase={countrySearchPhrase} countries={countries} setSelectedCountry={setSelectedCountry}/>
      </div>
      {selectedCountry && <CountryDetails country={selectedCountry}/>}
      {selectedCountry && <Weather selectedCountry={selectedCountry} weatherData={weatherData} setWeatherData={setWeatherData}/>}
    </div>
  )
}

export default App
