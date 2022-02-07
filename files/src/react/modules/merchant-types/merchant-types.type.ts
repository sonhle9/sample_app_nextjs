import {EnterpriseNameEnum} from '../../../shared/enums/enterprise.enum';

interface IRequest {
  perPage?: number;
  page?: number;
  sortDate?: 'asc' | 'desc';
}

export interface IMerchantTypeRequest extends IRequest {
  searchValue?: string;
  sortBy?: string;
}

export interface IMerchantTypeUsed {
  name: string;
  code: string;
}

export interface IListingColumn {
  name?: string;
  value?: string;
  label?: string;
  styles?: string;
  id?: string;
}

export interface IMerchantFieldResponse {
  merchantFields: IListingColumn[];
  defaultFields: IListingColumn[];
}

export interface IMerchantType {
  id?: string;
  _id?: string;
  name: string;
  code: string;
  products: ProductFeaturings;
  enterpriseId?: EnterpriseNameEnum;
  createdAt?: Date;
  updatedAt?: Date;
  createdOn?: any;
  statusDefaultValue?: string;
  statusValues?: string[];
  listingConfigurations?: IListingColumn[];
}

export interface IMerchantTypeUpdate {
  id?: string;
  _id?: string;
  name: string;
  code: string;
  products: ProductFeaturings;
  enterpriseId?: EnterpriseNameEnum;
  createdAt?: Date;
  updatedAt?: Date;
  createdOn?: any;
  statusDefaultValue?: string;
  statusValues?: string[];
  listingConfigurations?: string[];
}

export interface ProductFeaturings {
  retailEnabled?: boolean;
  fulfillmentEnabled?: boolean;
  fuellingEnabled?: boolean;
  catalogueEnabled?: boolean;
  pointOfSaleEnabled?: boolean;
  eCommerceEnabled?: boolean;
  inventoryEnabled?: boolean;
  shippingEnabled?: boolean;
  timesheetEnabled?: boolean;
  loyaltyEnabled?: boolean;
  dealsEnabled?: boolean;
  giftsEnabled?: boolean;
  vehiclesEnabled?: boolean;
  paymentsEnabled?: boolean;
  houseAccountsEnabled?: boolean;
  billingEnabled?: boolean;
  billsReloadsEnabled?: boolean;
  cardIssuingEnabled?: boolean;
  subsidyEnabled?: boolean;
  paymentControllerEnabled?: boolean;
  developerEnabled?: boolean;
  dropInEnabled?: boolean;
  miniEnabled?: boolean;
  pricingEnabled?: boolean;
}
