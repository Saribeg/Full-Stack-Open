import { safeParseJSON } from '../../../src/utils/commonHelpers.js';

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
});