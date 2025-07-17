function safeParseJSON(data) {
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch {
    return data;
  }
}

const getNestedValueFromObj = (obj, path) => path.split('.').reduce((acc, key) => acc?.[key], obj);

export { safeParseJSON, getNestedValueFromObj };
