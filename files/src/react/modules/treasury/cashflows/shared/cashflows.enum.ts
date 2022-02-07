export enum AccountsGroup {
  CUSTOMER = 'CUSTOMER',
  MERCHANT = 'MERCHANT',
  PLATFORM = 'PLATFORM',
  AGGREGATES = 'AGGREGATES',
}

export enum AggregatesAccounts {
  customer = 'customer-aggregate',
  merchant = 'merchant-aggregate',
  buffer = 'buffer-aggregate',
  mdr = 'mdr-aggregate',
  merchantOperating = 'merchant-operating-aggregate',
  mdrOperating = 'mdr-operating-aggregate',
}

export enum PlatformAccounts {
  collection = 'setel-collection',
  trust = 'setel-mbb-trust1',
  operating = 'setel-operating',
  operatingCollection = 'operating-collection',
}

export enum CollectionAccountsTab {
  Pending = 'pending',
  Available = 'available',
}

export enum AccountGroupBalanceTypes {
  CUSTOMER_AVAILABLE = 'CUSTOMER_AVAILABLE',
  MERCHANT_AVAILABLE = 'MERCHANT_AVAILABLE',
  MERCHANT_PREPAID = 'MERCHANT_PREPAID',
  PLATFORM_AVAILABLE = 'PLATFORM_AVAILABLE',
  PLATFORM_PENDING = 'PLATFORM_PENDING',
  AGGREGATES_AVAILABLE = 'AGGREGATES_AVAILABLE',
  AGGREGATES_PENDING = 'AGGREGATES_PENDING',
  AGGREGATES_PREPAID = 'AGGREGATES_PREPAID',
}
