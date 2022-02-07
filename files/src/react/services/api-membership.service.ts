import {environment} from 'src/environments/environment';
import {
  IMembershipAction,
  ITier,
  IUserTierProgress,
} from 'src/shared/interfaces/membership.interface';
import {ajax, IPaginationParam} from '../lib/ajax';
import {PaginationTokenResponse} from '../modules/tokenPagination/tokenPagination.type';

const BASE_URL = `${environment.membershipApiBaseUrl}/api/membership`;

export const getUserTierProgress = (userId: string) =>
  ajax.get<IUserTierProgress>(`${BASE_URL}/admin/user/${userId}/tier/progress`);

export const listActions = (userId?: string, pagination?: IPaginationParam) =>
  ajax.get<PaginationTokenResponse<IMembershipAction>>(`${BASE_URL}/admin/actions`, {
    params: {...pagination, userId},
  });

export interface ReplaceTierRequestBody {
  progress: number[];
  tierId: string;
}

export const replaceUserTier = (userId: string, replaceTierRequestBody: ReplaceTierRequestBody) =>
  ajax.put(`${BASE_URL}/admin/user/${userId}/tier`, replaceTierRequestBody);

export const getMemberTiers = () => ajax.get<ITier[]>(`${BASE_URL}/tiers`);
