import {CardSchemes} from '../modules/ledger/fee-settings/fee-settings.enum';
import {
  LedgerTransactionStatus,
  TransactionPGVendors,
  TransactionSubTypes,
  TransactionTypes,
} from '../modules/ledger/ledger-transactions/ledger-transactions.enums';
import {ReceivablesStatuses, ReceivableTypes} from '../modules/ledger/receivables/receivables.enum';

export interface IGeneralLedgerEntryDetails {
  GLCode: string;
  GLAccountNo: string;
  GLAccountName: string;
  GLTransactionDescription: string;
  profitCenterCode: string;
  costCenterCode: string;
  extractionIndicator: 'detailed' | 'summary';
  documentType: 'DA' | 'KZ' | 'RE';
}

export interface IGeneralLedgerParameter {
  GLProfile: string;
  transactionType: string;
  userName: string;
  debit: IGeneralLedgerEntryDetails;
  credit: IGeneralLedgerEntryDetails;
  status: GeneralLedgerParameterStatus;
  histories: any[];
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGeneralLedgerPosting {
  id: string;
  transactionType: string;
  GLProfile: string;
  userName: string;
  postedDate: string;
  transactionDate: string;
  amount: string;
  assignment: string;
  reference: string;
  transactionId: string;
  json: any;
  GLCode: string;
  GLAccountNo: string;
  GLTransactionDescription: string;
  entryType: 'credit' | 'debit';
  profileCenterCode: string;
  costCenterCode: string;
  extractionIndicator: 'detailed' | 'summary';
  documentType: string;
}

interface IGeneralLedgerEvent {
  transactionType: string;
  GLProfile: string;
  transactionId: string;
  date: string;
  amount: number;
  sourceService: string;
  assignment: string;
  reference: string;
  json: any;
}

export interface IGeneralLedgerPostingException {
  id: string;
  eventData: IGeneralLedgerEvent;
  isResolved: boolean;
  createdDate: Date;
  errorReason: string;
  errorMessage: string;
}

export interface ILedgerTransaction {
  relatedTransactions?: unknown[];
  balanceChanges?: unknown[];
  id: string;
  transactionId: string;
  transactionUid: string;
  walletId?: string;
  fullName: string;
  email?: string;
  userId: string;
  type: TransactionTypes;
  subType: string;
  status: LedgerTransactionStatus;
  amount: number;
  currency: string;
  referenceId: string;
  merchantId: string;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
  attributes?: {
    comment: string;
  };
}

export interface ISapPostingHistory {
  createdAt: string;
  updatedAt: string;
  id: string;
  fileName: string;
  glProfile: string;
  generationTrigger: string;
  generationDate: string;
  postingDate: string;
  glPostings: IGeneralLedgerPosting[];
}

export interface IFeeSettings {
  cardScheme: CardSchemes;
  createdAt: string;
  fee?: number;
  feeType: string;
  id: string;
  isDeleted: boolean;
  isTiered: boolean;
  paymentGatewayVendor: string;
  paymentOption: string;
  transactionType: string;
  tiering?: ITiering;
  updatedAt: string;
  validFrom: string;
  validTo: string;
}

interface ITiering {
  tieringType: TieringTypes;
  duration: TieringDurations;
  tiers: ITiers[];
}

interface ITiers {
  lowerLimit: number;
  upperLimit: number;
  fee: number;
}

export interface IReceivable {
  id: string;
  status: ReceivablesStatuses;
  receivableType?: ReceivableTypes;
  processorName: string;
  recordedAmount: number;
  processedAmount: number;
  feeAmount: number;
  numberOfTransactions: number;
  processedTransactions: number;
  variance: number;
  transactionDate: string;
  exceptions: unknown[];
}

export interface IReceivableReconciliation {
  receivableId: string;
  paymentGatewayVendor: TransactionPGVendors;
  paymentGatewayTransactionId: string;
  isReconciled: boolean;
  transactionId: string;
  transactionType: TransactionTypes;
  transactionSubType: TransactionSubTypes;
  amount: number;
  feeAmount: number;
  expectedFeeAmount: number;
  reconciledAmount: number;
  referenceId: string;
  reconciliationId?: string;
  metadata?: {[prop: string]: any};
  reconciledDate?: Date;
  paymentGatewayTransactionDate: Date;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IReceivableException {
  id?: string;
  receivableId?: string;
  metadata: {
    amount: number;
    commAmount: number;
    date: Date;
    feeAmount: number;
    merchantCode: string;
    merchantRefNo: string;
    no: number;
    paymentMethod: string;
    prodDesc: string;
    remark: string;
    status: string;
    taxAmount: number;
    totalAmount: number;
    transId: string;
    userName: string;
  };
  reason: string;
  isResolved: boolean;
}

export interface IDailySummary {
  cardScheme: string;
  computationDate: Date;
  count: number;
  feeAmount: number;
  feeSettingId: string;
  id: string;
  paymentGatewayFeeAmount: number;
  paymentGatewayVendor: string;
  paymentOption: string;
  transactionDate: Date;
  transactionType: string;
}

export const SEARCH_BY = ['GLProfile', 'transactionType', 'GLCode'] as const;

export type SearchBy = typeof SEARCH_BY[number];

export const GENERAL_LEDGER_PARAMETER_STATUS = ['active', 'disabled', ''] as const;

export type GeneralLedgerParameterStatus = typeof GENERAL_LEDGER_PARAMETER_STATUS[number];

export const GL_PROFILE_FILTER_BY = [
  'ALL',
  'LOYALTY_CARD',
  'GIFT_CARD',
  'FLEET_CARD',
  'OTHERS',
] as const;

export enum TieringTypes {
  AMOUNT = 'AMOUNT',
  VOLUME = 'VOLUME',
}

export enum TieringDurations {
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
}

export type GeneralLedgerProfileFilterBy = typeof GL_PROFILE_FILTER_BY[number];
