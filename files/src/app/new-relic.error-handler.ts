import {ErrorHandler, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NewRelicErrorHandler implements ErrorHandler {
  handleError(error) {
    console.error(error);
    if (window.newrelic) {
      window.newrelic.noticeError(error);
    }
  }
}

declare global {
  interface Window {
    newrelic?: {
      noticeError(
        error: Error,
        customAttributes?: {[key: string]: string | number | boolean},
      ): void;
    };
  }
}
