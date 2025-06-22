import axios from 'axios'
import urlUtils from '../utils/url'
const baseUrl = 'https://api.open-meteo.com/v1/forecast'

// I decided to use Open-Meteo without API keys and credit cards
const getByLatlng = async ({ latitude, longitude }) => {
  const queryParams = {
    latitude,
    longitude,
    current_weather: true
  }
  const queryString = urlUtils.getQueryStringFromObject(queryParams)
  const url = baseUrl + queryString
  const response = await axios.get(url)
  return response.data
}

export default { getByLatlng }