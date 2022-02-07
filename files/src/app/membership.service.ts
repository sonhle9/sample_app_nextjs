import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {
  ITier,
  IUserTierProgress,
  IMembershipAction,
} from '../shared/interfaces/membership.interface';

export interface IGetProgressParams {
  userId: string;
}

export interface IReplaceUserTierParams {
  userId: string;
  tierId: string;
  progress: number[];
}

export interface IListActionsParams {
  userId?: string;
  page: number;
  perPage: number;
}

export interface IListActionsResponse {
  total: number;
  data: IMembershipAction[];
}

@Injectable({providedIn: 'root'})
export class MembershipService {
  private baseUrl = `${environment.membershipApiBaseUrl}/api/membership`;

  constructor(private http: HttpClient) {}

  listTiers() {
    return this.http.get<ITier[]>(`${this.baseUrl}/tiers`);
  }

  listActions(params: IListActionsParams) {
    return this.http.get<IListActionsResponse>(`${this.baseUrl}/admin/actions`, {
      params: params as any,
    });
  }

  getProgress({userId}: IGetProgressParams) {
    return this.http.get<IUserTierProgress>(`${this.baseUrl}/admin/user/${userId}/tier/progress`);
  }

  replaceUserTier({userId, ...body}: IReplaceUserTierParams) {
    return this.http.put<IUserTierProgress>(`${this.baseUrl}/admin/user/${userId}/tier`, body);
  }
}
