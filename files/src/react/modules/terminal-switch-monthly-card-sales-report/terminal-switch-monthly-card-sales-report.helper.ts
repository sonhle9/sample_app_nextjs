/**
 * Return number string of fixed length, auto append to front of string if not enough
 *
 * @param num Number
 * @param length Length of result string
 * @param decimalPoint length of decimalPoint
 * @returns
 */
export const formatNumberToFixedString = (
  num: number,
  length: number,
  decimalPoint = 0,
): string => {
  return formatToDecimalPoint(num, decimalPoint).toString().padStart(length, '0');
};

export const formatToDecimalPoint = (num: number, decimalPoint: number) =>
  Math.round((num + Number.EPSILON) * 10 ** decimalPoint) / 10 ** decimalPoint;

export const formatMonthYear = (month: number, year: number) => {
  const date = new Date(year, month - 1);
  const monthString = date.toLocaleDateString('default', {month: 'long'});
  return `${monthString} ${year}`;
};
