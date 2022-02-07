import {
  BalanceStatus,
  MerchantTypes,
  StatementStatus,
  SubSummaryTypes,
  SummaryTypes,
} from './billing-statement-summary.constants';

export interface BillingStatementSummary {
  id: string;
  statementDate: string;
  statementEndDate: string;
  closingBalance: number;
  statementNo: string;
  totalCredit: number;
  totalDebit: number;
  gracePaymentDueDate: string;
  paymentDueDate: string;
  numberOfKnockOff: number;
  status: StatementStatus;
  merchantId: string;
  smartpayAccountName: string;
  smartpayAccountId: string;
  smartpayAccountFleetPlan: SmartpayAccountFleetPlans;
  billingAddress: string;
  creditLimit: number;
  previousBalance: number;
  summaries: {
    type: SummaryTypes;
    total: number;
    subSummaries: {
      amount: number;
      type: SubSummaryTypes;
      typeDescription?: string;
      isPrevCycle?: string;
    }[];
  }[];
}

export interface BillingStatementAccount {
  id: string;
  merchantId: string;
  merchantName: string;
  merchantType: MerchantTypes;
  fleetPlan: SmartpayAccountFleetPlans;
  balanceStatus: BalanceStatus;
  openingBalance: number;
  lastPaymentDate: string;
  lastPaymentAmount: number;
  lastStatementDate: string;
  overdueBalance: number;
  closingBalance: number;
  currentBalance: number;
  gracePaymentDueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBillingStatementSummaryDetailsProps {
  billingStatementSummaryId: any;
}
interface IRequest {
  perPage?: number;
  page?: number;
}

export interface IBillingStatementSummaryRequest extends IRequest {
  merchantId?: string;
}

export interface IBillingStatementAccountRequest extends IRequest {
  merchantId?: string;
  balanceStatus?: string;
}

export interface IStatementSummaryFilter {
  merchantId?: string;
}

export interface IStatementAccountFilter {
  merchantId?: string;
  balanceStatus?: string;
}

export enum SmartpayAccountFleetPlans {
  PREPAID = 'prepaid',
  POSTPAID = 'postpaid',
}

export const getBalanceStatusColor = (status: BalanceStatus) => {
  switch (status) {
    case BalanceStatus.PAID:
      return 'success';
    case BalanceStatus.INIT:
      return 'blue';
    case BalanceStatus.OVERDUE:
      return 'error';
    case BalanceStatus.PENDING:
      return 'lemon';
  }
};

export const FleetPlansTextPair = {
  [SmartpayAccountFleetPlans.POSTPAID]: 'Postpaid',
  [SmartpayAccountFleetPlans.PREPAID]: 'Prepaid',
};

export interface IStatementTransaction {
  id: string;
  statementId: string;
  type: SummaryTypes;
  subType: SubSummaryTypes;
  transactionUid: string;
  transactionDate: string;
  postingDate: string;
  cardNumber?: string;
  driverNo?: string;
  merchantId?: string;
  merchantName?: string;
  companyId?: string;
  companyName?: string;
  smartpayAccountId?: string;
  smartpayAccountName?: string;
  amount: number;
  rrn?: string;
  transactionDesc?: string;
  collectionBank?: string;
  refStatements: RefStatements[];
}

export interface RefStatements {
  statementId: string;
  statementNo: string;
  closingBalance: number;
  currentMonthBalance: number;
  paidAmount: number;
}

export interface IStatementSummaryTransactionFilter extends IRequest {
  id?: string;
  type?: SummaryTypes;
  subType?: SubSummaryTypes;
  cardNo?: string;
  timeFrom?: string;
  timeTo?: string;
  isPrevCycle?: boolean;
}
