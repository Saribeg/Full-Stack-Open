const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const api = supertest(app);

describe('Integration tests. Testing the CRUD API for users', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('sekret', 10);
    const initialUsers = helper.initialUsers.map(user => ({ ...user, passwordHash }));
    await User.insertMany(initialUsers);
  });

  describe('GET all users', () => {
    test('all users are returned', async () => {
      const response = await api.get('/api/users');
      assert.strictEqual(response.body.length, helper.initialUsers.length);
    });
  });

  describe('registration of a new user', () => {
    test('user can registrate', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'harrypotter',
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
});

after(async () => {
  await mongoose.connection.close();
});