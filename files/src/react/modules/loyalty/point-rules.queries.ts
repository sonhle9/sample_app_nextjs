import {useQuery, useMutation, useQueryClient, UseQueryOptions} from 'react-query';
import {
  getPointRules,
  getPointRuleById,
  createPointRule,
  deletePointRule,
  reorderPointRules,
  updatePointRule,
  getLoyaltyCategories,
  getLoyaltyCategoriesByCode,
  createLoyaltyCategory,
  updateLoyaltyCategory,
  deleteLoyaltyCategory,
  getPointExpiry,
  updatePointExpiry,
  deletePointExpiry,
  createPointExpiry,
} from './point-rules.service';
import {
  PointRules,
  OperationType,
  Statuses,
  LoyaltyCategory,
  PointRulesExpiries,
  PointRulesExpiriesParams,
} from './point-rules.type';
import {AxiosError} from 'axios';

export const useGetAllRedemptionRules = () =>
  useQuery(['getAllRedemptionRules'], () => getPointRules(OperationType.REDEMPTION), {
    retry: (_, error) => {
      return (error as AxiosError)?.response?.status !== 404;
    },
  });

export const useGetAllEarningRules = () =>
  useQuery(['getAllEarningRules'], () => getPointRules(OperationType.EARN), {
    retry: (_, error) => {
      return (error as AxiosError)?.response?.status !== 404;
    },
  });

export const useGetPointRulesById = (id: string) =>
  useQuery(['getPointRuleById', id], () => getPointRuleById(id));

export const useCreatePointRule = () => {
  const queryClient = useQueryClient();
  return useMutation((data: PointRules) => createPointRule({...data, status: Statuses.ENABLED}), {
    onSuccess: () => {
      queryClient.invalidateQueries('getAllRedemptionRules');
      queryClient.invalidateQueries('getAllEarningRules');
    },
  });
};

export const useUpdatePointRule = () => {
  const queryClient = useQueryClient();
  return useMutation((data: PointRules) => updatePointRule(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('getAllRedemptionRules');
      queryClient.invalidateQueries('getAllEarningRules');
      queryClient.invalidateQueries('getPointRuleById');
    },
  });
};

export const useDeletePointRule = (ruleId: string) => {
  const queryClient = useQueryClient();
  return useMutation(() => deletePointRule(ruleId), {
    onSuccess: () => {
      queryClient.invalidateQueries('getAllRedemptionRules');
      queryClient.invalidateQueries('getAllEarningRules');
    },
  });
};

export const useReorderPointRules = () => {
  const queryClient = useQueryClient();
  return useMutation((ruleIds: string[]) => reorderPointRules(ruleIds), {
    onSuccess: () => {
      queryClient.invalidateQueries('getAllRedemptionRules');
      queryClient.invalidateQueries('getAllEarningRules');
    },
  });
};

export const useGetLoyaltyCategories = (
  params?: {categoryCode?: string; categoryName?: string},
  options: Pick<UseQueryOptions, 'enabled'> = {enabled: true},
) => useQuery(['getLoyaltyCategories', params], () => getLoyaltyCategories(params), options);

export const useGetLoyaltyCategoryByCode = (code: string) =>
  useQuery('getLoyaltyCategoryDetail', (_) => getLoyaltyCategoriesByCode(code));

export const useGetLoyaltyCategoriesByCode = () =>
  useMutation((code: string) => getLoyaltyCategoriesByCode(code));

export const useCreateLoyaltyCategory = () => {
  const queryClient = useQueryClient();
  return useMutation((data: LoyaltyCategory) => createLoyaltyCategory(data), {
    onSuccess: () => queryClient.invalidateQueries('getLoyaltyCategories'),
  });
};

export const useUpdateLoyaltyCategory = () => {
  const queryClient = useQueryClient();
  return useMutation((data: LoyaltyCategory) => updateLoyaltyCategory(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('getLoyaltyCategories');
      queryClient.invalidateQueries('getLoyaltyCategoryDetail');
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation((id: string) => deleteLoyaltyCategory(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('getLoyaltyCategories');
      queryClient.invalidateQueries('getLoyaltyCategoryDetail');
    },
  });
};

export const useGetPointExpiry = (operationType?: OperationType) =>
  useQuery(['getPointExpiry', operationType], () => getPointExpiry(operationType), {
    retry: (_, error) => {
      return (error as AxiosError)?.response?.status !== 404;
    },
  });

export const useUpdatePointExpiry = () => {
  const queryClient = useQueryClient();
  return useMutation((data: PointRulesExpiries) => updatePointExpiry(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('getPointExpiry');
    },
  });
};

export const useDeletePointExpiry = () => {
  const queryClient = useQueryClient();
  return useMutation((id: string) => deletePointExpiry(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('getPointExpiry');
    },
  });
};

export const useCreatePointExpiry = () => {
  const queryClient = useQueryClient();
  return useMutation((data: PointRulesExpiriesParams) => createPointExpiry(data), {
    onSuccess: () => {
      queryClient.invalidateQueries('getPointExpiry');
    },
  });
};
