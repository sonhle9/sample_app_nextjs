import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {getRolePermissions, resetPagination} from 'src/shared/helpers/common';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {adminRole} from 'src/shared/helpers/roles.type';
import {IAdminRole, IOpsUser, IPermission} from 'src/shared/interfaces/opsUser.interface';
import {IPaginatedResult, IPagination} from '../shared/interfaces/core.interface';
import {ICredentialRepresentation} from './../shared/interfaces/opsUser.interface';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiOpsUsersService {
  private apiBaseUrl = '/api/ops/admin';

  constructor(protected http: HttpClient, protected authService: AuthService) {}

  getRolePermissions(): IAdminRole {
    return getRolePermissions<IAdminRole>(this.authService, adminRole);
  }

  indexOpsUsers({perPage, page}) {
    const {hasUserIndex} = this.getRolePermissions();
    if (!hasUserIndex) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.apiBaseUrl}/users`;
    return this.http.get<IPaginatedResult<IOpsUser[]>>(url, {
      params: {page, perPage},
    });
  }

  getGroupUsers({groupId, perPage, page}) {
    const {hasUserIndex} = this.getRolePermissions();
    if (!hasUserIndex) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/groups/${groupId}/users`;
    return this.http.get<IPaginatedResult<IOpsUser[]>>(url, {
      params: {page, perPage},
    });
  }

  opsUser(id: string): Observable<IOpsUser> {
    const {hasUserRead} = this.getRolePermissions();
    if (!hasUserRead) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/user/${id}`;
    return this.http.get<IOpsUser>(url);
  }

  getGroupPermissions(groupId: string): Observable<IPermission[]> {
    const {hasUserRead} = this.getRolePermissions();
    if (!hasUserRead) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/groups/${groupId}/permissions`;
    return this.http.get<IPermission[]>(url);
  }

  groups(): Observable<any> {
    const {hasUserRead} = this.getRolePermissions();
    if (!hasUserRead) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/groups`;
    return this.http.get<any>(url);
  }

  search(): Observable<IPagination<IOpsUser>> {
    const {hasUserSearch} = this.getRolePermissions();
    if (!hasUserSearch) {
      return throwError(new PermissionDeniedError());
    }

    return of(resetPagination<IOpsUser>(0, 0, 0));
  }

  add(payload: IOpsUser): Observable<any> {
    const {hasUserAdd} = this.getRolePermissions();
    if (!hasUserAdd) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.apiBaseUrl}/user`;
    return this.http.post<string>(url, payload);
  }

  updateUser(userId: string, payload: IOpsUser) {
    const {hasUserEdit} = this.getRolePermissions();
    if (!hasUserEdit) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/user/${userId}`;
    return this.http.put(url, payload);
  }

  assignUserGroup(userId: string, groupId: string): Observable<any> {
    const {hasUserAdd, hasUserEdit} = this.getRolePermissions();
    if (!hasUserAdd || !hasUserEdit) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.apiBaseUrl}/user/${userId}/group/${groupId}`;
    return this.http.put(url, {});
  }

  resetPassword(userId: string, payload: ICredentialRepresentation) {
    const {hasUserAdd, hasUserEdit} = this.getRolePermissions();
    if (!hasUserAdd || !hasUserEdit) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.apiBaseUrl}/user/${userId}/reset-password`;
    return this.http.put(url, payload);
  }

  deleteUserGroup(userId: string, groupId: string): Observable<any> {
    const {hasUserAdd, hasUserEdit} = this.getRolePermissions();
    if (!hasUserAdd || !hasUserEdit) {
      return throwError(new PermissionDeniedError());
    }
    const url = `${this.apiBaseUrl}/user/${userId}/group/${groupId}`;
    return this.http.delete(url);
  }

  update(): Observable<IOpsUser> {
    const {hasUserEdit} = this.getRolePermissions();
    if (!hasUserEdit) {
      return throwError(new PermissionDeniedError());
    }

    return of(null);
  }
}
