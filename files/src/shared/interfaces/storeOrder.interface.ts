import {StoreOrderPosType} from '../enums/store.enum';
import {StoreOrderStatusesEnum} from '../enums/storeOrders.enum';

export interface ILoyaltyTransactions {
  petronas?: ILoyaltyTransaction;
  setel?: ILoyaltyTransaction;
}

export interface ILoyaltyTransaction {
  isSuccess: boolean;
  cardNumber: string;
  earnedPoints: number;
  balance: number;
  transactionId: string;
  createdAt: Date;
}

export interface ICStoreOrder {
  id: string;
  vendorType: StoreOrderPosType;
  createdAt: Date;
  updatedAt: Date;
  stationName: string;
  storeOrderStatus: string;
  storeOrderState: string;
  totalAmount: number;
  userId: string;
}
export interface IStoreOrder {
  id: string;
  stationName: string;
  paymentProvider: string;
  userId: string;
  fullName: string;
  merchantId: string;
  vendorType: string;
  storeOrderStatus: StoreOrderStatusesEnum;
  storeOrderState: string;
  retailerId: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  chargeTransactionId?: string;
}

export interface IInCarOrder {
  orderId: string;
  status: string;
  stationId: string;
  storeName: string;
  userFullName: string;
  createdAt: Date;
  totalAmount: number;
}

export interface IStoreOrderRole {
  hasStoreOrderView;
}

export interface IStoreOrderStatistics {
  confirmed?: number;
  chargeError?: number;
  chargeSuccessful?: number;
  voidSuccessful?: number;
  voidError?: number;
  voidPending?: number;
  pointIssuanceSuccessful?: number;
  pointIssuanceError?: number;
  error?: number;
}

export interface IStoreOrderDashboard {
  storeOrdersStatistics: IStoreOrderStatistics;
  totalCount: number;
}
