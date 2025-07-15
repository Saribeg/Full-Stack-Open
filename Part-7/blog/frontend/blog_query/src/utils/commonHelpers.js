function safeParseJSON(data) {
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch {
    return data;
  }
}

export { safeParseJSON };