export enum PrefundingBalanceAlertTypes {
  SLACK = 'slack',
}

export interface ITotalPrefundingBalanceResponse {
  amount: {
    total: number;
  };
}

export interface IPrefundingBalanceAlert {
  type: PrefundingBalanceAlertTypes;
  text: string;
  limit: number;
}

export interface IPrefundingBalanceAlertResponseItem extends IPrefundingBalanceAlert {
  id: string;
}

class StoreCard {
  balance: number;
  bonusGranted: number;
  expiresAt: Date;
}
interface Beneficiary {
  email: string;
  mobile: string;
  storeCard: StoreCard;
}
export interface PrefundingBalanceTransaction {
  id: string;
  createdAt: Date;
  description: string;
  referenceId?: string;
  beneficiary: Beneficiary;
  amount: number;
}

export interface IPrefundingBalanceDailySnapshotResponseItem {
  id: string;
  balance: number;
  createdAt: Date;
}

export interface IPrefundingBalanceDailySnapshot {
  balance: string;
  date: string;
}
