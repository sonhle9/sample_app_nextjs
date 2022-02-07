import {EnterpriseNameEnum} from 'src/shared/enums/enterprise.enum';

interface IRequest {
  perPage?: number;
  page?: number;
  offset?: number;
  toLast?: boolean;
}

export const defaultSettingSettlementPage = {
  defaultPage: 1,
  defaultPerPage: 50,
};

export interface ISettlementRequest extends IRequest {
  status?: string;
  merchantId?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
}

export const SETTLEMENT_STATUS = [
  'CREATED',
  'PROCESSING',
  'SUCCEEDED',
  'FAILED',
  'PENDING_FOR_BANK',
] as const;

export type SettlementStatus = typeof SETTLEMENT_STATUS[number];

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

export const SETTLEMENT_TYPE = ['PRIME', 'LOYALTY', 'GIFT_CARD', 'LOYALTY_CARD', 'FLEET_CARD'];

export const SETTLEMENT_STATUS_COLOR: {
  [key in SettlementStatus]?: BadgeColorType;
} = {
  SUCCEEDED: 'success',
  PROCESSING: 'lemon',
  PENDING_FOR_BANK: 'warning',
  CREATED: 'info',
  FAILED: 'error',
};

export const SETTLEMENT_TYPE_CONST = [...SETTLEMENT_TYPE] as const;

export type SettlementType = typeof SETTLEMENT_TYPE_CONST[number];

export type Settlement = {
  id: string;
  status: SettlementStatus;
  settlementId: string;
  merchantId: string;
  amount: number;
  attemptNo: number;
  chargeAmount: number;
  feeAmount: number;
  createdAt: string;
  updatedAt: string;
  merchantName: string;
  terminalId: string;
  posBatchSettlementId: string;
  stan: string;
  totalTransactions: number;
  isForBatchUpload: boolean;
  enterpriseId: EnterpriseNameEnum;
  type: SettlementType;
};

export type Metadata = {
  currentPage: number;
  pageSize: number;
  lastPage: number;
  offset: number;
};

export const SETTLEMENT_STATUS_OPTION = [
  {
    label: 'Succeeded',
    value: SETTLEMENT_STATUS[2],
  },
  {
    label: 'Processing',
    value: SETTLEMENT_STATUS[1],
  },
  {
    label: 'Pending For Bank',
    value: SETTLEMENT_STATUS[4],
  },
  {
    label: 'Failed',
    value: SETTLEMENT_STATUS[3],
  },
  {
    label: 'Created',
    value: SETTLEMENT_STATUS[0],
  },
];
