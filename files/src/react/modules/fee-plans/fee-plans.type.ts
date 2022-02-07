import {
  FeePlansPaymentMethodRateTypes,
  FeePlanPaymentMethodBrands,
  FeePlanPaymentMethodFamilies,
  FeePlanPaymentMethodTypes,
} from './fee-plans.constant';

interface IRequest {
  perPage?: number;
  page?: number;
}

export interface IFeePlansRequest extends IRequest {
  ids?: string[];
}

export interface IFeePlanMerchantsRequest extends IRequest {
  id?: string;
}

export type FeePlansPaymentMethod = {
  id: string;
  rateType: FeePlansPaymentMethodRateTypes;
  rate: number;
  minimum: number;
  maximum: number;
  family: FeePlanPaymentMethodFamilies;
  brand: FeePlanPaymentMethodBrands;
  type: FeePlanPaymentMethodTypes;
  updatedAt: Date;
  createdAt: Date;
};

export type FeePlan = {
  id: string;
  name: string;
  type: string;
  customized?: string;
  paymentMethods?: FeePlansPaymentMethod[];
  merchantCount: number;
  createdAt: string;
};

export type FeePlanMerchant = {
  merchantId: string;
  name: string;
  createdAt: string;
};

export interface IFeePlanDetailProps {
  feePlanId: string;
}

export interface IMerchantsFeePlansPaymentMethod {
  merchantId: string;
}

export interface IMerchant {
  name: string;
  merchantId: string;
}

export interface IFeePlanByMerchantId {
  merchantId: string;
  feePlanId: string;
}

export interface IMerchantWithFeePlan extends IMerchant {
  feePlanName: string;
  feePlanId: string;
}
export interface ISearchMerchantWithFeePlanRequest extends IRequest {
  search?: string;
  excludedFeePlanId?: string;
  excludedMerchantIds?: string[];
}

export interface ICreateFeePlan {
  name: string;
}

export interface IEditFeePlansPaymentMethod {
  rateType: string;
  rate?: number | string;
  minimum?: number | string;
  maximum?: number | string;
}
