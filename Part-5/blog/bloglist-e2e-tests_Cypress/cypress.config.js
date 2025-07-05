const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    env: {
      BACKEND: 'http://localhost:3003/api'
    },
    video: false
  },
});
