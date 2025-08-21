const testRouter = require('express').Router();
const middleware = require('../utils/middleware');
const { resetDb, handleInitialDataInDb } = require('../utils/testDbSetup');

testRouter.get('/echo-token', middleware.tokenExtractor, (req, res) => {
  res.json({ token: req.token });
});

testRouter.get('/auth-check', middleware.userExtractor, (request, response) => {
  response.status(200).json(request.user);
});

testRouter.post('/reset', async (request, response) => {
  await resetDb();

  response.status(204).end();
});

testRouter.post('/initiate-db', async (request, response) => {
  const savedData = await handleInitialDataInDb();

  response.status(201).json(savedData);
});

testRouter.get('/force-error', (request, response, next) => {
  next(new Error('Forced error for testing'));
});


module.exports = testRouter;
