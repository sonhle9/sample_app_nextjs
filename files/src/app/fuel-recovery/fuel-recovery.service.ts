import {formatParameters} from './../../shared/helpers/common';
import {IPagination} from './../../shared/interfaces/core.interface';
import {PermissionDeniedError} from './../../shared/helpers/permissionDenied.error';
import {retailRoles} from './../../shared/helpers/roles.type';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth.service';
import {environment} from 'src/environments/environment';
import {getRolePermissions} from 'src/shared/helpers/common';
import {throwError, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {IFuelRecoveryRole} from './interface/fuel-recovery.interface';

@Injectable({
  providedIn: 'root',
})
export class FuelRecoveryService {
  private apiBaseUrl = `${environment.orderApiBaseUrl}/api/orders/orders`;

  constructor(protected http: HttpClient, protected authService: AuthService) {}
  getRolePermissions(): IFuelRecoveryRole {
    return getRolePermissions<IFuelRecoveryRole>(this.authService, retailRoles);
  }

  indexFuelRecoveryByStatus(
    status: string,
    perPage: number,
    pageIndex: number,
  ): Observable<IPagination<any>> {
    const {hasFuelOrderRecoveryView} = this.getRolePermissions();
    if (hasFuelOrderRecoveryView) {
      return throwError(new PermissionDeniedError());
    }
    const page = pageIndex + 1;
    return this.http
      .get<any[]>(`${this.apiBaseUrl}/fuel/status?status=${status}`, {
        params: formatParameters({perPage, page}),
        observe: 'response',
      })
      .pipe(
        map((res) => ({
          max: Number.parseInt(res.headers.get('x-total-count'), 10) || 0,
          index: Number.parseInt(res.headers.get('x-next-page'), 10) || 0,
          page: Number.parseInt(res.headers.get('x-per-page'), 10) || 20,
          items: res.body,
        })),
      );
  }

  updateRecoveryInfo(orderId: string, payload): Observable<boolean | Error> {
    const {hasFuelOrderRecoveryUpdate} = this.getRolePermissions();
    if (!hasFuelOrderRecoveryUpdate) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/${orderId}/recovery/success`;
    return this.http.put<boolean>(url, payload);
  }

  updateLostOrder(orderId: string) {
    const {hasFuelOrderRecoveryUpdate} = this.getRolePermissions();
    if (!hasFuelOrderRecoveryUpdate) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/${orderId}/recovery/lost`;
    return this.http.put<boolean>(url, {});
  }
}
