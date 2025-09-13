require('dotenv').config();
const express = require('express');
const { Sequelize } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
})();

app.get('/health', (req, res) => {
  res.send('Working');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
