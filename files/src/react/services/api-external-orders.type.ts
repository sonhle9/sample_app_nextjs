import {VendorTypes} from '../modules/stations/stations.enum';

export enum ExternalOrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

export enum PurchaseOrderType {
  FUEL = 'Fuel',
  STORE = 'Store',
}

export interface IOrderItem {
  name: string;
  type: PurchaseOrderType;
  pricePerUnit: number;
  quantity: number;
  totalPrice: number;
  isValidForLoyaltyPoints?: boolean;
}

export interface IExternalOrder {
  createdAt: Date;
  userId: string;
  id: string;
  orderType: PurchaseOrderType;
  stationName: string;
  items?: IOrderItem[];
  status: ExternalOrderStatus;
  amount?: number;
}

export interface IExternalOrdersError {
  statusCode: number;
  errorCode: string;
  message: string;
}

export interface IExternalOrdersFilter {
  id?: string;
  status?: ExternalOrderStatus;
  vendorType?: VendorTypes;
  orderType?: PurchaseOrderType;
  amount?: number;
  stationName?: string;
  stationId?: string;
  storeName?: string;
  from?: string;
  to?: string;
  query?: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

export enum OrderType {
  FUEL = 'FUEL',
  STORE = 'STORE',
}

export interface BulkGrantOrderPreviewItem {
  id: string;
  status: OrderStatus;
  requested: string;
  externalOrderId: string;
  receiptNumber: string;
  transactionDate: string;
  stationName: string;
  purchaseType: OrderType;
  items: string;
  isValidExternalOrder: boolean;
  isGrantedBasePoint: boolean;
  grantedBasePoints: number;
  pointsToBeGranted: string;
}
