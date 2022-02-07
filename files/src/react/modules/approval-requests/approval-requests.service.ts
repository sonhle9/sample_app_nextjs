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
  IApprovalRequests,
  IApprovalRequestsRequest,
  RawRequestUpdate,
  IApprovalRequestUpdate,
} from './approval-requests.type';

const workflowApiBaseUrl = `${environment.workflowsApiBaseUrl}/api/workflows`;

export const getApprovalRequests = (req: IApprovalRequestsRequest) => {
  const queryParams = _.mapValues(_.pickBy(req, _.identity));

  return apiClient
    .get<IApprovalRequests[]>(`${workflowApiBaseUrl}/admin/approval-requests`, {
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
          approvalRequests: res.data || [],
          totalDocs,
          totalPages,
          perPage,
          page,
        };
      }
      return null;
    });
};

export const getApprovalRequestDetails = (id: string) => {
  return apiClient
    .get<IApprovalRequests>(`${workflowApiBaseUrl}/admin/approval-requests/${id}`)
    .then((res) => res.data);
};

export const updateApprovalRequestToApprove = (requestUpdate: IApprovalRequestUpdate) => {
  const url = `${workflowApiBaseUrl}/admin/approval-requests/${requestUpdate.id}/approve`;
  return apiClient.put<IApprovalRequests>(url, requestUpdate).then((res) => res.data);
};

export const updateRawRequest = (rawRequestUpdate: RawRequestUpdate) => {
  const url = `${workflowApiBaseUrl}/admin/approval-requests/update-request`;
  return apiClient.put<IApprovalRequests>(url, rawRequestUpdate).then((res) => res.data);
};

export const updateApprovalRequestToReject = (requestUpdate: IApprovalRequestUpdate) => {
  const url = `${workflowApiBaseUrl}/admin/approval-requests/${requestUpdate.id}/reject`;
  return apiClient.put<IApprovalRequests>(url, requestUpdate).then((res) => res.data);
};

export const updateApprovalRequestToCancel = (id: string) => {
  return apiClient
    .put<IApprovalRequests>(`${workflowApiBaseUrl}/admin/approval-requests/${id}/cancel`)
    .then((res) => res.data);
};

export const updateApprovalRequestToReturn = (requestUpdate: IApprovalRequestUpdate) => {
  const url = `${workflowApiBaseUrl}/admin/approval-requests/${requestUpdate.id}/return`;
  return apiClient.put<IApprovalRequests>(url, requestUpdate).then((res) => res.data);
};
