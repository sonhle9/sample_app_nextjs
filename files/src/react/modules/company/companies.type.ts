import {Enterprises} from '@setel/payment-interfaces';
import {EnterpriseNameEnum} from '../../../shared/enums/enterprise.enum';
import {IPaginationParam} from '../../lib/ajax';

export enum CompanyTypeEnum {
  SMARTPAY = 'smartpay',
}

export interface ICompany {
  id?: string;
  _id?: string;
  name: string;
  manageCatalogue?: string;
  createdAt?: string;
  created_date?: number;
  description?: string;
  merchants?: string[];
  json?: string;
  updatedAt?: string;
  products?: IProducts;
  isApplyLogoToChildMerchant?: boolean;
  logoBackgroundColor?: string;
  logo?: string;
  typeId?: string;
  companyType?: ICompanyType;
  code?: string;
  creditLimitSharing?: boolean;
  creditLimit?: number;
  authorisedSignatory?: string;
}

interface IRequest {
  perPage?: number;
  page?: number;
  sortDate?: 'asc' | 'desc';
}

export interface ICompaniesRequest extends IRequest {
  keyWord?: string;
  companyType?: string;
}

export type MerchantInCompanyFilter = {
  companyId: string;
  searchValue?: string;
} & IPaginationParam;

export interface Merchant {
  userIds: any[];
  paymentsEnabled: boolean;
  settlementsEnabled: boolean;
  payoutEnabled: boolean;
  productOfferings: ProductOfferings;
  cardSetting: CardSetting;
  companyId: string;
  merchantId: string;
  name: string;
  legalName: string;
  countryCode: string;
  timezone: string;
  settlementsSchedule: SettlementsSchedule;
  merchantCategoryCode: string;
  siteId: string;
  bank: Bank;
  createdAt: Date;
  updatedAt: Date;
  id: string;
}

interface Bank {
  accountHolderName: string;
  accountNo: string;
  bankName: string;
  bankDisplayName: string;
  currency: string;
}

interface CardSetting {
  formFactors: any[];
  physicalTypes: any[];
  types: any[];
  subtypes: any[];
}

interface ProductOfferings {
  retailEnabled: boolean;
  paymentsEnabled: boolean;
  cardsEnabled: boolean;
  vehiclesEnabled: boolean;
  engageEnabled: boolean;
  developerEnabled: boolean;
  hardwareEnabled: boolean;
}

interface IProducts {
  retail?: boolean;
  fulfillment?: boolean;
  fuelling?: boolean;
  catalogue?: boolean;
  pointOfSale?: boolean;
  eCommerce?: boolean;
  inventory?: boolean;
  shipping?: boolean;
  timesheet?: boolean;
  loyalty?: boolean;
  deals?: boolean;
  gifts?: boolean;
  vehicles?: boolean;
  payments?: boolean;
  houseAccounts?: boolean;
  billing?: boolean;
  billsReloads?: boolean;
  cardIssuing?: boolean;
  pricing?: boolean;
  paymentController?: boolean;
  developer?: boolean;
  dropIn?: boolean;
  mini?: boolean;
  checkout?: boolean;
}

interface SettlementsSchedule {
  delayDays: number;
  delayDayType: string;
  interval: string;
}

export interface IProductsEnterprise {
  enterpriseId: EnterpriseNameEnum;
  products: IProducts;
}

export interface ICompanyType {
  id: string;
  name: string;
  code: string;
  products?: IProducts;
  enterpriseId: Enterprises;
}
export interface ICompanyTypesRequest extends Omit<IRequest, 'sortDate'> {
  searchValue?: string;
  sortBy?: string;
}

export type SmartpayCompanyAddress = {
  id?: string;
  smartpayCompanyId?: string;
  createdAt?: string;
  addressType?: SmartpayCompanyAddressTypeEnum;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  addressLine4?: string;
  addressLine5?: string;
  city?: string;
  postcode?: string;
  state?: string;
  country?: string;
  mainMailingIndicator?: boolean;
};

export enum SmartpayCompanyAddressTypeEnum {
  HOME_ADDRESS = 'home_address',
  WORK_ADDRESS = 'work_address',
  OFFICE_ADDRESS = 'office_address',
}

export const smartpayCompanyAddressTypeOptions = [
  {
    label: 'Home address',
    value: SmartpayCompanyAddressTypeEnum.HOME_ADDRESS,
  },
  {
    label: 'Work address',
    value: SmartpayCompanyAddressTypeEnum.WORK_ADDRESS,
  },
  {
    label: 'Office address',
    value: SmartpayCompanyAddressTypeEnum.OFFICE_ADDRESS,
  },
];

export type SmartpayCompanyContact = {
  id: string;
  name: string;
  createdAt: string;
  enterpriseId: string;
  spcCompanyId: string;
  contactPerson: string;
  isDefaultContact: boolean;
  email: string;
  mobilePhone: string;
  homePhone?: string;
  workPhone?: string;
  faxNumber?: string;
};
