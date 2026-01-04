import { normalizeDate, isSameDay } from './date.utils';

describe('normalizeDate', () => {
  it('should normalize a Date object to midnight', () => {
    const date = new Date(2026, 0, 4, 15, 30, 45);
    const normalized = normalizeDate(date);

    expect(normalized.getFullYear()).toBe(2026);
    expect(normalized.getMonth()).toBe(0);
    expect(normalized.getDate()).toBe(4);
    expect(normalized.getHours()).toBe(0);
    expect(normalized.getMinutes()).toBe(0);
    expect(normalized.getSeconds()).toBe(0);
    expect(normalized.getMilliseconds()).toBe(0);
  });

  it('should normalize a date string to midnight', () => {
    const dateStr = '2026-01-04T15:30:45Z';
    const normalized = normalizeDate(dateStr);

    expect(normalized.getFullYear()).toBe(2026);
    expect(normalized.getMonth()).toBe(0);
    expect(normalized.getDate()).toBe(4);
    expect(normalized.getHours()).toBe(0);
    expect(normalized.getMinutes()).toBe(0);
    expect(normalized.getSeconds()).toBe(0);
    expect(normalized.getMilliseconds()).toBe(0);
  });
});

describe('isSameDay', () => {
  it('should return true for the same Date object', () => {
    const date = new Date(2026, 0, 4, 12);
    expect(isSameDay(date, date)).toBe(true);
  });

  it('should return true for different Date objects on the same day', () => {
    const date1 = new Date(2026, 0, 4, 10, 15);
    const date2 = new Date(2026, 0, 4, 23, 59);
    expect(isSameDay(date1, date2)).toBe(true);
  });

  it('should return true for Date and string representing the same day', () => {
    const date = new Date(2026, 0, 4, 8);
    const dateStr = '2026-01-04T22:30:00Z';
    expect(isSameDay(date, dateStr)).toBe(true);
  });

  it('should return false for different days', () => {
    const date1 = new Date(2026, 0, 4);
    const date2 = new Date(2026, 0, 5);
    expect(isSameDay(date1, date2)).toBe(false);
  });

  it('should return false for different months', () => {
    const date1 = new Date(2026, 0, 4);
    const date2 = new Date(2026, 1, 4);
    expect(isSameDay(date1, date2)).toBe(false);
  });

  it('should return false for different years', () => {
    const date1 = new Date(2026, 0, 4);
    const date2 = new Date(2025, 0, 4);
    expect(isSameDay(date1, date2)).toBe(false);
  });
});