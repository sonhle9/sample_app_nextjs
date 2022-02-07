export interface CurrentFuelPrice {
  id: string;
  startDate: string;
  endDate: string;
  prices: CurrentPrices[];
}

export interface CurrentPrices {
  currentPrice: number;
  diff: number;
  name: string;
  shortName: string;
  fuelType: IFuelType;
  isPreferred: boolean;
  oldPrice: number;
}

export type CurrentPricesWithTitle = CurrentPrices & {title: string};

export interface IndexFuelPricesResponse {
  isEmpty: boolean;
  items: IndexFuelPriceItem[];
  page: number;
  pageCount: number;
  perPage: number;
  total: number;
}

interface IndexFuelPriceItem {
  createdAt: string;
  endDate: string;
  id: string;
  startDate: string;
  updatedAt: string;
  prices: Price[];
}

interface Price {
  currentPrice?: number;
  diff?: number;
  oldPrice?: number;
  fuelType: string;
  price: number;
  _id?: string;
}

export interface CreateOrUpdateFuelPriceRequest {
  startDate: string;
  endDate: string;
  prices: Price[];
}

export interface FuelPriceResponse {
  createdAt: string;
  endDate: string;
  _id: string;
  startDate: string;
  updatedAt: string;
  prices: Price[];
}

export enum FuelPriceSyncStatus {
  ALL = 'ALL',
  APPLIED = 'APPLIED',
  RECEIVED = 'RECEIVED',
  NOT_RECEIVED = 'NOT_RECEIVED',
}

export enum IFuelType {
  PRIMAX_95 = 'PRIMAX_95',
  PRIMAX_97 = 'PRIMAX_97',
  DIESEL = 'DIESEL',
  EURO5 = 'EURO5',
}

export interface SitesFuelPriceSyncRequest {
  fuelPriceId: string;
  keyWord: string;
  page: number;
  perPage: number;
  status: FuelPriceSyncStatus;
}

export interface SitesFuelPriceSyncResponse {
  siteId: string;
  name: string;
  receivedAt?: Date;
  appliedAt?: Date;
}

export interface SitesFuelPriceSyncStatisticsResponse {
  notReceived: number;
  received: number;
  applied: number;
  all: number;
}
