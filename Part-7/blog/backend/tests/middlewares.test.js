const { test, before, after, beforeEach, afterEach, describe, mock } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const helper = require('./test_helper');
const { resetDb, createInitialUsers } = require('../utils/testDbSetup');
const logger = require('../utils/logger');

const api = supertest(app);
let authenticatedApi;
let authenticatedUser;

describe('Integration tests. Middlewares.', () => {
  before(async () => {
    await resetDb();
    await createInitialUsers();
    const { agent, user } = await helper.getAuthenticatedAgent({
      username: 'jessica',
      password: 'sekret',
    });

    authenticatedApi = agent;
    authenticatedUser = user;
  });

  afterEach(() => {
    process.env.NODE_ENV = 'test';
  });

  describe('logging middlewares', () => {
    let info;
    let error;

    beforeEach(() => {
      info = mock.method(logger, 'info', () => {});
      error = mock.method(logger, 'error', () => {});
    });

    afterEach(() => {
      info.mock.restore();
      error.mock.restore();
    });

    describe('requestLogger', () => {
      test('development: logs Method/Path and "---" (no Body when request.body is empty)', async () => {
        process.env.NODE_ENV = 'development';

        await api.get('/api/blogs');

        const methodCall = info.mock.calls[0].arguments;
        const pathCall   = info.mock.calls[1].arguments;
        const dashCall   = info.mock.calls[2].arguments;

        assert.strictEqual(info.mock.callCount(), 3);
        assert.deepStrictEqual(methodCall, ['Method:', 'GET']);
        assert.deepStrictEqual(pathCall,   ['Path:  ', '/api/blogs']);
        assert.deepStrictEqual(dashCall,   ['---']);
      });

      test('development: logs Body when request has JSON body', async () => {
        process.env.NODE_ENV = 'development';

        const newBlog = {
          title: 'Node.js event loop',
          author: 'Saribeh Karakhanian',
          url: 'https://nodejseventloop.com/',
          likes: 100
        };

        await authenticatedApi
          .post('/api/blogs')
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/);

        const methodCall = info.mock.calls[0].arguments;
        const pathCall   = info.mock.calls[1].arguments;
        const bodyCall   = info.mock.calls[2].arguments;
        const dashCall   = info.mock.calls[3].arguments;

        assert.strictEqual(info.mock.callCount(), 4);
        assert.deepStrictEqual(methodCall, ['Method:', 'POST']);
        assert.deepStrictEqual(pathCall,   ['Path:  ', '/api/blogs']);
        assert.deepStrictEqual(bodyCall,   ['Body:  ', newBlog]);
        assert.deepStrictEqual(dashCall,   ['---']);
      });

      test('non-development (production): logs one structured entry on response finish', async () => {
        process.env.NODE_ENV = 'production';

        await api.get('/api/blogs');

        const args = info.mock.calls[0].arguments;
        const payload = args[0];

        assert.strictEqual(info.mock.callCount(), 1);
        assert.strictEqual(args.length, 1);
        assert.strictEqual(payload.method, 'GET');
        assert.strictEqual(payload.path, '/api/blogs');
        assert.strictEqual(payload.status, 200);
        assert.deepStrictEqual(payload.body, {});
        assert.ok(typeof payload.correlationId === 'string' && payload.correlationId.length > 0);
        assert.ok('ip' in payload);
        assert.ok('userAgent' in payload);
      });

      test('production: skips logging for GET /health with Consul Health Check UA', async () => {
        process.env.NODE_ENV = 'production';

        await api
          .get('/health')
          .set('User-Agent', 'Consul Health Check')
          .expect(200)
          .expect('Content-Type', /application\/json/);

        assert.strictEqual(info.mock.callCount(), 0);
      });

      test('production: logs GET /health when UA is not Consul', async () => {
        process.env.NODE_ENV = 'production';

        await api
          .get('/health')
          .set('User-Agent', 'Mozilla/5.0')
          .expect(200)
          .expect('Content-Type', /application\/json/);

        assert.strictEqual(info.mock.callCount(), 1);
        const payload = info.mock.calls[0].arguments[0];
        assert.strictEqual(payload.path, '/health');
        assert.strictEqual(payload.method, 'GET');
        assert.strictEqual(payload.status, 200);
      });
    });

    describe('unknownEndpoint', () => {
      test('responds with 404 and logs structured entry', async () => {
        process.env.NODE_ENV = 'production';

        const response = await api.get('/this-endpoint-does-not-exist')
          .expect(404)
          .expect('Content-Type', /application\/json/);

        const args = info.mock.calls[0].arguments;
        const payload = args[0];

        assert.deepStrictEqual(response.body, { error: 'unknown endpoint' });
        // One for unknownEndpoint and second for requestLogger (response.on('finish', ...) event).
        assert.strictEqual(info.mock.callCount(), 2);
        assert.strictEqual(args.length, 1);
        assert.ok(typeof payload.correlationId === 'string' && payload.correlationId.length > 0);
        assert.strictEqual(payload.message, 'unknown endpoint');
      });
    });

    describe('errorHandler', () => {
      test('handles CastError (malformatted id)', async () => {
        process.env.NODE_ENV = 'production';

        const invalidId = '12345invalid';
        const response = await api.get(`/api/blogs/${invalidId}`)
          .expect(400)
          .expect('Content-Type', /application\/json/);

        const args = error.mock.calls[0].arguments;
        const payload = args[0];

        assert.deepStrictEqual(response.body, { error: 'malformatted id' });
        assert.strictEqual(error.mock.callCount(), 1);
        assert.ok(typeof payload.correlationId === 'string' && payload.correlationId.length > 0);
        assert.strictEqual(payload.status, 400);
        assert.strictEqual(payload.userError.error, 'malformatted id');
        assert.strictEqual(payload.originalError.name, 'CastError');
        assert.ok(!('stack' in payload.originalError));
      });

      test('handles ValidationError (missing required field)', async () => {
        process.env.NODE_ENV = 'development';

        const invalidBlog = { url: 'short' };
        const response = await authenticatedApi
          .post('/api/blogs')
          .send(invalidBlog)
          .expect(400)
          .expect('Content-Type', /application\/json/);

        const args = error.mock.calls[0].arguments;
        const payload = args[0];

        assert.deepStrictEqual(response.body, { error: response.body.error });
        assert.strictEqual(error.mock.callCount(), 1);
        assert.ok(typeof payload.correlationId === 'string' && payload.correlationId.length > 0);
        assert.strictEqual(payload.status, 400);
        assert.match(payload.userError.error, /validation/i);
        assert.strictEqual(payload.originalError.name, 'ValidationError');
        assert.ok('stack' in payload.originalError);
      });


      test('handles duplicate key (username must be unique)', async () => {
        process.env.NODE_ENV = 'production';

        const existingUser = { username: 'jessica', name: 'Jess', password: 'sekret' };
        const response = await api
          .post('/api/users')
          .send(existingUser)
          .expect(400)
          .expect('Content-Type', /application\/json/);

        const args = error.mock.calls[0].arguments;
        const payload = args[0];

        assert.deepStrictEqual(response.body, { error: 'expected `username` to be unique' });
        assert.strictEqual(error.mock.callCount(), 1);
        assert.ok(typeof payload.correlationId === 'string' && payload.correlationId.length > 0);
        assert.strictEqual(payload.status, 400);
        assert.strictEqual(payload.userError.error, 'expected `username` to be unique');
        assert.ok(
          payload.originalError.message.includes('E11000') ||
    payload.originalError.name === 'MongoServerError'
        );
        assert.ok(!('stack' in payload.originalError));
      });


      test('handles JsonWebTokenError (invalid token)', async () => {
        process.env.NODE_ENV = 'production';

        const newBlog = { title: 'Bad token', author: 'Test', url: 'https://bad.token' };
        const response = await api
          .post('/api/blogs')
          .set('Authorization', 'Bearer this.is.not.valid')
          .send(newBlog)
          .expect(401)
          .expect('Content-Type', /application\/json/);

        const args = error.mock.calls[0].arguments;
        const payload = args[0];

        assert.deepStrictEqual(response.body, { error: 'token invalid' });
        assert.strictEqual(error.mock.callCount(), 1);
        assert.ok(typeof payload.correlationId === 'string' && payload.correlationId.length > 0);
        assert.strictEqual(payload.status, 401);
        assert.strictEqual(payload.userError.error, 'token invalid');
        assert.strictEqual(payload.originalError.name, 'JsonWebTokenError');
        assert.ok(!('stack' in payload.originalError));
      });


      test('handles unknown errors with 500 (development includes stack)', async () => {
        process.env.NODE_ENV = 'development';

        const response = await api.get('/api/test/force-error')
          .expect(500)
          .expect('Content-Type', /application\/json/);

        const args = error.mock.calls[0].arguments;
        const payload = args[0];

        assert.deepStrictEqual(response.body, { error: 'something went wrong' });
        assert.strictEqual(error.mock.callCount(), 1);
        assert.ok(typeof payload.correlationId === 'string' && payload.correlationId.length > 0);
        assert.strictEqual(payload.status, 500);
        assert.strictEqual(payload.userError.error, 'something went wrong');
        assert.strictEqual(payload.originalError.name, 'Error');
        assert.ok(payload.originalError.message.includes('Forced error'));
        assert.ok('stack' in payload.originalError);
      });
    });
  });

  describe('authorization middlewares', () => {
    describe('tokenExtractor', () => {
      test('returns null token when Authorization header is missing', async () => {
        const response = await api
          .get('/api/test/echo-token')
          .expect(200)
          .expect('Content-Type', /application\/json/);

        assert.deepStrictEqual(response.body, { token: null });
      });

      test('returns null token when Authorization header does not start with "Bearer "', async () => {
        const response = await api
          .get('/api/test/echo-token')
          .set('Authorization', 'notbearer something')
          .expect(200)
          .expect('Content-Type', /application\/json/);

        assert.deepStrictEqual(response.body, { token: null });
      });

      test('extracts token when Authorization header starts with "Bearer "', async () => {
        const token = 'xyz.123.token';
        const response = await api
          .get('/api/test/echo-token')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .expect('Content-Type', /application\/json/);

        assert.deepStrictEqual(response.body, { token });
      });
    });

    describe('test userExtractor middleware', () => {
      beforeEach(async () => {
        await resetDb();
        await createInitialUsers();
        const { agent, user } = await helper.getAuthenticatedAgent({
          username: 'jessica',
          password: 'sekret',
        });

        authenticatedApi = agent;
        authenticatedUser = user;
      });

      test('userExtractor middleware adds user to request', async () => {
        const { id, username, name } = authenticatedUser;

        const response = await authenticatedApi
          .get('/api/test/auth-check')
          .expect(200)
          .expect('Content-Type', /application\/json/);

        assert.strictEqual(response.body.id, id);
        assert.strictEqual(response.body.username, username);
        assert.strictEqual(response.body.name, name);
      });

      test('returns 401 if authorization header is missing', async () => {
        const response = await api
          .get('/api/test/auth-check')
          .expect(401)
          .expect('Content-Type', /application\/json/);

        assert.strictEqual(response.body.error, 'token missing or invalid');
      });

      test('returns 401 if authorization header does not start fron `Bearer `', async () => {
        const response = await api
          .get('/api/test/auth-check')
          .set('Authorization', 'notbearer ')
          .expect(401)
          .expect('Content-Type', /application\/json/);

        assert.strictEqual(response.body.error, 'token missing or invalid');
      });

      test('returns 401 for invalid/malformed token', async () => {
        const response = await api
          .get('/api/test/auth-check')
          .set('Authorization', 'Bearer not-a-real-token')
          .expect(401);

        assert.match(response.body.error, /token/i);
      });

      test('returns 401 if token is valid but missing id', async () => {
        const tokenWithoutId = jwt.sign({ username: 'jessica' }, process.env.TEST_SECRET);

        const response = await api
          .get('/api/test/auth-check')
          .set('Authorization', `Bearer ${tokenWithoutId}`)
          .expect(401)
          .expect('Content-Type', /application\/json/);

        assert.strictEqual(response.body.error, 'token invalid (missing id)');
      });

      test('returns 401 if user is not found', async () => {
        const userId = await helper.nonExistingId();
        const userForToken = {
          username: 'jessica',
          id: userId
        };
        const tokenWithoutId = jwt.sign(userForToken, process.env.TEST_SECRET);

        const response = await api
          .get('/api/test/auth-check')
          .set('Authorization', `Bearer ${tokenWithoutId}`)
          .expect(401)
          .expect('Content-Type', /application\/json/);

        assert.strictEqual(response.body.error, 'user not found for token');
      });
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});