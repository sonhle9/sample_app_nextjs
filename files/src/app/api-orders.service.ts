import {Injectable} from '@angular/core';
import {Observable, throwError, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';

import {catchError, tap, map} from 'rxjs/operators';
import {IPagination} from '../shared/interfaces/core.interface';
import {IFailedOrder} from 'src/shared/interfaces/dashboard.interface';
import {IOrder, IOrderRole} from '../shared/interfaces/order.interface';
import {formatParameters, getRolePermissions} from '../shared/helpers/common';
import {AuthService} from './auth.service';
import {retailRoles} from 'src/shared/helpers/roles.type';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {IReadStation} from 'src/shared/interfaces/station.interface';
import {
  IUpdateOrderTagsParams,
  IDeleteTag,
  IAddTag,
} from './orders/components/order-tags/order-tags.interface';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiOrderService {
  private apiBaseUrl = '/api/ops';
  private orderApiBaseUrl = `${environment.orderApiBaseUrl}/api/orders`;
  orders: Record<
    string,
    {
      data: IOrder;
      exists: boolean;
    }
  > = {};

  constructor(protected http: HttpClient, protected authService: AuthService) {}

  getRolePermissions(): IOrderRole {
    return getRolePermissions<IOrderRole>(this.authService, retailRoles);
  }

  indexOrders(
    page,
    perPage,
    type,
    from = '',
    to = '',
    query = '',
    status = '',
    tag = '',
  ): Observable<IPagination<IOrder>> {
    const {hasFuelOrderView} = this.getRolePermissions();
    if (!hasFuelOrderView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.orderApiBaseUrl}/orders/admin/orders`;
    return this.http
      .get<IOrder[]>(url, {
        params: formatParameters({page, perPage, type, from, to, query, status, tag}),
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
    const {hasFuelOrderView} = this.getRolePermissions();
    if (!hasFuelOrderView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/stations`;
    return this.http.get<IReadStation[]>(url, {
      params: {
        page: '0',
        perPage: '9999',
        'fields[]': ['id', 'name'],
      },
    });
  }

  order(orderId): Observable<IOrder> {
    const {hasFuelOrderView} = this.getRolePermissions();
    if (!hasFuelOrderView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/orders/${orderId}`;
    return this.http.get<IOrder>(url).pipe(
      tap((order) => {
        this.orders[orderId] = {
          data: order,
          exists: true,
        };

        return of(order);
      }),
      catchError((errorResponse) => {
        if (errorResponse.error.statusCode === 404) {
          this.orders[orderId] = {
            data: null,
            exists: false,
          };

          return of(null);
        }

        return throwError(errorResponse);
      }),
    );
  }

  orderGetManualReleaseStatus(orderId: string) {
    const {hasFuelOrderView} = this.getRolePermissions();
    if (!hasFuelOrderView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.orderApiBaseUrl}/admin/manual-release/orders/${orderId}`;
    return this.http.get(url);
  }

  orderManualRelease(orderId: string) {
    const {hasFuelOrderView} = this.getRolePermissions();
    if (!hasFuelOrderView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.orderApiBaseUrl}/admin/manual-release/orders/${orderId}`;
    return this.http.post(url, {});
  }

  topFailedOrders(perPage = 20): Observable<IFailedOrder[]> {
    const url = `${this.apiBaseUrl}/orders`;
    return this.http
      .get<IOrder[]>(url, {
        params: formatParameters({status: 'error', perPage}),
      })
      .pipe(
        map((orders) =>
          orders.map(({orderId, userFullName, stationId, stationName, orderStatus, createdAt}) => ({
            orderId,
            userFullName,
            stationId,
            stationName,
            orderStatus,
            createdAt,
          })),
        ),
      );
  }

  cancelAuthorize(orderId): Observable<string> {
    const {hasFuelOrderUpdate} = this.getRolePermissions();
    if (!hasFuelOrderUpdate) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/orders/${orderId}/cancel-payment-authorize`;
    return this.http.post<string>(url, {});
  }

  retryPurchase(orderId: string, amount: number): Observable<string> {
    const {hasFuelOrderUpdate} = this.getRolePermissions();
    if (!hasFuelOrderUpdate) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/orders/${orderId}/retry-purchase`;
    return this.http.post<string>(url, {amount});
  }

  clearOrders(orderId: string) {
    delete this.orders[orderId];
  }

  removeTag({orderId, tag: toRemove}: IUpdateOrderTagsParams) {
    return this.http
      .delete<IDeleteTag>(`${this.orderApiBaseUrl}/admin/tags/${orderId}/${toRemove}`)
      .pipe(
        tap(({adminTags}) => {
          this.orders[orderId] = {
            exists: true,
            data: {
              ...this.orders[orderId].data,
              adminTags,
            },
          };
        }),
      );
  }

  addTag({orderId, tag}: IUpdateOrderTagsParams) {
    const {exists = false} = this.orders[orderId] || {};
    const payload = {
      adminTags: !exists ? [tag] : this.orders[orderId].data.adminTags.concat([tag]),
    };

    return this.http.post<IAddTag>(`${this.orderApiBaseUrl}/admin/tags/${orderId}`, payload).pipe(
      tap(({adminTags}) => {
        this.orders[orderId] = {
          exists: true,
          data: {
            ...this.orders[orderId].data,
            adminTags,
          },
        };
      }),
    );
  }
}
