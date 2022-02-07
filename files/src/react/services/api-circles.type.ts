import {CircleMemberStatus, CircleStatus, CircleUserRole} from 'src/shared/enums/circle.enum';
export enum CirclePaymentMethodType {
  WALLET_SETTEL = 'wallet_setel',
  SMARTPAY = 'smartpay',
  CARD_VISA = 'card_visa',
  MESRA_CARD = 'mesa_card',
  CARD_MASTERCARD = 'card_mastercard',
}
export interface CircleHistory {
  circleId: string;
  status: CircleStatus;
  isDeleted: boolean;
  createdAt: string;
  role: CircleUserRole;
  memberStatus: CircleMemberStatus;
  paymentMethod: {
    type: CirclePaymentMethodType;
  };
}
