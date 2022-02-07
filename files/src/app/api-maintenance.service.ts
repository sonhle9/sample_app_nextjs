import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {environment} from '../environments/environment';

import {getRolePermissions} from '../shared/helpers/common';
import {maintenanceRole} from '../shared/helpers/roles.type';
import {
  IMalaysiaSystemState,
  IReadSystemStateResponse,
  IScheduleMaintenanceInput,
  IMaintenanceRole,
  IIPay88Bank,
} from '../shared/interfaces/maintenance.interface';
import {AuthService} from './auth.service';

export const DEFAULT_COUNTRY = 'malaysia';

@Injectable({
  providedIn: 'root',
})
export class ApiMaintenanceService {
  private apiBaseUrl = `${environment.maintenanceApiBaseUrl}/api/maintenance`;
  private walletApiBaseUrl = `${environment.walletApiBaseUrl}/api/wallets`;

  constructor(protected http: HttpClient, protected authService: AuthService) {}

  getRolePermissions(): IMaintenanceRole {
    return getRolePermissions<IMaintenanceRole>(this.authService, maintenanceRole);
  }

  readSystemState(): Observable<IMalaysiaSystemState> {
    if (!this.getRolePermissions()) {
      return throwError(new PermissionDeniedError());
    }

    return this.http
      .get<IReadSystemStateResponse>(`${this.apiBaseUrl}/maintenance/system-state`)
      .pipe(map((s) => s.malaysia));
  }

  scheduleMaintenance(body: IScheduleMaintenanceInput): Observable<IScheduleMaintenanceInput> {
    if (!this.getRolePermissions()) {
      return throwError(new PermissionDeniedError());
    }
    return this.http.post<IScheduleMaintenanceInput>(`${this.apiBaseUrl}/maintenance`, {
      ...body,
      country: DEFAULT_COUNTRY,
    });
  }

  completeMaintenance(scope: string) {
    if (!this.getRolePermissions()) {
      return throwError(new PermissionDeniedError());
    }
    return this.http.put(`${this.apiBaseUrl}/maintenance`, {
      scope,
      country: DEFAULT_COUNTRY,
    });
  }

  toggleMaintenance({key, body}: {key: string; body: Record<string, boolean>}): Observable<void> {
    if (!this.getRolePermissions()) {
      return throwError(new PermissionDeniedError());
    }
    return this.http.post<void>(`${this.apiBaseUrl}/maintenance/${key}/${DEFAULT_COUNTRY}`, body);
  }

  updateMaintenance(id, payload) {
    if (!this.getRolePermissions()) {
      return throwError(new PermissionDeniedError());
    }
    return this.http.put<void>(
      `${this.apiBaseUrl}/maintenance/future-maintenance-periods/${id}`,
      payload,
    );
  }

  getIPay88Banks(): Observable<IIPay88Bank[]> {
    if (!this.getRolePermissions()) {
      return throwError(new PermissionDeniedError());
    }

    return this.http.get<IIPay88Bank[]>(`${this.walletApiBaseUrl}/admin/ipay88_banks`).pipe(
      catchError((_) => {
        return of([]);
      }),
    );
  }

  updateIPay88BanksMainten(object: any): Observable<IIPay88Bank> {
    if (!this.getRolePermissions()) {
      return throwError(new PermissionDeniedError());
    }

    return this.http.put<IIPay88Bank>(
      `${this.walletApiBaseUrl}/admin/ipay88_banks/${object.paymentId}`,
      object.payload,
    );
  }
}
