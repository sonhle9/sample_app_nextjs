import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {getRolePermissions} from 'src/shared/helpers/common';
import {
  ICardExpiryDate,
  ICardExpiryDateRole,
} from 'src/shared/interfaces/card-expiry-date.interface';
import {AuthService} from './auth.service';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {IPagination} from '../shared/interfaces/core.interface';
import * as _ from 'lodash';
import {map} from 'rxjs/operators';
import {cardExpirationRole} from '../shared/helpers/roles.type';

@Injectable({providedIn: 'root'})
export class ApiCardExpiryDateService {
  private cardExpiryDateApiBaseUrl = `${environment.cardsApiBaseUrl}/api/cards`;
  constructor(protected http: HttpClient, protected authService: AuthService) {}

  getRolePermissions(): ICardExpiryDateRole {
    return getRolePermissions<ICardExpiryDateRole>(this.authService, cardExpirationRole);
  }

  indexCardExpiryDate(
    page: number,
    perPage: number,
    params?: ICardExpiryDate,
  ): Observable<IPagination<ICardExpiryDate>> {
    const {hasView} = this.getRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.cardExpiryDateApiBaseUrl}/admin/card-expirations`;
    const queryParams = _.mapValues(_.merge({page, perPage}, params), _.toString);
    return this.http
      .get<ICardExpiryDate[]>(url, {
        params: queryParams,
        observe: 'response',
      })
      .pipe(
        map((res) => ({
          max: +(res.headers.get('x-total-count') || 0),
          index: +(res.headers.get('x-next-page') || 0),
          page: +(res.headers.get('x-per-page') || 50),
          items: res.body,
        })),
      );
  }

  readCardExpiryDateDetails(id): Observable<any> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url: string = this.cardExpiryDateApiBaseUrl + `/admin/card-expirations/${id}`;
    return this.http.get(url, {});
  }

  createCardExpiryDate(cardExpiryDate: ICardExpiryDate): Observable<ICardExpiryDate> {
    const {hasCreate} = this.getRolePermissions();
    if (!hasCreate) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.cardExpiryDateApiBaseUrl}/admin/card-expirations`;
    return this.http
      .post<ICardExpiryDate>(url, cardExpiryDate, {observe: 'response'})
      .pipe(map((res) => res.body));
  }

  updateCardExpiryDate(cardExpiryDate: ICardExpiryDate): Observable<ICardExpiryDate> {
    const {hasUpdate} = this.getRolePermissions();
    if (!hasUpdate) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.cardExpiryDateApiBaseUrl}/admin/card-expirations/${cardExpiryDate.id}`;
    return this.http
      .put<ICardExpiryDate>(url, cardExpiryDate, {observe: 'response'})
      .pipe(map((res) => res.body));
  }

  createOrUpdateCardExpiryDate(cardExpiryDate: ICardExpiryDate): Observable<ICardExpiryDate> {
    if (cardExpiryDate.id) {
      return this.updateCardExpiryDate(cardExpiryDate);
    } else {
      return this.createCardExpiryDate(cardExpiryDate);
    }
  }
}
