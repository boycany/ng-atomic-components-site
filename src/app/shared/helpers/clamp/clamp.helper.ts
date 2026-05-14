export function clamp(min: number, num: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}
