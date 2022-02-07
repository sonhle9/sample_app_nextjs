export enum IdentifierType {
  MyKad = 'MY_KAD',
  MyTentera = 'MY_TENTERA',
  MyPr = 'MY_PR',
  Passport = 'PASSPORT',
}

export enum RiskScoringConfigType {
  CustomerType = 'CUSTOMER_TYPE',
  CountryOfResident = 'COUNTRY_OF_RESIDENCE',
  nationality = 'NATIONALITY',
  watchList = 'CUSTOMER_WATCHLIST',
  CustomernatureOfBusiness = 'NATURE_OF_BUSINESS',
  ProductFeaturesWalletSize = 'WALLET_SIZE',
  ProductFeaturesKYC = 'KYC',
  ProductFeaturesAnnualTransaction = 'ANNUAL_TRANSACTION',
}

export enum CreatingReason {
  SanctionedScreening = 'SANCTIONED_SCREENING',
  eKYCVerification = 'eKYC_VERIFICATION',
  PeriodicReview = 'PERIODIC_REVIEW',
  ManualScreening = 'MANUAL_SCREENING',
}

export enum CountryOfResidentValue {
  NonMalaysian = 'non_malaysian',
  Malaysian = 'malaysian',
}
