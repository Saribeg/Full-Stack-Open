const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:5173',
    env: {
      BACKEND: 'http://localhost:3003/api'
    }
  },
});
