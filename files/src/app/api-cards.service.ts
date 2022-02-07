import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {getRolePermissions} from 'src/shared/helpers/common';
import {
  ICard,
  ICardRole,
  ICardReplacementRole,
  ICardIndexParams,
  ICardUpdateInput,
  ICardCreateBulkInput,
  ICardReplacement,
} from 'src/shared/interfaces/card.interface';
import {AuthService} from './auth.service';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {IPagination} from '../shared/interfaces/core.interface';
import * as _ from 'lodash';
import {map} from 'rxjs/operators';
import {cardRole, cardReplacementRole} from '../shared/helpers/roles.type';

@Injectable({providedIn: 'root'})
export class ApiCardService {
  private cardsApiBaseUrl = `${environment.cardsApiBaseUrl}/api/cards`;
  constructor(protected http: HttpClient, protected authService: AuthService) {}

  getCardRolePermissions(): ICardRole {
    return getRolePermissions<ICardRole>(this.authService, cardRole);
  }

  getCardReplacementRolePermissions(): ICardReplacementRole {
    return getRolePermissions<ICardReplacementRole>(this.authService, cardReplacementRole);
  }

  indexCards(
    page: number,
    perPage: number,
    params?: ICardIndexParams,
  ): Observable<IPagination<ICard>> {
    const {hasView} = this.getCardRolePermissions();
    if (!hasView) {
      return throwError(new PermissionDeniedError());
    }
    this.getCardReplacementRolePermissions();
    const url = `${this.cardsApiBaseUrl}/admin/cards`;
    const queryParams = _.mapValues(_.merge({page, perPage}, params), _.toString);
    return this.http
      .get<ICard[]>(url, {
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

  readCard(id: string): Observable<ICard> {
    const {hasRead} = this.getCardRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.cardsApiBaseUrl}/admin/cards/${id}`;
    return this.http.get<ICard>(url);
  }

  createCardBulk(data: ICardCreateBulkInput): Observable<ICard> {
    const {hasCreate} = this.getCardRolePermissions();
    if (!hasCreate) {
      return throwError(new PermissionDeniedError());
    }

    const url: string = this.cardsApiBaseUrl + `/admin/cards/bulk`;
    return this.http.post<ICard>(url, data);
  }

  updateCard(id: string, data: ICardUpdateInput): Observable<ICard> {
    const {hasUpdate} = this.getCardRolePermissions();
    if (!hasUpdate) {
      return throwError(new PermissionDeniedError());
    }

    const url: string = this.cardsApiBaseUrl + `/admin/cards/${id}`;
    return this.http.put<ICard>(url, data);
  }

  createCardReplacement(data: ICardReplacement): Observable<ICardReplacement> {
    const {hasCreate} = this.getCardReplacementRolePermissions();
    if (!hasCreate) {
      return throwError(new PermissionDeniedError());
    }

    const url: string = this.cardsApiBaseUrl + `/admin/card-replacements`;
    return this.http.post<ICardReplacement>(url, data);
  }
}
