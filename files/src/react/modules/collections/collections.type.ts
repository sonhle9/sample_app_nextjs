interface IRequest {
  perPage?: number;
  page?: number;
}

export interface ICollectionsRequest extends IRequest {
  subType?: string;
  status?: string;
  type?: string;
  types?: string;
  filterByTime?: string;
  timeFrom?: string;
  timeTo?: string;
  category?: string;
}

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
  'PENDING',
  'APPROVED',
  'REJECT',
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
    reference?: string;
    destinationBalance?: string;
    attachment?: string;
    remark?: string[];
    assignment?: string;
    paymentMethod?: string;
    importedFileUrl?: string;
    approvalRequestId?: string;
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
  enterpriseId?: string;
};

export interface IEmailTransactionInput extends ICollectionsRequest {
  emails: string[];
}
export interface ISendEmailResponse {
  success: boolean;
  text: string;
}

export interface ITransactionSendEmailModalProps {
  filter: ICollectionsRequest;
  visible: boolean;
  onClose?: () => void;
  onSuccessSendEmail?: () => void;
}
