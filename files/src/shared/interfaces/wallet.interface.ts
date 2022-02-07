import {
  Currency,
  TransactionStatus,
  TransactionSubType,
  TransactionType,
  CreditCardBrand,
  CreditCardPaymentType,
} from '../enums/wallet.enum';

export interface ICreditCardInformation {
  cardBrand?: CreditCardBrand;
  cardCategory?: string;
  paymentType?: CreditCardPaymentType;
  firstSixDigits?: number;
  lastFourDigits?: number;
}

export interface ITransaction {
  id: string;
  transactionUid: string;
  refundedTransactionUid?: string;
  walletId: string;
  userId: string;
  type: TransactionType;
  subType: TransactionSubType;
  status: TransactionStatus;
  amount: number;
  currency: Currency;
  referenceId?: string;
  tokenId?: string;
  merchantId?: string;
  iPay88TransactionId?: string;
  errorDescription?: string;
  fullName: string;
  email: string;
  transactionDate: string;
  isRefundProcessing?: boolean;
  creditCardInfo?: ICreditCardInformation;
  attributes?: IAttribute;
}
interface IAttribute {
  [0]: string[]; // ["comment", "actual comment"]
  email?: string;
}

export interface ITransactionIndexParams {
  userId?: string;
  type?: string;
  status?: string;
  cardBrand?: CreditCardBrand;
  paymentType?: CreditCardPaymentType;
  transactionDateFrom?: string;
  transactionDateTo?: string;
}

export interface CreateAdjustmentTransactionParams {
  amount: number;
  customerId: string;
  currency: Currency;
  comment: string;
}
