const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const api = supertest(app);

describe.only('Integration tests. Testing the CRUD API for users', () => {
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
  });
});

after(async () => {
  await mongoose.connection.close();
});