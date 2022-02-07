import {AccountGroupBalanceTypes, AccountsGroup, PlatformAccounts} from './cashflows.enum';

export interface IAccountBalance {
  amount: number;
  debitTotal: number;
  debitCount: number;
  creditTotal: number;
  creditCount: number;
}

export interface IPlatformAccounts {
  collection: IAccount;
  trust: IAccount;
  operating: IAccount;
  operatingCollection: IAccount;
}

export interface IAccount {
  group: AccountsGroup;
  userId: string;
  currency: string;
  pendingBalance: IAccountBalance;
  availableBalance: IAccountBalance;
}

export interface IPlatformAdjustInput {
  account: PlatformAccounts;
  balanceType: AccountGroupBalanceTypes;
  amount: number;
  reason: string;
}

export interface IAdjustBufferInput {
  amount: number;
  reason: string;
}

export interface ITransferAccount {
  accountGroup: AccountsGroup;
  userId: PlatformAccounts;
}

export interface ITransferAccountInput {
  from: ITransferAccount;
  amount: number;
  reason: string;
  to: ITransferAccount;
}
export interface ICashflowsModalProps {
  visible: boolean;
  onClose?: () => void;
}
