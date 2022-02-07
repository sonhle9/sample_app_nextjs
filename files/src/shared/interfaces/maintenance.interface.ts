export interface IFeatures {
  topUpWithCard: boolean;
  topUpWithBank: boolean;
  redeemLoyaltyPoints: boolean;
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

export interface IVendors {
  cardtrendLms: boolean;
  kiple: boolean;
  pos: boolean;
  posSapura?: boolean;
  posSentinel?: boolean;
  posSetel?: boolean;
  silverstreet: boolean;
}

export interface IMalaysiaSystemState {
  features: IFeatures;
  services: IServices;
  vendors: IVendors;
  changeReason: string;
  announcementText: string;
  currentAnnouncementText: string;
  futureMaintenancePeriods?: IFutureMaintenancePeriod[];
  entireSystem: boolean;
  android: boolean;
  ios: boolean;
  currentAnnouncementColour: string;
  currentAnnouncementTextLocale: ICurrentAnnouncementTextLocale;
}
export interface IIPay88Bank {
  paymentId: number;
  name: string;
  imageUrl?: string;
  popular?: boolean;
  isMaintenance: boolean;
}

export interface IFutureMaintenancePeriod {
  id: string;
  startDate: string;
  endDate: string;
  announcementText: string;
  announcementTextLocale: ICurrentAnnouncementTextLocale;
  announcementColour: string;
  scope: string;
  type: string;
}

export interface IReadSystemStateResponse {
  malaysia: IMalaysiaSystemState;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IScheduleMaintenanceInput {
  scope: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  announcementText?: string;
}

export interface IUpdateAnnouncementInput {
  announcementColour?: string;
  announcementText?: string;
  announcementTextLocale?: ICurrentAnnouncementTextLocale;
  country: string;
  scope: string;
  startDate?: Date;
}
export interface ICurrentAnnouncementTextLocale {
  en: string;
  ms?: string;
  'zh-Hans'?: string;
  'zh-Hant'?: string;
  ta?: string;
}

export interface IMaintenanceRole {
  hasMaintenanceOutageView: boolean;
  hasMaintenanceOutageUpdate: boolean;
  hasMaintenanceVersionView: boolean;
  hasMaintenanceVersionCreate: boolean;
  hasMaintenanceVersionDelete: boolean;
  hasMaintenanceVersionUpdate: boolean;
}

export interface IIPay88Bank {
  paymentId: number;
  name: string;
  imageUrl?: string;
  popular?: boolean;
  isMaintenance: boolean;
}
