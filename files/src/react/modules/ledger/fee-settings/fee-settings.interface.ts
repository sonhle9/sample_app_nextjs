import {
  CardSchemes,
  TransactionPGVendors,
  TransactionTypes,
} from '../../../../react/modules/ledger/ledger-transactions/ledger-transactions.enums';
import {FeeTypes, TierDurations, TieringTypes} from './fee-settings.enum';

export interface IFeeSettingsFilter {
  page?: number;
  perPage?: number;
  transactionType?: TransactionTypes;
  paymentGatewayVendor?: TransactionPGVendors;
  cardScheme?: CardSchemes;
  paymentOption: PaymentOptions;
  validFrom?: string;
  validTo?: string;
}

export interface ITiers {
  lowerLimit: number;
  upperLimit: number;
  fee: number;
}

export interface ITiering {
  tieringType: TieringTypes;
  duration: TierDurations;
  tiers: ITiers[];
}

export interface ICreateFeeSetting {
  paymentGatewayVendor: TransactionPGVendors;
  cardScheme: CardSchemes;
  paymentOption: PaymentOptions;
  feeType: FeeTypes;
  transactionType: TransactionTypes;
  validFrom: Date;
  validTo?: Date;
  isTiered: boolean;
  tiering?: ITiering;
  fee?: number;
}

export interface ITiers {
  fee: number;
  lowerLimit: number;
  upperLimit: number;
}
