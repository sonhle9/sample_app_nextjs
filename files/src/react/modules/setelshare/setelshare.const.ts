import {BadgeProps} from '@setel/portal-ui';
import {
  CircleMemberStatus,
  CirclePaymentMethodType,
  CircleStatus,
  PaymentMethodIcon,
  TransactionStatus,
} from '../../../shared/enums/circle.enum';

export const circleStatusColorMap: Record<string, BadgeProps['color']> = {
  [CircleStatus.ACTIVE]: 'success',
  [CircleStatus.BLOCKED]: 'error',
};

export const circleMemberStatusColorMap: Record<string, BadgeProps['color']> = {
  [CircleMemberStatus.JOINED]: 'success',
  [CircleMemberStatus.REMOVED]: 'error',
  [CircleMemberStatus.INVITED]: 'warning',
  [CircleMemberStatus.REJECTED]: 'error',
  [CircleMemberStatus.LEFT]: 'error',
};

export const circlePaymentMethodStringMap: Record<string, string> = {
  [CirclePaymentMethodType.WALLET_SETTEL]: 'Setel Wallet',
  [CirclePaymentMethodType.SMARTPAY]: 'SmartPay',
  [CirclePaymentMethodType.CARD_VISA]: 'Visa Card',
  [CirclePaymentMethodType.MESRA_CARD]: 'Mesra card',
  [CirclePaymentMethodType.CARD_MASTERCARD]: 'Mastercard Card',
};

export const circlePaymentMethodIconMap: Record<string, string> = {
  [CirclePaymentMethodType.WALLET_SETTEL]: PaymentMethodIcon.WALLET_SETTEL,
  [CirclePaymentMethodType.SMARTPAY]: PaymentMethodIcon.SMARTPAY,
  [CirclePaymentMethodType.CARD_VISA]: PaymentMethodIcon.CARD_VISA,
  [CirclePaymentMethodType.MESRA_CARD]: PaymentMethodIcon.MESRA_CARD,
  [CirclePaymentMethodType.CARD_MASTERCARD]: PaymentMethodIcon.CARD_MASTERCARD,
};

export const circleTransactionsColorMap: Record<string, BadgeProps['color']> = {
  [TransactionStatus.success]: 'success',
  [TransactionStatus.pending]: 'warning',
  [TransactionStatus.incoming]: 'warning',
  [TransactionStatus.error]: 'error',
  [TransactionStatus.failed]: 'error',
  [TransactionStatus.cancelled]: 'error',
};
