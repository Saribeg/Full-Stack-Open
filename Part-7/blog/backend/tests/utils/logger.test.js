const { test, describe, afterEach } = require('node:test');
const assert = require('node:assert');

const { sanitize, info, error } = require('../../utils/logger');

describe('logger utils', () => {
  afterEach(() => {
    process.env.NODE_ENV = 'test';
  });

  describe('sanitize', () => {
    test('returns same value for null/undefined/non-object', () => {
      assert.strictEqual(sanitize(null), null);
      assert.strictEqual(sanitize(undefined), undefined);
      assert.strictEqual(sanitize('str'), 'str');
      assert.strictEqual(sanitize(42), 42);
      assert.strictEqual(sanitize(true), true);
    });

    test('sanitizes flat object with sensitive fields', () => {
      const obj = {
        username: 'alice',
        password: 'secret123',
        token: 'abc',
        secret: 'xyz',
      };

      const result = sanitize(obj);

      assert.deepStrictEqual(result, {
        username: 'alice',
        password: '***',
        token: '***',
        secret: '***',
      });
      assert.strictEqual(obj.password, 'secret123');
    });

    test('deeply sanitizes nested objects', () => {
      const obj = {
        meta: {
          auth: {
            token: 't',
            deeper: { secret: 's' },
          },
        },
        ok: 1,
      };

      const result = sanitize(obj);

      assert.deepStrictEqual(result, {
        meta: {
          auth: {
            token: '***',
            deeper: { secret: '***' },
          },
        },
        ok: 1,
      });
    });

    test('sanitizes arrays recursively', () => {
      const arr = [
        { password: 'p1', note: 'a' },
        { token: 't2', payload: [{ secret: 's3' }, 5] },
        'no-change',
        7,
      ];

      const result = sanitize(arr);

      assert.deepStrictEqual(result, [
        { password: '***', note: 'a' },
        { token: '***', payload: [{ secret: '***' }, 5] },
        'no-change',
        7,
      ]);
    });

    test('leaves non-sensitive keys intact while traversing', () => {
      const obj = { a: { b: { c: 1 } }, list: [{ x: 2 }, { y: 3 }] };
      const res = sanitize(obj);
      assert.deepStrictEqual(res, { a: { b: { c: 1 } }, list: [{ x: 2 }, { y: 3 }] });
    });
  });

  describe('info', () => {
    test('does nothing when NODE_ENV=test', (t) => {
      process.env.NODE_ENV = 'test';
      const infoLog = t.mock.method(console, 'log');

      info('hello', { token: 'abc' });

      assert.strictEqual(infoLog.mock.callCount(), 0);
    });

    test('logs sanitized params when NODE_ENV!=test', (t) => {
      process.env.NODE_ENV = 'development';
      const infoLog = t.mock.method(console, 'log');
      const obj = { user: 'bob', password: '123' };

      info('greet', obj, ['x', { secret: 'y' }]);

      const args = infoLog.mock.calls[0].arguments;

      assert.strictEqual(infoLog.mock.calls.length, 1);
      assert.deepStrictEqual(args, [
        'greet',
        { user: 'bob', password: '***' },
        ['x', { secret: '***' }],
      ]);
    });
  });

  describe('error', () => {
    test('does nothing when NODE_ENV=test', (t) => {
      process.env.NODE_ENV = 'test';
      const errLog = t.mock.method(console, 'error');

      error('oops', { token: 'abc' });

      assert.strictEqual(errLog.mock.calls.length, 0, 'console.error must not be called in test env');
    });

    test('logs sanitized params when NODE_ENV!=test', (t) => {
      process.env.NODE_ENV = 'production';
      const errLog = t.mock.method(console, 'error');

      error({ secret: 's' }, 'fatal', [{ password: 'p' }], 500);

      const args = errLog.mock.calls[0].arguments;

      assert.strictEqual(errLog.mock.calls.length, 1);
      assert.deepStrictEqual(args, [
        { secret: '***' },
        'fatal',
        [{ password: '***' }],
        500,
      ]);
    });
  });
});
