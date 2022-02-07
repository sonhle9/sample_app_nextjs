import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {map} from 'rxjs/operators';
import {IPagination} from '../shared/interfaces/core.interface';
import {formatParameters, getRolePermissions} from 'src/shared/helpers/common';
import {ApiCustomersService} from './api-customers.service';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {adminRole} from '../shared/helpers/roles.type';
import {AuthService} from './auth.service';
import {ApiOrderService} from './api-orders.service';
import {environment} from '../environments/environment';
import {IAdminRole} from '../shared/interfaces/opsUser.interface';
import {ISettlement, ISettlementIndexParams} from '../shared/interfaces/settlement.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiSettlementService {
  private merchantSettlementsApiBaseUrl = `${environment.merchantsApiBaseUrl}/api/merchants/admin/settlements`;

  constructor(
    protected http: HttpClient,
    protected customerService: ApiCustomersService,
    protected orderService: ApiOrderService,
    protected authService: AuthService,
  ) {}

  getRolePermissions(): IAdminRole {
    return getRolePermissions<IAdminRole>(this.authService, adminRole);
  }

  indexSettlements(
    page: number,
    perPage: number,
    params: ISettlementIndexParams,
  ): Observable<IPagination<ISettlement>> {
    const {hasUserIndex} = this.getRolePermissions();
    if (!hasUserIndex) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.merchantSettlementsApiBaseUrl}`;
    return this.http
      .get<ISettlement[]>(url, {
        params: formatParameters({
          page,
          perPage,
          ...params,
        }),
        observe: 'response',
      })
      .pipe(
        map((res) => ({
          max: +(res.headers.get('x-total-count') || 0),
          index: +(res.headers.get('x-next-page') || 0),
          page: +(res.headers.get('x-per-page') || 20),
          items: res.body,
        })),
      );
  }

  readSettlement(settlementId: string): Observable<ISettlement> {
    const {hasUserRead} = this.getRolePermissions();
    if (!hasUserRead) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.merchantSettlementsApiBaseUrl}/${settlementId}`;
    return this.http.get<ISettlement>(url);
  }
}
