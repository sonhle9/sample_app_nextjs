import {Injectable} from '@angular/core';
import {Observable, throwError, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';

import {map, catchError} from 'rxjs/operators';
import {IOrder} from '../shared/interfaces/order.interface';
import {formatParameters, getRolePermissions} from '../shared/helpers/common';
import {AuthService} from './auth.service';
import {dashboardRole} from 'src/shared/helpers/roles.type';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {
  IFailedOrder,
  IDashboardRole,
  IFailTopup,
  IOrderDashboard,
} from 'src/shared/interfaces/dashboard.interface';
import {ITransaction} from 'src/shared/interfaces/transaction.interface';
import {TransactionStatus, TransactionType} from './stations/shared/const-var';

@Injectable({
  providedIn: 'root',
})
export class ApiDashboardService {
  private apiBaseUrl = '/api/ops';

  constructor(protected http: HttpClient, protected authService: AuthService) {}

  getRolePermissions(): IDashboardRole {
    return getRolePermissions<IDashboardRole>(this.authService, dashboardRole);
  }

  topFailedOrders(perPage = 20): Observable<IFailedOrder[]> {
    const {hasMenu} = this.getRolePermissions();
    if (!hasMenu) {
      return throwError(new PermissionDeniedError());
    }

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

  topFailedTopups(perPage = 20): Observable<IFailTopup[]> {
    const {hasMenu} = this.getRolePermissions();
    if (!hasMenu) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/transactions`;
    return this.http
      .get<ITransaction[]>(url, {
        params: formatParameters({
          perPage,
          status: TransactionStatus.error,
          type: TransactionType.topup,
        }),
      })
      .pipe(
        map((orders) =>
          orders.map(({userId, fullName, createdAt, subtype, id}) => ({
            id,
            userId,
            fullName,
            subtype,
            createdAt,
          })),
        ),
      );
  }

  ordersDashboard() {
    const url = `${this.apiBaseUrl}/reports/orders/dashboard`;
    return this.http.get<IOrderDashboard>(url).pipe(
      catchError((_) => {
        const defaultDashboard: IOrderDashboard = {
          fuelStatistics: {},
          topupPendingStatus: {},
          topupStatistics: {},
          fuelProcessErrorStatistics: {},
        };
        return of(defaultDashboard);
      }),
    );
  }
}
