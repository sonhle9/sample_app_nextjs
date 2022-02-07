import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {ITransaction, ITransactionRole} from '../shared/interfaces/checkoutTransaction.interface';
import {map} from 'rxjs/operators';
import {IPagination} from '../shared/interfaces/core.interface';
import {formatParameters, getRolePermissions} from 'src/shared/helpers/common';
import {ApiCustomersService} from './api-customers.service';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {transactionRole} from 'src/shared/helpers/roles.type';
import {AuthService} from './auth.service';
import {environment} from '../environments/environment';
import {
  CheckoutPaymentMethodFamily,
  CheckoutPaymentMethod,
  CheckoutPaymentMethodBrand,
} from './customers/shared/const-var';

@Injectable({
  providedIn: 'root',
})
export class ApiCheckoutTransactionService {
  private checkoutsApiBaseUrl = `${environment.checkoutsApiBaseUrl}/api/checkout`;

  constructor(
    protected http: HttpClient,
    protected customerService: ApiCustomersService,
    protected authService: AuthService,
  ) {}

  getRolePermissions(): ITransactionRole {
    return getRolePermissions<ITransactionRole>(this.authService, transactionRole);
  }

  indexTransactions(
    userId,
    page,
    perPage,
    paymentStatus,
    keyword = '',
    from = '',
    to = '',
    paymentMethodFamily: string = CheckoutPaymentMethodFamily[0],
    paymentMethodType: string = CheckoutPaymentMethod[0],
    paymentMethodBrand: string = CheckoutPaymentMethodBrand[0],
  ): Observable<IPagination<ITransaction>> {
    const {hasView} = this.getRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.checkoutsApiBaseUrl}/admin/sessions`;
    const params = {
      userId,
      page,
      perPage,
      paymentStatus,
      keyword,
      from,
      to,
      paymentMethodFamily: !paymentMethodFamily ? '' : paymentMethodFamily,
      paymentMethodType: !paymentMethodType ? '' : paymentMethodType,
      paymentMethodBrand: !paymentMethodBrand ? '' : paymentMethodBrand,
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

    const url = `${this.checkoutsApiBaseUrl}/admin/sessions`;

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

    const url = `${this.checkoutsApiBaseUrl}/admin/sessions/${id}`;
    return this.http.get<ITransaction>(url);
  }

  syncPaymentStatus(id: string): Observable<string> {
    const {hasView} = this.getRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.checkoutsApiBaseUrl}/admin/sessions/${id}/sync`;
    return this.http.patch<string>(url, {});
  }
}
