import {TransactionStatus} from 'src/react/services/api-payments.type';
import {LoyaltyIdentityTypesEnum} from 'src/shared/enums/loyalty.enum';
import {StationStatus} from 'src/shared/interfaces/station.interface';

export enum RegexEnum {
  code = '^[A-Za-z0-9_]+$',
}

export enum AccessLevel {
  CUSTOMER = 'customer',
}

export const StationStatusColorMap = {
  [StationStatus.ACTIVE]: 'success',
  [StationStatus.INACTIVE]: 'grey',
  [StationStatus.MAINTENANCE]: 'lemon',
  [StationStatus.COMIN_SOON]: 'blue',
} as const;

export const TransactionStatusColorMap = {
  [TransactionStatus.success]: 'success',
  [TransactionStatus.error]: 'error',
  [TransactionStatus.failed]: 'error',
  [TransactionStatus.pending]: 'lemon',
  [TransactionStatus.cancelled]: 'warning',
  [TransactionStatus.incoming]: 'lemon',
  [TransactionStatus.reversed]: 'blue',
} as const;

export const IdentityTypeMap = {
  [LoyaltyIdentityTypesEnum.IC_NUMBER]: 'IC Number',
  [LoyaltyIdentityTypesEnum.OLC_IC_NUMBER]: 'Old IC Number',
  [LoyaltyIdentityTypesEnum.PASSPORT_NUMBER]: 'Passport Number',
};
