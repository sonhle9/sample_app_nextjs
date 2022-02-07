import {DealPriceUnit, DealStatus} from './deal.const';
import {IBaseVouchersBatch} from 'src/shared/interfaces/vouchers.interface';
import {DeepPartial} from 'src/shared/interfaces/types';

export type Deal<T = DealPrice> = {
  _id: string;
  name: string;
  description?: string;
  status: DealStatus;
  startDate: string;
  endDate: null | string;
  voucherBatchId: string;
  merchantId: string;
  voucherBatch: Pick<
    IBaseVouchersBatch,
    '_id' | 'name' | 'generationType' | 'vouchersCount' | 'content' | 'merchant'
  >;
  price: T;
  leftCount: null | number;
  showOnSoldOut: boolean;
  content: DealContent;
  createdAt: string;
};

export type DealExistingKeys = '_id' | 'status' | 'createdAt';

export type CreatedDeal<T = DealPrice> = Pick<Deal<T>, DealExistingKeys> &
  DeepPartial<Omit<Deal<T>, DealExistingKeys>>;

export type DealPrice = {
  unit: DealPriceUnit;
  amount: number;
  discounted: null | DealDiscountedPrice;
};

export type CurrentDealPrice = DeepPartial<DealPrice> & {
  currentPrice?: number;
  isDiscountPriceAvailable?: boolean;
};

export type DealDiscountedPrice = {
  newAmount: number;
  startDate: string;
  endDate: null | string;
};

export type DealContent = {
  images: {url: string}[];
  summary: string;
  buttonText: string;
};

export type GeneralDealPayload = Pick<Deal, 'name' | 'description' | 'startDate' | 'endDate'>;

export type VoucherBatchPayload = {
  voucherBatchId: null | string;
  leftCount: null | number;
};

export type PricePayload = Pick<DealPrice, 'amount' | 'discounted'>;

export type SubmittedImage = {
  url?: string;
  file?: File;
};

export type ImagesPayload = SubmittedImage[];
