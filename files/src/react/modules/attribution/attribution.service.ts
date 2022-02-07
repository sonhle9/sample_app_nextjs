import {apiClient, fetchPaginatedData, IPaginationParam} from 'src/react/lib/ajax';
import {environment} from 'src/environments/environment';
import {IAttributeFilter, IAttributeRuleReadOnly, IAttributionRule} from './types';
import _pickBy from 'lodash/pickBy';

export function postAttributionRule(newRule: IAttributionRule): Promise<IAttributionRule> {
  return apiClient
    .post(`${environment.attributesApiBaseUrl}/api/attributes/admin/rules`, newRule)
    .then((res) => res.data);
}

export function putAttributionRule({
  referenceId,
  newRule,
}: {
  referenceId: string;
  newRule: IAttributionRule;
}): Promise<IAttributionRule> {
  return apiClient
    .put(`${environment.attributesApiBaseUrl}/api/attributes/admin/rules/${referenceId}`, newRule)
    .then((res) => res.data);
}

export function deleteAttributionRule(referenceId: string): Promise<any> {
  return apiClient
    .delete(`${environment.attributesApiBaseUrl}/api/attributes/admin/rules/${referenceId}`)
    .then((res) => res.data);
}

export function getAttributionRules(pagination: IPaginationParam, filters?: IAttributeFilter) {
  return fetchPaginatedData<IAttributeRuleReadOnly>(
    `${environment.attributesApiBaseUrl}/api/attributes/admin/rules`,
    pagination,
    {
      params: _pickBy(filters, Boolean),
    },
  );
}

export function getAttributionRule(referenceId: string) {
  return apiClient
    .get<IAttributeRuleReadOnly>(
      `${environment.attributesApiBaseUrl}/api/attributes/admin/rules/${referenceId}`,
    )
    .then((response) => response.data);
}

export function uploadAttributionRulesCSV(file: File) {
  const formData = new FormData();
  formData.append('file', file, file.name);
  return apiClient
    .post(`${environment.attributesApiBaseUrl}/api/attributes/admin/rules/csv/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data);
}
