import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {
  ITransaction,
  ICreateTransactionInput,
  ITransactionRole,
} from '../shared/interfaces/transaction.interface';
import {map} from 'rxjs/operators';
import {IPagination} from '../shared/interfaces/core.interface';
import {formatParameters, getRolePermissions} from 'src/shared/helpers/common';
import {ApiCustomersService} from './api-customers.service';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {transactionRole} from 'src/shared/helpers/roles.type';
import {AuthService} from './auth.service';
import {ApiOrderService} from './api-orders.service';
import {environment} from '../environments/environment';
import {PaymentMethods, PaymentMethodAll} from './transactions/shared/const-var';
import {PaymentMethod} from './transactions/shared/const-var';

@Injectable({
  providedIn: 'root',
})
export class ApiTransactionService {
  private apiBaseUrl = '/api/ops';
  private paymentsApiBaseUrl = `${environment.paymentsApiBaseUrl}/api/payments`;

  constructor(
    protected http: HttpClient,
    protected customerService: ApiCustomersService,
    protected orderService: ApiOrderService,
    protected authService: AuthService,
  ) {}

  getRolePermissions(): ITransactionRole {
    return getRolePermissions<ITransactionRole>(this.authService, transactionRole);
  }

  indexTransactions(
    page,
    perPage,
    type,
    subtype,
    status,
    from = '',
    to = '',
    paymentMethod: string = PaymentMethods[0],
    paymentSubmethod = '',
    excludePaymentMethod = PaymentMethod.MESRA_CARD,
  ): Observable<IPagination<ITransaction>> {
    const {hasView} = this.getRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.paymentsApiBaseUrl}/admin/transactions`;
    const params =
      paymentMethod === PaymentMethodAll
        ? {page, perPage, type, subtype, status, from, to, paymentSubmethod, excludePaymentMethod}
        : {
            page,
            perPage,
            type,
            subtype,
            status,
            from,
            to,
            paymentMethod,
            paymentSubmethod,
            excludePaymentMethod,
          };
    return this.http
      .get<ITransaction[]>(url, {
        params: formatParameters(params),
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

  indexTransactionsByUserId(page, perPage, userId: string): Observable<IPagination<ITransaction>> {
    const {hasView} = this.getRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.paymentsApiBaseUrl}/admin/transactions`;

    return this.http
      .get<ITransaction[]>(url, {
        params: formatParameters({page, perPage, userId}),
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

  readTransaction(id: string): Observable<ITransaction> {
    const {hasView} = this.getRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.paymentsApiBaseUrl}/admin/transactions/${id}`;
    return this.http.get<ITransaction>(url);
  }

  indexOrderTransactions(
    orderId,
    page,
    perPage,
    userId = null,
  ): Observable<IPagination<ITransaction>> {
    const role = this.orderService.getRolePermissions();
    if (!role || !role.hasFuelOrderView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.paymentsApiBaseUrl}/admin/transactions`;
    return this.http
      .get<ITransaction[]>(url, {
        params: {page, perPage, orderId, ...(userId && {userId})},
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

  indexPaymentProcessorTransactions(
    referenceId,
    page,
    perPage,
    userId = null,
  ): Observable<IPagination<ITransaction>> {
    const {hasView} = this.getRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.paymentsApiBaseUrl}/admin/transactions`;
    return this.http
      .get<ITransaction[]>(url, {
        params: {page, perPage, referenceId, ...(userId && {userId})},
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

  add(transaction: ICreateTransactionInput): Observable<ITransaction> {
    const role = this.customerService.getRolePermissions();
    if (!role || !role.hasTransactions) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/transactions`;
    return this.http.post<ITransaction>(url, transaction);
  }
}
