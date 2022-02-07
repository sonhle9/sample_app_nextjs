import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {merchantRole} from '../shared/helpers/roles.type';
import {formatParameters, getRolePermissions} from 'src/shared/helpers/common';
import {Observable, of, throwError} from 'rxjs';
import {IPagination} from '../shared/interfaces/core.interface';
import {PermissionDeniedError} from '../shared/helpers/permissionDenied.error';
import {map, tap} from 'rxjs/operators';
import {
  IMerchant,
  IMerchantIndexParams,
  IMerchantRole,
  IMerchantUpdateModel,
  IDevice,
  IDeviceIndexParams,
  ITransaction,
  IMerchantTransactionIndexParams,
  IMerchantType,
  IEnterpriseProducts,
} from '../shared/interfaces/merchant.interface';
import * as _ from 'lodash';
import {SETEL_MERCHANT_ID} from './merchants/shared/constants';
import {IDeviceUpdateModel} from './devices/shared/device.interface';

@Injectable({providedIn: 'root'})
export class ApiMerchantsService {
  private readonly merchantsApiBaseUrl = `${environment.merchantsApiBaseUrl}/api/merchants`;
  private cache = {};

  constructor(protected http: HttpClient, protected authService: AuthService) {}

  getRolePermissions(): IMerchantRole {
    const roles = getRolePermissions<IMerchantRole>(this.authService, merchantRole);

    return roles;
  }

  indexMerchants(
    page: number,
    perPage: number,
    params?: IMerchantIndexParams,
  ): Observable<IPagination<IMerchant>> {
    const {hasView} = this.getRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.merchantsApiBaseUrl}/admin/merchants`;
    const queryParams = _.mapValues(_.merge({page, perPage}, params), _.toString);
    return this.http
      .get<IMerchant[]>(url, {
        params: queryParams,
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

  indexDevices(
    page: number,
    perPage: number,
    params?: IDeviceIndexParams,
  ): Observable<IPagination<IDevice>> {
    const {hasView} = this.getRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.merchantsApiBaseUrl}/admin/devices`;
    const queryParams = _.mapValues(_.merge({page, perPage}, params), _.toString);
    return this.http
      .get<IDevice[]>(url, {
        params: queryParams,
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

  topupSetelPrepaid(amount: number): Observable<any> {
    const url = `${this.merchantsApiBaseUrl}/admin/merchants/${SETEL_MERCHANT_ID}/balances/topup-prepaid`;
    if (!this.authService.getRoles().includes('setel-finance')) {
      return throwError(new PermissionDeniedError());
    }
    return this.http.post<any>(url, {
      currency: 'MYR',
      amount,
    });
  }

  readMerchant(merchantId: string): Observable<IMerchant> {
    const url = `${this.merchantsApiBaseUrl}/admin/merchants/${merchantId}`;
    return this.http.get<IMerchant>(url, {observe: 'response'}).pipe(map((res) => res.body));
  }

  createMerchant(merchant: IMerchantUpdateModel): Observable<IMerchant> {
    const {hasModifier} = this.getRolePermissions();
    if (!hasModifier) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.merchantsApiBaseUrl}/admin/merchants`;
    return this.http
      .post<IMerchant>(url, merchant, {observe: 'response'})
      .pipe(map((res) => res.body));
  }

  createDevice(device: IDeviceUpdateModel): Observable<IDevice> {
    /*const {hasAdd} = this.getRolePermissions();
    if (!hasAdd) {
      return throwError(new PermissionDeniedError());
    }*/
    const url = `${this.merchantsApiBaseUrl}/admin/devices`;
    return this.http.post<IDevice>(url, device, {observe: 'response'}).pipe(map((res) => res.body));
  }

  indexMerchantTypes(): Observable<IMerchantType[]> {
    const url = `${this.merchantsApiBaseUrl}/admin/merchant-types`;
    return this.http.get<IMerchantType[]>(url);
  }

  indexMerchantTypesUsed(): Observable<IMerchantType[]> {
    const url = `${this.merchantsApiBaseUrl}/admin/merchant-types/used`;
    return this.http.get<IMerchantType[]>(url);
  }

  createMerchantType(merchantType: IMerchantType): Observable<IMerchantType> {
    const url = `${this.merchantsApiBaseUrl}/admin/merchant-types`;
    return this.http
      .post<IMerchantType>(url, merchantType, {observe: 'response'})
      .pipe(map((res) => res.body));
  }

  updateDevice(deviceId: string, device: IDeviceUpdateModel): Observable<IDevice> {
    /*const {hasAdd} = this.getRolePermissions();
    if (!hasAdd) {
      return throwError(new PermissionDeniedError());
    }*/
    const url = `${this.merchantsApiBaseUrl}/admin/devices/${deviceId}`;
    return this.http.put<IDevice>(url, device, {observe: 'response'}).pipe(map((res) => res.body));
  }

  readDevice(deviceId: string): Observable<IDevice> {
    const {hasView} = this.getRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.merchantsApiBaseUrl}/admin/devices/${deviceId}`;
    return this.http.get<IDevice>(url);
  }

  // TODO: update type
  createAdjustmentTransaction(data: any): Observable<any> {
    const {hasModifier} = this.getRolePermissions();
    if (!hasModifier) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.merchantsApiBaseUrl}/admin/transactions/adjustments`;
    return this.http.post<IMerchant>(url, data, {observe: 'response'}).pipe(map((res) => res.body));
  }

  indexTransactions(
    page: number,
    perPage: number,
    params: IMerchantTransactionIndexParams,
  ): Observable<IPagination<ITransaction>> {
    const {hasView} = this.getRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.merchantsApiBaseUrl}/admin/transactions`;
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

  readTransaction(transactionUid: string): Observable<ITransaction> {
    const {hasView} = this.getRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.merchantsApiBaseUrl}/admin/transactions/${transactionUid}`;
    return this.http.get<ITransaction>(url);
  }

  health(): Observable<any> {
    const url = `${this.merchantsApiBaseUrl}/health`;
    return this.http.get<any>(url);
  }

  indexEnterpriseProducts(): Observable<IEnterpriseProducts> {
    const url = `${this.merchantsApiBaseUrl}/enterprise`;
    const cacheKey = url;

    const cachedEnterprise = this.cache[cacheKey] as IEnterpriseProducts;
    if (cachedEnterprise) {
      return of(cachedEnterprise);
    }

    return this.http.get<IEnterpriseProducts[]>(url).pipe(
      map((e) => e.reduce((acc, current) => Object.assign(acc, {...current}), {})),
      tap((res) => (this.cache[cacheKey] = res)),
    );
  }
}
