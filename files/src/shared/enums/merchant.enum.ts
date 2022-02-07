export enum SettlementScheduleDelayDayType {
  calendar = 'calendar',
  business = 'business',
}

export enum SettlementScheduleInterval {
  daily = 'daily',
  manual = 'manual',
}

export enum TransactionType {
  CHARGE = 'CHARGE',
  REFUND = 'REFUND',
  ADJUSTMENT = 'ADJUSTMENT',
  FEE = 'FEE',
  TRANSFER = 'TRANSFER',
}

export enum TransactionSubType {
  TRANSFER_MERCHANT_BONUS_WALLET = 'TRANSFER_MERCHANT_BONUS_WALLET',
  TRANSFER_REFUND_MERCHANT_BONUS_WALLET = 'TRANSFER_REFUND_MERCHANT_BONUS_WALLET',
}

export enum MerchantBalanceType {
  AVAILABLE = 'AVAILABLE',
  PENDING = 'PENDING',
  PREPAID = 'PREPAID',
  RESERVED = 'RESERVED',
}

export enum MerchantTypeCodes {
  GIFT_CARD_CLIENT = 'giftCardClient',
  SMART_PAY_ACCOUNT = 'smartPayAccount',
  STATION_DEALER = 'stationDealer',
}

export enum EnableTransactionValues {
  ACTIVE = 'active',
  SUSPEND = 'suspend',
  OVERDUE = 'overdue',
  CLOSED = 'closed',
}

export enum CustomFieldNames {
  ENABLE_TRANSACTION = 'enableTransaction',
  SALES_TERRITORY = 'salesTerritory',
}

export enum SmartpayAccountTabs {
  GENERAL = 'General',
  CREDIT_ASSESSMENT = 'Credit assessment',
  SECURITY_DEPOSIT = 'Security deposit',
  BILLING = 'Billing',
  FILE_MANAGER = 'File manager',
  ADDRESS_LIST = 'Address list',
  CONTACT_LIST = 'Contact list',
}
