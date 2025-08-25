const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const { initialData, handleInitialDataInDb } = require('../utils/testDbSetup');

const api = supertest(app);

describe('Integration tests. Testing the CRUD API for users', () => {
  beforeEach(async () => {
    await handleInitialDataInDb();
  });

  describe('GET all users', () => {
    test('all users are returned', async () => {
      const response = await api.get('/api/users');
      assert.strictEqual(response.body.length, initialData.users.length);
    });
  });

  describe('registration of a new user', () => {
    test('user can registrate', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'harrypotternew',
        name: 'Harry Potter',
        password: 'Voldemortloser',
      };

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      // Verify that one user was added to the database
      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

      // Check that the response contains the expected user data
      const savedUser = response.body;
      const { id, username, name } = savedUser;

      assert.ok(id);
      assert.deepStrictEqual(
        { username, name },
        { username: newUser.username, name: newUser.name }
      );

      // Confirm that the new user actually exists in the database
      const usernames = usersAtEnd.map(u => u.username);
      assert.ok(usernames.includes(newUser.username));
    });

    test('returns error if `username` is absent', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        name: 'Harry Potter',
        password: 'Voldemortloser',
      };

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);

      assert.ok(response.body.error);
      assert.match(response.body.error, /validation/i);
    });

    test('returns error if `username` length is less than 3 characters', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'ha',
        name: 'Harry Potter',
        password: 'Voldemortloser',
      };

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);

      assert.ok(response.body.error);
      assert.match(response.body.error, /validation/i);
    });

    test('returns error if `username` is not unique (already exists in DB)', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'alex',
        name: 'Alex Smith',
        password: 'sekret',
      };

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);

      assert.ok(response.body.error);
      assert.strictEqual(response.body.error, 'expected `username` to be unique');
    });

    test('returns error if `password` is absent', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'harrypotter',
        name: 'Harry Potter'
      };

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);

      assert.ok(response.body.error);
      assert.strictEqual(response.body.error, '`password` is required');
    });

    test('returns error if `password` length is less than 3 characters', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'harrypotter',
        name: 'Harry Potter',
        password: '12'
      };

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await helper.usersInDb();
      assert.strictEqual(usersAtEnd.length, usersAtStart.length);

      assert.ok(response.body.error);
      assert.strictEqual(response.body.error, '`password` must be at least 3 characters long');
    });
  });

  describe('user login', () => {
    test('user can login', async () => {
      const userLoginData = {
        username: 'jessica',
        password: 'sekret'
      };

      const response = await api
        .post('/api/login')
        .send(userLoginData)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.ok(response.body.token);
      assert.strictEqual(response.body.username, 'jessica');
      assert.strictEqual(response.body.name, 'Jessica Huston');
    });

    test('error is returned if password is incorrect', async () => {
      const userLoginData = {
        username: 'jessica',
        password: 'noncorrect'
      };

      const response = await api
        .post('/api/login')
        .send(userLoginData)
        .expect(401)
        .expect('Content-Type', /application\/json/);

      assert.ok(response.body.error);
      assert.strictEqual(response.body.error, 'invalid username or password');
    });

    test('error is returned if user is not found', async () => {
      const userLoginData = {
        username: 'nonexistinguser',
        password: 'sekret'
      };

      const response = await api
        .post('/api/login')
        .send(userLoginData)
        .expect(401)
        .expect('Content-Type', /application\/json/);

      assert.ok(response.body.error);
      assert.strictEqual(response.body.error, 'invalid username or password');
    });
  });

  describe('get existing user by id', () => {
    test('succeeds with status 200 and returns the correct user', async () => {
      const usersAtStart = await helper.usersInDb();
      const userToView = usersAtStart[0];

      const response = await api
        .get(`/api/users/${userToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const returnedUser = response.body;

      assert.strictEqual(returnedUser.id, userToView.id);
      assert.strictEqual(returnedUser.username, userToView.username);
      assert.ok(Array.isArray(returnedUser.blogs));

      assert.ok(returnedUser.id);
      assert.strictEqual(returnedUser._id, undefined);
      assert.strictEqual(returnedUser.__v, undefined);
      assert.strictEqual(returnedUser.passwordHash, undefined);
    });

    test('returns 404 if user does not exist', async () => {
      const nonExistingId = await helper.nonExistingId();

      const response = await api
        .get(`/api/users/${nonExistingId}`)
        .expect(404);

      assert.ok(response.body.error);
      assert.strictEqual(response.body.error, 'User not found');
    });

    test('returns 400 if id is invalid', async () => {
      const invalidId = '12345invalidid';

      const response = await api
        .get(`/api/users/${invalidId}`)
        .expect(400);

      assert.ok(response.body.error);
      assert.match(response.body.error, /malformatted|cast/i);
    });
  });

});

after(async () => {
  await mongoose.connection.close();
});