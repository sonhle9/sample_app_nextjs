/* eslint-disable @typescript-eslint/no-shadow */
import {getEnumValues} from '../../../shared/helpers/common';

/**
 * below constants are synced with api-switch/src/modules/routings/routings.constant.ts
 */

export enum RoutingType {
  Platform = 'PLATFORM',
  Merchant = 'MERCHANT',
}

export enum RoutingsStatus {
  ACTIVE = 'ACTIVE',
  DORMANT = 'DORMANT',
}

export enum PaymentMethod {
  // Bank = 'bank', // not supported yet
  Card = 'card',
  DigitalWallet = 'wallet',
}

export enum MerchantCategory {
  Fuel = '5542',
  Store = '5541',
}

export enum TransactionType {
  // TOPUP_REFUND = 'TOPUP_REFUND',
  // TOPUP = 'TOPUP',
  PURCHASE = 'PURCHASE',
  AUTHORIZE = 'AUTHORIZE',
  CAPTURE = 'CAPTURE',
  REFUND = 'REFUND',
  CANCEL = 'CANCEL',
}

// export enum ChargeModel {
//   Sales = 'SALES',
//   PreAuth = 'PRE_AUTH',
// }

// export enum ChargeSecurityProtocol {
//   TwoD = '2D',
//   ThreeD = '3D',
// }

export enum DigitalWalletType {
  SetelLoyalty = 'SETEL_LOYALTY',
  Boost = 'BOOST',
}

export enum CardBrand {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  AMEX = 'AMEX',
  // AMERICAN_EXPRESS = 'AMERICAN_EXPRESS',
  // UNION_PAY = 'UNION_PAY',
  // MY_DEBIT = 'MY_DEBIT',
}

// export enum CardPresent {
//   Exist = 'PRESENT',
//   NotExist = 'NOT_PRESENT',
// }

// export enum CardScheme {
//   OpenLoop = 'OPEN_LOOP',
//   ClosedLoop = 'CLOSED_LOOP',
// }

// export enum CardType {
//   Debit = 'DEBIT',
//   Credit = 'CREDIT',
// }

// export enum BankType {
//   Fpx = 'FPX',
// }

export enum RoutingsCriteriaParam {
  // BankType = 'BANK_TYPE', // not supported yet
  // CardBank = 'CARD_BANK',
  // CardPresent = 'CARD_PRESENT',
  // CardScheme = 'CARD_SCHEME',
  // CardType = 'CARD_TYPE',
  CardBrand = 'CARD_BRAND',
  DigitalWalletType = 'DIGITAL_WALLET_TYPE',
  // ChargeModel = 'CHARGE_MODEL',
  // ChargeSecurityProtocol = 'CHARGE_SECURITY_PROTOCOL',
  MerchantCategoryCode = 'MERCHANT_CATEGORY_CODE',
  TransactionType = 'TRANSACTION_TYPE',
}

/**
 * be used to validate criteria values
 */
export const RoutingsCriteriaParamToValues = {
  // [RoutingsCriteriaParam.BankType]: getEnumValues<string>(BankType), // not supported yet
  // [RoutingsCriteriaParam.CardBank]: [],// TODO: place list of banks here
  // [RoutingsCriteriaParam.CardPresent]: getEnumValues<string>(CardPresent),
  // [RoutingsCriteriaParam.CardScheme]: getEnumValues<string>(CardScheme),
  // [RoutingsCriteriaParam.CardType]: getEnumValues<string>(CardType),
  [RoutingsCriteriaParam.CardBrand]: getEnumValues<string>(CardBrand),
  [RoutingsCriteriaParam.DigitalWalletType]: getEnumValues<string>(DigitalWalletType),
  // [RoutingsCriteriaParam.ChargeModel]: getEnumValues<string>(ChargeModel),
  // [RoutingsCriteriaParam.ChargeSecurityProtocol]: getEnumValues<string>(ChargeSecurityProtocol),
  [RoutingsCriteriaParam.MerchantCategoryCode]: getEnumValues<string>(MerchantCategory),
  [RoutingsCriteriaParam.TransactionType]: getEnumValues<string>(TransactionType),
};

export const RoutingsCriteriaParamDependencies = {
  // [RoutingsCriteriaParam.BankType]: PaymentMethod.Bank, // not supported yet
  // [RoutingsCriteriaParam.CardBank]: PaymentMethod.Card,
  // [RoutingsCriteriaParam.CardPresent]: PaymentMethod.Card,
  // [RoutingsCriteriaParam.CardScheme]: PaymentMethod.Card,
  // [RoutingsCriteriaParam.CardType]: PaymentMethod.Card,
  [RoutingsCriteriaParam.CardBrand]: PaymentMethod.Card,
  [RoutingsCriteriaParam.DigitalWalletType]: PaymentMethod.DigitalWallet,
};
