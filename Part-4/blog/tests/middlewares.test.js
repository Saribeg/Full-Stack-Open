const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const helper = require('./test_helper');

const api = supertest(app);
let authenticatedApi;
let authenticatedUser;

describe('Integration tests. Testing the CRUD API for blogs', () => {
  beforeEach(async () => {
    await helper.resetDb();
    await helper.createInitialUsers();
    const { agent, user } = await helper.getAuthenticatedAgent({
      username: 'jessica',
      password: 'sekret',
    });

    authenticatedApi = agent;
    authenticatedUser = user;
  });

  describe('test userExtractor middleware', () => {
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

after(async () => {
  await mongoose.connection.close();
});