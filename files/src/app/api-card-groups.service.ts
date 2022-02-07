import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {getRolePermissions} from 'src/shared/helpers/common';
import {
  ICardGroup,
  ICardGroupRole,
  ICardGroupIndexParams,
} from 'src/shared/interfaces/card-group.interface';
import {AuthService} from './auth.service';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {IPagination} from '../shared/interfaces/core.interface';
import * as _ from 'lodash';
import {map} from 'rxjs/operators';
import {cardGroupRole} from '../shared/helpers/roles.type';

@Injectable({providedIn: 'root'})
export class ApiCardGroupService {
  private cardGroupsApiBaseUrl = `${environment.cardsApiBaseUrl}/api/cards`;
  constructor(protected http: HttpClient, protected authService: AuthService) {}

  getRolePermissions(): ICardGroupRole {
    return getRolePermissions<ICardGroupRole>(this.authService, cardGroupRole);
  }

  indexCardGroups(
    page: number,
    perPage: number,
    params?: ICardGroupIndexParams,
  ): Observable<IPagination<ICardGroup>> {
    const {hasView} = this.getRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.cardGroupsApiBaseUrl}/admin/card-groups`;
    const queryParams = _.mapValues(_.merge({page, perPage}, params), _.toString);
    return this.http
      .get<ICardGroup[]>(url, {
        params: queryParams,
        observe: 'response',
      })
      .pipe(
        map((res) => ({
          max: +(res.headers.get('x-total-count') || 0),
          index: +(res.headers.get('x-next-page') || 0),
          page: +(res.headers.get('x-per-page') || 50),
          items: res.body,
        })),
      );
  }

  readCardGroupDetails(id): Observable<any> {
    const {hasRead} = this.getRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url: string = this.cardGroupsApiBaseUrl + `/admin/card-groups/${id}`;
    return this.http.get(url, {});
  }

  createCardGroup(cardGroup: ICardGroup): Observable<ICardGroup> {
    const {hasCreate} = this.getRolePermissions();
    if (!hasCreate) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.cardGroupsApiBaseUrl}/admin/card-groups`;
    return this.http
      .post<ICardGroup>(url, cardGroup, {observe: 'response'})
      .pipe(map((res) => res.body));
  }

  updateCardGroup(cardGroup: ICardGroup): Observable<ICardGroup> {
    const {hasUpdate} = this.getRolePermissions();
    if (!hasUpdate) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.cardGroupsApiBaseUrl}/admin/card-groups/${cardGroup.id}`;
    return this.http
      .put<ICardGroup>(url, cardGroup, {observe: 'response'})
      .pipe(map((res) => res.body));
  }

  createOrUpdateCardGroup(cardGroup: ICardGroup): Observable<ICardGroup> {
    if (cardGroup.id) {
      return this.updateCardGroup(cardGroup);
    } else {
      return this.createCardGroup(cardGroup);
    }
  }
}
