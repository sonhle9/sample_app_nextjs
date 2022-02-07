export enum ProductCategoriesEnum {
  FOOD = 'food',
  BEVERAGES = 'beverages',
  SNACKS = 'snacks',
}

export interface IProduct {
  itemId?: string;
  storeId: string;
  barcode: string;
  image: string;
  name: string;
  price: number;
  isAvailable: boolean;
  rank: number;
  maxQuantity: number;
  category: ProductCategoriesEnum;
  currency: string;
  belongsTo: string;
  tax: number;
}

export interface IStoreError {
  statusCode: number;
  errorCode: string;
  message: string;
}

export interface IOperatingHours {
  day: number;
  timeSlots: ITimeSlot[];
}

export interface ITimeSlot {
  from: number;
  to: number;
}

export interface IFulfilment {
  type: FulfilmentTypeEnum;
  status: FulfilmentStatusEnum;
}

export interface IStoreTrigger {
  event: StoreTriggerEnum;
  status: 'active' | 'inactive';
  catalogueSetId: string;
}

export interface IStore {
  id?: string;
  storeId?: string;
  name: string;
  status: StoresStatusesEnum;
  stationId: string;
  stationName: string;
  merchantId?: string;
  pdbMerchantId?: string;
  items?: IProduct[];
  operatingHours?: IOperatingHours[];
  createdAt?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  fulfilments?: IFulfilment[];
  isMesra?: boolean;
  triggers?: IStoreTrigger[];
}

export enum StoresStatusesEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  COMING_SOON = 'coming-soon',
  MAINTENANCE = 'maintenance',
}

export enum FulfilmentStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum FulfilmentTypeEnum {
  DELIVER_TO_VEHICLE = 'deliver_to_vehicle',
}

export enum StoreTriggerEnum {
  APP_ORDERING_SHOP_ONLY = 'app_ordering_shop_only',
  APP_ORDERING_SHOP_WHILE_FUELLING = 'app_ordering_shop_while_fuelling',
}

export interface IStoresFilter {
  status?: string;
  query?: string;
  queryStore?: string;
  queryStation?: string;
}

export interface WaitingAreasFilter {
  query?: string;
}

export interface IStation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface IMerchant {
  merchantId: string;
  name: string;
}

export const INITIAL_STORE: IStore = {
  name: '',
  stationId: '',
  stationName: '',
  merchantId: '',
  pdbMerchantId: '',
  status: StoresStatusesEnum.INACTIVE,
  isMesra: true,
  fulfilments: [
    {
      type: FulfilmentTypeEnum.DELIVER_TO_VEHICLE,
      status: FulfilmentStatusEnum.INACTIVE,
    },
  ],
  triggers: [],
};

export const DEFAULT_STORE_VALUES = {
  brand: {
    name: 'Mesra',
    logoUrl:
      'https://mobile-app-assets-setel.s3-ap-southeast-1.amazonaws.com/stores/Mutiara+Damansara+-+Mesra/mesraLogo%403x.png',
  },
  operatingHours: [],
  peackHours: [],
  kipleMerchantId: '19',
  termsAndConditions: [
    {
      version: 1,
      url: 'http://localhost',
      contents: 'Lorem ipsum',
    },
  ],
};

export const INITIAL_PRODUCT: IProduct = {
  storeId: '',
  barcode: '',
  image: '',
  name: '',
  price: undefined,
  isAvailable: true,
  rank: 1,
  maxQuantity: 1,
  currency: 'RM',
  category: ProductCategoriesEnum.FOOD,
  belongsTo: '',
  tax: 0,
};

export interface IStoreHistory {
  id: string;
  activityType: ActivityTypeEnum;
  updatedBy: IStoreHistoryUser;
  prevStatus: StoresStatusesEnum;
  newStatus: StoresStatusesEnum;
  oldValues: IStoreChanges;
  newValues: IStoreChanges;
  changes: HistoryChanges[];
  dateTime: string;
  storeId: string;
  interface: InterfaceEnum;
}

export interface HistoryChanges {
  fieldName: string;
  key: string;
  oldValue?: any;
  newValue: any;
}
export interface IStoreHistoryFilter {
  activityType?: ActivityTypeEnum;
  userType?: UserTypeEnum;
  userName?: string;
  userId?: string;
  query?: string;
  from?: string;
  to?: string;
  storeId?: string;
}

export enum ActivityTypeEnum {
  CREATION = 'creation',
  UPDATE = 'update',
}

export enum UserTypeEnum {
  MERCHANT = 'merchant',
  ADMIN = 'admin',
}

export enum InterfaceEnum {
  ADMIN = 'admin',
  CONCIERGE = 'concierge',
  DASHBOARD = 'dashboard',
}

export interface IStoreChanges extends IStore {
  isDeleted: boolean;
  hasCookingGas: boolean;
}
export interface IStoreHistoryUser {
  userId: string;
  userType?: UserTypeEnum;
  userName?: string;
}
export interface IStoreHistoryUserFilter {
  userName?: string;
  storeId?: string;
}
