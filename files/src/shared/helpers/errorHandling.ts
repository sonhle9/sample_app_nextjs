import {ApiError} from '../interfaces/apiError.interface';

import {AppEmitter} from '../../app/emitter.service';

export const componentHttpErrorHandler = (httpError, subscription?) => {
  let formErrors = [];

  if (typeof httpError === 'string') {
    formErrors = [httpError];
  }

  if (typeof httpError === 'object') {
    formErrors = [];

    for (const key of Object.keys(httpError)) {
      const e = httpError[key];
      formErrors.push(e);
    }
    if (httpError && httpError.phone) {
      formErrors = httpError.phone;
    }
  }

  if (subscription) {
    subscription.unsubscribe();
  }

  return formErrors;
};

export const serviceHttpErrorHandler = (httpError) => {
  if (httpError === 'Unathorized' || httpError.status === 401) {
    AppEmitter.get(AppEmitter.SessionExpired).emit();
  }
};

export const getMessageFromApiError = ({response}: {response: ApiError}): string => {
  return response.data.message;
};
