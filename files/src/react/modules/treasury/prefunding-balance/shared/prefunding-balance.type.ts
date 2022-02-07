export enum PrefundingBalanceType {
  REFERENCE_ID = 'referenceId',
  MOBILE = 'mobile',
}

export enum PrefundingBalanceAlertOptions {
  SLACK = 'slack',
}

export enum MerchantBalanceType {
  AUTHORISED = 'AUTHORISED',
  AVAILABLE = 'AVAILABLE',
  PENDING = 'PENDING',
  PREPAID = 'PREPAID',
}

export enum PlatformAccounts {
  BUFFER = 'buffer-aggregate',
}

export interface PrefundingBalanceAlertType {
  type: string;
  text: string;
  limit: string;
}
export interface IAdjustBufferInput {
  amount: number;
  reason: string;
}
export interface ICreateAdjustmentTransactionData {
  merchantId: string;
  amount: number;
  attributes: {
    comment: string;
  };
  userId: string;
}
