import {ITransaction} from 'src/shared/interfaces/transaction.interface';

export interface CheckoutTransaction extends ITransaction {
  paymentMethod: CheckoutPaymentMethod;
  customer: Customer;
  currency: string;
  description: string;
  merchantName: string;
  paymentStatus?: string;
  paymentIntentStatus?: string;
}

interface Customer {
  id: string;
  email: string;
  name: string;
}

export enum CheckoutTransactionStatus {
  pending = 'pending',
  authorised = 'authorised',
  cancelled = 'cancelled',
  failed = 'failed',
  succeeded = 'succeeded',
  refunded = 'refunded',
  requiresPaymentMethod = 'requires_payment_method',
  processing = 'processing',
  partiallyRefunded = 'partially_refunded',
  expired = 'expired',
}

export interface CheckoutPaymentMethod {
  family: string;
  type: string;
  brand: string;
}
