import { JAR_PATTERN } from './constants';

describe('JAR_PATTERN', () => {
  it('matches full https URL and extracts 10-character jar ID', () => {
    const url = 'https://send.monobank.ua/jar/1234567890';
    const match = url.match(JAR_PATTERN);
    expect(match).not.toBeNull();
    expect(match[3]).toBe('1234567890');
  });

  it('matches URL without protocol', () => {
    const url = 'send.monobank.ua/jar/abcdefghij';
    const match = url.match(JAR_PATTERN);
    expect(match).not.toBeNull();
    expect(match[3]).toBe('abcdefghij');
  });

  it('matches standalone 10-character alphanumeric jar ID', () => {
    const id = 'aB3dE5gH9j';
    const match = id.match(JAR_PATTERN);
    expect(match).not.toBeNull();
    expect(match[3]).toBe('aB3dE5gH9j');
  });

  it('does not extract ID if shorter than 10 characters', () => {
    const shortId = '12345';
    const match = shortId.match(JAR_PATTERN);
    expect(match).toBeNull();
  });
});
