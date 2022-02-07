import {EType} from '../enums/card.enum';

export interface ICardGroupIndexParams {
  dateFrom?: string;
  dateTo?: string;
  searchValue?: string;
  cardType?: EType;
  merchantId?: string;
}

// export interface IContact {
//   email: string;
//   phoneNumber: string;
// }

// export interface IAddress {
//   type: string;
//   address1: string;
//   address2: string;
//   address3: string;
//   city: string;
//   postcode: string;
//   state: string;
//   country: string;
//   mailingIndicator: boolean;
// }

export interface ILimitations {
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

export interface ICardGroup {
  id: string;
  name: string;
  description: string;
  level: string;
  cardType: string;
  merchantId: string;
  createdAt: Date;
}

export interface ICardGroupRole {
  hasView: boolean;
  hasRead: boolean;
  hasCreate: boolean;
  hasUpdate: boolean;
}
