import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {IMobileVersion, IMobileVersionPayload} from '../shared/interfaces/version.interface';
import {IPaginatedResult} from '../shared/interfaces/core.interface';
import {IMaintenanceRole} from '../shared/interfaces/maintenance.interface';
import {maintenanceRole} from '../shared/helpers/roles.type';
import {getRolePermissions} from '../shared/helpers/common';
import {AuthService} from './auth.service';

export const DEFAULT_PER_PAGE = 50;

@Injectable({providedIn: 'root'})
export class ApiMobileVersionsService {
  private apiBaseUrl = `${environment.maintenanceApiBaseUrl}/api/maintenance`;

  constructor(protected http: HttpClient, protected authService: AuthService) {}

  getRolePermissions(): IMaintenanceRole {
    return getRolePermissions<IMaintenanceRole>(this.authService, maintenanceRole);
  }

  list({page}: {page: number}) {
    return this.http.get<IPaginatedResult<IMobileVersion[]>>(
      `${this.apiBaseUrl}/mobile-versions?page=${page}&perPage=${DEFAULT_PER_PAGE}`,
    );
  }

  create(payload: IMobileVersionPayload) {
    return this.http.post<IMobileVersion>(`${this.apiBaseUrl}/mobile-versions`, payload);
  }

  update(id: string, payload: IMobileVersionPayload) {
    return this.http.put<IMobileVersion>(`${this.apiBaseUrl}/mobile-versions/${id}`, payload);
  }

  get({id}: {id: string}) {
    return this.http.get<IMobileVersion>(`${this.apiBaseUrl}/mobile-versions/${id}`);
  }

  delete({id}: {id: string}) {
    return this.http.delete<void>(`${this.apiBaseUrl}/mobile-versions/${id}`);
  }
}
