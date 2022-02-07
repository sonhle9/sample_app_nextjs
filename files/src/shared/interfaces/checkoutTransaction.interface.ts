import {
  CheckoutPaymentMethod,
  CheckoutPaymentMethodBrand,
  CheckoutPaymentMethodFamily,
} from 'src/app/customers/shared/const-var';
import {CheckoutTransactionStatus} from '../../app/stations/shared/const-var';

export interface IError {
  code?: any;
  message?: any;
}

export interface IPaymentMethod {
  family: CheckoutPaymentMethodFamily;
  type: CheckoutPaymentMethod;
  brand: CheckoutPaymentMethodBrand;
}

export interface IPaymentMethodLite {
  text: any;
  family: any;
  type: any;
  brand: any;
}

export interface ICustomerLite {
  id: string;
  name: string;
  email: string;
}

export interface IShippingAddress {
  _id: string;
  isDefault: boolean;
  customerId: string;
  recipientName: string;
  phoneNumber: string;
  postCode: string;
  shippingAddressL1: string;
  shippingAddressL2: string;
  townCity: string;
  state: string;
  country: string;
  addressType: string;
  id: string;
}

export interface IBillingAddress {
  _id: string;
  isDefault: boolean;
  customerId: string;
  recipientName: string;
  phoneNumber: string;
  postCode: string;
  shippingAddressL1: string;
  shippingAddressL2: string;
  townCity: string;
  state: string;
  country: string;
  addressType: string;
  id: string;
}

export interface IItemDetails {
  itemName: string;
  variationName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  totalDiscountedPrice: number;
}

export interface IReferenceMeta {
  id: string;
  tenantId: string;
  merchantId: string;
  companyId: string;
  paymentMerchantId: string;
  sub: string;
  clientId: string;
  customerId: string;
  customerEmail: string;
  customerCode: string;
  customerFirstName: string;
  customerLastName: string;
  tenantSite: string;
  merchantCode: string;
  cartId: string;
  shippingAddress: IShippingAddress;
  billingAddress: IBillingAddress;
  totalQuantity: number;
  subtotal: number;
  shippingFee: number;
  totalDiscount: number;
  voucherCode: string;
  itemDetails: IItemDetails[];
}

export interface IPaymentMethodDetails {
  userId: string;
}

export interface IRedirect {
  defaultUrl: string;
  successUrl: string;
  failureUrl: string;
  cancelUrl: string;
}

export interface IWebhook {
  url: string;
}

export interface ISubMerchant {
  name: string;
  legalName: string;
}

export interface ITransaction {
  id: string;
  merchantId: string;
  apiKey: string;
  referenceId?: string;
  referenceType?: string;
  amount: {
    $numberDecimal: number;
  };
  currency: string;
  customer: ICustomerLite;
  redirect: IRedirect;
  webhook: IWebhook;
  description: string;
  sunMerchant: ISubMerchant;
  createdAt: Date;
  updatedAt: Date;
  paymentMethod: IPaymentMethod;
  referenceMeta: IReferenceMeta;
  locale: string;
  signature: string;
  signatureType: string;
  paymentMethodDetails: IPaymentMethodDetails;
  paymentProcessor: string;
  paymentIntentId: string;
  paymentIntentStatus: CheckoutTransactionStatus;
  expirationTime: Date;
  error: IError;
  status: CheckoutTransactionStatus;
  capturedAmount: number;
}

export interface IVendorTransaction {
  id: string;
  createdAt: Date;
  referenceId: string;
  type: string;
  amount: number;
}

export interface ICreateTransactionInput {
  amount: number;
  userId: string;
  type: string;
  createdAt: Date;
  message: string;
}

export interface ITransactionRole {
  hasView: boolean;
}
