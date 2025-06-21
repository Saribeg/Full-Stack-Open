const extractCountryData = (apiCountry) => {
  if (!apiCountry) {
    return null
  }

  return {
    id: apiCountry.cca3,
    name: apiCountry.name?.common,
    capital: apiCountry.capital?.[0],
    area: apiCountry.area,
    languages: Object.values(apiCountry.languages ?? {}),
    flag: apiCountry.flags?.png
  }
}

const filterCountriesBySearchPhrase = (countries, searchPhrase) => {
  return countries.filter(country => country.name.common.toLowerCase().includes(searchPhrase.toLowerCase())).map(extractCountryData)
}

export default { filterCountriesBySearchPhrase }