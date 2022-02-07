import {HttpClient} from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../environments/environment';
import {formatParameters} from '../shared/helpers/common';
import {IPagination} from '../shared/interfaces/core.interface';
import {
  IBaseVouchersBatch,
  IExtVoucherReport,
  IIndexExtVouchersReportFilters,
  IndexVouchersBatchFilters,
  IndexVouchersBatchReportFilters,
  IUpdateVouchersBatchInput,
  IVoucher,
  IVouchersBatch,
  IVouchersBatchBreakdown,
  IVouchersBatchReportItem,
  IVouchersInfo,
} from '../shared/interfaces/vouchers.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiVouchersService {
  private vouchersApiBaseUrl = `${environment.vouchersApiBaseUrl}/api/vouchers`;
  validationForm = new EventEmitter<any>();
  resetForm = new EventEmitter<any>();

  constructor(private http: HttpClient) {}

  indexVouchersBatches(
    page: number,
    perPage: number,
    filters: IndexVouchersBatchFilters,
  ): Observable<IPagination<IVouchersBatch>> {
    return this.http
      .get<IVouchersBatch[]>(`${this.vouchersApiBaseUrl}/admin/vouchers-batch`, {
        params: formatParameters({page, perPage, ...filters}),
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

  indexVouchersBatchesReport(
    page: number,
    perPage: number,
    filters: IndexVouchersBatchReportFilters,
  ): Observable<IPagination<IVouchersBatchReportItem>> {
    return this.http
      .get<IVouchersBatchReportItem[]>(`${this.vouchersApiBaseUrl}/admin/vouchers-batch/report`, {
        params: formatParameters({page, perPage, ...filters}),
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

  indexVouchers(
    customerId: string,
    page: number,
    perPage: number,
  ): Observable<IPagination<IVoucher>> {
    return this.http
      .get<IVoucher[]>(`${this.vouchersApiBaseUrl}/admin/vouchers/user/${customerId}`, {
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

  voidVoucher(code: string): Observable<void> {
    return this.http.post<void>(`${this.vouchersApiBaseUrl}/admin/vouchers/void/${code}`, {
      observe: 'response',
    });
  }

  createVouchersBatch(vouchersBatchData: IBaseVouchersBatch) {
    return this.http.post<IBaseVouchersBatch>(
      `${this.vouchersApiBaseUrl}/admin/vouchers-batch`,
      vouchersBatchData,
    );
  }

  uploadVouchersCodes(batchId: string, codes: string[]) {
    return this.http.put<IBaseVouchersBatch>(
      `${this.vouchersApiBaseUrl}/admin/vouchers-batch/${batchId}/codes`,
      codes,
    );
  }

  updateVouchersBatch(batchId, data: IUpdateVouchersBatchInput) {
    return this.http.put<IBaseVouchersBatch>(
      `${this.vouchersApiBaseUrl}/admin/vouchers-batch/${batchId}`,
      data,
    );
  }

  getBatchById(batchId: string): Observable<IVouchersBatch> {
    return this.http.get<IVouchersBatch>(
      `${this.vouchersApiBaseUrl}/admin/vouchers-batch/${batchId}`,
      {
        observe: 'body',
      },
    );
  }

  getBatchBreakdownById(batchId: string): Observable<IVouchersBatchBreakdown> {
    return this.http.get<IVouchersBatchBreakdown>(
      `${this.vouchersApiBaseUrl}/admin/vouchers-batch/${batchId}/batch-breakdown`,
      {
        observe: 'body',
      },
    );
  }

  validateVoucher(code: string): Observable<IVouchersInfo> {
    return this.http.get<IVouchersInfo>(`${this.vouchersApiBaseUrl}/admin/vouchers/${code}`, {
      observe: 'body',
    });
  }

  reTriggerRule(id: string) {
    return this.http.post(`${this.vouchersApiBaseUrl}/admin/vouchers/rules/${id}/trigger`, {
      observe: 'response',
    });
  }

  indexExtVouchersReport(
    page: number,
    perPage: number,
    filters: IIndexExtVouchersReportFilters,
  ): Observable<IPagination<IExtVoucherReport>> {
    return this.http
      .get<IExtVoucherReport[]>(`${this.vouchersApiBaseUrl}/admin/ext-vouchers-report`, {
        params: formatParameters({page, perPage, ...filters}),
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
