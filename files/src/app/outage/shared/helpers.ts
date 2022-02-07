import {isString, flatten} from 'lodash/fp';

export const outageError2Message = (value) => {
  let message = null;

  if (isString(value)) {
    message = value;
  } else if (value.error) {
    message = value.error.errors
      ? flatten(Object.values(value.error.errors)).join(' ')
      : value.error.message;
  } else if (Array.isArray(value) && value.some((obj) => obj && obj.property === 'password')) {
    message = 'Invalid user credentials.';
  } else if (value.message) {
    message = value.message;
  }

  return message || 'Oops! Unable to update outage status.';
};

export const SYSTEM_WIDE_SCOPE = 'SystemWide';
export const VENDOR_POS_ALL = 'pos';
export const VENDOR_POS_SAPURA = 'posSapura';
export const VENDOR_POS_SENTINEL = 'posSentinel';
export const VENDOR_POS_SETEL = 'posSetel';
