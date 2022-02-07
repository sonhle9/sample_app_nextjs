import * as React from 'react';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  getApprovalRequestDetails,
  getApprovalRequests,
  updateApprovalRequestToApprove,
  updateApprovalRequestToCancel,
  updateApprovalRequestToReject,
  updateApprovalRequestToReturn,
  updateRawRequest,
} from './approval-requests.service';
import {RawRequestUpdate, IApprovalRequestUpdate} from './approval-requests.type';

const APPROVAL_REQUESTS = 'approvalRequests';
const APPROVAL_REQUESTS_DETAILS = 'approval_requests_details';

export const useGetApprovalRequests = (filter: Parameters<typeof getApprovalRequests>[0]) => {
  return useQuery([APPROVAL_REQUESTS, filter], () => getApprovalRequests(filter), {
    keepPreviousData: true,
  });
};

export const useGetApprovalRequestDetails = (id: string) => {
  return useQuery([APPROVAL_REQUESTS_DETAILS, id], () => getApprovalRequestDetails(id));
};

export const useUpdateApprovalRequestToApprove = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (requestUpdate: IApprovalRequestUpdate) => updateApprovalRequestToApprove(requestUpdate),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([APPROVAL_REQUESTS]);
        setTimeout(() => {
          queryClient.invalidateQueries([APPROVAL_REQUESTS_DETAILS, id]);
        }, 1000);
      },
    },
  );
};

export const useUpdateRawRequest = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation((rawRequestUpdate: RawRequestUpdate) => updateRawRequest(rawRequestUpdate), {
    onSuccess: () => {
      queryClient.invalidateQueries([APPROVAL_REQUESTS]);
      setTimeout(() => {
        queryClient.invalidateQueries([APPROVAL_REQUESTS_DETAILS, id]);
      }, 1000);
    },
  });
};

export const useUpdateApprovalRequestToReject = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (requestUpdate: IApprovalRequestUpdate) => updateApprovalRequestToReject(requestUpdate),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([APPROVAL_REQUESTS]);
        setTimeout(() => {
          queryClient.invalidateQueries([APPROVAL_REQUESTS_DETAILS, id]);
        }, 1000);
      },
    },
  );
};

export const useUpdateApprovalRequestToCancel = (id: string) => {
  let timerId: number;
  const queryClient = useQueryClient();
  React.useEffect(() => () => window.clearTimeout(timerId), []);
  return useMutation((idReq: string) => updateApprovalRequestToCancel(idReq), {
    onSuccess: () => {
      queryClient.invalidateQueries([APPROVAL_REQUESTS]);
      timerId = window.setTimeout(() => {
        queryClient.invalidateQueries([APPROVAL_REQUESTS_DETAILS, id]);
      }, 1000);
    },
  });
};

export const useUpdateApprovalRequestToReturn = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    (requestUpdate: IApprovalRequestUpdate) => updateApprovalRequestToReturn(requestUpdate),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([APPROVAL_REQUESTS]);
        setTimeout(() => {
          queryClient.invalidateQueries([APPROVAL_REQUESTS_DETAILS, id]);
        }, 1000);
      },
    },
  );
};
