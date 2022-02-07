import {DealPrice, Deal} from '../deal/deals.type';

export enum DealOrderStatus {
  PROCESSING = 'PROCESSING',
  PURCHASE_FAILED = 'PURCHASE_FAILED',
  NOT_CLAIMED = 'NOT_CLAIMED',
  CAPTURE_FAILED = 'CAPTURE_FAILED',
  CLAIMED = 'CLAIMED',
  VOIDED = 'VOIDED',
}

export type Outlet = {
  _id: string;
  name: string;
  address: string;
};

export interface DealOrder {
  _id: string;
  status: DealOrderStatus;
  timestamps: Partial<Record<DealOrderStatus, string>>;
  merchantId: string;
  price: Pick<DealPrice, 'unit' | 'amount'>;
}

export interface DealOrderWithRelated extends DealOrder {
  deal: Pick<Deal, '_id' | 'name'>;
  merchant: {
    id: string;
    name: string;
  };
  profile?: {
    userId: string;
    fullName: string;
  };
  loyaltyCard?: {
    cardNumber: string;
  };
  outlet?: Pick<Outlet, '_id' | 'name'>;
  voucher?: {
    _id: string;
    code: string;
    expiryDate: string;
  };
}
