import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  getBillingPlans,
  getBillingPlan,
  getBillingPlanMerchants,
  createBillingPlan,
} from './billing-plan.services';
import {IBillingPlansMerchantRequest} from './billing-plan.types';

const BillingPlanListingKey = 'BILLING_PLAN_LISTING';
const BillingPlanMerchantListingKey = 'BILLING_PLAN_MERCHANT_LISTING';
const BillingPlanDetailKey = 'BILLING_PLAN_DETAIL';

export const useBillingPlans = (filter: Parameters<typeof getBillingPlans>[0]) => {
  return useQuery([BillingPlanListingKey, filter], () => getBillingPlans(filter), {
    keepPreviousData: true,
  });
};

export const useBillingPlanMerchants = (filter: IBillingPlansMerchantRequest) => {
  return useQuery([BillingPlanMerchantListingKey, filter], () => getBillingPlanMerchants(filter), {
    retry: false,
    keepPreviousData: true,
  });
};

export const useBillingPlan = (billingPlanId: string) =>
  useQuery([BillingPlanDetailKey, billingPlanId], () => getBillingPlan(billingPlanId));

export const useCreateBillingPlan = () => {
  const queryClient = useQueryClient();
  return useMutation((data: Parameters<typeof createBillingPlan>[0]) => createBillingPlan(data), {
    onSuccess: (newParam) => {
      if (newParam) {
        queryClient.invalidateQueries([BillingPlanListingKey]);
        queryClient.setQueryData([BillingPlanDetailKey, newParam.id], newParam);
      }
    },
  });
};
