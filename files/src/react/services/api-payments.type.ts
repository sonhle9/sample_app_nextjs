import {PaymentMethod, PaymentSubmethod} from 'src/app/transactions/shared/const-var';
import {ITransaction} from 'src/shared/interfaces/transaction.interface';

export enum TransactionType {
  topup = 'TOPUP',
  refund = 'REFUND',
  purchase = 'PURCHASE',
  authorize = 'AUTHORIZE',
  capture = 'CAPTURE',
  cancel = 'CANCEL',
  topup_refund = 'TOPUP_REFUND',
}

export enum TransactionSubType {
  topupBankAccount = 'TOPUP_BANK_ACCOUNT',
  topupCreditCard = 'TOPUP_CREDIT_CARD',
  topupRefundCreditCard = 'TOPUP_REFUND_CREDIT_CARD',
  topupRefundBankAccount = 'TOPUP_REFUND_BANK_ACCOUNT',
  topupExternal = 'TOPUP_EXTERNAL',
  refundExternal = 'REFUND_EXTERNAL',
  redeemLoyaltyPoints = 'REDEEM_LOYALTY_POINTS',
  rewards = 'REWARDS',
  autoTopup = 'AUTO_TOPUP',
}

export enum TransactionWalletSubType {
  TOPUP_BANK_ACCOUNT = 'TOPUP_BANK_ACCOUNT',
  TOPUP_CREDIT_CARD = 'TOPUP_CREDIT_CARD',
  TOPUP_REFUND_BANK_ACCOUNT = 'TOPUP_REFUND_BANK_ACCOUNT',
  TOPUP_REFUND_CREDIT_CARD = 'TOPUP_REFUND_CREDIT_CARD',
  TOPUP_DIGITAL_WALLET = 'TOPUP_DIGITAL_WALLET',
  TOPUP_REFUND_DIGITAL_WALLET = 'TOPUP_REFUND_DIGITAL_WALLET',
}

export enum TransactionStatus {
  success = 'success',
  pending = 'pending',
  error = 'error',
  failed = 'failed',
  cancelled = 'cancelled',
  reversed = 'reversed',
  incoming = 'incoming',
}

export interface PaymentTransaction extends Omit<ITransaction, 'subtype'> {
  paymentMethod: PaymentMethod;
  paymentSubmethod: PaymentSubmethod;
  subtype: TransactionSubType | TransactionWalletSubType;
}
