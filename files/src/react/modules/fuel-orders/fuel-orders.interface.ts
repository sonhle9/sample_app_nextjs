import {FuelOrderStatus} from './fuel-orders.type';

interface IVoucherUsed {
  voucherCode?: string;
  voucherAmount?: number;
  isVoucherUsed?: boolean;
}

interface ILoyaltyTransactions {
  petronas?: ILoyaltyTransaction;
  setel?: ILoyaltyTransaction;
}

interface ILoyaltyTransaction {
  isSuccess: boolean;
  cardNumber: string;
  earnedPoints: number;
  balance: number;
  transactionId: string;
  createdAt: Date;
}

interface IMerchant {
  merchantId: string;
  tradingCompanyName: string;
  gstNumber: string;
  phoneNumber: string;
}

interface IFuelOrder {
  pumpId: string;
  isFullTank: boolean;
  completedAmount: number;
  completedVolume: number;
  pricePerUnit: number;
}

interface IFuel {
  pumpId: string;
  fuelGrade: string;
  mesraCode: string;
  order: IFuelOrder;
}

interface IStore {
  order: {lineItems: any[]};
}

interface IInvoiceDetail {
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

interface IInvoice {
  orderid: string;
  transactionId: string;
  orderStatus: string;
  paymentAuthorizationId: string;
  invoice: IInvoiceDetail;
}

interface FuelOrderState {
  name: string;
  completed: boolean;
  success?: boolean;
  error?: any;
  errorCode?: string;
  message?: string;
  locked?: boolean;
}

interface OrderStatesBaseStatusObject {
  status: boolean;
  datetime?: Date;
  requestId?: string;
}

interface OrderStatesBase {
  completed: OrderStatesBaseStatusObject;
  started?: OrderStatesBaseStatusObject;
  skipped?: OrderStatesBaseStatusObject;
}

interface IOrderStatesFulfillConfirmation extends OrderStatesBase {
  error?: OrderStatesBaseStatusObject;
}

interface IOrderStatesCancelBase extends OrderStatesBase {
  error?: any;
}

interface IOrderStatesCancel extends OrderStatesBase {
  holdAmountCancel?: IOrderStatesCancelBase;
  posOrderCancel?: IOrderStatesCancelBase;
  reason?: string;
}

interface IFuelOrderStates {
  init?: OrderStatesBase;
  externalInit?: OrderStatesBase;
  externalPayment?: OrderStatesBase;
  transactionInit?: OrderStatesBase;
  preAuth?: OrderStatesBase;
  fulfill?: OrderStatesBase;
  fulfillConfirmation?: IOrderStatesFulfillConfirmation;
  charge?: OrderStatesBase;
  chargeRecovery?: OrderStatesBase;
  issueLoyaltyPointsSetel?: OrderStatesBase;
  issueLoyaltyPointsPetronas?: OrderStatesBase;
  confirm?: OrderStatesBase;
  cancel?: IOrderStatesCancel;
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

export interface IGetManualReleaseStatus {
  status: boolean;
}

export interface IAdminOrder {
  loyaltyTransaction: ILoyaltyTransactions;
  invoice: IInvoice;
  fuelOrderState: FuelOrderState;
  fuelOrderStates: IFuelOrderStates;
  orderId: string;
  orderType: string;
  paymentProvider: string;
  cardBrand: string;
  orderStatus: string;
  status: string;
  statusLabel: string;
  amount: number;
  stationId: string;
  stationName: string;
  pumpId: string;
  userId: string;
  userFullName: string;
  adminTags: string[];
  voucherUsed: IVoucherUsed;
  createdAt: Date;
  paymentAuthorizedAmount: number;
}

export interface IAdminTag {
  name: string;
}

export interface IManualCharge {
  orderId: string;
  remark: string;
}

export interface IManualChargeByGeneratedInvoice {
  orderId: string;
  amount: number;
  fuelType: string;
  pricePerUnit: number;
  completedVolume: number;
}
