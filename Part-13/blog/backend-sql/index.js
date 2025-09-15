const { PORT } = require('./src/utils/config');
const app = require('./src/app');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
