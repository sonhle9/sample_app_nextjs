import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {catchError, switchMap} from 'rxjs/operators';
import {publicEndpoints} from 'src/shared/const/public-api.const';
import {AuthService} from '../../app/auth.service';
import {throwError} from 'rxjs';
import {AppEmitter} from '../../app/emitter.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const isPublicCall = publicEndpoints.some(
      (endpoint) => req.method === endpoint.method && req.url.includes(endpoint.url),
    );
    const session = this.authService.getSession();

    if (isPublicCall || !session) {
      return next.handle(req);
    }

    const handleExpiredError = (responseErr) => {
      const anotherError = !(responseErr.status === 401 && this.authService.isAccessTokenExpired());

      if (anotherError) {
        return throwError(responseErr);
      }

      // If could not call refresh token, just throw error to prevent infinite loop
      if (responseErr.url && responseErr.url.toString().includes('/auth/refresh')) {
        return throwError(responseErr);
      }

      return this.authService.refreshToken().pipe(
        switchMap(() =>
          next.handle(
            req.clone({
              headers: req.headers.set('access-token', this.authService.getSession().accessToken),
            }),
          ),
        ),
        catchError((err) => {
          AppEmitter.get(AppEmitter.SessionExpired).emit();

          return throwError(err);
        }),
      );
    };

    return next
      .handle(
        req.clone({
          headers: req.headers.set('access-token', session.accessToken),
        }),
      )
      .pipe(catchError(handleExpiredError));
  }
}
