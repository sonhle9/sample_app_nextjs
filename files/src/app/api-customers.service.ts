import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

import {
  ICustomer,
  ICustomerRole,
  ICustomerWalletInfo,
  ICustomerAccountSettings,
  ICustomerRefreshBalanceResponse,
  ICustomerCardActivationResponse,
} from '../shared/interfaces/customer.interface';
import {ITransaction} from '../shared/interfaces/transaction.interface';
import {IPagination} from '../shared/interfaces/core.interface';
import {IOrder} from '../shared/interfaces/order.interface';
import {ICStoreOrder} from '../shared/interfaces/storeOrder.interface';
import {ICustomBudget, IBudget} from './../shared/interfaces/customer.interface';
import {formatParameters, getRolePermissions} from '../shared/helpers/common';
import {AuthService} from './auth.service';
import {adminAccountRole, customerRole} from 'src/shared/helpers/roles.type';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiCustomersService {
  private apiBaseUrl = '/api/ops';
  private paymentsApiBaseUrl = `${environment.paymentsApiBaseUrl}/api/payments`;
  private budgetsApiBaseUrl = `${environment.budgetApiBaseUrl}/api/budgets/admin/statements/users/`;
  private loyaltyApiBaseUrl = `${environment.loyaltyApiBaseUrl}/api/loyalty/`;
  private attributesApiBaseUrl = `${environment.attributesApiBaseUrl}/api/attributes/`;

  constructor(protected http: HttpClient, protected authService: AuthService) {}

  getRolePermissions(): ICustomerRole {
    const roles = getRolePermissions<ICustomerRole>(this.authService, customerRole);
    if (this.authService.getRoles().includes(adminAccountRole.adminRead)) {
      roles.hasMenu = true;
      roles.hasIndex = true;
      roles.hasRead = true;
      roles.hasSearch = true;
    }
    return roles;
  }

  indexCustomers(page, perPage): Observable<IPagination<ICustomer>> {
    const {hasIndex} = this.getRolePermissions();
    if (!hasIndex) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/users`;
    return this.http
      .get<ICustomer[]>(url, {
        params: {page, perPage},
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

  searchCustomers(query: string = '', page, perPage): Observable<IPagination<ICustomer>> {
    const {hasSearch} = this.getRolePermissions();
    if (!hasSearch) {
      return throwError(new PermissionDeniedError());
    }

    const params: {
      [param: string]: string;
    } = {page, perPage};
    if (!isNaN(+query) && query.startsWith('0')) {
      params.phone = 6 + query;
    } else if (!isNaN(+query)) {
      params.phone = query;
    } else if (query.indexOf('@') !== -1) {
      params.email = query;
    } else {
      params.fullNameOrDeviceId = query;
    }

    const url = `${this.apiBaseUrl}/users`;
    return this.http
      .get<ICustomer[]>(url, {
        params,
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

  customer(id): Observable<ICustomer> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/users/${id}`;
    return this.http.get<ICustomer>(url);
  }

  getCustomerWalletInfo(id): Observable<ICustomerWalletInfo> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/users/${id}/wallet`;
    return this.http.get<ICustomerWalletInfo>(url);
  }

  getCustomerIncomingBalance(userId: string): Observable<number> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.paymentsApiBaseUrl}/admin/users/${userId}/wallet/incoming-balance`;
    return this.http.get<number>(url);
  }

  refreshCustomerBalance(userId: string): Observable<ICustomerRefreshBalanceResponse> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.paymentsApiBaseUrl}/admin/users/${userId}/wallet/refresh-balance`;
    return this.http.get<ICustomerRefreshBalanceResponse>(url);
  }

  getCustomerCardActivationRetry(userId: string): Observable<ICustomerCardActivationResponse> {
    const {hasEdit} = this.getRolePermissions();
    if (!hasEdit) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.loyaltyApiBaseUrl}admin/searchLoyaltyCards/cardActivationLimit`;
    return this.http.get<ICustomerCardActivationResponse>(url, {
      params: {userId},
    });
  }

  resetCustomerCardActivationRetry(userId: string): Observable<ICustomerCardActivationResponse> {
    const {hasEdit} = this.getRolePermissions();
    if (!hasEdit) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.loyaltyApiBaseUrl}admin/searchLoyaltyCards/resetCardActivationLimit?userId=${userId}`;
    return this.http.put<ICustomerCardActivationResponse>(url, {
      params: {userId},
    });
  }

  getCustomerIncomingBalanceTransactions(userId: string): Observable<ITransaction[]> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.paymentsApiBaseUrl}/admin/users/${userId}/wallet/incoming-balance/transactions`;
    return this.http.get<ITransaction[]>(url);
  }

  updateInternal(id, internal): Observable<any> {
    const {hasEdit} = this.getRolePermissions();
    if (!hasEdit) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/users/${id}`;
    return this.http.put<any>(url, {internal});
  }

  updateBrand(id, brand): Observable<any> {
    const {hasEdit} = this.getRolePermissions();
    if (!hasEdit) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/users/${id}/account-settings`;
    return this.http.put<any>(url, {
      preferredPetrolBrand: brand,
    });
  }

  accountSettings(id): Observable<ICustomerAccountSettings> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/users/${id}/account-settings`;
    return this.http.get<any>(url);
  }

  indexCustomerTransactions(
    customerId,
    page,
    perPage,
    types = [],
    from = '',
    to = '',
  ): Observable<IPagination<ITransaction>> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url: string = this.apiBaseUrl + `/users/${customerId}/transactions`;
    return this.http
      .get<ITransaction[]>(url, {
        params: formatParameters({page, perPage, from, to, 'types[]': types}),
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

  indexCustomerPaymentTransactions(
    customerId,
    from = '',
    to = '',
  ): Observable<IPagination<ITransaction>> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.paymentsApiBaseUrl}/admin/transactions`;
    return this.http
      .get<ITransaction[]>(url, {
        params: formatParameters({from, to, userId: customerId}),
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

  indexCustomerOrders(
    userId,
    page,
    perPage,
    type = '',
    from = '',
    to = '',
    status = '',
  ): Observable<IPagination<IOrder>> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/orders`;
    return this.http
      .get<IOrder[]>(url, {
        params: formatParameters({userId, page, perPage, type, from, to, status}),
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

  indexCustomerStoreOrders(
    userId,
    from = '',
    to = '',
    status = '',
  ): Observable<IPagination<ICStoreOrder>> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${environment.storeApiBaseUrl}/api/store-orders/admin/store-orders`;
    return this.http
      .get<ICStoreOrder[]>(url, {
        params: formatParameters({userId, from, to, status}),
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

  indexCustomerBudgets(userId: string, pageIndex: number, perPage: number): Observable<any> {
    const {hasBudget} = this.getRolePermissions();
    if (!hasBudget) {
      return throwError(new PermissionDeniedError());
    }
    const page = pageIndex + 1;
    const url = `${this.budgetsApiBaseUrl}${userId}/statements/summary`;
    return this.http
      .get<IBudget[]>(url, {
        params: formatParameters({page, perPage}),
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

  customBudgets(userId: string, payload: ICustomBudget): Observable<string> {
    const {hasStatement} = this.getRolePermissions();
    if (!hasStatement) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.budgetsApiBaseUrl}${userId}/statements/email`;
    return this.http.post<any>(url, payload);
  }

  indexAttributes(customerId: string): Observable<any> {
    const url = `${this.attributesApiBaseUrl}admin/entity?entityType=users&entityId=${customerId}`;
    return this.http.get<any>(url);
  }
}
