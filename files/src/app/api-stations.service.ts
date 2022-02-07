import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

import {map} from 'rxjs/operators';
import {
  IReadStation,
  IIndexStation,
  IUpdateStation,
  IStationRole,
  IStationFeatureType,
  IReadPosStation,
} from '../shared/interfaces/station.interface';
import {IPagination} from '../shared/interfaces/core.interface';
import {AuthService} from './auth.service';
import {getRolePermissions, formatParameters} from 'src/shared/helpers/common';
import {retailRoles} from 'src/shared/helpers/roles.type';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {environment} from 'src/environments/environment';
import {ICStoreOrder, IInCarOrder} from '../shared/interfaces/storeOrder.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiStationsService {
  private stationsApiBaseUrl = `${environment.stationsApiBaseUrl}/api/stations`;
  private orderApiBaseUrl = `${environment.orderApiBaseUrl}/api/orders/orders`;
  private storeApiBaseUrl = `${environment.storeApiBaseUrl}/api/store-orders/admin/store-orders`;
  private inCarApiBaseUrl = `${environment.storeApiBaseUrl}/api/store-orders/admin/in-car`;

  constructor(protected http: HttpClient, protected authService: AuthService) {}

  getRolePermissions(): IStationRole {
    return getRolePermissions<IStationRole>(this.authService, retailRoles);
  }

  indexStations(
    pageIndex: number,
    perPage: number,
    name?: string,
    status?: string,
    vendorStatus?: string,
  ): Observable<IPagination<IIndexStation>> {
    const {hasStationView} = this.getRolePermissions();
    if (!hasStationView) {
      return throwError(new PermissionDeniedError());
    }

    const page = pageIndex + 1;
    const url = `${this.stationsApiBaseUrl}/stations`;

    let params = new HttpParams().set('page', page.toString()).set('perPage', perPage.toString());

    if (!!name) {
      params = params.set('name', name);
    }
    if (!!status) {
      params = params.set('status', status);
    }
    if (!!vendorStatus) {
      params = params.set('vendorStatus', vendorStatus);
    }

    return this.http
      .get<IIndexStation[]>(url, {
        params,
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

  fuelOrdersByStation(id, pageIndex, perPage, isInCarOrders): Observable<any> {
    const {hasStationView} = this.getRolePermissions();
    if (!hasStationView) {
      return throwError(new PermissionDeniedError());
    }
    const page = pageIndex + 1;

    id = `${id}`.toUpperCase();
    const url = `${this.orderApiBaseUrl}/station/${id}/orders`;
    return this.http
      .get<any>(url, {
        params: {page, perPage, isInCarOrders},
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

  storeOrdersByStation(stationId, pageIndex, perPage): Observable<any> {
    const {hasStationView} = this.getRolePermissions();
    if (!hasStationView) {
      return throwError(new PermissionDeniedError());
    }
    const page = pageIndex + 1;
    stationId = `${stationId}`.toUpperCase();
    return this.http
      .get<ICStoreOrder>(this.storeApiBaseUrl, {
        params: formatParameters({page, perPage, query: stationId}),
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

  inCarOrdersByStation(stationId, pageIndex, perPage): Observable<any> {
    const {hasStationView} = this.getRolePermissions();
    if (!hasStationView) {
      return throwError(new PermissionDeniedError());
    }

    const page = pageIndex + 1;
    stationId = `${stationId}`.toUpperCase();

    return this.http
      .get<IInCarOrder>(this.inCarApiBaseUrl, {
        params: formatParameters({page, perPage, stationId}),
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

  indexStationFeatures(): Observable<IStationFeatureType[]> {
    const {hasStationView} = this.getRolePermissions();
    if (!hasStationView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.stationsApiBaseUrl}/stations/feature/types`;
    return this.http.get<IStationFeatureType[]>(url);
  }

  station(id: string): Observable<IReadStation> {
    const {hasStationView} = this.getRolePermissions();
    if (!hasStationView) {
      return throwError(new PermissionDeniedError());
    }

    id = `${id}`.toUpperCase();
    const url = `${this.stationsApiBaseUrl}/stations/${id}`;
    return this.http.get<IReadStation>(url);
  }

  search(value, page, perPage): Observable<IPagination<IIndexStation>> {
    const {hasStationView} = this.getRolePermissions();
    if (!hasStationView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.stationsApiBaseUrl}/stations`;
    return this.http
      .get<IIndexStation[]>(url, {
        params: {page, perPage, name: value},
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

  add(stationId: string, vendorType: string): Observable<boolean | Error> {
    const {hasStationCreate} = this.getRolePermissions();
    if (!hasStationCreate) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.stationsApiBaseUrl}/administration/stations`;
    return this.http.post<boolean>(url, {id: stationId, stationId, vendorType});
  }

  update(stationId, station: IUpdateStation): Observable<IReadStation> {
    const {hasStationUpdate} = this.getRolePermissions();
    if (!hasStationUpdate) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.stationsApiBaseUrl}/administration/stations/${stationId}`;
    return this.http.put<IReadStation>(url, station);
  }

  syncPumps(stationId): Observable<IReadPosStation> {
    const {hasStationUpdate} = this.getRolePermissions();
    if (!hasStationUpdate) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.stationsApiBaseUrl}/stations/${stationId}/pos`;
    return this.http.get<IReadPosStation>(url, {});
  }

  updateStationPartially(stationId: string, payload: any): Observable<IReadStation> {
    const {hasStationUpdate} = this.getRolePermissions();
    if (!hasStationUpdate) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.stationsApiBaseUrl}/administration/stations/${stationId}`;
    return this.http.patch<IReadStation>(url, payload);
  }

  indexStationsMap(): Observable<Array<IIndexStation>> {
    const {hasStationView} = this.getRolePermissions();
    if (!hasStationView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.stationsApiBaseUrl}/stations`;
    return this.http.get<IIndexStation[]>(url);
  }
}
