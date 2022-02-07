import {EPhysicalType} from '../enums/card.enum';
import {ICardGroup} from './card-group.interface';

export interface ICard {
  id: string;
  type: string;
  formFactor: string;
  physicalType: string;
  subtype: string;
  merchantId: string;
  cardNumber: string;
  processType?: string;
  status?: string;
  cardholder?: string;
  fleetVehicle?: string;
  vehicleNumber?: string;
  createAt?: string;
  cardGroup?: ICardGroup;
}

export interface ICardReplacement {
  formFactor: string;
  physicalType?: EPhysicalType;
  fee?: number;
  reason: string;
  remark?: string;
}

export interface ICardRole {
  hasView: boolean;
  hasRead: boolean;
  hasCreate: boolean;
  hasUpdate: boolean;
}

export interface ICardReplacementRole {
  hasView: boolean;
  hasCreate: boolean;
}

export interface ICardIndexParams {
  id?: string;
  type?: string;
  formFactor?: string;
  physicalType?: string;
  subtype?: string;
  merchantId?: string;
  cardNumber?: string;
  status?: string;
  cardholder?: any;
  fleetVehicle?: string;
  createAt?: string;
  dateFrom?: string;
  dateTo?: string;
  searchValue?: string;
}

export interface ILimitation {
  singleTransactionLimit: number;
  dailyCardLimit: number;
  dailyCardLimitBalance: number;
  monthlyCardLimit: number;
  monthlyCardLimitBalance: number;
  dailyCountLimit: number;
  dailyCountLimitBalance: number;
  monthlyCountLimit: number;
  monthlyCountLimitBalance: number;
  allowedFuelProducts: [string];
}

export interface ICardUpdateInput {
  status?: string;
  reason?: string;
  remark?: string;
  type?: string;
  formFactor?: string;
  physicalType?: string;
  subtype?: string;
  limitation?: ILimitation;
}

export interface ICardCreateBulkInput {
  formFactor: string;
  physicalType?: string;
  type: string;
  subtype?: string;
  expiry?: string;
  merchantId?: string;
  mileageReading: boolean;
  pinRequired: boolean;
  cardGroup: string;
  cardRange: string;
  numberOfCards: number;
}
