import {environment} from 'src/environments/environment';
import {apiClient, extractError} from 'src/react/lib/ajax';
import {UnlinkHistoryParams, UnlinkHistory, ILoyaltyMemberWhitelist} from './loyalty-members.type';
import {PaginationMetadata} from 'src/shared/interfaces/pagination.interface';
import {AxiosResponse} from 'axios';
const loyaltyMemberBaseURL = `${environment.variablesBaseUrl}/api/loyalty-members/admin`;
const loyaltyBaseURL = `${environment.variablesBaseUrl}/api/loyalty/admin`;

export const getLoyaltyMemberUnlinkHistory = (params?: UnlinkHistoryParams) =>
  apiClient
    .get(`${loyaltyMemberBaseURL}/card/unlink`, {params})
    .then((res: AxiosResponse<PaginationMetadata<UnlinkHistory[]>>) => res.data)
    .catch((e) => extractError(e));

export const getLoyaltyMemberWhitelist = (whitelist: ILoyaltyMemberWhitelist) =>
  apiClient
    .get(
      `${loyaltyBaseURL}/fraud-rules/whitelist/${whitelist.loyaltyMemberId}?ruleId=${whitelist.ruleId}`,
    )
    .then((res: AxiosResponse<ILoyaltyMemberWhitelist>) => res.data)
    .catch((e) => extractError(e));

export const loyaltyMemberWhitelist = (whitelist: ILoyaltyMemberWhitelist) =>
  apiClient
    .post(`${loyaltyBaseURL}/fraud-rules/whitelist`, {
      ...whitelist,
    })
    .then((res: AxiosResponse<ILoyaltyMemberWhitelist>) => res.data)
    .catch((e) => extractError(e));

export const loyaltyMemberUnwhitelist = (whitelist: ILoyaltyMemberWhitelist) =>
  apiClient
    .delete(
      `${loyaltyBaseURL}/fraud-rules/whitelist/${whitelist.loyaltyMemberId}?ruleId=${whitelist.ruleId}`,
    )
    .then((res: AxiosResponse) => res.data)
    .catch((e) => extractError(e));
