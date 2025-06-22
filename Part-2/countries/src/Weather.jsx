import { useEffect } from 'react'
import weatherService from './services/weather'
import weatherUtils from './utils/weather'

const Weather = ({ selectedCountry, weatherData, setWeatherData }) => {
  const getWeatherData = async (country) => {
    const apiWeatherData = await weatherService.getByLatlng(country)
    const relevantWeatherData = weatherUtils.extractWeatherData(apiWeatherData)
    setWeatherData(relevantWeatherData)
  }

  useEffect(() => {
    getWeatherData(selectedCountry)
  }, [selectedCountry])

  return weatherData && (
    <div className="weather-container">
      <h2>Weather in {selectedCountry.capital}:</h2>
      <p>Temperature {weatherData.temperature}</p>
      <p>Wind {weatherData.wind}</p>
      <div style={{ fontSize: '100px' }}>{weatherData.icon}</div>
    </div>
  )
}

export default Weather