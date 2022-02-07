import {
  TransactionSubType,
  TransactionType,
  TransactionWalletSubType,
} from 'src/react/services/api-payments.type';

export const TRANSACTION_MIX_TYPE = {
  topupCard: {
    text: 'Top-up with Card',
    type: TransactionType.topup,
    subType: TransactionSubType.topupCreditCard,
  },
  topupBank: {
    text: 'Top-up with Bank',
    type: TransactionType.topup,
    subType: TransactionSubType.topupBankAccount,
  },
  topupDigitalWallet: {
    text: 'Top-up with Digital Wallet',
    type: TransactionType.topup,
    subType: TransactionWalletSubType.TOPUP_DIGITAL_WALLET,
  },
  authorize: {
    text: 'Authorise',
    type: TransactionType.authorize,
  },
  purchase: {
    text: 'Purchase',
    type: TransactionType.purchase,
  },
  capture: {
    text: 'Capture',
    type: TransactionType.capture,
  },
  cancel: {
    text: 'Cancel',
    type: TransactionType.cancel,
  },
  refund: {
    text: 'Refund',
    type: TransactionType.refund,
  },
  externalTopup: {
    text: 'External Top-up',
    type: TransactionType.topup,
    subType: TransactionSubType.topupExternal,
  },
  externalTopupRefund: {
    text: 'External Top-up Refund',
    type: TransactionType.refund,
    subType: TransactionSubType.refundExternal,
  },
  mesraPointRedemption: {
    text: 'Mesra Point Redemption',
    type: TransactionType.topup,
    subType: TransactionSubType.redeemLoyaltyPoints,
  },
  rewards: {
    text: 'Rewards',
    type: TransactionType.topup,
    subType: TransactionSubType.rewards,
  },
  topupRefundCard: {
    text: 'Top-up Refund with Card',
    type: TransactionType.topup_refund,
    subType: TransactionSubType.topupRefundCreditCard,
  },
  topupRefundBank: {
    text: 'Top-up Refund with Bank',
    type: TransactionType.topup_refund,
    subType: TransactionSubType.topupRefundBankAccount,
  },
  topupRefundDigitalWallet: {
    text: 'Top-up Refund with Digital Wallet',
    type: TransactionType.topup_refund,
    subType: TransactionWalletSubType.TOPUP_REFUND_DIGITAL_WALLET,
  },
  autoTopup: {
    text: 'Auto Top-up',
    type: TransactionType.topup,
    subType: TransactionSubType.autoTopup,
  },
};
