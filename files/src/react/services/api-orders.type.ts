export enum OrderStatusesLabel {
  'canceled' = 'Cancelled',
  'created' = 'Created',
  'error' = 'Error',
  'fulfilled' = 'Fulfilled',
  'confirmed' = 'Confirmed',
  'fuelFulfillmentReadyError' = 'Fuel Fulfillment Ready Error',
  'fuelFulfillmentReady' = 'Fuel Fulfillment Ready',
  'fuelReservePumpSuccess' = 'Fuel Reserve Pump Success',
  'fuelReservePumpStarted' = 'Fuel Reserve Pump Started',
  'fuelReservePumpError' = 'Fuel Reserve Pump Error',
  'fuelFulfillmentError' = 'Fuel Fulfillment Error',
  'fuelFulfillmentSuccess' = 'Fuel Fulfillment Success',
  'fuelFulfillmentStarted' = 'Fuel Fulfillment Started',
  'fuelHoldAmountSuccess' = 'Fuel Hold Amount Success',
  'fuelHoldAmountStarted' = 'Fuel Hold Amount Started',
  'fuelHoldAmountError' = 'Fuel Hold Amount Error',
  'blank' = '',
}

interface IOrderAction {
  _id: string;
  __v: number;
  ackUrl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  isFailed: boolean;
  meta: any;
  type: string;
  relatedDocumentId: string;
  amount: number;
  createdBy?: string;
  updatedBy?: string;
}

export enum PaymentMethodFriendlyName {
  SETEL_WALLET = 'Setel Wallet',
  SMARTPAY = 'Smartpay',
  VOUCHER = 'Voucher',
  BOOST = 'Boost',
  CASH = 'Cash',
  VISA = 'Visa',
  MASTERCARD = 'Mastercard',
  AMEX = 'AMEX',
  CARD = 'Card',
}

export enum CardBrandFriendlyName {
  VISA = 'Visa',
  MASTERCARD = 'Mastercard',
  AMEX = 'AMEX',
}

export interface IOrdersError {
  statusCode: number;
  errorCode: string;
  message: string;
}

export interface IFuelOrder {
  orderId?: string;
  orderType?: string;
  orderStatus?: string;
  status?: string;
  statusLabel?: OrderStatusesLabel | string;
  amount?: number;
  stationId: string;
  stationName?: string;
  pumpId?: string;
  userId?: string;
  userFullName?: string;
  createdAt?: Date | string;
  action?: IOrderAction;
  paymentProvider?: PaymentMethodFriendlyName | string;
  cardBrand?: CardBrandFriendlyName | string;
  transactionId?: string;
}
