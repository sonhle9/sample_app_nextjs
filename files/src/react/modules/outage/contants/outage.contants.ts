export const SYSTEM_WIDE_SCOPE = 'SystemWide';
export const DEFAULT_COUNTRY = 'malaysia';

export interface IVendors {
  cardtrendLms: boolean;
  kiple: boolean;
  pos: boolean;
  posSapura?: boolean;
  posSentinel?: boolean;
  posSetel?: boolean;
  silverstreet: boolean;
}

export interface IServices {
  accounts: boolean;
  orders: boolean;
  payments: boolean;
  loyalty: boolean;
  rewards: boolean;
  stations: boolean;
  emails: boolean;
  storeOrders: boolean;
}

export interface IFeatures {
  topUpWithCard: boolean;
  topUpWithBank: boolean;
  redeemLoyaltyPoints: boolean;
}

export interface IIPay88Bank {
  paymentId: number;
  name: string;
  imageUrl?: string;
  popular?: boolean;
  isMaintenance: boolean;
}

export enum SupportOutageVariantEnum {
  CHAT_OFF_SUPPORT_ON = 'chat-off-support-on',
  CHAT_ON_SUPPORT_ON = 'chat-on-support-on',
}

export const SUPPORT_OUTAGE_VARIABLE_KEY = 'app_motorist_help_centre_outage_maintenance_chat';
