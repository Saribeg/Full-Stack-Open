const extractCountryData = (apiCountry) => {
  if (!apiCountry) {
    return null
  }

  const [latitude, longitude] = apiCountry.capitalInfo?.latlng ?? []

  return {
    id: apiCountry.cca3,
    name: apiCountry.name?.common,
    capital: apiCountry.capital?.[0],
    area: apiCountry.area,
    languages: Object.values(apiCountry.languages ?? {}),
    flag: apiCountry.flags?.png,
    latitude,
    longitude
  }
}

const filterCountriesBySearchPhrase = (countries, searchPhrase) => {
  return countries.filter(country => country.name.common.toLowerCase().includes(searchPhrase.toLowerCase())).map(extractCountryData)
}

export default { extractCountryData, filterCountriesBySearchPhrase }