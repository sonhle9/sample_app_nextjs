import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor() {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const baseUrl =
      req.url.indexOf('http://') === 0 || req.url.indexOf('https://') === 0
        ? ''
        : environment.apiBaseUrl;

    req = req.clone({
      url: `${baseUrl}${req.url}`,
    });

    return next.handle(req).pipe(
      catchError((error) => {
        return throwError(error);
      }),
    );
  }
}
