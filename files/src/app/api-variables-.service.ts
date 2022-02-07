import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {experienceAppSettingsRoles} from '../shared/helpers/roles.type';
import {getRolePermissions} from '../shared/helpers/common';
import {IAppSettings, IExperienceAppSettingsRole} from '../shared/interfaces/variables.interface';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class ApiVariablesService {
  private apiBaseUrl = `${environment.variablesBaseUrl}/api/variables/admin`;

  constructor(protected http: HttpClient, protected authService: AuthService) {}

  getRolePermissions(): IExperienceAppSettingsRole {
    return getRolePermissions<IExperienceAppSettingsRole>(
      this.authService,
      experienceAppSettingsRoles,
    );
  }

  getAppSettings(userId?: string): Observable<any> {
    let url = `${this.apiBaseUrl}/app-settings`;
    if (userId) {
      url += `?userId=${userId}`;
    }

    return this.http.get(url).pipe(map((res) => _.omit(res, ['_id', 'isGlobal', '__v'])));
  }

  createAppSettings(data: IAppSettings): Observable<any> {
    const url = `${this.apiBaseUrl}/app-settings`;
    return this.http.post(url, data);
  }

  updateAppSettings(data: IAppSettings): Observable<any> {
    const url = `${this.apiBaseUrl}/app-settings`;
    return this.http.put(url, data);
  }

  createOrUpdateAppSettings(data: IAppSettings): Observable<any> {
    return this.updateAppSettings(data).pipe(catchError(() => this.createAppSettings(data)));
  }
}
