function safeParseJSON(data) {
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch {
    return data;
  }
}

const modifyArray = (initArr, operationType, newData) => {
  switch (operationType) {
    case 'add':
      return initArr.concat(newData).sort((a, b) => b.likes - a.likes);
    case 'update':
      return [...initArr]
        .map((b) => (b.id === newData.id ? newData : b))
        .sort((a, b) => b.likes - a.likes);
    case 'delete':
      return [...initArr].filter((b) => b.id !== newData.id);
    default:
      return initArr;
  }
};

export { safeParseJSON, modifyArray };
