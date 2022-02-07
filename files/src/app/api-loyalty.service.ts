import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';

import {map} from 'rxjs/operators';
import {IPagination} from '../shared/interfaces/core.interface';
import {
  ILoyaltyTransaction,
  ILoyaltyRole,
  ILMSTransaction,
  IDailyTransaction,
  ILoyaltySearchResponse,
  ILoyaltyCardsInfo,
  IGrantPetronasPointsResponse,
  IPaginationMetadata,
} from 'src/shared/interfaces/loyalty.interface';
import {
  ILoyaltyCard,
  IVendorLoyaltyCard,
  IUpdateLoyaltyCardInput,
} from 'src/shared/interfaces/loyaltyCard.interface';
import {ICustomerRole, IdentityTypesEnum} from 'src/shared/interfaces/customer.interface';
import {AuthService} from './auth.service';
import {getRolePermissions, cleanObject} from 'src/shared/helpers/common';
import {customerRole, loyaltyRole} from 'src/shared/helpers/roles.type';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {LoyaltyReferenceTypesEnum} from 'src/shared/enums/loyalty.enum';

@Injectable({
  providedIn: 'root',
})
export class ApiLoyaltyService {
  private apiBaseUrl = '/api/ops';
  private apiLoyaltyUrl = '/api/loyalty';

  constructor(protected http: HttpClient, protected authService: AuthService) {}

  getCustomerRolePermissions(): ICustomerRole {
    return getRolePermissions<ICustomerRole>(this.authService, customerRole);
  }

  getRolePermissions(): ILoyaltyRole {
    return getRolePermissions<ILoyaltyRole>(this.authService, loyaltyRole);
  }

  readLoyaltyCard(cardId: string): Observable<ILoyaltyCard> {
    const {hasRead} = this.getCustomerRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url: string = this.apiBaseUrl + `/cards/${cardId}`;
    return this.http.get<ILoyaltyCard>(url);
  }

  readUnlinkedLoyalCard(userId: string): Observable<ILoyaltyCard[]> {
    const {hasRead} = this.getCustomerRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url: string = this.apiLoyaltyUrl + `/system/cards/unlink/${userId}`;
    return this.http.get<ILoyaltyCard[]>(url);
  }

  readVendorLoyaltyCard(number: string): Observable<IVendorLoyaltyCard> {
    const {hasRead} = this.getCustomerRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url: string = this.apiLoyaltyUrl + `/admin/loyaltyAccount/${number}`;
    return this.http.get<IVendorLoyaltyCard>(url);
  }

  readLoyaltyTransaction(id: string): Observable<ILoyaltyTransaction> {
    const {hasRead} = this.getCustomerRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url: string = this.apiBaseUrl + `/loyalty-transactions/${id}`;
    return this.http.get<ILoyaltyTransaction>(url);
  }

  addUserLoyaltyCard(userId: string, cardNumber: string): Observable<IVendorLoyaltyCard> {
    const {hasLoyaltyPointsGranting} = this.getCustomerRolePermissions();
    if (!hasLoyaltyPointsGranting) {
      return throwError(new PermissionDeniedError());
    }

    const url: string = this.apiBaseUrl + `/users/${userId}/loyalty-cards/${cardNumber}`;
    return this.http.post<IVendorLoyaltyCard>(url, {});
  }

  updateUserLoyaltyCard(
    userId: string,
    cardNumber: string,
    body: IUpdateLoyaltyCardInput,
  ): Observable<IVendorLoyaltyCard> {
    const {hasLoyaltyPointsGranting} = this.getCustomerRolePermissions();
    if (!hasLoyaltyPointsGranting) {
      return throwError(new PermissionDeniedError());
    }

    const url: string = this.apiBaseUrl + `/users/${userId}/loyalty-cards/${cardNumber}`;
    return this.http.put<IVendorLoyaltyCard>(url, body);
  }

