import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {getRolePermissions, formatParameters} from '../shared/helpers/common';
import {IPagination} from '../shared/interfaces/core.interface';
import {map} from 'rxjs/operators';
import {Store} from '../shared/interfaces/store.interface';
import {retailRoles} from '../shared/helpers/roles.type';
import {AuthService} from './auth.service';
import {PermissionDeniedError} from '../shared/helpers/permissionDenied.error';
import IStoresRole = Store.IStoresRole;

@Injectable({
  providedIn: 'root',
})
export class ApiStoresService {
  private apiBaseUrl = `${environment.storeApiBaseUrl}/api/stores`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getRolePermissions(): IStoresRole {
    return getRolePermissions<IStoresRole>(this.authService, retailRoles);
  }

  indexStores(
    page,
    perPage,
    name = '',
    status: string = '',
    stationName: string = '',
  ): Observable<IPagination<Store.IStore>> {
    const {hasStoreView} = this.getRolePermissions();
    if (!hasStoreView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/admin/stores`;
    return this.http
      .get<Store.IStore[]>(url, {
        params: formatParameters({page, perPage, name, stationName, status}),
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

  store(storeId: string): Observable<Store.IStore> {
    const {hasStoreView} = this.getRolePermissions();
    if (!hasStoreView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/admin/stores/${storeId}`;
    return this.http.get<Store.IStore>(url);
  }

  update(storeId: string, data): Observable<Store.IStore> {
    const {hasStoreUpdate} = this.getRolePermissions();
    if (!hasStoreUpdate) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/admin/stores/${storeId}`;
    return this.http.put<Store.IStore>(url, data);
  }
}
