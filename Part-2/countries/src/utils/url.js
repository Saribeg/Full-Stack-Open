const getQueryStringFromObject = (obj) => {
  const query = Object.entries(obj)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')

  return `?${query}`
}

export default { getQueryStringFromObject }