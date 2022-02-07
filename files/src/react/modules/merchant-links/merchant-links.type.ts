import {IRequest} from '../merchant-users/merchant-users.type';

export type MerchantLink = {
  id?: string;
  merchantName?: string;
  merchantId: string;
  createdAt?: string;
  updatedAt?: string;
  linkedMerchants: LinkedMerchant[];
  enterpriseToLink: string;
  attributes: Record<any, any>;
};

export type MerchantLinkDto = {
  merchantId: string;
  enterpriseToLink: string;
  linkedMerchants: string[];
};

export type LinkedMerchant = {
  merchantId: string;
  merchantName: string;
  enterpriseId: string;
};

export type MerchantLinkListingFilter = IRequest & {
  searchBy?: string;
  searchValue?: string;
};
