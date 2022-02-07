import {
  GeneralLedgerPayoutsStatus,
  GeneralLedgerPayoutTransactionStatus,
  PayoutBatchStatus,
  PayoutStatus,
} from './api-processor.enum';

export interface IGeneralLedgerPayoutsBatch {
  id: string;
  transactionDate: string;
  runningCount: number;
  processorName: string;
  type: string;
  totalCount: number;
  pendingCount: number;
  rejectedCount: number;
  processedCount: number;
  totalAmount: string;
  pendingAmount: string;
  rejectedAmount: string;
  processedAmount: string;
  totalFees: string;
  amountBreakdown: {
    GLProfile: string;
    amount: string;
    feeAmount: string;
  }[];
  fileName?: string;
  status: GeneralLedgerPayoutsStatus;
  timeline: {
    status: GeneralLedgerPayoutsStatus;
    createdAt: Date;
    error?: any;
    message?: string;
  }[];
  error?: string;
}

export interface IGeneralLedgerPayoutsBatchPayout {
  id: string;
  transactionDate: string;
  bankName: string;
  bankCode: string;
  bankAccountNo: string;
  bankAccountHolderName: string;
  identificationDocumentType: string;
  identificationDocumentNo: string;
  amount: string;
  feeAmount: string;
  amountBreakdown: {
    type: string;
    amount: string;
    feeAmount: string;
  }[];
  currency: string;
  merchantId: string;
  merchantName: string;
  settlementId: string;
  status: GeneralLedgerPayoutTransactionStatus;
  payoutBatchId?: string;
  timeline: {
    status: string;
    createdAt: Date;
    error?: any;
    errorCode?: any;
    message?: string;
  }[];
  error?: string;
  errorCode?: string;
  errorObjs?: {
    payoutBatchId: string;
    errorCode?: any;
    errorMessage: string;
    createdAt: Date;
  }[];
  idempotencyKey: string;
  createdAt: string;
}

export interface IPayoutsBatch {
  id: string;
  transactionDate: string;
  runningCount: number;
  processorName: string;
  totalCount: number;
  pendingCount: number;
  rejectedCount: number;
  processedCount: number;
  totalAmount: string;
  pendingAmount: string;
  rejectedAmount: string;
  processedAmount: string;
  totalFees: string;
  amountBreakdown: {
    GLProfile: string;
    amount: string;
    feeAmount: string;
  }[];
  fileName?: string;
  status: PayoutBatchStatus;
  timeline: {
    status: PayoutBatchStatus;
    createdAt: Date;
    error?: any;
    message?: string;
  }[];
  error?: string;
}

export interface IPayout {
  id: string;
  transactionDate: string;
  bankName: string;
  bankCode: string;
  bankAccountNo: string;
  bankAccountHolderName: string;
  identificationDocumentType: string;
  identificationDocumentNo: string;
  amount: number;
  feeAmount: number;
  currency: string;
  merchantId: string;
  merchantName: string;
  settlementId: string;
  status: PayoutStatus;
  payoutBatchId?: string;
  timeline: {
    status: string;
    createdAt: Date;
    error?: any;
    errorCode?: any;
    message?: string;
  }[];
  error?: string;
  errorCode?: string;
  errorObjs?: {
    payoutBatchId: string;
    errorCode?: any;
    errorMessage: string;
    createdAt: Date;
  }[];
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMT940 {
  id: string;
  fileName: string;
  fileDate: string;
  account: 'COLLECTION' | 'OPERATING';
  accountNo: string;
  debit: {
    count: number;
    amount: number;
  };
  credit: {
    count: number;
    amount: number;
  };
  balance: {
    opening: {
      amount: number;
      transactionType: string;
    };
    closing: {
      amount: number;
      transactionType: string;
    };
    available: {
      amount: number;
      transactionType: string;
    };
  };
}
export interface IMessageMT490Sync {
  message: string;
}

export interface IMT940ReportTransaction {
  id: string;
  mt940: string;
  transactionDate: string;
  entryDate: string;
  transactionType: string;
  transactionIdCode: string;
  amount: number;
  statementRefNo: string;
  accServInsRef: string;
  statementDesc: string;
  paymentDesc1: string;
  paymentDesc2: string;
  paymentDesc3: string;
  refNo1: string;
  mbbTxCode: string;
  processingTime: string;
  source: string;
}

export interface IPayoutProjection {
  dayOfWeek: number;
  isHoliday: boolean;
  isReference: boolean;
  isWeekend: boolean;
  totalAmount: string;
  totalFees: string;
  transactionDate: string;
}
export interface IPayoutMax {
  transactionDate: string;
  totalAmount: string;
}
