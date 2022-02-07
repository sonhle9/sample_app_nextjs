interface IRequest {
  perPage?: number;
  page?: number;
}

export interface ISearchMerchantRequest extends IRequest {
  name?: string;
}

export type Merchant = {
  id: string;
  name: string;
  merchantName: string;
  merchantId: string;
};

export interface IGetMerchantsSmartpayRequest extends IRequest {
  name?: string;
}
