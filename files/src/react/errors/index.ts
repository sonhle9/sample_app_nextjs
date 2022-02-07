import {DomainError} from './domainError';

export const UNKNOWN_ERROR = 'Something went wrong';

export const onUnknownError = (err: Error | any) => {
  // Logging may be introduced here
  if (process.env.REACT_APP_STAGE !== 'prod') {
    console.error(err);
  }
};

export const ofType =
  <T extends Function, R>( // eslint-disable-line @typescript-eslint/ban-types
    Type: T,
    fn: (err: T) => R,
  ) =>
  (err: Error | any): never | R => {
    if (err instanceof Type) {
      return fn(err as T);
    }

    throw err;
  };

export const onlyDomainError =
  <T, R = any>(fn: (err: DomainError<T>) => R) =>
  (err: Error | any): never | R => {
    if (isDomainError(err)) {
      return fn(err);
    }

    throw err;
  };

export const exceptDomainError =
  <R = any>(fn: (err: Error | any) => R) =>
  (err: Error | any): never | R => {
    if (!isDomainError(err)) {
      return fn(err);
    }

    throw err;
  };

export const isDomainError = (err: Error | any) => err instanceof DomainError || err.domainError;

export * from './domainError';
