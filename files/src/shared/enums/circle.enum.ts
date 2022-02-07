export enum CircleStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
}

export enum CircleUserRole {
  OWNER = 'owner',
  MEMBER = 'member',
}

export enum CircleMemberStatus {
  INVITED = 'invited',
  JOINED = 'joined',
  REJECTED = 'rejected',
  REMOVED = 'removed',
  LEFT = 'left',
  BLOCKED = 'blocked',
  CANCELLED = 'cancelled',
}

export enum PaymentMethodIcon {
  WALLET_SETTEL = '/assets/icons/icon-setel-wallet.png',
  SMARTPAY = '/assets/icons/icon-smartpay.png',
  CARD_VISA = '/assets/icons/icon-visa-card.png',
  CARD_MASTERCARD = '/assets/icons/icon-mastercard-card.png',
  MESRA_CARD = '/assets/icons/icon-mersa-card',
}

export enum PaymentMethodType {
  WALLET_SETTEL = 'wallet_setel',
  SMARTPAY = 'smartpay',
  CARD_VISA = 'card_visa',
  CARD_MASTERCARD = 'card_mastercard',
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

export enum CirclePaymentMethodType {
  WALLET_SETTEL = 'wallet_setel',
  SMARTPAY = 'smartpay',
  CARD_VISA = 'card_visa',
  MESRA_CARD = 'mesa_card',
  CARD_MASTERCARD = 'card_mastercard',
}
