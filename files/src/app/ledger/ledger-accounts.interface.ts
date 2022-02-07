import {AccountsGroup, PlatformAccounts, AccountGroupBalanceTypes} from './ledger-accounts.enum';

export interface IAccountBalance {
  amount: number;
  debitTotal: number;
  debitCount: number;
  creditTotal: number;
  creditCount: number;
}

export interface IAccount {
  group: AccountsGroup;
  userId: string;
  currency: string;
  pendingBalance: IAccountBalance;
  availableBalance: IAccountBalance;
  metadata?: unknown;
}

export interface IPlatformAccounts {
  collection: IAccount;
  trust1: IAccount;
  operating: IAccount;
  operatingCollection: IAccount;
}

export interface IAggregatesAccounts {
  customer: IAccount;
  merchant: IAccount;
  buffer: IAccount;
  mdr: IAccount;
}

export interface IPlatformAdjustInput {
  account: PlatformAccounts;
  balanceType: AccountGroupBalanceTypes;
  amount: number;
  reason: string;
}
