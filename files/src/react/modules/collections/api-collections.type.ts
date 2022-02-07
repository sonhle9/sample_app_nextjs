export const TRANSACTION_STATUS = [
  'CREATED',
  'AUTHORISED',
  'CANCELLED',
  'EXPIRED',
  'FAILED',
  'SUCCEEDED',
  'SETTLED',
  'PARTIALLY_REFUNDED',
  'REFUNDED',
  'UNPOSTED',
] as const;

export type TransactionStatus = typeof TRANSACTION_STATUS[number];

export type BadgeColorType =
  | 'turquoise'
  | 'grey'
  | 'purple'
  | 'lemon'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'offwhite'
  | undefined;

export const TRANSACTION_TYPE = [
  'CHARGE',
  'REFUND',
  'ADJUSTMENT',
  'FEE',
  'TRANSFER',
  'ROYALTY',
  'ROYALTY_REFUND',
  'COLLECTION',
  'COLLECTION_REFUND',
] as const;

export type TransactionType = typeof TRANSACTION_TYPE[number];

export type TransactionSubType =
  | 'CHARGE_WALLET'
  | 'REFUND_WALLET'
  | 'TRANSFER_MERCHANT_BONUS_WALLET'
  | 'TRANSFER_REFUND_MERCHANT_BONUS_WALLET'
  | 'TRANSFER_MERCHANT_TO_PREPAID';

export type Transaction = {
  transactionUid: string;
  attributes?: {
    merchantName: string;
  };
  type: TransactionType;
  subType?: TransactionSubType;
  merchantId?: string;
  userId?: string;
  orderId?: string;
  orderType?: string;
  status?: TransactionStatus;
  transactionDateFrom?: string;
  transactionDateTo?: string;
  settlementId?: string;
  referenceId?: string;
  currency?: any;
  amount?: any;
  email?: any;
  fullName?: any;
  mobile?: any;
  paymentMethod?: string;
  paymentSubmethod?: string;
  transactionDate?: any;
  relatedTransactions?: Array<{
    transactionType: TransactionType;
    transactionUid: string;
    id: string;
  }>;
  id?: string;
  data?: any;
  createdAt: string;
  updatedAt: string;
};

export const COLLECTION_TYPE = ['COLLECTION', 'COLLECTION_REFUND'] as const;

export const COLLECTION_TYPE_OPTIONS = [
  {
    label: 'Collection',
    value: COLLECTION_TYPE[0],
  },
  {
    label: 'Collection refund',
    value: COLLECTION_TYPE[1],
  },
];

export const COLLECTION_STATUS = ['SUCCEEDED', 'SETTLED', 'REFUNDED', 'UNPOSTED'] as const;

export const COLLECTION_STATUS_OPTION = [
  {
    label: 'Succeeded',
    value: COLLECTION_STATUS[0],
  },
  {
    label: 'Settled',
    value: COLLECTION_STATUS[1],
  },
  {
    label: 'Refunded',
    value: COLLECTION_STATUS[2],
  },
  {
    label: 'Unposted',
    value: COLLECTION_STATUS[3],
  },
];

enum CATEGORY_TYPE {
  COLLECTION_GIFT_CARD_TOPUP = 'COLLECTION_GIFT_CARD_TOPUP',
  COLLECTION_FLEET_CARD_TOPUP = 'COLLECTION_FLEET_CARD_TOPUP',
}

export const CATEGORY_TYPE_PDB_OPTIONS = [
  {
    label: 'Gift card top up',
    value: CATEGORY_TYPE.COLLECTION_GIFT_CARD_TOPUP,
  },
  {
    label: 'Fleet card top up',
    value: CATEGORY_TYPE.COLLECTION_FLEET_CARD_TOPUP,
  },
];

export const CATEGORY_TYPE_SETEL_OPTIONS = [];
