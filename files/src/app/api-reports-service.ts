import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {formatParameters, getRolePermissions} from 'src/shared/helpers/common';
import {map, tap} from 'rxjs/operators';
import {IUserOrderReport, IReportRole} from 'src/shared/interfaces/report.interface';
import * as _ from 'lodash';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {AuthService} from './auth.service';
import {reportRole} from 'src/shared/helpers/roles.type';
import {ApiCustomersService} from './api-customers.service';
import {ApiTransactionService} from './api-transactions.service';
import {ApiOrderService} from './api-orders.service';
import {ApiLoyaltyService} from './api-loyalty.service';
import {UTIL_TRANSACTIONS_SEARCH_TYPES} from './stations/shared/const-var';
import {environment} from 'src/environments/environment';
import {IIndexExtVouchersReportFilters} from '../shared/interfaces/vouchers.interface';
import {ApiStationsService} from './api-stations.service';

@Injectable({
  providedIn: 'root',
})
export class ApiReportsService {
  private apiBaseUrl = '/api/ops';
  private stationsApiBaseUrl = `${environment.stationsApiBaseUrl}/api/stations`;

  constructor(
    protected http: HttpClient,
    protected authService: AuthService,
    protected customersService: ApiCustomersService,
    protected orderService: ApiOrderService,
    protected loyaltyService: ApiLoyaltyService,
    protected transactionService: ApiTransactionService,
    protected stationService: ApiStationsService,
  ) {}

  getRolePermissions(): IReportRole {
    return getRolePermissions<IReportRole>(this.authService, reportRole);
  }

  userOrders(
    createdUsersFrom,
    createdUsersTo,
    hasOrderFrom,
    hasOrderTo,
    repeatedOrders,
    limitOrderCount,
  ): Observable<IUserOrderReport[]> {
    const {hasMenu} = this.getRolePermissions();
    if (!hasMenu) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/reports/users/orders`;
    const params = formatParameters({
      createdUsersFrom,
      createdUsersTo,
      hasOrderFrom,
      hasOrderTo,
      repeatedOrders,
      limitOrderCount,
    });

    return this.http
      .get<IUserOrderReport[]>(url, {params})
      .pipe(map((report) => _.orderBy(report, ['createdAt'], ['desc'])));
  }

  userFunnel(createdAtFrom: string, createdAtTo: string): Observable<string> {
    const {hasMenu} = this.getRolePermissions();
    if (!hasMenu) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/reports/users/funnel`;
    const params = formatParameters({createdAtFrom, createdAtTo});

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

  orders(type, from = '', to = '', query = '', status = '', tag = ''): Observable<string> {
    const role = this.orderService.getRolePermissions();
    if (!role || !role.hasFuelOrderView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/reports/orders`;
    const params = formatParameters({type, from, to, query, status, tag});

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

  transactions(type, subType, from = '', to = '', status = ''): Observable<string> {
    const role = this.transactionService.getRolePermissions();
    if (!role || !role.hasView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/reports/transactions`;
    const params = formatParameters({type, subType, from, to, status, utcOffset: 8});

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

  dailyLoyalty(fromDate = '', toDate = ''): Observable<string> {
    const role = this.loyaltyService.getRolePermissions();
    if (!role || !role.hasIndex) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/dailyTransaction/csv`;
    const params = formatParameters({fromDate, toDate, csv: true, utcOffset: 8});

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

  prefundingTransactions(
    page: number,
    perPage: number,
    fromDate: string,
    toDate: string,
    searchType?: UTIL_TRANSACTIONS_SEARCH_TYPES,
    searchValue?: string,
  ): Observable<string> {
    const params: any = {page, perPage, fromDate, toDate};

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

    const url = `${this.apiBaseUrl}/reports/wallets/prefund-transactions-history`;

    return this.http
      .post<Blob>(url, formatParameters(params), {
        responseType: 'blob' as 'json',
        headers: {
          accept: ' text/csv',
        },
      })
      .pipe(map(this.downloadCsv));
  }

  originalBulkWalletGrantFile(fileId: string): Observable<string> {
    const url = `${this.apiBaseUrl}/wallet/bulk-wallet-granting/${fileId}/original`;
    return this.http
      .get<Blob>(url, {
        responseType: 'blob' as 'json',
        headers: {
          accept: ' text/csv',
        },
      })
      .pipe(map(this.downloadCsv));
  }

  vouchersReportFile(batchId: string): Observable<string> {
    const url = `${this.apiBaseUrl}/reports/vouchers-batch/${batchId}`;
    return this.http
      .get<Blob>(url, {
        responseType: 'blob' as 'json',
        headers: {accept: ' text/csv'},
      })
      .pipe(map(this.downloadCsv));
  }

  failedBulkWalletGrantFile(fileId: string): Observable<string> {
    const url = `${this.apiBaseUrl}/wallet/bulk-wallet-granting/${fileId}/failed`;
    return this.http
      .get<Blob>(url, {
        responseType: 'blob' as 'json',
        headers: {
          accept: ' text/csv',
        },
      })
      .pipe(map(this.downloadCsv));
  }

  stationCsv(input: string): Observable<string> {
    const role = this.stationService.getRolePermissions();
    if (!role || !role.hasStationExport) {
      return throwError(new PermissionDeniedError());
    }

    const params: any = {name: input};
    const url = `${this.stationsApiBaseUrl}/stations`;

    return this.http
      .get<Blob>(url, {
        params: formatParameters(params),
        responseType: 'blob' as 'json',
        headers: {
          accept: 'text/csv',
        },
      })
      .pipe(map(this.downloadCsv));
  }

  private downloadCsv(blob): string {
    return window.URL.createObjectURL(blob);
  }

  voucherBatchCsvFile(batchId: string, undisableMethod?): Observable<string> {
    const url = `${this.apiBaseUrl}/reports/vouchers/${batchId}`;
    return this.http
      .get<Blob>(url, {
        responseType: 'blob' as 'json',
        headers: {
          accept: ' text/csv',
        },
      })
      .pipe(
        map(this.downloadCsv),
        tap(() => {
          if (undisableMethod) {
            undisableMethod(batchId);
          }
        }),
      );
  }

  extVouchersReportCsvFile(
    page: number,
    perPage: number,
    filters: IIndexExtVouchersReportFilters,
    undisableMethod,
  ): Observable<string> {
    const url = `${this.apiBaseUrl}/reports/ext-vouchers`;
    return this.http
      .get<Blob>(url, {
        params: formatParameters({page, perPage, ...filters}),
        responseType: 'blob' as 'json',
        headers: {
          accept: ' text/csv',
        },
      })
      .pipe(map(this.downloadCsv), tap(undisableMethod));
  }
}
