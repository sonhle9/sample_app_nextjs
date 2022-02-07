import {useMutation, useQuery, useQueryClient} from 'react-query';
import {
  getFeePlans,
  getFeePlan,
  assignMerchantToFeePlan,
  searchMerchantsWithFeePlan,
  createFeePlan,
  editPaymentMethod,
  getFeePlanMerchants,
  getFeePlanByMerchantId,
} from './fee-plans.service';
import {IEditFeePlansPaymentMethod} from './fee-plans.type';
import {FeePlanTypes} from './fee-plans.constant';
import {filterEmptyString} from 'src/react/lib/ajax';

const FEE_PLANS_LISTING_KEY = 'feePlansListing';
const FEE_PLAN_DETAIL_KEY = 'feePlanDetail';
const MERCHANT_WITH_FEE_PLAN_SEARCH_KEY = 'searchMerchantWithFeePlan';
const FEE_PLAN_BY_MERCHANT_ID = 'feePlanByMerchantId';
const FEE_PLAN_MERCHANTS_LISTING_KEY = 'feePlanMerchantsListing';

export const useFeePlans = (filter: Parameters<typeof getFeePlans>[0]) => {
  return useQuery([FEE_PLANS_LISTING_KEY, filter], () => getFeePlans(filter), {
    keepPreviousData: true,
  });
};

export const useFeePlan = (feePlanId: string) =>
  useQuery([FEE_PLAN_DETAIL_KEY, feePlanId], () => getFeePlan(feePlanId));

export const useAssignMerchantToFeePlan = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: {feePlanId: string; merchantIds: string[]}) => assignMerchantToFeePlan(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([FEE_PLAN_MERCHANTS_LISTING_KEY]);
        queryClient.invalidateQueries([MERCHANT_WITH_FEE_PLAN_SEARCH_KEY]);
      },
    },
  );
};

export const useSearchMerchantsWithFeePlan = (
  filter: Parameters<typeof searchMerchantsWithFeePlan>[0],
) =>
  useQuery([MERCHANT_WITH_FEE_PLAN_SEARCH_KEY, filter], () => searchMerchantsWithFeePlan(filter));

export const useFeePlanByMerchantId = (merchantId: string) =>
  useQuery([FEE_PLAN_BY_MERCHANT_ID, merchantId], () => getFeePlanByMerchantId(merchantId));

export const useCreateFeePlan = () => {
  const queryClient = useQueryClient();

  return useMutation((body: Parameters<typeof createFeePlan>[0]) => createFeePlan(body), {
    onSuccess: () => {
      queryClient.invalidateQueries([FEE_PLANS_LISTING_KEY]);
    },
  });
};

export const useEditFeePlansPaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: {
      feePlanId: string;
      paymentMethodId: string;
      body: IEditFeePlansPaymentMethod;
      feePlanType: FeePlanTypes;
      merchantId?: string;
    }) =>
      editPaymentMethod(
        data.feePlanId,
        data.paymentMethodId,
        filterEmptyString(data.body),
        data.feePlanType,
        data.merchantId,
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([FEE_PLAN_DETAIL_KEY]);
        queryClient.invalidateQueries([FEE_PLAN_BY_MERCHANT_ID]);
      },
    },
  );
};

export const useFeePlanMerchants = (filter: Parameters<typeof getFeePlanMerchants>[0]) => {
  return useQuery([FEE_PLAN_MERCHANTS_LISTING_KEY, filter], () => getFeePlanMerchants(filter), {
    keepPreviousData: true,
  });
};
