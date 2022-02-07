import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  createApprovalRule,
  deleteApprovalRule,
  getApprovalRuleDetails,
  getApprovalRules,
  getApprovers,
  updateApprovalRule,
} from './approval-rules.service';
import {IApprovalRule, IApprover, ICreateApprovalRuleInput} from './approval-rules.type';

const APPROVERS = 'approvers';
const APPROVAL_RULES = 'approvalRules';
const APPROVAL_RULE_DETAILS = 'approval_rule_details';

export const useGetApprovers = (filter: Parameters<typeof getApprovers>[0]) => {
  return useQuery([APPROVERS, filter], () =>
    filter.userEmail ? getApprovers(filter) : (Promise.resolve([]) as Promise<IApprover[]>),
  );
};

export const useGetApprovalRules = (filter: Parameters<typeof getApprovalRules>[0]) => {
  return useQuery([APPROVAL_RULES, filter], () => getApprovalRules(filter), {
    keepPreviousData: true,
  });
};

export const useGetApprovalRuleDetails = (id: string) => {
  return useQuery([APPROVAL_RULE_DETAILS, id], () => getApprovalRuleDetails(id));
};

export const useSetApprovalRule = (currentApprovalRule: IApprovalRule) => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: ICreateApprovalRuleInput) =>
      currentApprovalRule
        ? updateApprovalRule({
            ...currentApprovalRule,
            ...data,
          })
        : createApprovalRule(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([APPROVAL_RULES]);

        if (currentApprovalRule) {
          queryClient.invalidateQueries([APPROVAL_RULE_DETAILS, currentApprovalRule.id]);
        }
      },
    },
  );
};

export const useDeleteApprovalRule = (currentApprovalRule: IApprovalRule) => {
  const queryClient = useQueryClient();
  return useMutation(
    (approvalRuleId: string) => deleteApprovalRule(approvalRuleId || currentApprovalRule.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([APPROVAL_RULES]);
      },
    },
  );
};
