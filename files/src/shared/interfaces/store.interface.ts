import {StoreOrderFulfilmentMethodEnum, StoreStatus} from '../enums/store.enum';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Store {
  export interface ITermsAndConditions {
    version: string;
    url: string;
    contents: string;
  }

  export interface ILocation {
    longitude: number;
    latitude: number;
  }

  export interface IOperationalHours {
    from: number;
    to: number;
  }

  export interface IOperationalDay {
    day: number;
    hours: IOperationalHours[];
  }

  export interface IStore {
    id: string;
    name: string;
    stationId: string;
    status: StoreStatus;
    stationName?: string;
    location?: ILocation;
    logoUrl?: string;
    operationalDays?: IOperationalDay[];
    merchantId: string;
    kipleMerchantId: string;
    fulfilmentMethod?: StoreOrderFulfilmentMethodEnum;
    externalRefNumber?: string;
    termsAndConditions?: ITermsAndConditions;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }

  export interface IStoresRole {
    hasStoreView: boolean;
    hasStoreUpdate: boolean;
  }

  export interface ITimeSlot {
    slots: Date[][];
  }
}
