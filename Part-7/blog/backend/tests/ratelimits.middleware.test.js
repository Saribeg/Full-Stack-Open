const { describe, test, beforeEach, afterEach, mock } = require('node:test');
const assert = require('node:assert');
const express = require('express');
const supertest = require('supertest');

const {
  jsonBodyLimit,
  authLimiter,
  writeLimiterMiddleware,
  errorHandler,
} = require('../utils/middleware');
const config = require('../utils/config');
const logger = require('../utils/logger');

describe('rate/json middlewares (isolated app)', () => {
  let app;
  let agent;
  let infoMock;
  let errorMock;

  beforeEach(() => {
    app = express();
    agent = supertest.agent(app);
    infoMock = mock.method(logger, 'info', () => {});
    errorMock = mock.method(logger, 'error', () => {});
  });

  afterEach(() => {
    infoMock.mock.restore();
    errorMock.mock.restore();
  });

  describe('jsonBodyLimit', () => {
    test('returns 413 on payload too large', async () => {
      app.use(jsonBodyLimit);
      app.post('/echo', (req, res) => res.json({ ok: true }));
      app.use(errorHandler);

      const big = 'a'.repeat(20 * 1024);

      const res = await agent.post('/echo').send({ title: big }).expect(413);

      assert.ok(res.body.error);
      assert.match(res.body.error, /too large|limit/i);
    });
  });

  describe('authLimiter', () => {
    test('returns 429 after AUTH_RATE_MAX successful logins', async () => {
      app.use(
        '/api/login',
        authLimiter,
        express.json(),
        (req, res) => res.status(200).json({ token: 'ok' })
      );

      for (let i = 0; i < config.AUTH_RATE_MAX; i++) {
        const ok = await agent
          .post('/api/login')
          .send({ username: 'u', password: 'p' })
          .expect(200);
        assert.strictEqual(ok.body.token, 'ok');
      }

      const res = await agent
        .post('/api/login')
        .send({ username: 'u', password: 'p' })
        .expect(429);

      assert.deepStrictEqual(res.body, {
        error: 'Too many login attempts, try again later',
      });
    });
  });

  describe('writeLimiterMiddleware', () => {
    test('GET passes, POST hits 429 after WRITE_RATE_MAX_PER_MIN', async () => {
      process.env.NODE_ENV = 'production';
      const oldCI = process.env.CI;
      process.env.CI = 'false';

      app.get('/things', (_req, res) => res.json({ ok: true }));
      app.post(
        '/things',
        writeLimiterMiddleware,
        express.json(),
        (_req, res) => res.status(201).json({ created: true })
      );

      const getRes = await agent.get('/things').expect(200);
      assert.deepStrictEqual(getRes.body, { ok: true });

      for (let i = 0; i < config.WRITE_RATE_MAX_PER_MIN; i++) {
        const ok = await agent.post('/things').send({ a: 1 }).expect(201);
        assert.deepStrictEqual(ok.body, { created: true });
      }

      const res = await agent.post('/things').send({ a: 1 }).expect(429);

      assert.deepStrictEqual(res.body, {
        error: 'Too many write requests, slow down',
      });

      process.env.NODE_ENV = 'test';
      process.env.CI = oldCI;
    });
  });
});