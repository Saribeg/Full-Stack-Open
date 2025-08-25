const sensitiveFields = ['password', 'token', 'secret'];

function sanitize(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitize);
  }

  const copy = {};
  for (const [key, value] of Object.entries(obj)) {
    if (sensitiveFields.includes(key)) {
      copy[key] = '***';
    } else {
      copy[key] = sanitize(value);
    }
  }
  return copy;
}

const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params.map(sanitize));
  }
};

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params.map(sanitize));
  }
};

module.exports = { sanitize, info, error };