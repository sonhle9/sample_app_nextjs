import {IPagination, IPag} from '../interfaces/core.interface';
import moment from 'moment';
import {IDashboardTemplate} from '../interfaces/dashboard.interface';
import {AuthService} from 'src/app/auth.service';
import {Observable} from 'rxjs';
import {ElementRef} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {createWriteStream} from 'streamsaver';
import * as _ from 'lodash';

export const uuidv4 = () =>
  (([1e7] as any) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    // eslint-disable-next-line no-bitwise
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
  );

export const converToCurrency = (amount) => {
  return (amount / 100).toFixed(2);
};

export const convertToCents = (amount) => {
  return Math.round(amount * 100);
};

export const formatParameters = (obj) => {
  return Object.entries(obj).reduce(
    (a, [k, v]) => (!v || (Array.isArray(v) && v.length === 0) ? a : ((a[k] = v), a)),
    {},
  );
};

export const formatDate = (date, endOf = false) => {
  if (!date) {
    return '';
  }

  const formatted = moment(date);
  if (endOf) {
    return formatted.endOf('day').toISOString();
  }

  return formatted.toISOString();
};

export function resetPagination<T>(perPage = 20, page = 1, totalPage = -9999): IPagination<T> {
  return {
    max: totalPage,
    index: page,
    page: perPage,
    items: [],
  };
}

export function resetPag(page = 1, perPage = 20): IPag {
  return {
    page,
    perPage,
  };
}

export const forceUpdate = (obj) => Object.assign({}, obj);

export const formatQueryString = (obj) =>
  Object.keys(obj)
    .map((key) => key + '=' + obj[key])
    .join('&');

export const convertMinuteToMilliSeconds = (minute: number) => {
  return minute * 60 * 1000;
};

export const generateDashboard = (apiFunction): IDashboardTemplate => {
  return {
    isLoading: false,
    apiFunction,
  };
};

export const toFirstUpperCase = (key) => key.charAt(0).toUpperCase() + key.slice(1);

export function getRolePermissions<T>(authService: AuthService, systemRoles): T {
  const permissions = {};
  const allRoles = Object.keys(systemRoles);

  for (const role of allRoles) {
    permissions[`has${toFirstUpperCase(role)}`] = authService.validatePermissions(
      systemRoles[role],
    );
  }

  return permissions as T;
}

export const isEmptyOrUndefined = (value: string) =>
  value === undefined || value === null || value === '';

export const isBlank = (value: string) => !value || /^\s*$/.test(value);

export const cleanObject = (obj) => {
  const keys = Object.keys(obj);
  keys.forEach((key) => {
    if (isEmptyOrUndefined(obj[key])) {
      delete obj[key];
    }
  });
  return obj;
};

export const numberWithCommas = (value) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const downloadFile = async (
  fileObserver: Observable<string>,
  element: ElementRef,
  fileName: string, // with extension
  pageSize: any,
) =>
  new Promise<void>((resolve, reject) => {
    if (pageSize > 1000) {
      alert('You can only download up to 1000 entries. Please specify a smaller date range');
      return;
    }
    fileObserver.subscribe((url) => {
      if (!url) {
        return;
      }

      const link = element.nativeElement;
      link.href = url;
      link.download = `${fileName}${moment().format('YYYYMMDDhhmmss')}.csv`;
      link.click();

      window.URL.revokeObjectURL(url);
      resolve();
    }, reject);
  });

export const dateValidator = ({value}: AbstractControl): Record<string, boolean> | null =>
  !value || moment(value).isValid() ? null : {invalidDate: true};

export const triggerFileDownloading = ({url, accessToken, filename}) => {
  return fetch(url, {
    method: 'POST',
    headers: {
      'access-token': accessToken,
    },
  }).then((res) => {
    const fileStream = createWriteStream(filename);
    const writer = fileStream.getWriter();
    // if (res.body.pipeTo) {
    //   writer.releaseLock();
    //   return res.body.pipeTo(fileStream);
    // }

    const reader = res.body.getReader();
    const pump = () =>
      reader
        .read()
        .then(({value, done}) => (done ? writer.close() : writer.write(value).then(pump)));

    return pump();
  });
};

export const getStringEnumValues = <E extends Record<keyof E, string>>(e: E): E[keyof E][] => {
  return (Object.keys(e) as (keyof E)[]).map((k) => e[k]);
};

export function getEnumKeys<T extends string | number>(e: Record<string, T>): string[] {
  return _.difference(_.keys(e), _.map(_.filter(_.values(e), _.isNumber), _.toString));
}

export function getEnumValues<T extends string | number>(e: Record<string, T>): T[] {
  return _.values(_.pick(e, getEnumKeys(e)));
}

export const capitalize = (str: string): string => {
  const lower = str.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.substring(1);
};

export const tagValidator =
  (getAllTags: () => string[]) =>
  ({value}: AbstractControl): Record<string, boolean> | null => {
    if (!value) {
      return null;
    }

    const checks = [
      value.length > 25 && {lengthError: true},
      !/^[a-z0-9_\-]+$/.test(value) && {tagError: true},
      getAllTags().includes(value) && {duplicateError: true},
    ];

    return checks.find(Boolean) || null;
  };

export const deepCopy = (obj) => {
  return _.cloneDeep(obj);
};

export const deepEqual = (obj1, obj2) => {
  return _.isEqual(obj1, obj2);
};

export const isInt = (num) => {
  return _.isInteger(num);
};

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : // eslint-disable-next-line @typescript-eslint/ban-types
    T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

/**
 * Loosely matching value with text
 *
 * @example
 *   const matcher = textLooselyMatching('hello world');
 *   matcher('Hello World!') // true
 *   matcher('hello World') // true
 *   matcher('HELLO WORLD') // true
 *   matcher('hello_world') // true
 *   matcher('HELLO_WORLD') // true
 * @param criteria
 */
export const textLooselyMatching = (criteria: string) => {
  const portions = criteria.match(/[A-z0-9]+/g);
  const looselyMatchingRegex = new RegExp(portions.join('.'), 'i');
  return (value: string): boolean => looselyMatchingRegex.test(value);
};
