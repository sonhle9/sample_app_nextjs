import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {getRolePermissions} from 'src/shared/helpers/common';
import {
  ICardholder,
  ICardholderRole,
  ICardholderIndexParams,
} from 'src/shared/interfaces/cardholder.interface';
import {AuthService} from './auth.service';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {IPagination} from '../shared/interfaces/core.interface';
import * as _ from 'lodash';
import {map} from 'rxjs/operators';
import {cardHolderRole} from '../shared/helpers/roles.type';

@Injectable({providedIn: 'root'})
export class ApiCardholderService {
  private cardholdersApiBaseUrl = `${environment.cardsApiBaseUrl}/api/cards`;
  constructor(protected http: HttpClient, protected authService: AuthService) {}

  getRolePermissions(): ICardholderRole {
    return getRolePermissions<ICardholderRole>(this.authService, cardHolderRole);
  }

  indexCardholders(
    page: number,
    perPage: number,
    params?: ICardholderIndexParams,
  ): Observable<IPagination<ICardholder>> {
    const {hasView} = this.getRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.cardholdersApiBaseUrl}/admin/cardholders`;
    const queryParams = _.mapValues(_.merge({page, perPage}, params), _.toString);
    return this.http
      .get<ICardholder[]>(url, {
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

  readCardholderDetails(id): Observable<any> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url: string = this.cardholdersApiBaseUrl + `/admin/cardholders/${id}`;
    return this.http.get(url, {});
  }
}
