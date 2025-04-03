import { describe, it, expect } from 'vitest';
import { Date13 } from '../src';

describe('Date13', () => {
  /* positive test cases */
  it('should Date.now eq to Date13.now', () => {
    const d_now = Date.now();
    const d13_now = Date13.now();

    expect(d13_now).toBe(d_now);
  });

  // from timestamp
  it('should convert 0 to unix epoch time', () => {
    const d = new Date13(0);
    expect(d.toISOString()).toBe('1970-01-01T00:00:00.000Z');
  });

  it('should convert milis to correct unix time', () => {
    const d = new Date13(3 * 60 * 60 * 1000);
    expect(d.getTime()).toBe(3 * 60 * 60 * 1000);
    expect(d.toISOString()).toBe('1970-01-01T03:00:00.000Z');
  });

  // TODO refactor
  it('should convert timestamp to Date13', () => {
    const d = new Date13(1743638400000);
    expect(d.toISOString()).toBe('2025-04-08T00:00:00.000Z');
  });

  // from date parts
  it('should convert year and month to Date13', () => {
    const d = new Date13(2025, 2);
    expect(d.getUTCFullYear()).toBe(2025);
    expect(d.getUTCMonth()).toBe(2);
    expect(d.getUTCDate()).toBe(1);
    expect(d.getUTCHours()).toBe(0);
    expect(d.getUTCMinutes()).toBe(0);
    expect(d.getUTCSeconds()).toBe(0);
    expect(d.getUTCMilliseconds()).toBe(0);
  });

  it('should convert year and month to Date13', () => {
    const d = new Date13(2025, 2);
    expect(d.getUTCFullYear()).toBe(2025);
    expect(d.getUTCMonth()).toBe(2);
    expect(d.getUTCDate()).toBe(1);
    expect(d.getUTCHours()).toBe(0);
    expect(d.getUTCMinutes()).toBe(0);
    expect(d.getUTCSeconds()).toBe(0);
    expect(d.getUTCMilliseconds()).toBe(0);
  });

  it('should convert 2025-02-27 to Date13', () => {
    const d = new Date13(2025, 2, 27);
    expect(d.getUTCFullYear()).toBe(2025);
    expect(d.getUTCMonth()).toBe(2);
    expect(d.getUTCDate()).toBe(27);
    expect(d.getUTCHours()).toBe(0);
    expect(d.getUTCMinutes()).toBe(0);
    expect(d.getUTCSeconds()).toBe(0);
    expect(d.getUTCMilliseconds()).toBe(0);
  });

  it('should correctly overflow 29th day', () => {
    const d = new Date13(2025, 2, 29);
    expect(d.getUTCFullYear()).toBe(2025);
    expect(d.getUTCMonth()).toBe(3);
    expect(d.getUTCDate()).toBe(1);
    expect(d.getUTCHours()).toBe(0);
    expect(d.getUTCMinutes()).toBe(0);
    expect(d.getUTCSeconds()).toBe(0);
    expect(d.getUTCMilliseconds()).toBe(0);
  });

  it('should oveflow to 13th month after Dec 31', () => {
    const d = new Date13(2025, 11, 31);
    expect(d.getUTCFullYear()).toBe(2025);
    expect(d.getUTCMonth()).toBe(12);
    expect(d.getUTCDate()).toBe(3);
    expect(d.getUTCHours()).toBe(0);
    expect(d.getUTCMinutes()).toBe(0);
    expect(d.getUTCSeconds()).toBe(0);
    expect(d.getUTCMilliseconds()).toBe(0);
  });

  /* negative test cases */
  it('should display NaN as Invalid Date', () => {
    const d = new Date13(NaN);
    expect(d.toString()).toBe('Invalid Date');
  });
});
