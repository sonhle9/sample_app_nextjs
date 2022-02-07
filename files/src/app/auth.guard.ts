import {catchError, switchMap, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, CanActivate} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';

import {AuthService} from './auth.service';
import {AppEmitter} from './emitter.service';
import {ISessionData} from 'src/shared/interfaces/auth.interface';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';

@Injectable()
export class AuthResolver implements Resolve<ISessionData>, CanActivate {
  constructor(private authService: AuthService) {}

  resolve(): Observable<ISessionData> {
    const session = this.authService.getSessionData();

    if (session) {
      return of(session);
    }

    return this.authService.refreshToken().pipe(
      map((_) => session),
      catchError((_) => {
        AppEmitter.get(AppEmitter.SessionExpired).emit();
        return throwError('Unathorized');
      }),
    );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const session = this.authService.getSession();
    if (!session) {
      AppEmitter.get(AppEmitter.PermissionDenied).emit();
      return throwError(new PermissionDeniedError());
    }

    const routeRoles = route.data.roles || [];
    const isAuthenticated = this.authService.isAuthenticated();
    if (!isAuthenticated) {
      return this.authService.refreshToken().pipe(
        switchMap(() => of(this.authService.validatePermissions(routeRoles))),
        catchError(() => {
          AppEmitter.get(AppEmitter.SessionExpired).emit();
          return throwError('Unathorized');
        }),
      );
    }

    const validated = this.authService.validatePermissions(routeRoles);
    if (!validated) {
      AppEmitter.get(AppEmitter.PermissionDenied).emit();
      return throwError(new PermissionDeniedError());
    }

    return of(true);
  }
}
