interface IRequest {
  perPage?: number;
  page?: number;
}

export interface IReloadTransactionRequest extends IRequest {
  search?: string;
  status?: string;
  types?: string;
  reloadName?: string;
  filterByTime?: string;
  timeFrom?: string;
  timeTo?: string;
}

export const TRANSACTION_STATUS = ['Succeeded', 'Refunded', 'Unposted'] as const;

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

export const TRANSACTION_TYPE = ['RELOAD', 'RELOAD_REFUND'];

export const TRANSACTION_STATUS_COLOR: {
  [key in TransactionStatus]?: BadgeColorType;
} = {
  Succeeded: 'success',
  Refunded: 'success',
  Unposted: 'error',
};

export const TRANSACTION_STATUS_NAME: {
  [key in TransactionStatus]?: string;
} = {
  Succeeded: 'SUCCEEDED',
  Refunded: 'REFUNDED',
  Unposted: 'UNPOSTED',
};

export const TRANSACTION_TYPE_NAME = {
  RELOAD: 'Reload',
  RELOAD_REFUND: 'Reload refund',
};

export const TRANSACTION_TYPE_CONST = [...TRANSACTION_TYPE] as const;

export type TransactionType = typeof TRANSACTION_TYPE_CONST[number];

export type Transaction = {
  id: string;
  status: TransactionStatus;
  merchantId: string;
  attributes?: {
    merchantName: string;
  };
  referenceId?: string;
  transactionUid: string;
  type: TransactionType;
  merchantName: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  enterpriseId?: string;
};

export interface IEmailTransactionInput extends IReloadTransactionRequest {
  type?: string;
  emails: string[];
}

export interface ISendEmailResponse {
  success: boolean;
  text: string;
}

export interface ITransactionSendEmailModalProps extends IReloadTransactionRequest {
  type: string;
  visible: boolean;
  onClose?: () => void;
}

export const COLLECTION_TYPE_OPTIONS = [
  {
    label: 'Reload',
    value: TRANSACTION_TYPE[0],
  },
  {
    label: 'Reload refund',
    value: TRANSACTION_TYPE[1],
  },
];

export const COLLECTION_STATUS_OPTION = [
  {
    label: 'Succeeded',
    value: TRANSACTION_STATUS[0],
  },
  {
    label: 'Refunded',
    value: TRANSACTION_STATUS[1],
  },
  {
    label: 'Unposted',
    value: TRANSACTION_STATUS[2],
  },
];

export enum RELOAD_NAME {
  GIFT_CARD = 'GIFT_CARD',
  FLEET_CARD = 'FLEET_CARD',
}

export const RELOAD_NAME_LABEL = {
  GIFT_CARD: 'Gift card reload',
  FLEET_CARD: 'Fleet card reload',
};

export const RELOAD_NAME_OPTIONS = [
  {
    label: RELOAD_NAME_LABEL.GIFT_CARD,
    value: RELOAD_NAME.GIFT_CARD,
  },
  {
    label: RELOAD_NAME_LABEL.FLEET_CARD,
    value: RELOAD_NAME.FLEET_CARD,
  },
];
