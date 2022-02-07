import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {getRolePermissions} from 'src/shared/helpers/common';
import {
  ICardRange,
  ICardRangeRole,
  ICardRangeIndexParams,
} from 'src/shared/interfaces/card-range.interface';
import {AuthService} from './auth.service';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {IPagination} from '../shared/interfaces/core.interface';
import * as _ from 'lodash';
import {map} from 'rxjs/operators';
import {cardRangeRole} from '../shared/helpers/roles.type';

@Injectable({providedIn: 'root'})
export class ApiCardRangeService {
  private cardRangeApiBaseUrl = `${environment.cardsApiBaseUrl}/api/cards`;
  constructor(protected http: HttpClient, protected authService: AuthService) {}

  getRolePermissions(): ICardRangeRole {
    return getRolePermissions<ICardRangeRole>(this.authService, cardRangeRole);
  }

  indexCardRange(
    page: number,
    perPage: number,
    params?: ICardRangeIndexParams,
  ): Observable<IPagination<ICardRange>> {
    const {hasView} = this.getRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.cardRangeApiBaseUrl}/admin/card-ranges`;
    const queryParams = _.mapValues(_.merge({page, perPage}, params), _.toString);
    return this.http
      .get<ICardRange[]>(url, {
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

  readCardRangeDetails(id): Observable<any> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url: string = this.cardRangeApiBaseUrl + `/admin/card-ranges/${id}`;
    return this.http.get(url, {});
  }

  createCardRange(cardRange: ICardRange): Observable<ICardRange> {
    const {hasCreate} = this.getRolePermissions();
    if (!hasCreate) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.cardRangeApiBaseUrl}/admin/card-ranges`;
    return this.http
      .post<ICardRange>(url, cardRange, {observe: 'response'})
      .pipe(map((res) => res.body));
  }

  updateCardRange(cardRange: ICardRange): Observable<ICardRange> {
    const {hasUpdate} = this.getRolePermissions();
    if (!hasUpdate) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.cardRangeApiBaseUrl}/admin/card-ranges/${cardRange.id}`;
    return this.http
      .put<ICardRange>(url, cardRange, {observe: 'response'})
      .pipe(map((res) => res.body));
  }

  createOrOpdateCardRange(cardRange: ICardRange): Observable<ICardRange> {
    if (cardRange.id) {
      return this.updateCardRange(cardRange);
    } else {
      return this.createCardRange(cardRange);
    }
  }
}
