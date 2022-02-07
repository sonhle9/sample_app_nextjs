import {HttpErrorResponse} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, of, throwError, from} from 'rxjs';
import {catchError, map, tap, switchMap} from 'rxjs/operators';
import {environment} from '../environments/environment';
import {adminGroup} from '../shared/helpers/groups';
import {CURRENT_ENTERPRISE} from '../shared/const/enterprise.const';
import {ISession, ISessionData, I2FALoginInput} from '../shared/interfaces/auth.interface';
import {ApiAccountsService} from './api-accounts.service';
import {ApiIamService} from './api-iam.service';
import {AppEmitter} from './emitter.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private EXCLUDE_FROM_RETURN = ['reset-password'];
  private SESSION_STORAGE_KEY = 'session';
  private roles: string[];

  constructor(
    private apiAccountsService: ApiAccountsService,
    private apiIamService: ApiIamService,
    private router: Router,
    @Inject('JwtDecode') public jwtDecode: any,
  ) {
    AppEmitter.get(AppEmitter.SessionExpired).subscribe(() => {
      this.logout();

      let returnUrl = btoa(window.location.pathname + window.location.search);

      if (this.EXCLUDE_FROM_RETURN.some((key) => window.location.pathname.includes(key))) {
        returnUrl = undefined;
      }

      this.router.navigate(['/login'], {queryParams: {returnUrl}});
    });

    AppEmitter.get(AppEmitter.PermissionDenied).subscribe(() => {
      let returnUrl = btoa(window.location.pathname + window.location.search);

      if (this.EXCLUDE_FROM_RETURN.some((key) => window.location.pathname.includes(key))) {
        returnUrl = undefined;
      }

      this.router.navigate(['/login'], {queryParams: {returnUrl}});
    });
  }
  handleLoginResponse = (email, loginResult) => {
    if (
      (loginResult.resetPasswordToken && !loginResult.passwordExpiresIn) ||
      loginResult.require2Fa
    ) {
      return of(loginResult);
    }
    return of(loginResult).pipe(
      tap((x) => this.processSession(email, x)),
      switchMap(() => {
        return from(this.setRoles().then(() => loginResult));
      }),
    );
  };
  login(email: string, password: string) {
    return this.apiAccountsService.login(email, password, CURRENT_ENTERPRISE.iamNamespace).pipe(
      switchMap((loginResult) => this.handleLoginResponse(email, loginResult)),
      catchError(this.handleError),
    );
  }

  login2FA(input: I2FALoginInput) {
    return this.apiAccountsService.login2FA(input, CURRENT_ENTERPRISE.iamNamespace).pipe(
      switchMap((loginResult) => this.handleLoginResponse(input.identifier, loginResult)),
      catchError(this.handleError),
    );
  }

  async setRoles(): Promise<void> {
    return new Promise((resolve, reject) => {
      const sessionData = this.getSessionData();
      if (!sessionData || !sessionData.sub) {
        resolve();
      }

      this.apiIamService
        .getPermissions({namespace: sessionData.namespace, userId: sessionData.sub})
        .subscribe(
          (permissions) => {
            this.roles = permissions;
            resolve();
          },
          (err) => {
            this.handleError(err);
            reject(err);
          },
        );
    });
  }

  createOtp(phone): Observable<any> {
    return this.apiAccountsService.createOtp(phone).pipe(
      map(() => true),
      catchError(this.handleError),
    );
  }

  resetPassword(phone, otp, password): Observable<any> {
    return this.apiAccountsService.resetPassword(phone, otp, password).pipe(
      map(() => true),
      catchError(this.handleError),
    );
  }

  logout() {
    return this.apiAccountsService.logout().pipe(
      catchError(() => of({})),
      map(() => this.removeSession()),
    );
  }

  refreshToken() {
    const session: ISession = this.getSession();
    if (!session) {
      return throwError(new Error());
    }
    const refreshToken = session.refreshToken;
    const {namespace} = this.getSessionData();
    const email = session.email;

    return this.apiAccountsService.refreshToken(refreshToken, namespace).pipe(
      // tap(saveSession),
      tap((_) => this.processSession(email, _)),
      map(() => session),
      catchError((error) => {
        AppEmitter.get(AppEmitter.SessionExpired).emit();
        this.removeSession();
        return this.handleError(error);
      }),
    );
  }

  isAuthenticated(): boolean {
    const session = this.getSession();
    if (!session) {
      return false;
    }

    return !this.isSessionExpired(session);
  }

  getSessionData(): ISessionData | null {
    const session = this.getSession();

    return session && this.decodeJwt(session.accessToken);
  }

  getSession(): ISession {
    const session: string = localStorage.getItem(this.SESSION_STORAGE_KEY);
    if (session) {
      return JSON.parse(session);
    }

    return null;
  }

  validatePermissions(roles: string[] | string): boolean {
    roles = Array.isArray(roles) ? roles : [roles];
    const sessionRoles = this.getRoles();

    if (sessionRoles.length === 0) {
      return false;
    }

    for (const role of roles) {
      if (sessionRoles.indexOf(role) !== -1) {
        return true;
      }
    }

    return false;
  }

  getRoles(): string[] {
    if (environment.enableApiIamRoles) {
      return this.roles;
    }
    const session = this.getSessionData();
    const {resource_access} = session || {resource_access: {'setel-ops': {roles: []}}};
    const {roles} = resource_access['setel-ops'];
    return roles;
  }

  isAccessTokenExpired() {
    const session = this.getSession();

    return !!session && new Date(session.expiresAt) <= new Date();
  }

  isConciergeAdmin(): boolean {
    const roles = this.getRoles() || [];
    if (roles.includes(adminGroup.concierge) && !roles.includes(adminGroup.admin)) {
      return true;
    }

    return false;
  }

  private processSession(email: string, res): void {
    const expireDate = new Date();
    expireDate.setSeconds(expireDate.getSeconds() + res.expiresIn);

    const session: ISession = {
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
      expiresAt: expireDate.toISOString(),
      username: res.username && res.username.trim(),
      email,
    };

    this.saveSession(session);
  }

  private isSessionExpired(session): boolean {
    const currentDate = new Date();

    currentDate.setSeconds(currentDate.getSeconds());
    return new Date(session.expiresAt) < currentDate;
  }

  private saveSession(session: ISession) {
    localStorage.setItem(this.SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  private removeSession() {
    localStorage.removeItem(this.SESSION_STORAGE_KEY);
  }

  private handleError(error: HttpErrorResponse) {
    let message: any = 'Something went wrong. Please try again';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      message = 'Looks like you have some network issues, please try again';
      console.error('An error occurred:', error.error.message);
    } else {
      console.error('An error occured', error);
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      const errBody: any = error && error.error;
      if (errBody && error.error.message) {
        message = errBody.message;
      } else if (errBody && errBody.errors) {
        message = errBody.errors;
      }
    }

    // return an observable with a user-facing error message
    return throwError(message);
  }

  private decodeJwt(jwt) {
    return this.jwtDecode(jwt);
  }

  mergeKeywords(...values: string[]): string {
    return values.filter((v) => v != null).join('|');
  }

  setAdminUsername() {
    const session = this.getSessionData();

    // Temporary workaround - Passing admin id instead of username
    this.apiAccountsService.setAdminUsername(session.sub);
  }
}
