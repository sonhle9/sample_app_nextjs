import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {map} from 'rxjs/operators';
import {getRolePermissions} from 'src/shared/helpers/common';
import {PermissionDeniedError} from 'src/shared/helpers/permissionDenied.error';
import {adminFraudProfile} from 'src/shared/helpers/roles.type';
import {IPagination} from 'src/shared/interfaces/core.interface';
import {IFraudRole} from 'src/shared/interfaces/fraud.interface';
import {environment} from '../environments/environment';
import {AuthService} from './auth.service';

export enum FraudProfilesTargetType {
  USER = 'USER',
  MERCHANT = 'MERCHANT',
}

export enum FraudProfilesStatus {
  WATCHLISTED = 'WATCHLISTED',
  BLACKLISTED = 'BLACKLISTED',
  CLEARED = 'CLEARED',
}

export enum FraudProfilesRestrictionType {
  USER_TOPUP = 'USER_TOPUP',
  USER_CHARGE = 'USER_CHARGE',
  USER_LOGIN = 'USER_LOGIN',
}

export enum FraudProfilesRestrictionValue {
  BLOCK = 'BLOCK',
  LIMIT = 'LIMIT',
}

export interface IFraudProfilesRestriction {
  type: FraudProfilesRestrictionType;
  value: FraudProfilesRestrictionValue;
}

export interface IFraudProfilesCreateInput {
  targetId: string;
  targetName: string;
  targetType: FraudProfilesTargetType;
  status: FraudProfilesStatus;
  restrictions: IFraudProfilesRestriction[];
  remarks: string;
}

export interface IFraudProfiles extends IFraudProfilesCreateInput {
  id: string;
}

export interface IFraudProfilesUpdateInput {
  status?: FraudProfilesStatus;
  restrictions?: IFraudProfilesRestriction[];
}

export interface IFraudProfilesFilters {
  targetId?: string;
  targetName?: string;
  targetType?: FraudProfilesTargetType;
  status?: FraudProfilesStatus;
  restrictionType?: FraudProfilesRestrictionType;
  createdAtFrom?: string;
  createdAtTo?: string;
}

export interface ICustomerBlacklistRole {
  hasAccess: boolean;
  hasView: boolean;
  hasUpdate: boolean;
}

export enum ICustomerLimitationType {
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
  ANNUALLY = 'ANNUALLY',
}

interface ILimitationMetadata {
  interfaceType: string;
  osType: string;
  osVersion: string;
  isDeviceSupported: boolean;
}

export interface ICustomerLimitation {
  userId: string;
  type: ICustomerLimitationType;
  chargeLimit?: number;
  numberTransactionLimit?: number;
  maxTransactionAmount?: number;
  metadata?: ILimitationMetadata;
}

export interface ICustomerAccumulation {
  chargeAccumulation: number;
  numberTransactionAccumulation: number;
}

export interface IDailyCustomer extends ICustomerAccumulation, ICustomerLimitation {
  userId: string;
}

export interface IPeriodCustomerAccumulation extends ICustomerAccumulation, ICustomerLimitation {
  userId: string;
}
export interface IAllCustomerAccumulation {
  daily: IPeriodCustomerAccumulation;
  monthly: IPeriodCustomerAccumulation;
  annually: IPeriodCustomerAccumulation;
}

@Injectable({
  providedIn: 'root',
})
export class ApiBlacklistService {
  private apiBlacklistUrl = `${environment.blacklistApiBaseUrl}/api/blacklist`;

  constructor(private http: HttpClient, protected authService: AuthService) {}

  getRolePermissions(): IFraudRole {
    const roles: IFraudRole = getRolePermissions<IFraudRole>(this.authService, adminFraudProfile);
    if (this.authService.getRoles().includes(adminFraudProfile.adminUpdate)) {
      roles.hasAdminView = true;
    }
    return roles;
  }

  createOrUpdateFraudProfile(data: IFraudProfiles): Observable<IFraudProfiles> {
    if (data.id) {
      return this.updateFraudProfile(data.id, data);
    } else {
      return this.createFraudProfile(data);
    }
  }

  getFraudProfileByUserId(userId: string): Observable<IPagination<IFraudProfiles>> {
    return this.listFraudProfiles({
      targetId: userId,
      targetType: FraudProfilesTargetType.USER,
    });
  }

  createFraudProfile(data: IFraudProfilesCreateInput): Observable<IFraudProfiles> {
    const url: string = this.apiBlacklistUrl + '/admin/fraudProfiles';
    return this.http.post<IFraudProfiles>(url, data);
  }

  updateFraudProfile(id: string, data: IFraudProfilesUpdateInput): Observable<IFraudProfiles> {
    const url: string = this.apiBlacklistUrl + `/admin/fraudProfiles/${id}`;
    return this.http.put<IFraudProfiles>(url, data);
  }

  getFraudProfileById(id: string): Observable<IFraudProfiles> {
    const {hasAdminView} = this.getRolePermissions();
    if (!hasAdminView) {
      return throwError(new PermissionDeniedError());
    }
    return this.http.get<IFraudProfiles>(`${this.apiBlacklistUrl}/admin/fraudProfiles/${id}`);
  }

  getDailyCustomerAccumulation(userId: string): Observable<IDailyCustomer> {
    return this.http.get<IDailyCustomer>(
      `${this.apiBlacklistUrl}/users/${userId}/daily-customer-accumulation`,
    );
  }

  updateDailyCustomerLimitations(
    userId: string,
    data: Partial<ICustomerLimitation>,
  ): Observable<any> {
    return this.http.put<any>(
      `${this.apiBlacklistUrl}/users/${userId}/daily-customer-limitations`,
      data,
    );
  }

  listFraudProfiles(
    filters: IFraudProfilesFilters,
    page = 1,
    perPage = 50,
  ): Observable<IPagination<IFraudProfiles>> {
    const {hasAdminIndex} = this.getRolePermissions();
    if (!hasAdminIndex) {
      return throwError(new PermissionDeniedError());
    }
    const url: string = this.apiBlacklistUrl + '/admin/fraudProfiles';
    const query = new HttpParams().set('page', String(page)).set('perPage', String(perPage));
    const queryWithFilters = Object.entries(filters || {}).reduce(
      (acc, [key, value]) => acc.set(key, Array.isArray(value) ? value.join(',') : value),
      query,
    );
    return this.http
      .get<IFraudProfiles[]>(url, {
        params: queryWithFilters,
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
}
