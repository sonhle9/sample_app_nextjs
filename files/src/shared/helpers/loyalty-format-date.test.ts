import {convertToDate} from './loyalty-format-date';

describe('convertToDate', () => {
  it('returns date for "dd-MM-yyyy" format', () => {
    const result = convertToDate('22-01-2021');

    expect(result).toBeInstanceOf(Date);
  });
  it('returns date accordingly', () => {
    const result = convertToDate('2024-07-22T23:59:59.999Z');

    expect(result).toBeInstanceOf(Date);
  });
});
