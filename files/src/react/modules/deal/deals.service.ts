import {environment} from 'src/environments/environment';
import {apiClient} from 'src/react/lib/ajax';
import {CreatedDeal, CurrentDealPrice, DealPrice} from './deals.type';
import {PaginationTokenParams, PaginationTokenResponse} from '../tokenPagination';
import {DealStatus} from './deal.const';
import {DeepPartial} from 'src/shared/interfaces/types';

export type ListDealsParams = PaginationTokenParams & {
  merchantId?: string;
  name?: string;
  status?: DealStatus;
  dealIds?: string[];
  select?: Array<keyof CreatedDeal>;
  omitVoucherBatch?: boolean;
  notInCatalogue?: string;
  merchantName?: string;
};

export type UpdateDealStatusParams = {
  dealId: string;
  status: DealStatus;
};

export const listDeals = (params: ListDealsParams): Promise<PaginationTokenResponse<CreatedDeal>> =>
  apiClient
    .get<PaginationTokenResponse<CreatedDeal>>(`${environment.dealsBaseUrl}/deals`, {params})
    .then(({data}) => ({
      ...data,
      data: data.data.map((deal) => ({...deal, price: getCurrentDealPrice(deal.price)})),
    }));

export const updateDealStatus = ({
  dealId,
  status,
}: UpdateDealStatusParams): Promise<PaginationTokenResponse<CreatedDeal>> =>
  apiClient.post(`${environment.dealsBaseUrl}/deals/${dealId}/admin/status`, {status});

export const getCurrentDealPrice = (price?: DeepPartial<DealPrice>): CurrentDealPrice | null => {
  if (!price) {
    return price;
  }
  const now = new Date();
  const isDiscountPriceAvailable =
    !!price.discounted &&
    now > new Date(price.discounted.startDate) &&
    (!price.discounted.endDate || now < new Date(price.discounted.endDate));
  return {
    ...price,
    currentPrice: isDiscountPriceAvailable ? (price.discounted?.newAmount as number) : price.amount,
    isDiscountPriceAvailable,
  };
};
