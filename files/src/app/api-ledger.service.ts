import {Injectable} from '@angular/core';
import {getRolePermissions, formatParameters} from '../shared/helpers/common';
import {AuthService} from './auth.service';
import {ledgerRole} from '../shared/helpers/roles.type';
import {throwError} from 'rxjs/internal/observable/throwError';
import {PermissionDeniedError} from '../shared/helpers/permissionDenied.error';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {IAccount, IPlatformAdjustInput} from './ledger/ledger-accounts.interface';
import {
  ILedgerRole,
  IReceivable,
  ILedgerTransaction,
  ILedgerReport,
} from './ledger/ledger.interface';
import {AccountsGroup, PlatformAccounts} from './ledger/ledger-accounts.enum';
import {Observable} from 'rxjs';
import {IPagination} from '../shared/interfaces/core.interface';
import {map} from 'rxjs/operators';
import {ITransaction} from '../shared/interfaces/merchant.interface';
import {
  ICreateFeeSetting,
  IFeeSettingsFilter,
} from 'src/react/modules/ledger/fee-settings/fee-settings.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiLedgerService {
  private baseUrl = `${environment.ledgerApiBaseUrl}/api/ledger`;

  constructor(protected http: HttpClient, protected authService: AuthService) {}

  getRolePermissions(): ILedgerRole {
    return getRolePermissions<ILedgerRole>(this.authService, ledgerRole);
  }

  // Accounts
  getPlatformBalances() {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.baseUrl}/accounts/platform`;
    return this.http.get<IAccount[]>(url);
  }

  getAggregatesBalances() {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.baseUrl}/accounts/aggregates`;
    return this.http.get<IAccount[]>(url);
  }

  adjustPlatformAccount(account: IPlatformAdjustInput) {
    const {hasAdjust} = this.getRolePermissions();
    if (!hasAdjust) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.baseUrl}/accounts/platform/adjust`;
    return this.http.post<IAccount>(url, {
      ...account,
    });
  }

  adjustBufferBalance(amount, reason) {
    const {hasAdjust} = this.getRolePermissions();
    if (!hasAdjust) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.baseUrl}/accounts/buffer/adjust`;
    return this.http.post<IAccount>(url, {
      amount,
      reason,
    });
  }

  transferToOperating(amount, reason) {
    const {hasTransfer} = this.getRolePermissions();
    if (!hasTransfer) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.baseUrl}/accounts/transfer`;
    return this.http.post<IAccount>(url, {
      from: {
        accountGroup: AccountsGroup.PLATFORM,
        userId: PlatformAccounts.trust1,
      },
      to: {
        accountGroup: AccountsGroup.PLATFORM,
        userId: PlatformAccounts.operating,
      },
      amount,
      reason,
    });
  }

  // Adjustments
  indexAdjustments(page, perPage, account, from, to): Observable<IPagination<ITransaction>> {
    const {hasIndex} = this.getRolePermissions();
    if (!hasIndex) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.baseUrl}/transactions/ledger/adjustments`;
    return this.http
      .get<ITransaction[]>(url, {
        params: formatParameters({page, perPage, account, from, to}),
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

  downloadAdjustmentsList(account, from, to): Observable<string> {
    const url = `${this.baseUrl}/transactions/ledger/adjustments`;
    const params = formatParameters({account, from, to});
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

  // Receivables
  indexReceivables(page, perPage, status, from, to): Observable<IPagination<IReceivable>> {
    const {hasIndex} = this.getRolePermissions();
    if (!hasIndex) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.baseUrl}/receivables`;
    return this.http
      .get<IReceivable[]>(url, {
        params: formatParameters({page, perPage, status, from, to}),
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

  readReceivable(id: string): Observable<IReceivable> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.baseUrl}/receivables/${id}`;
    return this.http.get<IReceivable>(url);
  }

  indexReceivableTransactions(
    id: string,
    isReconciled: boolean,
    page,
    perPage,
  ): Observable<IPagination<any>> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.baseUrl}/receivables/${id}/transactions`;

    return this.http
      .get<any[]>(url, {
        params: formatParameters({isReconciled, page, perPage}),
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

  downloadReceivablesTransactions(id: string, isReconciled: boolean): Observable<string> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.baseUrl}/receivables/${id}/transactions`;

    return this.http
      .get<Blob>(url, {
        params: formatParameters({isReconciled}),
        responseType: 'blob' as 'json',
        headers: {
          accept: 'text/csv',
        },
      })
      .pipe(map(this.downloadCsv));
  }

  downloadReceivablesList(status, from, to): Observable<string> {
    const role = this.getRolePermissions();
    if (!role || !role.hasIndex) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.baseUrl}/receivables`;
    const params = formatParameters({status, from, to});

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

  indexReceivableExceptions(id, page, perPage): Observable<any> {
    const {hasFinance} = this.getRolePermissions();
    if (!hasFinance) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.baseUrl}/receivables/${id}/exceptions`;
    return this.http
      .get<any[]>(url, {
        params: formatParameters({page, perPage}),
        observe: 'response',
      })
      .pipe(
        map((res) => ({
          max: +(res.headers.get('x-total-count') || 0),
          index: +(res.headers.get('x-next-page') || 0),
          page: +(res.headers.get('x-per-page') || 5),
          items: res.body,
        })),
      );
  }

  resolveReceivableException(id, exception): Observable<IReceivable> {
    const {hasFinance} = this.getRolePermissions();
    if (!hasFinance) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.baseUrl}/receivables/${id}/exceptions/resolve`;
    return this.http.put<IReceivable>(url, {
      ...exception,
    });
  }

  adjustReceivable(id, adjustmentAmount, totalAmount, feeAmount): Observable<IReceivable> {
    const {hasFinance} = this.getRolePermissions();
    if (!hasFinance) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.baseUrl}/receivables/${id}/adjust`;
    return this.http.post<IReceivable>(url, {
      adjustmentAmount,
      totalAmount,
      feeAmount,
    });
  }

  // transactions
  readLedgerTransaction(id: string): Observable<ILedgerTransaction> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.baseUrl}/transactions/${id}`;
    return this.http.get<ILedgerTransaction>(url);
  }

  indexLedgerTransactions(
    page,
    perPage,
    type,
    subType,
    status,
    from,
    to,
  ): Observable<IPagination<any>> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.baseUrl}/transactions`;

    return this.http
      .get<any[]>(url, {
        params: formatParameters({page, perPage, type, subType, status, from, to}),
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

  downloadLedgerTransactions(type, from, to): Observable<string> {
    const role = this.getRolePermissions();
    if (!role || !role.hasIndex) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.baseUrl}/transactions`;
    const params = formatParameters({type, from, to});

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

  // reports
  indexReports(page, perPage, type, from, to): Observable<IPagination<any>> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.baseUrl}/reports/index`;

    return this.http
      .get<any[]>(url, {
        params: formatParameters({page, perPage, type, from, to}),
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

  emailTrusteeReport(data): Observable<any> {
    const {hasFinance} = this.getRolePermissions();
    if (!hasFinance) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.baseUrl}/reports/trustee/email`;
    return this.http.post<any>(url, {...data});
  }

  readReport(id: string): Observable<ILedgerReport> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.baseUrl}/reports/${id}`;
    return this.http.get<ILedgerReport>(url);
  }

  updateReport(id: string, data): Observable<ILedgerReport> {
    const {hasFinance} = this.getRolePermissions();
    if (!hasFinance) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.baseUrl}/reports/${id}/update`;
    return this.http.post<any>(url, {...data});
  }

  downloadReports(type, from, to): Observable<string> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.baseUrl}/reports/index`;
    const params = formatParameters({type, from, to});

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

  // Fee Settings
  indexFeeSettings(indexFeeSettingsFilter: IFeeSettingsFilter): Observable<IPagination<any>> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.baseUrl}/fee-settings`;

    return this.http
      .get<any[]>(url, {
        params: formatParameters(indexFeeSettingsFilter),
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

  createFeeSetting(createFeeSetting: ICreateFeeSetting): Observable<any> {
    const {hasFinance} = this.getRolePermissions();
    if (!hasFinance) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.baseUrl}/fee-settings/create`;
    return this.http.put<any>(url, createFeeSetting);
  }

  deleteFeeSetting(id: string): Observable<any> {
    const {hasFinance} = this.getRolePermissions();
    if (!hasFinance) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.baseUrl}/fee-settings/${id}`;
    return this.http.delete<any>(url);
  }

  // Fee daily summary
  getDailySummary(paymentGatewayVendor: string, transactionDate: string): Observable<any> {
    const {hasFinance} = this.getRolePermissions();
    if (!hasFinance) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.baseUrl}/fee-daily-summary`;
    return this.http.get<any[]>(url, {
      params: {
        paymentGatewayVendor,
        transactionDate,
      },
    });
  }

  private downloadCsv(blob): string {
    return window.URL.createObjectURL(blob);
  }
}
