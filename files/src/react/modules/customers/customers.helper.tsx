import {formatDate} from '@setel/portal-ui';
import moment from 'moment';

const isoDateReg = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

export const maskCardNumber = (cardNumber: string): string => {
  return cardNumber && '●●●●' + cardNumber.slice(-4);
};
export const convertSnakeCaseToSentence = (snakeCaseText: string) =>
  snakeCaseText &&
  (snakeCaseText.charAt(0).toUpperCase() + snakeCaseText.slice(1)).replace(/_/gi, ' ');

export const convertUnixTimestampToString = (timestamp: number) => {
  // Unix timestamp (seconds)
  return formatDate(moment.unix(timestamp).toDate());
};

export const convertUnderscoreToWhitespace = (str: string) => {
  const strArr = str.split('_');
  return strArr.join(' ');
};

export const convertAnyToString = (value: any): string => {
  if (value === null || value === undefined) return null;
  if (isoDateReg.test(value)) return formatDate(value);

  switch (typeof value) {
    case 'boolean':
      return value.toString();
    case 'number':
      return value.toString();
    case 'object':
      return JSON.stringify(value);
    default:
      return value;
  }
};
