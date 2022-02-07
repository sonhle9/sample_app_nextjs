export enum OrderType {
  FUEL = 'FUEL',
  STORE = 'STORE',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

export interface IOrderItem {
  name: string;
  type: OrderType;
  pricePerUnit: number;
  quantity: number;
  totalPrice: number;
  isValidForLoyaltyPoints?: boolean;
}

export interface IExternalOrder {
  orderType: OrderType;
  status: OrderStatus;
  zendeskUrl?: string;
  receiptImageUrl?: string;
  items?: IOrderItem[];
  totalAmount?: number;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IExternalOrderRole {
  hasExternalOrderView: boolean;
  hasExternalOrderUpdate: boolean;
}

export interface ICsvFileOrderResponse {
  batchId: string;
}

export interface ICsvPreviewOrdersResponse {
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
}
