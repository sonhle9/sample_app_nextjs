import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {throwError} from 'rxjs/internal/observable/throwError';
import {map} from 'rxjs/operators';
import {environment} from '../environments/environment';
import {formatParameters, getRolePermissions} from '../shared/helpers/common';
import {PermissionDeniedError} from '../shared/helpers/permissionDenied.error';
import {ledgerRole} from '../shared/helpers/roles.type';
import {IPagination} from '../shared/interfaces/core.interface';
import {IPayout} from '../shared/interfaces/payout.interface';
import {AuthService} from './auth.service';
import {ILedgerRole, IPayoutProjection} from './ledger/ledger.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiProcessorService {
  private apiBaseUrl = '/api/processor';
  private processorApiBaseUrl = `${environment.processorApiBaseUrl}${this.apiBaseUrl}`;

  constructor(private http: HttpClient, protected authService: AuthService) {}

  getRolePermissions(): ILedgerRole {
    return getRolePermissions<ILedgerRole>(this.authService, ledgerRole);
  }

  indexPayouts(page, perPage): Observable<IPagination<any>> {
    const url: string = this.processorApiBaseUrl + `/admin/payouts`;

    return this.http
      .get<any[]>(url, {
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

  readPayoutDetail(id): Observable<any> {
    const url: string = this.processorApiBaseUrl + `/admin/payouts/${id}`;

    return this.http.get(url, {});
  }

  readTodaySummary(): Observable<any> {
    const url: string = this.processorApiBaseUrl + `/admin/payouts-batch/today-summary`;

    return this.http.get(url, {});
  }

  readPayoutBatch(id): Observable<any> {
    const url: string = this.processorApiBaseUrl + `/admin/payouts-batch/${id}`;

    return this.http.get(url, {});
  }

  indexPayoutBatch(page, perPage, status, from, to): Observable<IPagination<any>> {
    const url: string = this.processorApiBaseUrl + `/admin/payouts-batch`;

    return this.http
      .get<any[]>(url, {
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

  downloadPayoutBatches(status, from, to): Observable<string> {
    const role = this.getRolePermissions();
    if (!role || !role.hasIndex) {
      return throwError(new PermissionDeniedError());
    }

    const url: string = this.processorApiBaseUrl + `/admin/payouts-batch`;
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

  indexPayoutsByBatchId(batchId: string, status, page, perPage): Observable<IPagination<IPayout>> {
    const url: string = this.processorApiBaseUrl + `/admin/payouts-batch/${batchId}/payouts`;

    return this.http
      .get<any[]>(url, {
        params: formatParameters({page, status, perPage}),
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

  getPayoutProjection(referenceDate: string) {
    return this.http.get<IPayoutProjection[]>(
      `${this.processorApiBaseUrl}/admin/payouts/projection`,
      {
        params: formatParameters({referenceDate}),
      },
    );
  }

  getPayoutMax(referenceDate?: string) {
    return this.http.get<{
      transactionDate: string;
      totalAmount: string;
    }>(`${this.processorApiBaseUrl}/admin/payouts/max`, {
      params: formatParameters({referenceDate}),
    });
  }

  private downloadCsv(blob): string {
    return window.URL.createObjectURL(blob);
  }
}
