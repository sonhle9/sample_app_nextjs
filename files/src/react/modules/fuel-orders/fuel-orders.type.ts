import {CreditCardBrand} from '../../../shared/enums/wallet.enum';

export enum FuelOrderStatus {
  blank = '',
  fuelReservePumpStarted = 'fuelReservePumpStarted',
  fuelReservePumpSuccess = 'fuelReservePumpSuccess',
  fuelReservePumpError = 'fuelReservePumpError',
  fuelHoldAmountStarted = 'fuelHoldAmountStarted',
  fuelHoldAmountSuccess = 'fuelHoldAmountSuccess',
  fuelHoldAmountError = 'fuelHoldAmountError',
  fuelFulfillmentReady = 'fuelFulfillmentReady',
  fuelFulfillmentReadyError = 'fuelFulfillmentReadyError',
  fuelFulfillmentStarted = 'fuelFulfillmentStarted',
  fuelFulfillmentSuccess = 'fuelFulfillmentSuccess',
  fuelFulfillmentError = 'fuelFulfillmentError',
  created = 'created',
  confirmed = 'confirmed',
  fulfilled = 'fulfilled',
  error = 'error',
  canceled = 'canceled',
}

export enum OrderStatusFilterOptions {
  created = 'created',
  fulfillmentReady = 'fulfillmentReady',
  fulfillmentStarted = 'fulfillmentStarted',
  fulfillmentSuccess = 'fulfillmentSuccess',
  fulfillmentError = 'fulfillmentError',
  confirmed = 'confirmed',
  fulfilled = 'fulfilled',
  cancelled = 'cancelled',
  error = 'error',
}

export enum FuelPaymentProvider {
  wallet = 'wallet',
  smartpay = 'smartpay',
  vouchers = 'vouchers',
  cash = 'cash',
  boost = 'boost',
  card = 'card',
}

export enum FuelOrderType {
  fuel = 'fuel',
  fuelInCar = 'fuel-in-car',
}

export interface IFuelOrdersFilter {
  type?: FuelOrderType;
  from?: string;
  to?: string;
  status?: FuelOrderStatus | string;
  query?: string;
  stationName?: string;
  userId?: string;
  mechantId?: string;
  paymentProvider?: FuelPaymentProvider | string;
  cardBrand?: CreditCardBrand;
  date?: [string, string];
  adminTags?: string[];
}
