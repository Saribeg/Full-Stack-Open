import { safeParseJSON, getNestedValueFromObj } from '../../../src/utils/commonHelpers.js';

describe('Test utils, commonHelpers.js', () => {
  describe('safeParseJSON', () => {
    it('parses a valid JSON string into an object', () => {
      const input = '{"a":1,"b":"str","c":true,"d":null,"e":[1,2]}';
      const result = safeParseJSON(input);
      expect(result).toEqual({ a: 1, b: 'str', c: true, d: null, e: [1, 2] });
    });

    it('parses a valid JSON array string', () => {
      const input = '[{"id":1},{"id":2}]';
      const result = safeParseJSON(input);
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('returns the original value when input is not a string', () => {
      const obj = { x: 1 };
      const arr = [1, 2, 3];
      const num = 42;
      const bool = false;
      const nil = null;

      expect(safeParseJSON(obj)).toBe(obj);
      expect(safeParseJSON(arr)).toBe(arr);
      expect(safeParseJSON(num)).toBe(num);
      expect(safeParseJSON(bool)).toBe(bool);
      expect(safeParseJSON(nil)).toBe(nil);
    });

    it('returns the original string when JSON.parse throws (invalid JSON)', () => {
      const input = '{invalid json}';
      const result = safeParseJSON(input);
      expect(result).toBe(input);
    });

    it('returns the original string when it is not JSON (e.g., plain text)', () => {
      const input = 'hello';
      const result = safeParseJSON(input);
      expect(result).toBe('hello');
    });

    it('returns the original empty string when parsing empty string fails', () => {
      const input = '';
      const result = safeParseJSON(input);
      expect(result).toBe('');
    });
  });

  describe('getNestedValueFromObj', () => {
    const data = {
      user: {
        id: 10,
        profile: {
          name: 'Alice',
          address: {
            city: 'Tbilisi',
            zip: 12345
          }
        },
        roles: ['admin', 'editor']
      }
    };

    it('returns nested value by dot path', () => {
      expect(getNestedValueFromObj(data, 'user.profile.name')).toBe('Alice');
      expect(getNestedValueFromObj(data, 'user.profile.address.city')).toBe('Tbilisi');
      expect(getNestedValueFromObj(data, 'user.id')).toBe(10);
    });

    it('supports array indices in the path', () => {
      expect(getNestedValueFromObj(data, 'user.roles.0')).toBe('admin');
      expect(getNestedValueFromObj(data, 'user.roles.1')).toBe('editor');
    });

    it('returns undefined when the path does not exist', () => {
      expect(getNestedValueFromObj(data, 'user.profile.age')).toBeUndefined();
      expect(getNestedValueFromObj(data, 'user.permissions.read')).toBeUndefined();
    });

    it('returns undefined when any intermediate value is null/undefined', () => {
      const obj = { a: null };
      expect(getNestedValueFromObj(obj, 'a.b.c')).toBeUndefined();

      const obj2 = undefined;
      expect(getNestedValueFromObj(obj2, 'a.b')).toBeUndefined();
    });
  });
});
