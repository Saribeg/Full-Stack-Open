const Filter = ({ filterPhrase, setFilterPhrase }) => {
  const onFilterChange = (event) => {
    setFilterPhrase(event.target.value)
  }

  return <div>Filter shown with: <input value={filterPhrase} onChange={onFilterChange}/></div>

}

export default Filter;