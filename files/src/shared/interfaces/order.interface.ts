import {FuelOrderStatus} from '../../react/modules/fuel-orders/fuel-orders.type';

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

export interface IMerchant {
  merchantId: string;
  tradingCompanyName: string;
  gstNumber: string;
  phoneNumber: string;
}

export interface IFuelOrder {
  pumpId: string;
  isFullTank: boolean;
  completedAmount: number;
  completedVolume: number;
}

export interface IFuel {
  pumpId: string;
  fuelGrade: string;
  mesraCode: string;
  order: IFuelOrder;
}

export interface IStoreOrder {
  lineItems: any[];
}

export interface IStore {
  order: IStoreOrder;
}

export interface IInvoiceDetail {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  transactionCreatedAt: Date;
  transactionCompletedAt: Date;
  paymentAuthorizationId?: any;
  merchant: IMerchant;
  fuel: IFuel;
  store: IStore;
  subTotalWithoutGST: number;
  totalGSTAmount: number;
  grandTotal: number;
}

export interface IInvoice {
  orderid: string;
  transactionId: string;
  orderStatus: string;
  paymentAuthorizationId: string;
  invoice: IInvoiceDetail;
}

export interface IOrder {
  orderId: string;
  orderType: string;
  orderStatus: string;
  status: FuelOrderStatus;
  amount: number;
  stationId: string;
  stationName: string;
  pumpId: string;
  userId: string;
  userFullName: string;
  adminTags?: string[];
  voucherUsed?: IVoucherUsed;
  createdAt: Date;
  loyaltyTransaction: ILoyaltyTransactions;
  invoice: IInvoice;
  paymentProvider?: string;
}

interface IVoucherUsed {
  voucherCode?: string;
  voucherAmount?: number;
  isVoucherUsed?: boolean;
}

export interface IOrderRole {
  hasMenu: boolean;
  hasFuelOrderView: boolean;
  hasFuelOrderExport: boolean;
  hasFuelOrderUpdate: boolean;
  hasFuelOrderRecoveryView: boolean;
  hasFuelOrderRecoveryUpdate: boolean;
  hasFuelPriceView: boolean;
  hasFuelPriceCreate: boolean;
  hasFuelPriceUpdate: boolean;
}
