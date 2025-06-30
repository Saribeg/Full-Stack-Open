const testRouter = require('express').Router();
const middleware = require('../utils/middleware');

testRouter.get('/auth-check', middleware.userExtractor, (request, response) => {
  response.status(200).json(request.user);
});

module.exports = testRouter;
