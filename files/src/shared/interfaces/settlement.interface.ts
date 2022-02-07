import {Currency} from '../enums/wallet.enum';

export interface ISettlement {
  id: string;
  status: SettlementStatus;
  attemptNo: number;
  merchantId: string;
  merchantName: string;
  amount: number;
  chargeAmount: number;
  refundAmount: number;
  adjustmentAmount: number;
  feeAmount: number;
  timeline: ITimeline[];
  transactions: number;
  bank: IBank;
  totalTransactions: number;
  createdAt: Date;
}

export enum SettlementStatus {
  CREATED = 'CREATED',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
}

export interface ITimeline {
  status: string;
  data?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISettlementIndexParams {
  createdAtFrom?: string;
  createdAtTo?: string;
  status?: string;
}

export interface IBank {
  bankName: string;
  bankDisplayName: string;
  accountNo: string;
  accountHolderName: string;
  currency: Currency;
  idType?: IDTypes;
  idNumber?: string;
}

export enum IDTypes {
  IC_OLD = 'IC_OLD',
  IC_NEW = 'IC_NEW',
  PASSPORT = 'PASSPORT',
  BRN = 'BRN',
}
