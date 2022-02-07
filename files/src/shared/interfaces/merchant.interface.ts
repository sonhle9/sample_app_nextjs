import {ProductOfferings} from 'src/react/modules/merchants/merchants.type';
import {DevicesStatus} from '../../app/devices/shared/enums';
import {ICustomFieldRule} from '../../react/modules/custom-field-rules';
import {
  MerchantBalanceType,
  SettlementScheduleDelayDayType,
  SettlementScheduleInterval,
} from '../enums/merchant.enum';
import {Currency} from '../enums/wallet.enum';

export interface ISettlementSchedule {
  delayDays: number;
  delayDayType: SettlementScheduleDelayDayType;
  interval: SettlementScheduleInterval;
}

export interface IProductOfferings {
  retailEnabled: boolean;
  paymentsEnabled: boolean;
  fleetEnabled: boolean;
  engageEnabled: boolean;
  developerEnabled: boolean;
}

export interface IMerchantBalanceItem {
  type: MerchantBalanceType;
  currency: Currency;
  balance: number;
}

// TODO: consider merging with IMerchant in station.interface.ts
export interface IMerchant {
  id: string;
  merchantId: string;
  name: string;
  legalName: string;
  countryCode: string;
  timezone: string;
  paymentsEnabled: boolean;
  settlementsEnabled: boolean;
  payoutEnabled: boolean;
  settlementsSchedule: ISettlementSchedule;
  userIds: string[];
  productOfferings: ProductOfferings;
  balances: IMerchantBalanceItem[];
  createdAt: string;
  updatedAt: string;
  smartPayAccountAttributes?: SmartPayAccountAttributes;
  availableBalanceMyr: number;
  merchantCategoryCode: string;
}

export interface SmartPayAccountAttributes {
  companyOrIndividualName?: string;
}

export interface IDevice {
  id: string;
  merchantMerchantIds: string[];
  serialNo: string;
  status: DevicesStatus;
  modelDevice: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMerchantType {
  name: string;
  code: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  enterpriseId?: string;
  products: ProductOfferings;
}

export interface IMerchantUpdateModel {
  name?: string;
  legalName?: string;
  merchantId?: string;
  status?: string;
  typeId?: string;
  countryCode?: string;
  timezone?: string;
  paymentsEnabled?: boolean;
  settlementsEnabled?: boolean;
  payoutEnabled?: boolean;
  settlementsSchedule?: ISettlementSchedule;
  userIds?: string[];
  merchantCategoryCode: string;
  productOfferings?: ProductOfferings;
  customFields?: ICustomFieldRule[];
  createdOrUpdatedBy?: string;
  businessRegistrationType?: string;
  businessRegistrationNo?: string;
}

export interface IMerchantIndexParams {
  name?: string;
  legalName?: string;
  countryCode?: string;
  paymentsEnabled?: boolean;
  settlementsEnabled?: boolean;
  payoutEnabled?: boolean;
  merchantIds?: string;
  userId?: string;
  includeBalances?: boolean;
  searchValue?: string;
  merchantTypes?: string[];
}

export interface IDeviceIndexParams {
  deviceDateFrom?: string;
  deviceDateTo?: string;
  status?: DevicesStatus;
  serialNo?: string;
  modelDevice?: string;
  searchValue?: string;
}

export interface ITransactionBalanceChange {
  type: string;
  currency: string;
  amount: number;
  updatedBalance: number;
}

export interface IRelatedTransaction {
  transactionType: string;
  transactionUid: string;
}

export interface ITransaction {
  id: string;
  transactionUid: string;
  transactionDate: string;
  merchantId: string;
  merchantName?: string;
  orderId?: string;
  orderType?: string;
  type: string;
  subType?: string;
  status: string;
  currency: string;
  amount: number;
  referenceId?: string;
  email?: string;
  fullName?: string;
  userId: string;
  settlementId?: string;
  attributes?: {[key: string]: any};
  balanceChanges?: ITransactionBalanceChange[];
  relatedTransactions?: IRelatedTransaction[];
  createdAt: string;
  updatedAt: string;
}

export interface ITransactionIndexParams {
  transactionUid?: string;
  merchantId?: string;
  userId?: string;
  refundedTransactionUid?: string;
  orderType?: string;
  orderId?: string;
  type?: string;
  status?: string;
  transactionDateFrom?: string;
  transactionDateTo?: string;
  settlementId?: string;
  paymentMethod?: string;
  paymentSubmethod?: string;
}
export interface IMerchantTransactionIndexParams {
  transactionUid?: string;
  merchantId?: string;
  userId?: string;
  refundedTransactionUid?: string;
  orderType?: string;
  orderId?: string;
  type?: string;
  status?: string;
  transactionDateFrom?: string;
  transactionDateTo?: string;
  settlementId?: string;
  paymentMethod?: string;
  paymentSubmethod?: string;
}

export interface IMerchantRole {
  hasView: boolean;
  hasModifier: boolean;
  hasAdjust: boolean;
  hasBulk: boolean;
}

export interface IMerchantCategoryCode {
  code: string;
  desc: string;
}

export interface IEnterpriseProduct {
  name: string;
  legalName: string;
  country: string;
  products: {
    accounts: boolean;
    customers: boolean;
    merchants: boolean;
    companies: boolean;
    hardware: boolean;
    retail: boolean;
    fulfillment: boolean;
    fuelling: boolean;
    catalogue: boolean;
    pointOfSale: boolean;
    eCommerce: boolean;
    inventory: boolean;
    shipping: boolean;
    timesheet: boolean;
    loyaltyAffiliate: boolean;
    loyalty: boolean;
    deals: boolean;
    rewards: boolean;
    reach: boolean;
    gifts: boolean;
    gamification: boolean;
    experience: boolean;
    attribution: boolean;
    advertising: boolean;
    customerDataPlatform: boolean;
    dataPipeline: boolean;
    vehicles: boolean;
    drive: boolean;
    wallet: boolean;
    payments: boolean;
    budgeting: boolean;
    circles: boolean;
    houseAccount: boolean;
    billing: boolean;
    billsReloads: boolean;
    vault: boolean;
    gateway: boolean;
    cardIssuing: boolean;
    treasury: boolean;
    complianceControls: boolean;
    riskControls: boolean;
    subsidy: boolean;
    pricing: boolean;
    paymentController: boolean;
    financialRebates: boolean;
    developer: boolean;
    teams: boolean;
    maintenance: boolean;
    support: boolean;
  };
}

export interface IEnterpriseProducts {
  [key: string]: IEnterpriseProduct;
}
