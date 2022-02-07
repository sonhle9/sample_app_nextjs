/**
 * parse a string to number. Returns 0 if the result is not a number.
 */
export function parseNumber(value: string): number {
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}
