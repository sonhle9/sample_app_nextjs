import {VendorTypes} from '../modules/stations/stations.enum';

export enum OverCounterOrderStatus {
  created = 'created',
  chargeSuccessful = 'successfulCharge',
  chargeError = 'errorCharge',
  voidSuccessful = 'successfulVoid',
  voidPending = 'pendingVoid',
  voidError = 'errorVoid',
  pointIssuanceSuccessful = 'successfulPointIssuance',
  pointIssuanceError = 'errorPointIssuance',
  pointVoidSuccessful = 'successfulPointVoid',
  pointVoidError = 'errorPointVoid',
  confirmed = 'confirmed',
  error = 'error',
}

export enum ConciergeOrderStatus {
  created = 'created',
  acknowledged = 'acknowledged',
  modified = 'modified',
  chargeSuccess = 'chargeSuccess',
  chargeError = 'chargeError',
  delivered = 'delivered',
  pointIssuanceSuccess = 'pointIssuanceSuccess',
  pointIssuanceError = 'pointIssuanceError',
  pointVoidSuccess = 'pointVoidSuccess',
  pointVoidError = 'pointVoidError',
  voidSuccess = 'voidSuccess',
  voidError = 'voidError',
  CancelSuccess = 'CancelSuccess',
  CancelError = 'CancelError',
}

export enum ConciergeOrderStates {
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_HOLD_AMOUNT_SUCCESS = 'ORDER_HOLD_AMOUNT_SUCCESS',
  ORDER_HOLD_AMOUNT_ERROR = 'ORDER_HOLD_AMOUNT_ERROR',
  ORDER_ACKNOWLEDGED = 'ORDER_ACKNOWLEDGED',
  ORDER_MODIFIED = 'ORDER_MODIFIED',
  ORDER_CHARGE_SUCCESS = 'ORDER_CHARGE_SUCCESS',
  ORDER_CHARGE_ERROR = 'ORDER_CHARGE_ERROR',
  ORDER_PAYMENT_RECOVERY_SUCCESS = 'ORDER_PAYMENT_RECOVERY_SUCCESS',
  ORDER_PAYMENT_RECOVERY_ERROR = 'ORDER_PAYMENT_RECOVERY_ERROR',
  ORDER_DELIVERED = 'ORDER_DELIVERED',
  ORDER_POINTS_ISSUANCE_SUCCESS = 'ORDER_POINTS_ISSUANCE_SUCCESS',
  ORDER_POINTS_ISSUANCE_ERROR = 'ORDER_POINTS_ISSUANCE_ERROR',
  ORDER_POINTS_VOID_SUCCESS = 'ORDER_POINTS_VOID_SUCCESS',
  ORDER_POINTS_VOID_ERROR = 'ORDER_POINTS_VOID_ERROR',
  ORDER_VOID_SUCCESS = 'ORDER_VOID_SUCCESS',
  ORDER_VOID_ERROR = 'ORDER_VOID_ERROR',
  ORDER_CANCEL_SUCCESS = 'ORDER_CANCEL_SUCCESS',
  ORDER_CANCEL_ERROR = 'ORDER_CANCEL_ERROR',
}

export interface IOverCounterOrder {
  id: string;
  vendorType: VendorTypes;
  createdAt: Date;
  updatedAt: Date;
  stationName: string;
  storeOrderStatus: OverCounterOrderStatus;
  storeOrderState: string;
  totalAmount: number;
  userId: string;
  fullName: string;
  paymentProvider: 'wallet' | 'card';
  success: boolean;
  orderId: string;
  retailerId: string;
  txDate: string;
  posTransactionId: string;
  paymentMetaData: {
    cardTokenId: string;
    cardBrand: string;
    cardLastFourDigits: string;
  };
  authorizationId: string;
  totalTaxAmount: number;
  items: {
    _id: string;
    type: 'Product' | 'Promotion';
    name: string;
    mesraCode: string;
    unitPrice: number;
    quantity: number;
    amount: number;
    taxCode: string;
    taxRate: number;
    taxAmount: number;
    subItems: {
      _id: string;
      name: string;
      mesraCode: string;
      unitPrice: number;
      quantity: number;
      amount: number;
      taxCode: string;
      taxRate: number;
      taxAmount: 0;
    }[];
  }[];
  storeOrderStates: {
    init: {
      started: string;
      skipped: string;
      completed: string;
      errorMessage: string;
      errorObject: string;
    };
    charge: {
      started: string;
      skipped: string;
      completed: string;
      errorMessage: string;
      errorObject: string;
    };
    loyalty: {
      started: string;
      skipped: string;
      completed: string;
      errorMessage: string;
      errorObject: string;
    };
    void: {
      started: string;
      skipped: string;
      completed: string;
      errorMessage: string;
      errorObject: string;
    };
    confirm: {
      started: string;
      skipped: string;
      completed: string;
      errorMessage: string;
      errorObject: string;
    };
    cancel: {
      started: string;
      skipped: string;
      completed: string;
      errorMessage: string;
      errorObject: string;
    };
  };
  chargeTransactionId: string;
  chargeTransactionReferenceId: string;
  chargeTransactionAmount: number;
  chargeTransactionDate: string;
  walletBalance: number;
  paymentLabel: 'Refunded';
  loyalty: {
    petronas: {
      id: string;
      isSuccess: true;
      cardNumber: string;
      transactionId: string;
      earnedPoints: number;
      bonusPoint: number;
      balance: number;
      error: string;
      createdAt: string;
    };
  };
  merchantId: string;
  loyaltyVendorMerchantId: string;
  error: string;
  createdBy: string;
  updatedBy: string;
}

