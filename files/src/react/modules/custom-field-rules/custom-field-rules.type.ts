import {Pagination} from '../../../shared/interfaces/pagination.interface';

interface IRequest {
  perPage?: number;
  page?: number;
  sortDate?: 'asc' | 'desc';
}

export interface ICustomFieldRulesRequest extends IRequest {
  searchValue?: string;
  entityName?: string;
  fieldValueType?: string;
  isEnabled?: boolean;
  entityCategorisationId?: string;
}

export interface ICustomFieldInputType {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  default?: boolean;
}

export interface ICustomFieldInputApiResponse {
  data: ICustomFieldInputType[];
}

export interface IMutationCustomFieldRule {
  id?: string;
  fieldName?: string;
  fieldLabel?: string;
  fieldValueType?: string;
  fieldValueDefault?: string;
  valueOptions?: string[];
  validations?: string[];
  entityName?: string;
  entityCategorisationId?: string;
  entityCategorisationIds?: string[];
  entityCategorisationType?: string;
  entityCategorisationName?: string;
  isEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICustomFieldRule {
  id?: string;
  fieldName?: string;
  fieldLabel?: string;
  fieldValueType?: string; // just for show data on listing
  fieldValueDefault?: string;
  valueOptions?: string[];
  validations?: string[];
  entityName?: string;
  entityCategorisationType?: string;
  entityCategorisationId?: string;
  entityCategorisationIds?: string[];
  entityCategorisationName?: string;
  value?: string | string[];
  isEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
  enterpriseId?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICustomFieldRulePagination extends Pagination {}

export interface ICustomFieldRuleApiResponse {
  pagination: ICustomFieldRulePagination;
  data: ICustomFieldRule[];
}

export interface ProductOfferings {
  retailEnabled: boolean;
  fulfillmentEnabled: boolean;
  fuellingEnabled: boolean;
  catalogueEnabled: boolean;
  pointOfSaleEnabled: boolean;
  eCommerceEnabled: boolean;
  inventoryEnabled: boolean;
  shippingEnabled: boolean;
  timesheetEnabled: boolean;
  loyaltyEnabled: boolean;
  dealsEnabled: boolean;
  giftsEnabled: boolean;
  vehiclesEnabled: boolean;
  paymentsEnabled: boolean;
  houseAccountsEnabled: boolean;
  billingEnabled: boolean;
  billsReloadsEnabled: boolean;
  cardIssuingEnabled: boolean;
  subsidyEnabled: boolean;
  paymentControllerEnabled: boolean;
  dropInMiniInEnabled: boolean;
  dropInEnabled: boolean;
  miniEnabled: boolean;
  developerEnabled: boolean;
}

export interface MerchantType {
  id: string;
  products: ProductOfferings;
  name: string;
  code: string;
}

export interface CustomerCategory {
  id: string;
  name?: string;
  isRequiredReview?: boolean;
  enterpriseId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const ValidateMessage = {
  fieldName: 'Name is required',
  fieldNameInvalid: 'The name supports only alphanumeric and _ characters',
  fieldLabel: 'Display name is required',
  fieldValueDefault: 'Default value is invalid',
  fieldValueType: 'Input type is required',
  valueOptions: 'Value options is required',
  validations: 'Validations is required',
  entityName: 'Entity applied is required',
  entityCategorisationType: 'Entity categorisation is required',
  entityCategorisationIds: 'Entity categorisation values is required',
  entityCategorisationId: 'Entity categorisation values is required',
};

export enum FIELD_VALUE_TYPE {
  CHECKBOX = 'checkboxList',
  DROPDOWN = 'dropdown',
  TEXTBOX = 'textbox',
}

export enum VALIDATION_TYPE {
  ONLY_NUMERIC = 'only_numeric',
  ALPHA_NUMERIC = 'alpha_numeric',
}

export enum ENTITY_CATEGORISATION_TYPE {
  MERCHANT_TYPE = 'merchantType',
  CUSTOMER_CATEGORY = 'customerCategory',
  MERCHANT = 'merchant',
  COMPANY = 'company',
}

export enum ENTITY_NAME {
  MERCHANT = 'merchant',
  SITE = 'site',
  ATTRIBUTION_RULE = 'attributionRule',
  CUSTOMER = 'customer',
  ITEM = 'item',
}
