export interface ICardTransaction {
  id: string;
  amount?: number;
  cardNumber: string;
  currency?: string;
  merchant?: string;
  status: string;
  type: string;
  updatedAt?: string;
  createdAt: string;
}

export interface ICardTransactionIndexParams {
  dateFrom?: string;
  dateTo?: string;
  values?: any[];
  level?: string;
  type?: string;
  status?: string;
}

export interface ICardTransactionRole {
  hasView: boolean;
  hasRead: boolean;
  hasCreate: boolean;
  hasUpdate: boolean;
}

export interface EmailTransactionInput {
  toEmails: string[];
  transactionId?: string;
}
