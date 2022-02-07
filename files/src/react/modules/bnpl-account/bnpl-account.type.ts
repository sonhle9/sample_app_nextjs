import {IPaginationParam} from 'src/react/lib/ajax';

export enum BnplAccountStatus {
  active = 'Active',
  inactive = 'Inactive',
  requires_ekyc = 'Spending eKYC',
  requires_payment_method = 'Spending CardTerus',
  frozen = 'Frozen',
}

export enum BnplAccountBillsStatus {
  uncollectible = 'Uncollectible',
  voided = 'Voided',
  open = 'Open',
  past_due = 'Past Due',
  paid = 'Paid',
  refunded = 'Refunded',
  partially_refunded = 'Partially Refunded',
}

export enum BnplAccountTransactionsStatus {
  success = 'Success',
  pending = 'Grey',
  failed = 'Warning',
}

export interface IBnplAccount {
  id?: string;
  name?: string;
  userId: string;
  status: BnplAccountStatus;
  gracePeriod: number;
  creditLimit: number;
  activationDate: string;
  billCycle: number;
  lastBillRunDate: string;
  lastBillRunAmount: number;
  creditBalance: number;
  cardNumber?: string;
  amountDueThisMonth?: number;
}

export interface IBnplAccountBill {
  bnpl_bill_id: string;
  status: BnplAccountBillsStatus;
  due_date: string;
  bill_amount: number;
  associated_instructions: string;
}

export interface IBnplAccountTransaction {
  transaction_id: string;
  status: BnplAccountStatus;
  type: string;
  amount: number;
  available: number;
  payment_method: string;
  error_message: string;
}

export interface GetBnplAccountOptions extends IPaginationParam, IAccountIndexParams {}

export interface IAccountIndexParams {
  status?: BnplAccountStatus;
  creditLimit?: number;
  creditBalance?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
