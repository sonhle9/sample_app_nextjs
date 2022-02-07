import {IListingColumn} from './merchant-types.type';

export enum ValidateMessage {
  name = 'Name cannot be empty',
  code = 'Code cannot be empty and only contains alphanumeric and underscore',
}

export enum RegexEnum {
  code = '^[A-Za-z0-9_]+$',
}

export enum ColumnNames {
  adjustBalance = 'adjustBalance',
  availableBalance = 'availableBalance',
  settlementsEnabled = 'settlementsEnabled',
  payoutEnabled = 'payoutEnabled',
  paymentsEnabled = 'paymentsEnabled',
  name = 'name',
  status = 'status',
  prepaidBalance = 'prepaidBalance',
  createdAt = 'createdAt',
  merchantType = 'merchantType',
  creditLimit = 'creditLimit',
}

export const defaultMerchantsOfTypeListingColumns: IListingColumn[] = [
  {
    name: ColumnNames.name,
    label: 'Merchant Name',
  },
  {
    name: ColumnNames.status,
    label: 'Status',
  },
  {
    name: ColumnNames.paymentsEnabled,
    label: 'Payments Enabled',
  },
  {
    name: ColumnNames.payoutEnabled,
    label: 'Payout Enabled',
  },
  {
    name: ColumnNames.settlementsEnabled,
    label: 'Settlements Enabled',
  },
];

export const defaultAllMerchantsListingColumns: IListingColumn[] = [
  {
    name: ColumnNames.name,
    label: 'Merchant Name',
  },
  {
    name: ColumnNames.paymentsEnabled,
    label: 'Payments Enabled',
  },
  {
    name: ColumnNames.payoutEnabled,
    label: 'Payout Enabled',
  },
  {
    name: ColumnNames.settlementsEnabled,
    label: 'Settlements Enabled',
  },
  {
    name: ColumnNames.availableBalance,
    label: 'Available Balance (RM)',
  },
  {
    name: ColumnNames.adjustBalance,
    label: '',
  },
];

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
  pricingEnabled = 'Pricing',
  cardIssuingEnabled = 'Card Issuing',
  subsidyEnabled = 'Subsidy',
  paymentControllerEnabled = 'Payment controller',
  dropInEnabled = 'Drop In',
  miniEnabled = 'Mini',
  developerEnabled = 'Developer',
  gatewayEnabled = 'Gateway',
  checkoutEnabled = 'Checkout',
}
