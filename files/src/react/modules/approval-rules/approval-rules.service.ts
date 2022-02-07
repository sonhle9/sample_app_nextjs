import _ from 'lodash';
import {environment} from 'src/environments/environment';
import {apiClient} from 'src/react/lib/ajax';
import {
  PAGES_COUNT_HEADER_NAME,
  PAGE_HEADER_NAME,
  PER_PAGE_HEADER_NAME,
  TOTAL_COUNT_HEADER_NAME,
} from 'src/react/services/service.type';
import {
  IApprovalRule,
  IApprovalRulesRequest,
  IApprover,
  IApproversRequest,
  ICreateApprovalRuleInput,
  IUpdateApprovalRuleInput,
} from './approval-rules.type';

const approvalRulesApiBaseUrl = `${environment.workflowsApiBaseUrl}/api/workflows`;

export const getApprovers = (req: IApproversRequest) => {
  const queryParams = _.mapValues(req, _.toString);
  return apiClient
    .get<IApprover[]>(`${approvalRulesApiBaseUrl}/admin/approvers`, {
      params: queryParams,
    })
    .then((res) => res.data || []);
};

export const getApprovalRules = (req: IApprovalRulesRequest) => {
  const queryParams = _.mapValues(_.pickBy(req, _.identity), _.toString);
  return apiClient
    .get<IApprovalRule[]>(`${approvalRulesApiBaseUrl}/admin/approval-rules`, {
      params: queryParams,
    })
    .then((res) => {
      if (res && res.data && res.headers) {
        const {
          [TOTAL_COUNT_HEADER_NAME]: totalDocs,
          [PAGES_COUNT_HEADER_NAME]: totalPages,
          [PER_PAGE_HEADER_NAME]: perPage,
          [PAGE_HEADER_NAME]: page,
        } = res.headers;
        return {
          approvalRules: res.data || [],
          totalDocs,
          totalPages,
          perPage,
          page,
        };
      }
      return null;
    });
};

export const getApprovalRuleDetails = (id: string) => {
  return apiClient
    .get<IApprovalRule>(`${approvalRulesApiBaseUrl}/admin/approval-rules/${id}`)
    .then((res) => res.data);
};

export const createApprovalRule = (data: ICreateApprovalRuleInput) => {
  return apiClient
    .post<IApprovalRule>(`${approvalRulesApiBaseUrl}/admin/approval-rules`, {
      feature: data.feature,
      levels: data.levels,
    })
    .then((res) => res.data);
};

export const updateApprovalRule = (approvalRule: IUpdateApprovalRuleInput) => {
  return apiClient
    .put<IApprovalRule>(`${approvalRulesApiBaseUrl}/admin/approval-rules/${approvalRule.id}`, {
      feature: approvalRule.feature,
      ...(approvalRule.levels && {levels: approvalRule.levels}),
      status: approvalRule.status,
    })
    .then((res) => res.data);
};

export const deleteApprovalRule = (approvalRuleId: string) => {
  return apiClient.delete(`${approvalRulesApiBaseUrl}/admin/approval-rules/${approvalRuleId}`);
};
