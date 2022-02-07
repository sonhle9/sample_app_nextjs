import {ReceivablesStatuses, ReceivableTypes} from './ledger-receivables.enum';
import {LedgerReportTypes} from './ledger-reports.enum';
import {TransactionTypes} from '../../react/modules/ledger/ledger-transactions/ledger-transactions.enums';

export interface ILedgerRole {
  hasMenu: boolean;
  hasRead: boolean;
  hasAdjust: boolean;
  hasTransfer: boolean;
  hasIndex: boolean;
  hasFinance: boolean;
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

export interface ILedgerTransaction {
  relatedTransactions: unknown[];
  balanceChanges: unknown[];
  id: string;
  transactionId: string;
  transactionUid: string;
  walletId: string;
  fullName: string;
  email: string;
  userId: string;
  type: TransactionTypes;
  subType: string;
  status: string;
  amount: number;
  currency: string;
  referenceId: string;
  merchantId: number;
  transactionDate: Date;
  createdAt: Date;
  updatedAt: Date;
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

export interface IEmailTo {
  date: string;
  emails: string[];
}

export interface IUserInputField {
  description?: string;
  amount?: string;
  isUnderlined?: boolean;
}

export interface IUserInputSection {
  description?: string;
  fields?: IUserInputField[];
}

export interface ILiabilitiesBreakdown {
  customerPrepayments: string | number;
  merchantPayables: string | number;
}

export interface ISummary {
  liabilities?: string | number;
  liabilitiesBreakdown?: ILiabilitiesBreakdown;
  equity?: string | number;
  payables?: string | number;
  receivables?: string | number;
  refunds?: string | number;
  withdrawals?: string | number;
  sections?: Array<IUserInputSection>;
  extras?: IUserInputField[];
}

export interface ILedgerReport {
  id: string;
  type: LedgerReportTypes;
  reportDate: string;
  emailedTo?: IEmailTo[];
  updatedBy?: any[];
  totalAmount?: number | string;
  totalAmountOnCreation?: number | string;
  totalFeeAmount?: number | string;
  transactionsCount?: number;
  transactions?: string[] | ILedgerTransaction[];
  summary?: ISummary;
  createdAt: string;
}
export interface IAttribute {
  account: string;
  reason: string;
}
export interface ILedgerAdjustments {
  id: string;
  attributes: IAttribute;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
}