  deleteUserLoyaltyCard(userId: string, cardNumber: string): Observable<void> {
    const {hasLoyaltyPointsGranting} = this.getCustomerRolePermissions();
    if (!hasLoyaltyPointsGranting) {
      return throwError(new PermissionDeniedError());
    }

    const url: string = this.apiBaseUrl + `/users/${userId}/loyalty-cards/${cardNumber}`;
    return this.http.delete<void>(url);
  }

  indexUserLoyaltyCards(userId: string): Observable<ILoyaltyCard> {
    const {hasRead} = this.getCustomerRolePermissions();
    if (!hasRead) {
      return throwError(new PermissionDeniedError());
    }

    const url: string = this.apiBaseUrl + `/users/${userId}/loyalty-cards`;
    return this.http.get<ILoyaltyCard>(url);
  }

  indexLoyaltyCards(
    page: number,
    perPage: number,
    cardNumber?: string,
    issuedBy?: string,
    status?: string,
    vendorStatus?: string,
    isPhysicalCard?: boolean,
    createdDateFrom?: string,
    createdDateTo?: string,
  ): Observable<IPagination<ILoyaltyCard>> {
    const {hasIndex} = this.getRolePermissions();
    if (!hasIndex) {
      return throwError(new PermissionDeniedError());
    }

    const params = cleanObject({
      cardNumber,
      issuedBy,
      status,
      vendorStatus,
      isPhysicalCard,
      createdDateFrom,
      createdDateTo,
      page,
      perPage,
    });
    const url: string = this.apiLoyaltyUrl + `/admin/cards`;
    return this.http
      .get<IPaginationMetadata<ILoyaltyCard[]>>(url, {
        params,
        observe: 'response',
      })
      .pipe(
        map((res) => ({
          max: +(res.body.metadata.totalCount || 0),
          index: +(res.body.metadata.currentPage || 0),
          page: +(res.body.metadata.pageSize || 20),
          items: res.body.data,
        })),
      );
  }

  indexLoyaltyTransactions(
    page: number,
    perPage: number,
    statuses?: string,
    issuers?: string,
    startDate?: string,
    endDate?: string,
  ): Observable<IPagination<ILoyaltyTransaction>> {
    const {hasIndex} = this.getRolePermissions();
    if (!hasIndex) {
      return throwError(new PermissionDeniedError());
    }

    const params = cleanObject({statuses, issuers, startDate, endDate, page, perPage});
    const url: string = this.apiLoyaltyUrl + `/transactions`;
    return this.http
      .get<IPaginationMetadata<ILoyaltyTransaction[]>>(url, {
        params,
        observe: 'response',
      })
      .pipe(
        map((res) => ({
          max: +(res.body.metadata.totalCount || 0),
          index: +(res.body.metadata.currentPage || 0),
          page: +(res.body.metadata.pageSize || 20),
          items: res.body.data,
        })),
      );
  }

