import {environment} from 'src/environments/environment';
import {apiClient} from 'src/react/lib/ajax';
import {
  FeePlan,
  IFeePlanMerchantsRequest,
  ICreateFeePlan,
  IEditFeePlansPaymentMethod,
  IFeePlansRequest,
  IMerchant,
  IMerchantWithFeePlan,
  ISearchMerchantWithFeePlanRequest,
  FeePlanMerchant,
  IFeePlanByMerchantId,
} from './fee-plans.type';
import {TOTAL_COUNT_HEADER_NAME} from 'src/react/services/service.type';
import {FeePlanTypes} from './fee-plans.constant';

const feePlansUrl = `${environment.feesApiBaseUrl}/api/fees/admin/fee-plans`;

export const getFeePlans = async (req: IFeePlansRequest = {}) => {
  const {data: feePlans, headers} = await apiClient.get<FeePlan[]>(feePlansUrl, {
    params: {
      perPage: req.perPage,
      page: req.page,
    },
  });

  return {
    feePlans,
    total: headers[TOTAL_COUNT_HEADER_NAME],
  };
};

export const getFeePlanMerchants = async (req: IFeePlanMerchantsRequest = {}) => {
  const {data: merchants, headers} = await apiClient.get<FeePlanMerchant[]>(
    `${feePlansUrl}/${req.id}/assign-merchants`,
    {
      params: {
        perPage: req.perPage,
        page: req.page,
      },
    },
  );

  return {
    merchants,
    total: headers[TOTAL_COUNT_HEADER_NAME],
  };
};

export const getFeePlan = (id: string): Promise<FeePlan> =>
  apiClient.get<FeePlan>(`${feePlansUrl}/${id}`).then((res) => res.data);

export const getFeePlanByMerchantId = (merchantId: string): Promise<IFeePlanByMerchantId> =>
  apiClient
    .get<IFeePlanByMerchantId>(`${feePlansUrl}/merchants/${merchantId}`)
    .then((res) => res.data);

export const editFeePlan = (feePlan: FeePlan): Promise<FeePlan> =>
  apiClient.post<FeePlan>(`${feePlansUrl}/customized`, feePlan).then((res) => res.data);

export const assignMerchantToFeePlan = ({
  feePlanId,
  merchantIds,
}: {
  feePlanId: string;
  merchantIds: string[];
}) =>
  apiClient.put<IMerchant>(`${feePlansUrl}/${feePlanId}/assign-merchants`, null, {
    params: {merchantIds},
  });

export const searchMerchantsWithFeePlan = (params: ISearchMerchantWithFeePlanRequest) =>
  apiClient
    .get<IMerchantWithFeePlan[]>(`${feePlansUrl}/merchants`, {
      params,
    })
    .then((res) => res.data);

export const createFeePlan = (body: ICreateFeePlan) =>
  apiClient.post<FeePlan>(`${feePlansUrl}`, body).then((res) => res.data);

export const editPaymentMethod = (
  feePlanId: string,
  paymentMethodId: string,
  body: IEditFeePlansPaymentMethod,
  feePlanType: FeePlanTypes,
  merchantId?: string,
) => {
  if (feePlanType === FeePlanTypes.PRE_DEFINED) {
    return apiClient
      .put<FeePlan>(
        `${feePlansUrl}/${feePlanId}/pre-defined/payment-methods/${paymentMethodId}`,
        body,
      )
      .then((res) => res.data);
  }

  return apiClient
    .put<FeePlan>(
      `${feePlansUrl}/${feePlanId}/customized/${merchantId}/payment-methods/${paymentMethodId}`,
      body,
    )
    .then((res) => res.data);
};
