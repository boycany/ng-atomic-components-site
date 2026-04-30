import { clamp } from './clamp.helper';

describe('clamp', () => {
  it('should return num when within range', () => {
    expect(clamp(0, 5, 10)).toBe(5);
  });

  it('should return min when num is below the lower bound', () => {
    expect(clamp(0, -5, 10)).toBe(0);
  });

  it('should return max when num is above the upper bound', () => {
    expect(clamp(0, 50, 10)).toBe(10);
  });

  it('should return the bound value when num equals min or max', () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(0, 10, 10)).toBe(10);
  });

  it('should support negative ranges', () => {
    expect(clamp(-10, -5, 0)).toBe(-5);
    expect(clamp(-10, -50, 0)).toBe(-10);
    expect(clamp(-10, 50, 0)).toBe(0);
  });
});
