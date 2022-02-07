import {TransactionType, TransactionSubType} from '../../app/stations/shared/const-var';

export interface IError {
  code?: any;
  description?: any;
  message?: any;
}

export interface ICreditCardTransaction {
  shopperIp: string;
  cardSchema: string;
  creditCardId: string;
  lastForDigits: string;
}

export interface IStorecardTransaction {
  balance: number;
  expiryDate: string;
  merchantId: string;
}

export interface ITransaction {
  error: IError;
  creditCardTransaction: ICreditCardTransaction;
  webhookResponse: any[];
  id: string;
  _id: string;
  walletId: string;
  userId: string;
  fullName?: string;
  kipleTransactionId: string;
  amount: number;
  type: TransactionType;
  subtype: TransactionSubType;
  kipleType: string;
  isSuccess: boolean;
  rawRequest: string;
  rawResponse: string;
  rawError?: string;
  createdAt: Date;
  updatedAt: Date;
  storecardTransaction: IStorecardTransaction;
  orderId: string;
  stationName: string;
  status: string;
  posTransactionId: string;
  message: string;
  walletBalance: number;
  referenceType?: string;
  referenceId?: string;
  merchantId?: string;
  remark?: string;
}

export interface IVendorTransaction {
  id: string;
  createdAt: Date;
  referenceId: string;
  type: string;
  amount: number;
}

export interface ICreateTransactionInput {
  amount: number;
  userId: string;
  type: string;
  createdAt: Date;
  message: string;
}

export interface ITransactionRole {
  hasView: boolean;
}

export enum ITransactionStatus {
  SUCCESS = 'success',
  PENDING = 'pending',
  ERROR = 'error',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REVERSED = 'reversed',
  INCOMING = 'incoming',
}

export interface IGrantWalletInput {
  userId: string;
  amount: number;
  expiryDate: Date;
  tag: string[];
  message: string;
}
