import _ from 'lodash';
import {environment} from 'src/environments/environment';
import {apiClient} from 'src/react/lib/ajax';
import {
  PAGES_COUNT_HEADER_NAME,
  PAGE_HEADER_NAME,
  PER_PAGE_HEADER_NAME,
  TOTAL_COUNT_HEADER_NAME,
} from 'src/react/services/service.type';
import {IApprover, IApproversRequest, ICreateApproverInput} from './approvers.type';

const approvalRulesApiBaseUrl = `${environment.workflowsApiBaseUrl}/api/workflows`;

export const getApprovers = (req: IApproversRequest) => {
  const queryParams = _.mapValues(_.pickBy(req, _.identity), _.toString);

  return apiClient
    .get<IApprover[]>(`${approvalRulesApiBaseUrl}/admin/approvers`, {
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
          approvers: res.data || [],
          totalDocs,
          totalPages,
          perPage,
          page,
        };
      }
      return null;
    });
};

export const getApproverDetails = (id: string) => {
  return apiClient
    .get<IApprover>(`${approvalRulesApiBaseUrl}/admin/approvers/${id}`)
    .then((res) => res.data);
};

export const createApprover = (data: ICreateApproverInput) => {
  return apiClient
    .post<IApprover>(`${approvalRulesApiBaseUrl}/admin/approvers`, {
      userEmail: data.userEmail,
      approvalLimit: data.approvalLimit,
      status: data.status,
    })
    .then((res) => res.data);
};

export const updateApprover = (approver: IApprover) => {
  return apiClient
    .put<IApprover>(`${approvalRulesApiBaseUrl}/admin/approvers/${approver.id}`, {
      userEmail: approver.userEmail,
      approvalLimit: approver.approvalLimit,
      status: approver.status,
    })
    .then((res) => res.data);
};

export const deleteApprover = (approverId: string) => {
  return apiClient.delete(`${approvalRulesApiBaseUrl}/admin/approvers/${approverId}`);
};
