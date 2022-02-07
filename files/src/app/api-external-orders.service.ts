import {Injectable, Output, EventEmitter} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Observable, throwError} from 'rxjs';
import {PermissionDeniedError} from '../shared/helpers/permissionDenied.error';
import {getRolePermissions, formatParameters} from '../shared/helpers/common';
import {retailRoles} from '../shared/helpers/roles.type';
import {IPagination} from '../shared/interfaces/core.interface';
import {map} from 'rxjs/operators';
import {
  IExternalOrder,
  IExternalOrderRole,
  ICsvFileOrderResponse,
  ICsvPreviewOrdersResponse,
} from 'src/shared/interfaces/externalOrder.interface';
import {toFormData} from 'src/shared/helpers/toFormData';

@Injectable({
  providedIn: 'root',
})
export class ApiExternalOrderService {
  private externalOrdersApiBaseUrl = `${environment.externalOrdersApiBaseUrl}/api/external-orders`;

  previewOrdersResponse = [];
  @Output() previewAvailable: EventEmitter<ICsvPreviewOrdersResponse[]> = new EventEmitter();

  constructor(protected http: HttpClient, protected authService: AuthService) {}

  getRolePermissions(): IExternalOrderRole {
    return getRolePermissions<IExternalOrderRole>(this.authService, retailRoles);
  }

  loadPreviewData(parsedData: ICsvPreviewOrdersResponse[]) {
    this.previewOrdersResponse = parsedData;
    this.previewAvailable.emit(this.previewOrdersResponse);
  }

  indexCustomerExternalOrders(
    userId,
    from = '',
    to = '',
    status = '',
    orderType = '',
  ): Observable<IPagination<IExternalOrder>> {
    const {hasExternalOrderView} = this.getRolePermissions();
    if (!hasExternalOrderView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.externalOrdersApiBaseUrl}/admin/customers/${userId}/orders`;
    return this.http
      .get<IExternalOrder[]>(url, {
        params: formatParameters({from, to, status, orderType}),
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

  getOrder(orderId): Observable<IExternalOrder> {
    const {hasExternalOrderView} = this.getRolePermissions();
    if (!hasExternalOrderView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.externalOrdersApiBaseUrl}/admin/orders/${orderId}`;
    return this.http.get<IExternalOrder>(url);
  }

  bulkUpdateCsv(csvData): Observable<HttpEvent<ICsvFileOrderResponse>> {
    const {hasExternalOrderUpdate} = this.getRolePermissions();
    if (!hasExternalOrderUpdate) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.externalOrdersApiBaseUrl}/admin/loyalty/bulk-grant`;
    return this.http.post<ICsvFileOrderResponse>(url, toFormData(csvData), {
      reportProgress: true,
      observe: 'events',
    });
  }

  bulkPreviewCsv(csvData): Observable<HttpEvent<ICsvPreviewOrdersResponse[]>> {
    const {hasExternalOrderUpdate} = this.getRolePermissions();
    if (!hasExternalOrderUpdate) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.externalOrdersApiBaseUrl}/admin/loyalty/bulk-grant/preview`;
    return this.http.post<ICsvPreviewOrdersResponse[]>(url, toFormData(csvData), {
      reportProgress: true,
      observe: 'events',
    });
  }

  downloadOrdersCsv(csvData): Observable<string> {
    const {hasExternalOrderUpdate} = this.getRolePermissions();
    if (!hasExternalOrderUpdate) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.externalOrdersApiBaseUrl}/admin/loyalty/bulk-grant/preview`;

    return this.http
      .post<Blob>(url, toFormData(csvData), {
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
}
