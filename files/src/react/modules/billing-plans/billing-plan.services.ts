import {environment} from 'src/environments/environment';
import {apiClient} from 'src/react/lib/ajax';
import {
  BillingPlan,
  IBillingPlansMerchantRequest,
  IBillingPlansRequest,
  SubscriptionMerchant,
} from './billing-plan.types';
import {TOTAL_COUNT_HEADER_NAME} from 'src/react/services/service.type';

const billingPlansUrl = `${environment.billingPlansApiBaseUrl}/api/billings/admin/billing-plans`;
const subscriptionUrl = `${environment.billingPlansApiBaseUrl}/api/billings/admin/subscriptions`;

export const getBillingPlans = async (req: IBillingPlansRequest = {}) => {
  const {data: billingPlans, headers} = await apiClient.get<BillingPlan[]>(billingPlansUrl, {
    params: {
      perPage: req.perPage,
      page: req.page,
      ids: req.ids && req.ids.length > 0 ? req.ids.join(',') : undefined,
      searchName: req.searchName ? req.searchName : undefined,
      pricingModel: req.pricingModel || undefined,
    },
  });

  return {
    billingPlans,
    total: headers[TOTAL_COUNT_HEADER_NAME],
  };
};

export const getBillingPlanMerchants = async (params: IBillingPlansMerchantRequest) => {
  const {data: merchants, headers} = await apiClient.get<SubscriptionMerchant[]>(
    `${subscriptionUrl}`,
    {
      params: {
        billingPlanId: params.billingPlanId,
        perPage: params.perPage,
        page: params.page,
      },
    },
  );

  return {
    merchants,
    total: headers[TOTAL_COUNT_HEADER_NAME],
  };
};

export const getBillingPlan = (id: string): Promise<BillingPlan> =>
  apiClient.get<BillingPlan>(`${billingPlansUrl}/${id}`).then((res) => res.data);

export const createBillingPlan = (billingPlan: BillingPlan): Promise<BillingPlan> =>
  apiClient.post<BillingPlan>(billingPlansUrl, billingPlan).then((res) => res.data);
