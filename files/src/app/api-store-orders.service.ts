import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {
  ICStoreOrder,
  IStoreOrderDashboard,
  IStoreOrderRole,
  IInCarOrder,
} from '../shared/interfaces/storeOrder.interface';
import {Observable, throwError} from 'rxjs';
import {PermissionDeniedError} from '../shared/helpers/permissionDenied.error';
import {getRolePermissions, formatParameters} from '../shared/helpers/common';
import {retailRoles} from '../shared/helpers/roles.type';
import {IPagination} from '../shared/interfaces/core.interface';
import {map} from 'rxjs/operators';
import {IReadStation} from '../shared/interfaces/station.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiStoreOrderService {
  private opsApiBaseUrl = '/api/ops';
  private apiBaseUrl = `${environment.storeApiBaseUrl}/api/store-orders/admin`;

  constructor(protected http: HttpClient, protected authService: AuthService) {}

  getRolePermissions(): IStoreOrderRole {
    return getRolePermissions<IStoreOrderRole>(this.authService, retailRoles);
  }

  indexOrders(
    page,
    perPage,
    from = '',
    to = '',
    query = '',
    status = '',
    vendorType = '',
  ): Observable<IPagination<ICStoreOrder>> {
    const {hasStoreOrderView} = this.getRolePermissions();
    if (!hasStoreOrderView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/store-orders`;
    return this.http
      .get<ICStoreOrder[]>(url, {
        params: formatParameters({page, perPage, from, to, query, status, vendorType}),
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

  indexStationsLite(): Observable<IReadStation[]> {
    const {hasStoreOrderView} = this.getRolePermissions();
    if (!hasStoreOrderView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.opsApiBaseUrl}/stations`;
    return this.http.get<IReadStation[]>(url, {
      params: {
        page: '0',
        perPage: '9999',
        'fields[]': ['id', 'name'],
      },
    });
  }

  order(id): Observable<ICStoreOrder> {
    const {hasStoreOrderView} = this.getRolePermissions();
    if (!hasStoreOrderView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/store-orders/${id}`;
    return this.http.get<ICStoreOrder>(url);
  }

  ordersDashboard(): Observable<IStoreOrderDashboard> {
    const {hasStoreOrderView} = this.getRolePermissions();
    if (!hasStoreOrderView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/dashboard`;
    return this.http.get<IStoreOrderDashboard>(url);
  }

  indexConciergeOrders(
    page,
    perPage,
    from = '',
    to = '',
    storeName = '',
    stationId = '',
    status = '',
    orderId = '',
  ): Observable<IPagination<IInCarOrder>> {
    const {hasStoreOrderView} = this.getRolePermissions();
    if (!hasStoreOrderView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/in-car`;

    return this.http
      .get<IInCarOrder[]>(url, {
        params: formatParameters({
          orderId,
          page,
          perPage,
          from,
          to,
          storeName,
          status,
          stationId,
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

  conciergeOrder(id): Observable<IInCarOrder> {
    const {hasStoreOrderView} = this.getRolePermissions();
    if (!hasStoreOrderView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/in-car/${id}`;
    return this.http.get<IInCarOrder>(url);
  }
}
