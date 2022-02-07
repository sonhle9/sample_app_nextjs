import {environment} from 'src/environments/environment';
import {apiClient, extractError, extractErrorJSON} from 'src/react/lib/ajax';
import {
  PointRules,
  OperationType,
  LoyaltyCategory,
  PointRulesExpiries,
  PointRulesExpiriesParams,
  Statuses,
  ExpiryType,
} from './point-rules.type';
import {AxiosResponse} from 'axios';

const pointBaseURL = `${environment.variablesBaseUrl}/api/points-rules/admin`;

export const getPointRules = (operationType: OperationType): Promise<PointRules[]> => {
  return apiClient
    .get(`${pointBaseURL}/enterpriseRules`, {
      params: {enterpriseName: environment.enterprise, operationType},
    })
    .then((res: AxiosResponse<PointRules[]>) => res.data);
};

export const getPointRuleById = (id: string): Promise<PointRules> => {
  return apiClient
    .get(`${pointBaseURL}/rules/${id}`)
    .then((res: AxiosResponse<PointRules>) => res.data)
    .catch((e) => extractError(e));
};

export const createPointRule = (data: PointRules) => {
  data.loyaltyCategory = data.loyaltyCategory?.map((val) => val.match(/^\S*/g)[0]);

  return apiClient
    .post(`${pointBaseURL}/enterpriseRules`, {...data, enterpriseName: environment.enterprise})
    .catch((e) => extractError(e));
};

export const updatePointRule = (data: PointRules) => {
  data.loyaltyCategory = data.loyaltyCategory.map((val) => val.match(/^\S*/g)[0]);

  return apiClient.put(`${pointBaseURL}/rules/${data.id}`, data).catch((e) => extractError(e));
};

export const deletePointRule = (ruleId: string) => {
  return apiClient.delete(`${pointBaseURL}/rules/${ruleId}`).catch((e) => extractError(e));
};

export const reorderPointRules = (data: string[]) => {
  return apiClient.post(`${pointBaseURL}/rules/setPriority`, data).catch((e) => extractError(e));
};

export const getLoyaltyCategories = (params?: {categoryCode?: string; categoryName?: string}) => {
  if (params?.categoryCode) params['categoryCodes'] = [params.categoryCode];
  return apiClient
    .get(`${pointBaseURL}/loyalty-categories`, {
      params,
    })
    .then((res: AxiosResponse<LoyaltyCategory[]>) => res.data)
    .catch((e) => {
      console.error(e);
      return [];
    });
};

export const getLoyaltyCategoriesByCode = (code: string) =>
  apiClient
    .get(`${pointBaseURL}/loyalty-categories/${code}`)
    .then((res: AxiosResponse<LoyaltyCategory>) => res.data)
    .catch((e) => extractError(e));

export const createLoyaltyCategory = (data: LoyaltyCategory) =>
  apiClient.post(`${pointBaseURL}/loyalty-categories`, data).catch((e) => extractErrorJSON(e));

export const updateLoyaltyCategory = (data: LoyaltyCategory) => {
  const id = data.id;
  delete data.id;
  delete data.createdAt;
  delete data.updatedAt;
  return apiClient
    .put(`${pointBaseURL}/loyalty-categories/${id}`, data)
    .catch((e) => extractErrorJSON(e));
};

export const deleteLoyaltyCategory = (id: string) =>
  apiClient.delete(`${pointBaseURL}/loyalty-categories/${id}`).catch((e) => extractErrorJSON(e));

export const getPointExpiry = (operationType?: OperationType) =>
  apiClient
    .get(`${pointBaseURL}/expiry`, {params: {operationType}})
    .then((res: AxiosResponse<PointRulesExpiries[]>) => res.data);

export const updatePointExpiry = (data: PointRulesExpiries) =>
  apiClient.put(`${pointBaseURL}/expiry/${data.id}`, data).catch((e) => extractErrorJSON(e));

export const deletePointExpiry = (id: string) =>
  apiClient.delete(`${pointBaseURL}/expiry/${id}`).catch((e) => extractErrorJSON(e));

export const createPointExpiry = (data: PointRulesExpiriesParams) =>
  apiClient
    .post(`${pointBaseURL}/expiry`, {
      status: Statuses.ENABLED,
      expiryType: ExpiryType.HARD,
      operationType: OperationType.EARN,
      ...data,
    })
    .catch((e) => extractErrorJSON(e));
