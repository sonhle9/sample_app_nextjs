import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {transactionRole} from '../shared/helpers/roles.type';
import {ITransactionRole} from '../shared/interfaces/transaction.interface';
import {formatParameters, getRolePermissions} from '../shared/helpers/common';
import {Observable, throwError} from 'rxjs';
import {IPagination} from '../shared/interfaces/core.interface';
import {PermissionDeniedError} from '../shared/helpers/permissionDenied.error';
import {map} from 'rxjs/operators';
import {ITransaction, ITransactionIndexParams} from '../shared/interfaces/wallet.interface';
import {Currency} from '../shared/enums/wallet.enum';

@Injectable({providedIn: 'root'})
export class ApiWalletsService {
  private readonly walletsApiBaseUrl = `${environment.walletsApiBaseUrl}/api/wallets`;

  constructor(protected http: HttpClient, protected authService: AuthService) {}

  getTransactionRolePermissions(): ITransactionRole {
    return getRolePermissions<ITransactionRole>(this.authService, transactionRole);
  }

  indexTransactions(
    page: number,
    perPage: number,
    params?: ITransactionIndexParams,
  ): Observable<IPagination<ITransaction>> {
    const {hasView} = this.getTransactionRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.walletsApiBaseUrl}/transactions`;
    return this.http
      .get<ITransaction[]>(url, {
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

  readTransaction(
    transactionUid: string,
    options?: {
      includeRefundStatus?: boolean;
    },
  ): Observable<ITransaction> {
    const {hasView} = this.getTransactionRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.walletsApiBaseUrl}/transactions/${transactionUid}`;
    return this.http.get<ITransaction>(url, {
      params: formatParameters({
        ...options,
      }),
    });
  }

  createAdjustmentTransaction(data: {
    amount: number;
    customerId: string;
    currency: Currency;
    comment: string;
  }): Observable<ITransaction> {
    const url = `${this.walletsApiBaseUrl}/transactions/adjustments`;
    return this.http.post<ITransaction>(url, data, {
      headers: {
        'x-handled-user-id': data.customerId,
      },
    });
  }

  refundTransaction(referenceId: string): Observable<ITransaction> {
    const {hasView} = this.getTransactionRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.walletsApiBaseUrl}/admin/topups/${referenceId}/refund`;
    return this.http.post<ITransaction>(url, null);
  }

  findTxsByReferenceId(referenceId: string): Observable<IPagination<ITransaction>> {
    const {hasView} = this.getTransactionRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.walletsApiBaseUrl}/transactions`;
    return this.http
      .get<ITransaction[]>(url, {
        params: formatParameters({referenceId}),
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
}
