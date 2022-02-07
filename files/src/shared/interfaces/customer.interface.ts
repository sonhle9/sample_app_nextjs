export enum IdentityTypesEnum {
  icNumber = 'ic_number',
  oldIcNumber = 'old_ic_number',
  passportNumber = 'passport_number',
}

export interface ICustomerPinPreferences {
  fuelPurchase: boolean;
  storePurchase: boolean;
}
export interface ICustomerAccountSettings {
  userId: string;
  pinPreferences: ICustomerPinPreferences;
  emailSubscriptionStatus: boolean;
  isSafetyAgreed: {
    value: boolean;
    updatedAt: Date;
  };
  preferredPetrolBrand: string;
}

export interface ICustomerLite {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ICustomerWalletInfo {
  id: string;
  balance: number;
  isCreated?: boolean;
  limit?: number;
}

export interface ICustomerRefreshBalanceResponse {
  id: string;
  balance: number;
}

export interface ICustomer extends ICustomerLite {
  tierTitle: string;
  referralCode: string;
  referrerCode?: any;
  isBonusGranted: boolean;
  isBonusUnlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  deviceId: string;
  verified: boolean;
  internal: boolean;
  isEmailVerified: boolean;
  isEnabled: boolean;
  identityType?: IdentityTypesEnum;
  identityNumber?: string;
  language?: string;
  walletLimit?: number;
}

export interface ICustomerStorecard {
  id: string;
  isCreated?: boolean;
  balance: number;
  limit?: number;
}

export interface ICustomerRole {
  hasMenu: boolean;
  hasRead: boolean;
  hasIndex: boolean;
  hasSearch: boolean;
  hasEdit: boolean;
  hasTransactions: boolean;
  hasWallet: boolean;
  hasLoyaltyPointsGranting: boolean;
  hasBudget: boolean;
  hasTreasury: boolean;
  hasRecordAdjustment: boolean;
  hasStatement: boolean;
}

export interface IBudget {
  createdAt: string;
  fuelOrders: IBudgetFuelOrders;
  month: string;
  updatedAt: string;
  userId: string;
  year: string;
  __v?: number;
  _id: string;
}

export interface IBudgetFuelOrders {
  summaries: IBudgetSummaries[];
  totals: IBudgetTotal;
  _id: string;
}
export interface IBudgetSummaries {
  amountFuelled: number;
  fuelType: string;
  litresFuelled: number;
  purchaseCount: number;
  _id: string;
}

export interface IBudgetTotal {
  amountFuelled: number;
  litresFuelled: number;
  purchaseCount: number;
  _id: string;
}

export interface ICustomBudget {
  type: string;
  year?: string;
  month?: string;
  startDate: any;
  endDate: any;
}

export interface ICustomerCardActivationResponse {
  retryCount: number;
}
