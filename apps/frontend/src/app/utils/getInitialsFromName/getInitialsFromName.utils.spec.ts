import { getInitialsFromName } from "./getInitialsFromName.utils";

describe('getInitialsFromName', () => {
  it('should return empty string if name is undefined', () => {
    expect(getInitialsFromName()).toBe('');
  });

  it('should return empty string if name is empty', () => {
    expect(getInitialsFromName('')).toBe('');
  });

  it('should return first two letters for a single name', () => {
    expect(getInitialsFromName('Alice')).toBe('AL');
  });

  it('should return initials from first and last name', () => {
    expect(getInitialsFromName('Alice Johnson')).toBe('AJ');
  });

  it('should handle multiple spaces between names', () => {
    expect(getInitialsFromName('Alice   Mary  Johnson')).toBe('AJ');
  });

  it('should trim spaces around the name', () => {
    expect(getInitialsFromName('   Bob Smith   ')).toBe('BS');
  });

  it('should return uppercase initials', () => {
    expect(getInitialsFromName('alice johnson')).toBe('AJ');
    expect(getInitialsFromName('ALICE JOHNSON')).toBe('AJ');
  });

  it('should handle single character names', () => {
    expect(getInitialsFromName('A')).toBe('A');
    expect(getInitialsFromName('b')).toBe('B');
  });
});