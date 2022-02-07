import {EStatusTransaction, ETransaction_Type} from './enum';

export const fnChangeShowStatus = (status: string) => {
  switch (status) {
    case EStatusTransaction.PENDING:
      return 'Pending';
    case EStatusTransaction.AUTHORISED:
      return 'Authorised';
    case EStatusTransaction.SUCCEEDED:
      return 'Succeeded';
    case EStatusTransaction.FAILED:
      return 'Failed';
    case EStatusTransaction.SETTLED:
      return 'Settled';
    case EStatusTransaction.POSTED:
      return 'Posted';
    case EStatusTransaction.BILLED:
      return 'Billed';
    case EStatusTransaction.PAID:
      return 'Paid';
    default:
      return 'Created';
  }
};

export const fnChangeShowType = (type: string) => {
  switch (type) {
    case ETransaction_Type.CHARGE:
      return 'Charge';
    case ETransaction_Type.TOP_UP:
      return 'Top up';
    case ETransaction_Type.ISSUANCE:
      return 'Issuance';
    case ETransaction_Type.REDEMPTION:
      return 'Redemption';
    case ETransaction_Type.PRELOAD:
      return 'Preload';
    case ETransaction_Type.ADJUSTMENT:
      return 'Adjustment';
    case ETransaction_Type.PAYMENT:
      return 'Payment';
    case ETransaction_Type.FEE:
      return 'Fee';
    default:
      return '';
  }
};
