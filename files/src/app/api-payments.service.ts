import {Injectable} from '@angular/core';
import {Observable, throwError, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ICreditCard, IAutoTopup} from '../shared/interfaces/creditCards.interface';
import {ApiCustomersService} from './api-customers.service';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {formatParameters, getRolePermissions} from '../shared/helpers/common';
import {map} from 'rxjs/operators';
import {
  IPrefundingBalanceAlert,
  IPrefundingBalanceAlertResponseItem,
  PrefundingBalanceTransaction,
  ITotalPrefundingBalanceResponse,
  IPrefundingBalanceDailySnapshotResponseItem,
} from '../shared/interfaces/prefundingBalance.interface';
import {
  IBalanceBatchUploadHistoryItem,
  IBatchGrantBalanceData,
} from '../shared/interfaces/balanceBatchUpload.interface';
import {environment} from '../environments/environment';
import {UTIL_TRANSACTIONS_SEARCH_TYPES} from './stations/shared/const-var';
import {toFormData} from '../shared/helpers/toFormData';
import {ITransactionRole} from '../shared/interfaces/transaction.interface';
import {transactionRole} from '../shared/helpers/roles.type';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiPaymentsService {
  private apiBaseUrl = '/api/ops';
  private paymentsApiBaseUrl = `${environment.paymentsApiBaseUrl}/api/payments`;

  constructor(
    private http: HttpClient,
    protected customerService: ApiCustomersService,
    protected authService: AuthService,
  ) {}

  getTransactionRolePermissions(): ITransactionRole {
    return getRolePermissions<ITransactionRole>(this.authService, transactionRole);
  }

  indexCreditCards(customerId: string): Observable<ICreditCard[]> {
    const role = this.customerService.getRolePermissions();
    if (!role || !role.hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url = this.paymentsApiBaseUrl + `/users/${customerId}/credit-cards`;
    return this.http.get<ICreditCard[]>(url);
  }

  readCreditCards(customerId: string, cardId: string): Observable<ICreditCard> {
    const role = this.customerService.getRolePermissions();
    if (!role || !role.hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url: string = this.paymentsApiBaseUrl + `/users/${customerId}/credit-cards/${cardId}`;
    return this.http.get<ICreditCard>(url);
  }

  public getWalletEnv(): Observable<string> {
    return of('api-payments-setel');
  }

  deleteCreditCard(creditCardId: string): Observable<ICreditCard> {
    const role = this.customerService.getRolePermissions();
    if (!role || !role.hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url: string = this.paymentsApiBaseUrl + `/admin/credit-cards/${creditCardId}`;
    return this.http.delete<ICreditCard>(url);
  }

  readAutoTopup(customerId: string): Observable<IAutoTopup> {
    const role = this.customerService.getRolePermissions();
    if (!role || !role.hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url: string = this.apiBaseUrl + `/wallet/${customerId}/auto-topup`;
    return this.http.get<IAutoTopup>(url);
  }

  grantWallet(userId: string, amount: number, message: string, tags: string[], expiryDate: string) {
    const role = this.customerService.getRolePermissions();
    if (!role || !role.hasWallet) {
      return throwError(new PermissionDeniedError());
    }

    const url: string = this.apiBaseUrl + `/wallet/grant`;
    return this.http.post<IAutoTopup>(url, {
      userId,
      amount,
      message,
      ...(tags && tags.length && {tags}),
      ...(expiryDate && {expiryDate}),
    });
  }

  refundTopupWallet(id: string): Observable<any> {
    const {hasView} = this.getTransactionRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.paymentsApiBaseUrl}/wallets/topup/${id}/refund`;
    return this.http.post<any>(url, null);
  }

  fetchTotalPrefundingBalance() {
    return this.http
      .get<ITotalPrefundingBalanceResponse>(`${this.paymentsApiBaseUrl}/admin/prefund-balance`, {
        observe: 'response',
      })
      .pipe(map((res) => res.body.amount.total));
  }

  indexDailySnapshots(page: number, perPage: number) {
    return this.http
      .get<IPrefundingBalanceDailySnapshotResponseItem[]>(
        `${this.paymentsApiBaseUrl}/admin/prefund-balance-daily-snapshots`,
        {
          params: formatParameters({page, perPage}),
          observe: 'response',
        },
      )
      .pipe(
        map((res) => ({
          max: Number.parseInt(res.headers.get('x-total-count'), 10) || 0,
          index: Number.parseInt(res.headers.get('x-next-page'), 10) || 0,
          page: Number.parseInt(res.headers.get('x-per-page'), 10) || 20,
          items: res.body,
        })),
      );
  }

  indexPrefundingBalanceAlerts(page: number, perPage: number) {
    return this.http
      .get<IPrefundingBalanceAlertResponseItem[]>(
        `${this.paymentsApiBaseUrl}/prefunding-balance-alert`,
        {
          params: formatParameters({page, perPage}),
          observe: 'response',
        },
      )
      .pipe(
        map((res) => ({
          max: Number.parseInt(res.headers.get('x-total-count'), 10) || 0,
          index: Number.parseInt(res.headers.get('x-next-page'), 10) || 0,
          page: Number.parseInt(res.headers.get('x-per-page'), 10) || 20,
          items: res.body,
        })),
      );
  }

  addPrefundingBalanceAlert(data: IPrefundingBalanceAlert) {
    return this.http.post<IPrefundingBalanceAlert>(
      `${this.paymentsApiBaseUrl}/prefunding-balance-alert`,
      data,
    );
  }

  deletePrefundingBalanceAlert(alertId: string) {
    return this.http.delete(`${this.paymentsApiBaseUrl}/prefunding-balance-alert/${alertId}`);
  }

  indexPrefundingBalanceUtilHistory(
    page: number,
    perPage: number,
    fromDate: string,
    toDate: string,
    searchType?: UTIL_TRANSACTIONS_SEARCH_TYPES,
    searchValue?: string,
  ) {
    const PER_PAGE_LIMIT = 200;
    const params: any = {page, perPage, fromDate, toDate, perPageLimit: PER_PAGE_LIMIT};

    if (searchType && searchValue) {
      switch (searchType) {
        case UTIL_TRANSACTIONS_SEARCH_TYPES.REFERENCE_ID:
          params.referenceId = searchValue;
          break;
        case UTIL_TRANSACTIONS_SEARCH_TYPES.MOBILE:
          params.mobile = searchValue;
          break;
      }
    }

    return this.http
      .get<PrefundingBalanceTransaction[]>(
        `${this.paymentsApiBaseUrl}/admin/prefund-transactions-history`,
        {
          params: formatParameters(params),
          observe: 'response',
        },
      )
      .pipe(
        map((res) => ({
          items: res.body,
        })),
      );
  }

  voidWalletBonus(transactionId: string, userId: string) {
    return this.http.post(`${this.paymentsApiBaseUrl}/admin/grant-balance/void`, {
      transactionId,
      userId,
    });
  }

  getBatchGrantBalanceProcessed(batchId: string) {
    return this.http.get(
      `${this.paymentsApiBaseUrl}/admin/batch-grant-balance-processed/${batchId}`,
      {
        observe: 'response',
      },
    );
  }

  batchGrantBalance(data: IBatchGrantBalanceData) {
    return this.http.post(`${this.paymentsApiBaseUrl}/admin/batch-grant-balance`, data, {
      reportProgress: true,
      observe: 'events',
    });
  }

  indexBalanceBatchUploadHistory(page: number, perPage: number) {
    const params: any = {page, perPage};

    return this.http
      .get<IBalanceBatchUploadHistoryItem[]>(
        `${this.apiBaseUrl}/wallet/bulk-wallet-granting/history`,
        {
          params: formatParameters(params),
          observe: 'response',
        },
      )
      .pipe(
        map((res) => ({
          items: res.body,
        })),
      );
  }

  parseBatchGrantBalanceCsv(data: any) {
    return this.http.post(
      `${this.apiBaseUrl}/wallet/upload-csv-bulk-wallet-granting`,
      toFormData(data),
      {
        reportProgress: true,
        observe: 'events',
      },
    );
  }

  cancelAuthorizedTransaction(params: ICancelPaymentByAdminInput) {
    return this.http.post(`${this.paymentsApiBaseUrl}/admin/cancel`, params);
  }

  tryUseIncomingBalance(userId: string) {
    return this.http.post(
      `${this.paymentsApiBaseUrl}/admin/users/${userId}/wallet/incoming-balance/try-use`,
      {},
    );
  }
}

export interface ICancelPaymentByAdminInput {
  readonly authorizationId: string;
  readonly amount: number;
  readonly orderId: string;
  readonly merchantId: string;
  readonly userId?: string;
  readonly posTransactionId?: string;
  readonly stationName?: string;
  readonly remark?: string;
  readonly referenceType?: string;
  readonly longitude?: string;
  readonly latitude?: string;
}