export interface IDeliver2MeOrder {
  id: string;
  orderId: string;
  baseOrderId: string;
  code: string;
  otac: string;
  userId: string;
  pinToken: string;
  userFullName: string;
  userPhoneNumber: string;
  storeId: string;
  merchantId: string;
  loyaltyVendorMerchantId: string;
  storeName: string;
  stationId: string;
  stationName: string;
  paymentProvider: 'wallet' | 'card';
  paymentMetaData: {
    cardTokenId: string;
    cardBrand: string;
    cardLastFourDigits: string;
  };
  pumpId: number;
  serviceCharge: number;
  paymentTransactionId: string;
  paymentReferenceId: string;
  posTransactionId: string;
  type: 'retail' | 'concierge';
  status: ConciergeOrderStatus;
  state: ConciergeOrderStates;
  states: {
    placed: {
      started: string;
      skipped: string;
      completed: string;
      errorMessage: string;
      errorObject: string;
    };
    acknowledged: {
      started: string;
      skipped: string;
      completed: string;
      errorMessage: string;
      errorObject: string;
    };
    ready: {
      started: string;
      skipped: string;
      completed: string;
      errorMessage: string;
      errorObject: string;
    };
    delivered: {
      started: string;
      skipped: string;
      completed: string;
      errorMessage: string;
      errorObject: string;
    };
    charge: {
      started: string;
      skipped: string;
      completed: string;
      errorMessage: string;
      errorObject: string;
    };
    loyalty: {
      started: string;
      skipped: string;
      completed: string;
      errorMessage: string;
      errorObject: string;
    };
    void: {
      started: string;
      skipped: string;
      completed: string;
      errorMessage: string;
      errorObject: string;
    };
    cancel: {
      started: string;
      skipped: string;
      completed: string;
      errorMessage: string;
      errorObject: string;
    };
    reconcile: {
      started: string;
      skipped: string;
      completed: string;
      errorMessage: string;
      errorObject: string;
    };
  };
  items: {
    itemId: string;
    quantity: number;
    maxQuantity: number;
    storeId: string;
    mesraCode: string;
    barcode: string;
    tax: number;
    price: number;
    isAvailable: true;
    image: string;
    belongsTo: string;
    category: string;
    externalRefNumber: string;
    currency: string;
  }[];
  vehicle: {
    plateNumber: string;
    color: string;
  };
  vehicleNumber: string;
  fulfilmentMethod: 'pitStop';
  pickUpTime: unknown;
  totalAmount: number;
  taxAmount: number;
  grandTotalAmount: number;
  walletBalance: number;
  paymentLabel: 'Refunded' | 'Partially refunded' | 'Processing';
  loyalty: {
    petronas: {
      id: string;
      isSuccess: true;
      cardNumber: string;
      transactionId: string;
      earnedPoints: number;
      bonusPoint: number;
      balance: number;
      error: string;
      createdAt: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
}

export interface IStoreOrderError {
  statusCode: number;
  errorCode: string;
  message: string;
}

export interface IStoreOrderFilter {
  userId?: string;
  orderId?: string;
  status?: ConciergeOrderStatus | string;
  state?: ConciergeOrderStates | string;
  vendorType?: VendorTypes;
  stationName?: string;
  stationId?: string;
  storeName?: string;
  from?: string;
  to?: string;
  query?: string;
}
