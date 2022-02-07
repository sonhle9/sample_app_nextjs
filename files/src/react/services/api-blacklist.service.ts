import {
  IAllCustomerAccumulation,
  ICustomerLimitation,
  ICustomerLimitationType,
  IPeriodCustomerAccumulation,
} from 'src/app/api-blacklist-service';
import {environment} from 'src/environments/environment';
import {ajax, fetchPaginatedData, IPaginationParam, filterEmptyString} from '../lib/ajax';

const BASE_URL = `${environment.blacklistApiBaseUrl}/api/blacklist`;

export interface FraudProfile extends FraudProfilesInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IIndexFraudProfileFilters extends IPaginationParam {
  targetId?: string;
  targetName?: string;
  targetType?: FraudProfilesTargetType;
  status?: FraudProfilesStatus;
  restrictionType?: FraudProfilesRestrictionType;
  createdAtFrom?: string;
  createdAtTo?: string;
}

export const indexFraudProfiles = ({perPage, page, ...filter}: IIndexFraudProfileFilters) => {
  return fetchPaginatedData<FraudProfile>(
    `${BASE_URL}/admin/fraudProfiles`,
    {perPage, page},
    {params: filterEmptyString(filter)},
  );
};

export const getFraudProfile = (id: string) =>
  ajax
    .get<FraudProfile>(`${BASE_URL}/admin/fraudProfiles?targetId=${id}&targetType=USER`)
    .then((res) => res?.[0]);

export interface CreateFraudProfileInput
  extends Pick<FraudProfile, 'status' | 'restrictions' | 'remarks'> {}

export interface UpdateFraudProfileInput
  extends Pick<FraudProfile, 'status' | 'restrictions' | 'remarks'> {
  id: string;
}

export interface UpdateUserLimitation {
  userId: string;
  input: ICustomerLimitation[];
}
export const createFraudProfile = (input: FraudProfilesInput) =>
  ajax.post<FraudProfile>(`${BASE_URL}/admin/fraudProfiles`, input);

export const updateFraudProfile = (input: FraudProfilesInput) =>
  ajax.put<FraudProfile>(`${BASE_URL}/admin/fraudProfiles/${input.id}`, input);

export const getCustomerAccumulation = (userId: string) =>
  ajax
    .get<IPeriodCustomerAccumulation[]>(`${BASE_URL}/users/${userId}/customer-accumulation`)
    .then((res: IPeriodCustomerAccumulation[]) => {
      return {
        daily: res.find((item) => item.type === ICustomerLimitationType.DAILY),
        monthly: res.find((item) => item.type === ICustomerLimitationType.MONTHLY),
        annually: res.find((item) => item.type === ICustomerLimitationType.ANNUALLY),
      };
    });

export const updateCustomerLimitation = ({userId, input}: UpdateUserLimitation) =>
  ajax.put<IAllCustomerAccumulation>(`${BASE_URL}/users/${userId}/customer-limitations`, input);

export enum FraudProfilesRestrictionType {
  USER_TOPUP = 'USER_TOPUP',
  USER_CHARGE = 'USER_CHARGE',
  USER_LOGIN = 'USER_LOGIN',
}

export enum FraudProfilesStatus {
  CLEARED = 'CLEARED',
  WATCHLISTED = 'WATCHLISTED',
  BLACKLISTED = 'BLACKLISTED',
}

export enum FraudProfilesTargetType {
  USER = 'USER',
  MERCHANT = 'MERCHANT',
}

export enum FraudProfilesRestrictionValue {
  BLOCK = 'BLOCK',
  LIMIT = 'LIMIT',
}

export interface FraudProfilesRestriction {
  type: FraudProfilesRestrictionType;
  value: FraudProfilesRestrictionValue;
}
export interface FraudProfilesInput {
  id?: string;
  targetId: string;
  targetName: string;
  targetType: FraudProfilesTargetType;
  status: FraudProfilesStatus;
  restrictions: FraudProfilesRestriction[];
  remarks: string;
}
export interface FraudProfilesFormInput {
  status: FraudProfilesStatus;
  restrictions: FraudProfilesRestrictionType[];
  remarks: string;
}
