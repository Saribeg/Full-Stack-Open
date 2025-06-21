const CountrySearchForm = ({ countrySearchPhrase, setCountrySearchPhrase }) => {
  const onCountryChange = (event) => {
    setCountrySearchPhrase(event.target.value)
  }

  return (
    <form className="country-form">
      <label className="country-label" htmlFor="findCountries">Find Countries</label>
      <input className="country-input" type="text" id="findCountries" value={countrySearchPhrase} onChange={onCountryChange} />
    </form>
  )
}

export default CountrySearchForm