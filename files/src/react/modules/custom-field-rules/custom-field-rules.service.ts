import {environment} from '../../../environments/environment';
import {apiClient, fetchPaginatedData} from '../../lib/ajax';
import {extractErrorWithConstraints} from '../../lib/utils';
import {
  CustomerCategory,
  ICustomFieldRule,
  ICustomFieldRulesRequest,
  IMutationCustomFieldRule,
} from './custom-field-rules.type';

export const getCustomFieldRules = (filter: ICustomFieldRulesRequest = {page: 1, perPage: 10}) => {
  return fetchPaginatedData<ICustomFieldRule>(
    `${environment.opsApiBaseUrl}/api/custom-field-rules/custom-field-rules`,
    {
      ...filter,
    },
    {
      params: {},
    },
  );
};

export const getCustomFieldRuleDetail = (customFieldId: string): Promise<ICustomFieldRule> => {
  return apiClient
    .get<ICustomFieldRule>(
      `${environment.opsApiBaseUrl}/api/custom-field-rules/custom-field-rules/${customFieldId}`,
    )
    .then((res) => res.data)
    .catch((err) =>
      Promise.reject({
        message: extractErrorWithConstraints(err),
      }),
    );
};

export const createCustomFieldRule = (customField: IMutationCustomFieldRule) => {
  return apiClient
    .post<IMutationCustomFieldRule>(
      `${environment.opsApiBaseUrl}/api/custom-field-rules/custom-field-rules`,
      customField,
    )
    .then((res) => res.data);
};

export const createCustomFieldRuleMulti = (customField: IMutationCustomFieldRule) => {
  return apiClient
    .post<IMutationCustomFieldRule>(
      `${environment.opsApiBaseUrl}/api/custom-field-rules/custom-field-rules/multiple`,
      customField,
    )
    .then((res) => res.data);
};

export const updateCustomFieldRule = (customField: IMutationCustomFieldRule) => {
  return apiClient
    .put<IMutationCustomFieldRule>(
      `${environment.opsApiBaseUrl}/api/custom-field-rules/custom-field-rules/${customField.id}`,
      customField,
    )
    .then((res) => res.data);
};

export const indexCustomerCategories = (): Promise<any> => {
  return apiClient
    .get<CustomerCategory>(`${environment.apiBaseUrl}/api/customers/categories/index`)
    .then((res) => {
      return res.data;
    });
};

export const deleteCustomFieldRule = (customFieldId: string): Promise<ICustomFieldRule> => {
  return apiClient
    .delete<ICustomFieldRule>(
      `${environment.opsApiBaseUrl}/api/custom-field-rules/custom-field-rules/${customFieldId}`,
    )
    .then((res) => res.data);
};
export interface IFilter {
  name: string;
  companyType?: string;
  page?: number;
  perPage?: string;
}
export const getMerchants = (filters: IFilter): Promise<any> => {
  return apiClient
    .get(`${environment.apiBaseUrl}/api/merchants/admin/merchants`, {
      params: {
        name: filters.name || null,
        perPage: filters.perPage || 50,
      },
    })
    .then((res) => res.data);
};
export const getCompanies = (filters: IFilter): Promise<any> => {
  return apiClient
    .get(
      `${environment.companiesApiBaseUrl}/api/companies/admin/companies?keyWord=${filters.name}&perPage=${filters.perPage}`,
    )
    .then((res) => res.data);
};
