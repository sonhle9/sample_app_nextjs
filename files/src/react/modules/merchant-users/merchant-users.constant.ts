export enum RegexEnum {
  code = '^[A-Za-z0-9_]+$',
}

export enum ProductLabels {
  retailEnabled = 'Retail',
  fulfillmentEnabled = 'Fulfilment',
  fuellingEnabled = 'Fuelling',
  catalogueEnabled = 'Catalogue',
  pointOfSaleEnabled = 'Point of sale',
  eCommerceEnabled = 'eCommerce',
  inventoryEnabled = 'Inventory',
  shippingEnabled = 'Shipping',
  timesheetEnabled = 'Timesheet',
  loyaltyEnabled = 'Loyalty',
  dealsEnabled = 'Deals',
  giftsEnabled = 'Gifts',
  vehiclesEnabled = 'Vehicles',
  paymentsEnabled = 'Payments',
  houseAccountsEnabled = 'House accounts',
  billingEnabled = 'Billing',
  billsReloadsEnabled = 'Bills & reloads',
  cardIssuingEnabled = 'Card Issuing',
  subsidyEnabled = 'Subsidy',
  paymentControllerEnabled = 'Payment controller',
  developerEnabled = 'Developer',
  dropInEnabled = 'Drop In',
  miniEnabled = 'Mini',
}

export enum AccessLevel {
  COMPANY = 'company',
  MERCHANT = 'merchant',
}
