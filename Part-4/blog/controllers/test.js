const testRouter = require('express').Router();
const middleware = require('../utils/middleware');
const { resetDb, handleInitialDataInDb } = require('../utils/testDbSetup');

testRouter.get('/auth-check', middleware.userExtractor, (request, response) => {
  response.status(200).json(request.user);
});

testRouter.post('/reset', async (request, response) => {
  await resetDb();

  response.status(204).end();
});

testRouter.post('/initiate-db', async (request, response) => {
  await handleInitialDataInDb();

  response.status(201).json({ message: 'Initial Data is added to DB' });
});

module.exports = testRouter;
