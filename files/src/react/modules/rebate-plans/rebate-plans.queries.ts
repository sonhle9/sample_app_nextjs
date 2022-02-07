import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  createRebatePlan,
  editRebatePlanGeneral,
  editRebatePlanTier,
  getLoyaltyCategoryCodes,
  getRebatePlan,
  getRebatePlans,
} from '../../services/api-rebates.service';
import {IRebatePlan} from '../../services/api-rebates.type';

const REBATE_PLANS_LISTING_KEY = 'rebatePlansListing';
const REBATE_PLAN_DETAIL_KEY = 'rebatePlanDetail';
const REBATE_PLAN_CRATE_KEY = 'rebatePlanCreate';
const REBATE_PLAN_GENERAL_EDIT_KEY = 'rebatePlanGeneralEdit';
const REBATE_PLAN_TIER_EDIT_KEY = 'rebatePlanTierEdit';
const LOYALTY_CATEGORY_CODE_KEY = 'loyaltyCategoryCodeKey';

export const useRebatePlans = (filter: Parameters<typeof getRebatePlans>[0]) => {
  return useQuery([REBATE_PLANS_LISTING_KEY, filter], () => getRebatePlans(filter), {
    keepPreviousData: true,
  });
};

export const useRebatePlan = (rebatePlanId: string) =>
  useQuery([REBATE_PLAN_DETAIL_KEY, rebatePlanId], () => getRebatePlan(rebatePlanId));

export const useLoyaltyCategoryCodes = (searchString: string) =>
  useQuery([LOYALTY_CATEGORY_CODE_KEY, searchString], () => getLoyaltyCategoryCodes(searchString));

export const useCreateRebatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation((body: Parameters<typeof createRebatePlan>[0]) => createRebatePlan(body), {
    onSuccess: () => {
      queryClient.invalidateQueries([REBATE_PLAN_CRATE_KEY]);
    },
  });
};

export const useEditGeneralRebatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: {body: IRebatePlan; planId: number}) => editRebatePlanGeneral(data.body, data.planId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([REBATE_PLAN_GENERAL_EDIT_KEY]);
        queryClient.invalidateQueries([REBATE_PLAN_DETAIL_KEY]);
      },
    },
  );
};

export const useEditTierRebatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: {body: IRebatePlan; planId: number}) => editRebatePlanTier(data.body, data.planId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([REBATE_PLAN_TIER_EDIT_KEY]);
        queryClient.invalidateQueries([REBATE_PLAN_DETAIL_KEY]);
      },
    },
  );
};
