import {IDTypes, PayoutStatuses} from '../enums/payout.enum';

export interface IPayoutTimeline {
  status: PayoutStatuses;
  createdAt: string;
  error?: any;
  errorCode?: any;
  message?: string;
}

export interface IPayoutRejectErrors {
  payoutBatchId: string;
  errorCode?: any;
  errorMessage: string;
  createdAt: string;
}

export interface IPayout {
  transactionDate: string;
  bankName: string;
  bankCode: string;
  bankAccountNo: string;
  bankAccountHolderName: string;
  identificationDocumentType: IDTypes;
  identificationDocumentNo: string;
  amount: number;
  feeAmount: number;
  currency: string;
  merchantId: string;
  merchantName: string;
  settlementId: string;
  status: PayoutStatuses;
  payoutBatchId?: string;
  timeline: IPayoutTimeline[];
  error?: string;
  errorCode?: string;
  errorObjs?: IPayoutRejectErrors[];
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}
