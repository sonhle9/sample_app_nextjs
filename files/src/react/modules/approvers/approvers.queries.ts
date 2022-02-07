import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  createApprover,
  deleteApprover,
  getApproverDetails,
  getApprovers,
  updateApprover,
} from './approvers.service';
import {IApprover, ICreateApproverInput} from './approvers.type';

const APPROVERS = 'approvers';
const APPROVER_DETAILS = 'approver_details';

export const useGetApprovers = (filter: Parameters<typeof getApprovers>[0]) => {
  return useQuery([APPROVERS, filter], () => getApprovers(filter), {
    keepPreviousData: true,
  });
};

export const useGetApproverDetails = (id: string) => {
  return useQuery([APPROVER_DETAILS, id], () => getApproverDetails(id));
};

export const useSetApprover = (currentApprover: IApprover) => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: ICreateApproverInput) =>
      currentApprover
        ? updateApprover({
            ...currentApprover,
            ...data,
          })
        : createApprover(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([APPROVERS]);
        if (currentApprover) {
          queryClient.invalidateQueries([APPROVER_DETAILS, currentApprover.id]);
        }
      },
    },
  );
};

export const useDeleteApprover = (currentApprover: IApprover) => {
  const queryClient = useQueryClient();
  return useMutation((approverId: string) => deleteApprover(approverId || currentApprover.id), {
    onSuccess: () => {
      queryClient.invalidateQueries([APPROVERS]);
    },
  });
};
