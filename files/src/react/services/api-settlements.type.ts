import {IPaginationParam} from 'src/react/lib/ajax';
import {TransactionSubType, TransactionType} from './api-merchants.type';

export interface IExceptionFilterRequest extends IPaginationParam {
  createdAtFrom?: string;
  createdAtTo?: string;
  merchantId?: string;
  posBatchSettlementId?: string;
  terminalId?: string;
}

export interface IExceptionTransactionsFilterRequest extends IPaginationParam {
  id?: string;
}

export interface IPosBatchUploadReport {
  merchantId: string;
  merchantName: string;
  settlementType: SettlementType;
  posBatchSettlementId?: string;
  terminalId?: string;
  transactionNum?: number;
  transactionTotalAmount?: number;
  rrn?: string;
  stan?: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  _id?: string;
}

export interface IPosBatchUploadTransactionsReport {
  platformTransactionId: string;
  terminalTransactionId?: string;
  transactionType: TransactionType;
  transactionSubType: TransactionSubType;
  transactionDate: string;
  posBatchSettlementId: string;
  referenceId?: string;
  platformAmount: number;
  terminalAmount: number;
  failType: PosBatchUploadReportFailType;
  posBatchUploadReportId: string;
  rrn: string;
  stan: string;
  originalStan: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export enum SettlementType {
  PRIME = 'PRIME', // settlement charges from boost, card, setel wallet
  LOYALTY = 'LOYALTY', // settlement charges from switch for loyalty
  GIFT_CARD = 'GIFT_CARD', // settlement for gift card txs from terminal
  LOYALTY_CARD = 'LOYALTY_CARD', // settlement for loyalty card txs from terminal
  FLEET_CARD = 'FLEET_CARD', // settlement for fleet card txs from terminal
}

export enum PosBatchUploadReportFailType {
  ONLY_EXIST_ON_PLATFORM = 'ONLY_EXIST_ON_PLATFORM',
  ONLY_EXIST_ON_TERMINAL = 'ONLY_EXIST_ON_TERMINAL',
  AMOUNT_MISMATCH = 'AMOUNT_MISMATCH',
}

export type IReconciliation = {
  merchantId: string;
  merchantName: string;
  settlementType: SettlementType;
  posBatchSettlementId: string;
  terminalId: string;
  type: ReconciliationType;
  isAmountMatch: boolean;
  systemAmounts: {
    totalNetPurchaseAmount: number;
    totalNetPurchaseCount: number;
    totalNetTopupAmount: number;
    totalNetTopupCount: number;
  };
  terminalAmounts: {
    totalNetPurchaseAmount: number;
    totalNetPurchaseCount: number;
    totalNetTopupAmount: number;
    totalNetTopupCount: number;
  };
  createdAt: string;
  updatedAt: string;
  id: string;
  posBatchUploadReportId?: string;
};

export interface IReconciliationFilterRequest extends IPaginationParam {
  type?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  merchantId?: string;
  isAmountMatch?: boolean;
  posBatchSettlementId?: string;
  terminalId?: string;
}

export enum ReconciliationType {
  INITIAL = 'INITIAL',
  BATCH_UPLOAD = 'BATCH_UPLOAD',
}

export const SettlementTypeFilter = [
  {label: 'Gift card', value: SettlementType.GIFT_CARD},
  {label: 'Fleet card', value: SettlementType.FLEET_CARD},
  {label: 'Loyalty card', value: SettlementType.LOYALTY_CARD},
];

export const mapSettlementTypeToPaymentMethod = new Map([
  [SettlementType.GIFT_CARD, 'Gift card'],
  [SettlementType.LOYALTY_CARD, 'Loyalty card'],
  [SettlementType.FLEET_CARD, 'Fleet card'],
]);