  indexLmsLoyaltyTransactions(
    userId: string,
    page,
    perPage,
    type,
  ): Observable<IPagination<ILMSTransaction>> {
    const url = `${this.apiBaseUrl}/transactionHistory`;
    return this.http
      .get<ILMSTransaction[]>(url, {
        params: {userId, page, perPage, type},
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

  indexDailyTransactions(
    page,
    perPage,
    fromDate?: string,
    toDate?: string,
  ): Observable<IPagination<IDailyTransaction>> {
    const url = `${this.apiLoyaltyUrl}/system/dailyTransaction`;
    const params = {page, perPage};
    if (fromDate && toDate) {
      params['fromDate'] = fromDate;
      params['toDate'] = toDate;
    }
    return this.http
      .get<IDailyTransaction[]>(url, {
        params,
        observe: 'response',
      })
      .pipe(
        map((res) => {
          return {
            max: +(res.headers.get('x-total-count') || 0),
            index: +(res.headers.get('x-next-page') || 0),
            page: +(res.headers.get('x-per-page') || 20),
            items: res.body,
          };
        }),
      );
  }

  indexMonthlyTransactions(
    page,
    perPage,
    fromDate?: string,
    toDate?: string,
  ): Observable<IPagination<IDailyTransaction>> {
    const url = this.apiLoyaltyUrl + '/system/monthlyTransactions';
    const params = {page, perPage};
    if (fromDate && toDate) {
      params['fromDate'] = fromDate;
      params['toDate'] = toDate;
    }
    return this.http
      .get<IDailyTransaction[]>(url, {
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

  indexOrderLoyaltyTransactions(
    referenceId: string,
    referenceTypes: string,
    page,
    perPage,
  ): Observable<IPagination<ILoyaltyTransaction>> {
    const url = `${this.apiLoyaltyUrl}/transactions`;
    return this.http
      .get<IPaginationMetadata<ILoyaltyTransaction[]>>(url, {
        params: {referenceId, referenceTypes, page, perPage},
        observe: 'response',
      })
      .pipe(
        map((res) => ({
          max: +(res.body.metadata.totalCount || 0),
          index: +(res.body.metadata.currentPage || 0),
          page: +(res.body.metadata.pageSize || 20),
          items: res.body.data,
        })),
      );
  }

  indexUserLoyaltyTransactions(
    userId: string,
    page,
    perPage,
  ): Observable<IPagination<ILoyaltyTransaction>> {
    const url = `${this.apiBaseUrl}/users/${userId}/loyalty-transactions`;
    return this.http
      .get<IPaginationMetadata<ILoyaltyTransaction[]>>(url, {
        params: {page, perPage},
        observe: 'response',
      })
      .pipe(
        map((res) => ({
          max: +(res.body.metadata.totalCount || 0),
          index: +(res.body.metadata.currentPage || 0),
          page: +(res.body.metadata.pageSize || 20),
          items: res.body.data,
        })),
      );
  }

  grantLoyaltyPoints(userId: string, amount: number, title: string) {
    const {hasLoyaltyPointsGranting} = this.getCustomerRolePermissions();
    if (!hasLoyaltyPointsGranting) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/loyalty-transactions/grant`;
    return this.http.post<ILoyaltyTransaction>(url, {userId, amount, title});
  }

  manuallyGrantLoyaltyPoints(
    userId: string,
    grandTotal: number,
    transactionId?: string,
    transactionDateTime?: Date,
    referenceId?: string,
    referenceType?: LoyaltyReferenceTypesEnum,
  ) {
    const {hasLoyaltyPointsGranting} = this.getCustomerRolePermissions();
    if (!hasLoyaltyPointsGranting) {
      return throwError(new PermissionDeniedError());
    }

    const url: string = this.apiLoyaltyUrl + `/system/manuallyGrantPetronasPoints`;
    return this.http.post<IGrantPetronasPointsResponse>(url, {
      userId,
      grandTotal,
      transactionId,
      transactionDateTime,
      referenceId,
      referenceType,
    });
  }

  retryGrantPetronasPoints(orderId: string, points: number): Observable<string> {
    const {hasLoyaltyPointsGranting} = this.getCustomerRolePermissions();
    if (!hasLoyaltyPointsGranting) {
      return throwError(new PermissionDeniedError());
    }

    const url = `${this.apiBaseUrl}/orders/${orderId}/retry-grant-points`;
    return this.http.post<string>(url, {amount: points});
  }

  searchLoyatyCards(icNumber: string, icType: IdentityTypesEnum): Observable<ILoyaltyCardsInfo[]> {
    const {hasSearch} = this.getRolePermissions();
    if (!hasSearch) {
      return throwError(new PermissionDeniedError());
    }

    const url = this.apiLoyaltyUrl + '/admin/searchLoyaltyCards';
    return this.http
      .get<ILoyaltySearchResponse>(url, {
        params: {icNumber, icType},
        observe: 'response',
      })
      .pipe(map((res) => res.body.cardsInfo));
  }
}
