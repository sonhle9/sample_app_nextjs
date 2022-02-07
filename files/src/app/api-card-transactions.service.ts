import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {getRolePermissions, formatParameters} from 'src/shared/helpers/common';
import {
  ICardTransaction,
  ICardTransactionRole,
  ICardTransactionIndexParams,
  EmailTransactionInput,
} from 'src/shared/interfaces/card-transaction.interface';
import {AuthService} from './auth.service';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {IPagination} from '../shared/interfaces/core.interface';
import * as _ from 'lodash';
import {map} from 'rxjs/operators';
import {cardTransactionRole} from '../shared/helpers/roles.type';

@Injectable({providedIn: 'root'})
export class ApiCardTransactionsService {
  private cardTransactionsApiBaseUrl = `${environment.cardsApiBaseUrl}/api/cards`;
  constructor(protected http: HttpClient, protected authService: AuthService) {}

  getRolePermissions(): ICardTransactionRole {
    return getRolePermissions<ICardTransactionRole>(this.authService, cardTransactionRole);
  }

  indexCardTransactions(
    page: number,
    perPage: number,
    params?: ICardTransactionIndexParams,
  ): Observable<IPagination<ICardTransaction>> {
    const {hasView} = this.getRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.cardTransactionsApiBaseUrl}/admin/transactions`;
    const queryParams = Object.assign(_.mapValues(_.merge({page, perPage}), _.toString), params);
    return this.http
      .get<ICardTransaction[]>(url, {
        params: queryParams,
        observe: 'response',
      })
      .pipe(
        map((res) => ({
          max: +(res.headers.get('x-total-count') || 0),
          index: +(res.headers.get('x-next-page') || 0),
          page: +(res.headers.get('x-per-page') || 15),
          items: res.body,
        })),
      );
  }

  readCardTransactions(id: string): Observable<ICardTransaction> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.cardTransactionsApiBaseUrl}/admin/transactions/${id}`;
    return this.http.get<ICardTransaction>(url);
  }

  downloadTransaction(filter?: ICardTransactionIndexParams, transactionId?): Observable<string> {
    const {hasView} = this.getRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }
    const url = transactionId
      ? `${this.cardTransactionsApiBaseUrl}/admin/transactions/${transactionId}`
      : `${this.cardTransactionsApiBaseUrl}/admin/transactions`;
    const params = formatParameters(filter || {});

    return this.http
      .get<Blob>(url, {
        params,
        responseType: 'blob' as 'json',
        headers: {
          accept: ' text/csv',
        },
      })
      .pipe(map(this.downloadCsv));
  }

  private downloadCsv(blob): string {
    return window.URL.createObjectURL(blob);
  }

  sendEmail(emailTransactionInput: EmailTransactionInput, filter?: ICardTransactionIndexParams) {
    const {hasView} = this.getRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.cardTransactionsApiBaseUrl}/admin/transactions/send-email`;
    const params = formatParameters(filter || {});
    return this.http.post<string>(url, emailTransactionInput, {
      params,
    });
  }
}
