require('dotenv').config();
const { Sequelize, QueryTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
    console.log('Executing (default): SELECT * FROM blogs');
    const blogs = await sequelize.query('SELECT * FROM blogs', { type: QueryTypes.SELECT });
    console.log(blogs);
    sequelize.close();
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
})();
