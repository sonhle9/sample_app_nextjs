import {MerchantBalanceType} from '../../../shared/enums/merchant.enum';
import {ICustomFieldRule} from '../custom-field-rules';

export type Merchant = {
  id: string;
  userIds: string[];
  siteId: string;
  name: string;
  status?: string;
  merchantName: string;
  legalName: string;
  businessRegistrationType?: string;
  businessRegistrationNo?: string;
  countryCode: string;
  paymentsEnabled: boolean;
  payoutEnabled: boolean;
  settlementsEnabled: boolean;
  settlementsSchedule: SettlementSchedule;
  timezone: string;
  attributes?: {[key: string]: any};
  createdAt: string;
  updatedAt: string;
  productOfferings: ProductOfferings;
  merchantCategoryCode: string;
  merchantId: string;
  bank: {
    accountHolderName: string;
    accountNo: string;
    bankName: string;
    bankDisplayName: string;
    currency: string;
    idNumber?: string;
    idType?: IdType;
  };
  logoUrl?: string;
  companyId?: string;
  typeId?: string;
  siteNameId?: string;
  feePlanId?: string;
  customFields?: ICustomFieldRule[];
  balances?: Balance[];
  merchantType?: MerchantType;
  saleTerritory?: SalesTerritory;
  salesTerritoryId?: string;
  fleetPlan?: FleetPlan;
  smartPayAccountAttributes?: ISmartPayAccountAttributes;
  reason?: string;
  remark?: string;
  creditLimit?: number;

  contactInfo?: MerchantContactInfo;

  timeline?: MerchantTimeline[];

  createdOrUpdatedBy?: string;
};

export enum FleetPlan {
  PREPAID = 'prepaid',
  POSTPAID = 'postpaid',
}

export interface ISmartPayAccountAttributes {
  fleetPlan?: FleetPlan;
}

export type MerchantContactInfo = {
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  addressLine4?: string;
  addressLine5?: string;
  city?: string;
  postcode?: string;
  state?: string;
  country?: string;
  contactNo?: string;
  email?: string;
  personInCharge?: string;
  picContactNo?: string;
  authorizedSignatory?: string;
};

export type MerchantTimeline = {
  status: string;
  reason?: string;
  remark?: string;
  updatedAt: string;
  email?: string;
};

export type SettlementSchedule = {
  delayDays: number;
  delayDayType: SettlementDelayDayType;
  interval: SettlementInterval;
};

export type Balance = {
  type: MerchantBalanceType;
  currency: string;
  balance: number;
};

export type SettlementDelayDayType = typeof SETTLEMENT_DELAY_DAY_TYPE[number];

export const SETTLEMENT_INTERVAL = ['daily', 'manual'];

export const SETTLEMENT_DELAY_DAY_TYPE = ['calendar', 'business'];

export type SettlementInterval = typeof SETTLEMENT_INTERVAL[number];

export const ID_TYPE = ['IC_OLD', 'IC_NEW', 'PASSPORT'] as const;

export type IdType = typeof ID_TYPE[number];

export type ProductOfferingItem = {
  key: string;
  label: string;
};

export type GiftCardExternalTopUp = {
  merchantId: string;
  status?: 'APPROVED' | 'REJECT' | 'PENDING';
  paymentMethod: 'cheque' | 'bank_transfer';
  amount: number;
  remark?: string;
  reference: string;
  assignment: string;
  topUpTarget: 'AVAILABLE' | 'PREPAID';
  attachment: string;
  transactionDate: string;
};

export enum MerchantGiftsOfferingKey {
  giftsEnabled = 'giftsEnabled',
  giftsDealsEnabled = 'giftsDealsEnabled',
  giftsMerchantEnabled = 'giftsMerchantEnabled',
  giftsTopupEnabled = 'giftsTopupEnabled',
}

export const PRODUCT_OFFERINGS: ProductOfferingItem[] = [
  {
    key: 'retailEnabled',
    label: 'Retail',
  },
  {
    key: 'fulfillmentEnabled',
    label: 'Fulfilment',
  },
  {
    key: 'fuellingEnabled',
    label: 'Fuelling',
  },
  {
    key: 'catalogueEnabled',
    label: 'Catalogue',
  },
  {
    key: 'pointOfSaleEnabled',
    label: 'Point of sale',
  },
  {
    key: 'eCommerceEnabled',
    label: 'eCommerce',
  },
  {
    key: 'inventoryEnabled',
    label: 'Inventory',
  },
  {
    key: 'shippingEnabled',
    label: 'Shipping',
  },
  {
    key: 'timesheetEnabled',
    label: 'Timesheet',
  },
  {
    key: 'loyaltyEnabled',
    label: 'Loyalty',
  },
  {
    key: 'dealsEnabled',
    label: 'Deals',
  },
  {
    key: MerchantGiftsOfferingKey.giftsEnabled,
    label: 'Gifts',
  },

  {
    key: 'vehiclesEnabled',
    label: 'Vehicles',
  },
  {
    key: 'paymentsEnabled',
    label: 'Payments',
  },
  {
    key: 'houseAccountsEnabled',
    label: 'House accounts',
  },
  {
    key: 'billingEnabled',
    label: 'Billing',
  },
  {
    key: 'billsReloadsEnabled',
    label: 'Bills & reloads',
  },
  {
    key: 'cardIssuingEnabled',
    label: 'Card issuing',
  },
  {
    key: 'subsidyEnabled',
    label: 'Subsidy',
  },
  {
    key: 'paymentControllerEnabled',
    label: 'Payment controller',
  },
  {
    key: 'dropInEnabled',
    label: 'Drop-in',
  },
  {
    key: 'miniEnabled',
    label: 'Mini',
  },
  {
    key: 'developerEnabled',
    label: 'Developer',
  },
  {
    key: 'pricingEnabled',
    label: 'Pricing',
  },
  {
    key: 'gatewayEnabled',
    label: 'Gateway',
  },
  {
    key: 'checkoutEnabled',
    label: 'Checkout',
  },
  {
    key: 'parkingEnabled',
    label: 'Parking',
  },
];

export type ProductOfferings = {
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
  pricingEnabled: boolean;
  checkoutEnabled: boolean;
  parkingEnabled: boolean;
};

export type MerchantType = {
  id: string;
  statusValues?: string[];
  statusDefaultValue?: string;
  products: ProductOfferings;
  name: string;
  code: string;
};

export type SalesTerritory = {
  id: string;
  code: string;
  name: string;
  salesPersonEmail: string;
  enterpriseId: string;
  inUse: boolean;
  merchantTypeId: string;
};

export type MerchantSmartpayGeneralInfo = {
  merchantId?: string;
  applicationId?: string;
  status?: string;
  applicationRef?: string;
  fleetPlan: string;
  smartpayCompanyId?: string;
  smartpayCompanyName?: string;
  language?: string;
  website?: string;
  reason?: string;
  remark?: string;
  authorisedSignatory?: string;
  isCreateVirtualAccount?: boolean;
  virtualAccountId?: string;
};

export type SPAContactInfo = {
  name: string;
  phoneNumber?: string;
  emailAddress: string;
};

export type SPASubscriptionInfo = {
  fleetPlan: string;
  language: string;
  isCreateVirtualAccount: boolean;
};

export type MerchantSmartpayCompanyInfo = {
  companyOrIndividualName: string;
  companyType?: string;
  companyEmbossName: string;
  companyRegNo?: string;
  companyRegDate?: string;
  businessCategory?: string;
};

export type MerchantSmartpayTimeline = {
  status: string;
  userId: string;
  time: string;
  email: string;
};

export type FinancialInfo = {
  creditLimit: string;
  prepaidBalance: string;
};

export type MerchantSmartpay = {
  id: string;
  status: string;
  enterpriseId: string;
  merchantId?: string;
  applicationId?: string;
  generalInfo: MerchantSmartpayGeneralInfo;
  companyOrIndividualInfo: MerchantSmartpayCompanyInfo;
  timelines: MerchantSmartpayTimeline[];
  smartPayAccountAttributes?: MerchantSmartpayGeneralInfo & MerchantSmartpayCompanyInfo;
  createdAt?: string;
  updatedAt?: string;
  approvalRequestId?: string;
};

export type SmartpayAccountDetails = {
  id: string;
  merchantId?: string;
  generalInfo: MerchantSmartpayGeneralInfo;
  companyOrIndividualInfo: MerchantSmartpayCompanyInfo;
  financial: FinancialInfo;
  timelines: MerchantSmartpayTimeline[];
  applicationId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SmartpayAssessmentCreditLimit = {
  approvedCreditLimit?: number;
  requestedCreditLimit?: number;
  recommendedCreditLimit?: number;
};

export type SmartpayAssessmentSecurityDeposit = {
  securityDepositRequired?: boolean;
  approvedSecurityDepositAmount?: number;
  requestedSecurityDepositAmount?: number;
  recommendedSecurityDepositAmount?: number;
};

export type SmartpayAssessmentDetails = {
  id?: string;
  creditLimit: SmartpayAssessmentCreditLimit;
  securityDeposit: SmartpayAssessmentSecurityDeposit;
  ratings: {
    qualitativeRating?: AssessmentRatings;
    quantitativeRating?: AssessmentRatings;
  };
  others: {
    remarks?: string;
  };
  enterpriseId?: string;
  applicationId?: string;
  fleetPlan?: FleetPlan;
  createdOrUpdatedBy?: string;
};

export type SmartpayAssessmentFormData = {
  approvedCreditLimit?: number;
  requestedCreditLimit?: number;
  recommendedCreditLimit?: number;
  securityDepositRequired?: boolean;
  approvedSecurityDepositAmount?: number;
  requestedSecurityDepositAmount?: number;
  recommendedSecurityDepositAmount?: number;
  qualitativeRating?: AssessmentRatings | '';
  quantitativeRating?: AssessmentRatings | '';
  remarks?: string;
};

export type MerchantSmartpayFile = {
  id: string;
  fileName: string;
  type: string;
  size: number;
  enterpriseId: string;
  createdAt?: string;
  applicationId: string;
  storageUrl: string;
};

export type CreateUpdateMerchantSmartpayPayload = {
  generalInfo?: MerchantSmartpayGeneralInfo;
  contactDetail?: SPAContactInfo;
  companyOrIndividualInfo?: MerchantSmartpayCompanyInfo;
  createdOrUpdatedBy?: string;
};

export enum MerchantSmartpayStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  ACTIVE = 'active',
  FROZEN = 'frozen',
  OVERDUE = 'overdue',
  DEFERRED = 'deferred',
  DORMANT = 'dormant',
  CLOSED = 'closed',
}

export enum AssessmentRatings {
  NIL = 'nil',
  MINIMAL_RISK = 'minimal_risk',
  LOW_RISK = 'low_risk',
  AVERAGE_RISK = 'average_risk',
  SIGN_RISK = 'significant_risk',
  HIGH_RISK = 'high_risk',
  PROBLEM = 'problem',
  GOVERNMENT = 'government',
}

export const MerchantSmartpayStatusOptions: DropdownOption[] = [
  {
    label: 'Pending',
    value: MerchantSmartpayStatus.PENDING,
  },
  {
    label: 'Rejected',
    value: MerchantSmartpayStatus.REJECTED,
  },
  {
    label: 'Cancelled',
    value: MerchantSmartpayStatus.CANCELLED,
  },
  {
    label: 'Active',
    value: MerchantSmartpayStatus.ACTIVE,
  },
  {
    label: 'Frozen',
    value: MerchantSmartpayStatus.FROZEN,
  },
  {
    label: 'Overdue',
    value: MerchantSmartpayStatus.OVERDUE,
  },
  {
    label: 'Deferred',
    value: MerchantSmartpayStatus.DEFERRED,
  },
  {
    label: 'Dormant',
    value: MerchantSmartpayStatus.DORMANT,
  },
  {
    label: 'Closed',
    value: MerchantSmartpayStatus.CLOSED,
  },
];

export const SmartpayMerchantStatusActiveFrozenOptions: DropdownOption[] = [
  {
    label: 'Active',
    value: MerchantSmartpayStatus.ACTIVE,
  },
  {
    label: 'Frozen',
    value: MerchantSmartpayStatus.FROZEN,
  },
  {
    label: 'Closed',
    value: MerchantSmartpayStatus.CLOSED,
  },
];

export const SmartpayMerchantStatusOverdueOptions: DropdownOption[] = [
  {
    label: 'Overdue',
    value: MerchantSmartpayStatus.OVERDUE,
  },
  {
    label: 'Deferred',
    value: MerchantSmartpayStatus.DEFERRED,
  },
];

export const SmartpayMerchantStatusDormantOptions: DropdownOption[] = [
  {
    label: 'Dormant',
    value: MerchantSmartpayStatus.DORMANT,
  },
  {
    label: 'Active',
    value: MerchantSmartpayStatus.ACTIVE,
  },
  {
    label: 'Closed',
    value: MerchantSmartpayStatus.CLOSED,
  },
];

export type DropdownOption = {
  label: string;
  value: string;
};

export enum MerchantSmartpayFleetPlan {
  PREPAID = 'prepaid',
  POSTPAID = 'postpaid',
}

export const MerchantSmartpayFleetPlanOption: DropdownOption[] = [
  {
    label: 'Prepaid',
    value: MerchantSmartpayFleetPlan.PREPAID,
  },
  {
    label: 'Postpaid',
    value: MerchantSmartpayFleetPlan.POSTPAID,
  },
];

export const MerchantSmartpayCompanyTypeOptions: DropdownOption[] = [
  {
    label: 'Berhad',
    value: 'berhad',
  },
  {
    label: 'Sendirian Berhad',
    value: 'sendirian_berhad',
  },
  {
    label: 'Sole proprietory',
    value: 'sole_proprietory',
  },
  {
    label: 'Partnership',
    value: 'partnership',
  },
  {
    label: 'Individual',
    value: 'individual',
  },
  {
    label: 'PETRONAS subsidiary',
    value: 'petronas_subsidiary',
  },
  {
    label: 'Government-linked company',
    value: 'government_linked',
  },
];

export const SmartpayAssessmentRatingOptions: DropdownOption[] = [
  {
    label: 'Nil',
    value: AssessmentRatings.NIL,
  },
  {
    label: 'Minimal risk',
    value: AssessmentRatings.MINIMAL_RISK,
  },
  {
    label: 'Low risk',
    value: AssessmentRatings.LOW_RISK,
  },
  {
    label: 'Average risk',
    value: AssessmentRatings.AVERAGE_RISK,
  },
  {
    label: 'Significant risk',
    value: AssessmentRatings.SIGN_RISK,
  },
  {
    label: 'High risk',
    value: AssessmentRatings.HIGH_RISK,
  },
  {
    label: 'Problem',
    value: AssessmentRatings.PROBLEM,
  },
  {
    label: 'Government',
    value: AssessmentRatings.GOVERNMENT,
  },
];

export const MerchantSmartpayBusinessCategoryOptions: DropdownOption[] = [
  {
    label: 'Agriculture, forestry & fishing',
    value: 'agriculture_forestry_fishing',
  },
  {
    label: 'Arts & entertainment',
    value: 'art_entertainment',
  },
  {
    label: 'Construction',
    value: 'construction',
  },
  {
    label: 'Education',
    value: 'education',
  },
  {
    label: 'Electricity & gas',
    value: 'electricity_gas',
  },
  {
    label: 'E-commerce',
    value: 'e_commerce',
  },
  {
    label: 'Financial services',
    value: 'financial_services',
  },
  {
    label: 'Hotel & accommodation',
    value: 'hotel_accommodation',
  },
  {
    label: 'Hospitality, food & beverages',
    value: 'hospitality_foods_beverages',
  },
  {
    label: 'Human health & social works',
    value: 'human_health_social_works',
  },
  {
    label: 'Information & communication (ICT)',
    value: 'information_communication',
  },
  {
    label: 'Insurance',
    value: 'insurance',
  },
  {
    label: 'Investment company',
    value: 'investment_company',
  },
  {
    label: 'Manufacturing',
    value: 'manufacturing',
  },
  {
    label: 'Mining & jewelry',
    value: 'mining_jewelry',
  },
  {
    label: 'Non-profit organisation',
    value: 'non_profit_organisation',
  },
  {
    label: 'Public admin, defense & social security',
    value: 'public_admin_defense_social_security',
  },
  {
    label: 'Professional services',
    value: 'professional_services',
  },
  {
    label: 'Real estate',
    value: 'real_estate',
  },
  {
    label: 'Retail',
    value: 'retail',
  },
  {
    label: 'Wholesale',
    value: 'wholesale',
  },
  {
    label: 'Services',
    value: 'services',
  },
  {
    label: 'Transportation & storage',
    value: 'transportation_storage',
  },
  {
    label: 'Travel agency',
    value: 'travel_agency',
  },
  {
    label: 'Water, sewerage & waste management',
    value: 'water_sewerage_waste_management',
  },
];

export type SmartpayAccountAddress = {
  id: string;
  applicationId: string;
  enterpriseId: string;
  merchantId?: string;
  addressType: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  addressLine4?: string;
  addressLine5?: string;
  city?: string;
  postcode?: string;
  state?: string;
  country?: string;
  mainMailingIndicator: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type SetSmartpayAccountAddressPayload = {
  id?: string;
  addressType: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  addressLine4?: string;
  addressLine5?: string;
  city?: string;
  postcode?: string;
  state?: string;
  country?: string;
  mainMailingIndicator: boolean;
};

export type SmartpayAccountContact = {
  id: string;
  applicationId: string;
  enterpriseId: string;
  contactPerson: string;
  default: boolean;
  email?: string;
  mobilePhone?: string;
  homePhone?: string;
  workPhone?: string;
  fax?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SetSmartpayAccountContactPayload = {
  id?: string;
  contactPerson: string;
  default: boolean;
  email?: string;
  mobilePhone?: string;
  homePhone?: string;
  workPhone?: string;
  fax?: string;
};

export enum SecurityDepositTypes {
  ACQUIRED_DEPOSIT = 'acquired_deposit',
  AMANAH_SAHAM = 'amanah_saham',
  BUMIPUTERA = 'bumiputera',
  BANK_GUARANTEE = 'bank_guarantee',
  CHEQUE_DEPOSIT = 'cheque_deposit',
  CORPORATE_GUARANTEE = 'corporate_guarantee',
  CASH_DEPOSIT = 'cash_deposit',
  LETTER_OF_CREDIT = 'letter_of_credit',
  OTHERS = 'others',
  DIRECTOR_PERSONAL_GUARANTEE = 'director_personal_guarantee',
  UNSECURED = 'unsecured',
}

export enum BankAccountTypes {
  THREE_IN_ONE_ACCOUNT = '3-in-1_account',
  CURRENT_ACCOUNT = 'current_account',
  FIXED_ACCOUNT = 'fixed_account',
  SAVINGS_ACCOUNT = 'savings_account',
}

export enum BankNames {
  AFFIN_BANK_BERHAD = 'affin_bank_berhad',
  AFFIN_ISLAMIC_BANK_BERHAD = 'affin_islamic_bank_berhad',
  ALLIANCE_ISLAMIC_BANK_BERHAD = 'alliance_islamic_bank_berhad',
  ALKHAIR_INTERNATIONAL_ISLAMIC_BANK_BERHAD = 'alkhair_international_islamic_bank_berhad',
  AMISLAMIC_BANK_BERHAD = 'amislamic_bank_berhad',
  AMINTERNATIONAL_L_LTD = 'aminternational_(l)_ltd',
  AMBANK_M_BERHAD = 'ambank_(m)_berhad',
  BANGKOK_BANK_BERHAD = 'bangkok_bank_berhad',
  BANK_ISLAM_MALAYSIA_BERHAD = 'bank_islam_malaysia_berhad',
  BANK_KOPERASI_BANK_PERSATUAN_MALAYSIA_BERHAD = 'bank_koperasi_bank_persatuan_malaysia_berhad',
  BANK_KERJASAMA_MALAYSIA_BERHAD = 'bank_kerjasama_malaysia_berhad',
  BANK_MUAMALAT_MALAYSIA_BERHAD = 'bank_muamalat_malaysia_berhad',
  THE_BANK_OF_NOVA_SCOTIA_BERHAD = 'the_bank_of_nova_scotia_berhad',
  BANK_OF_AMERICA_MALAYSIA_BERHAD = 'bank_of_america_malaysia_berhad',
  BANK_OF_CHINA_MALAYSIA_BERHAD = 'bank_of_china_(malaysia)_berhad',
  BANK_PEMBANGUNAN_MALAYSIA_BERHAD = 'bank_pembangunan_malaysia_berhad',
  BANK_SIMPANAN_NASIONAL = 'bank_simpanan_nasional',
  BANK_OF_TOKYO_MITSUBISHI_UFJ_MALAYSIA_BERHAD = 'bank_of_tokyo-mitsubishi_ufj_(malaysia)_berhad',
  CIMB_BANK_BERHAD = 'cimb_bank_berhad',
  CIMB_ISLAMIC_BANK_BERHAD = 'cimb_islamic_bank_berhad',
  CIMB_BANK_L_LTD = 'cimb_bank_(l)_ltd',
  CITIBANK_M_BERHAD = 'citibank_(m)_berhad',
  CITIBANK_MALAYSIA_L_LTD = 'citibank_malaysia_(l)_ltd',
  DEUTSCHE_BANK_M_BERHAD = 'deutsche_bank_(m)_berhad',
  HONG_LEONG_BANK_BERHAD = 'hong_leong_bank_berhad',
  HONG_LEONG_ISLAMIC_BANK_BERHAD = 'hong_leong_islamic_bank_berhad',
  HSBC_BANK_M_BERHAD = 'hsbc_bank_(m)_berhad',
  HSBC_AMANAH_BANK_BERHAD = 'hsbc_amanah_bank_berhad',
  INDUSTRIAL_AND_COMMERCIAL_BANK_OF_CHINA_MALAYSIA_BERHAD = 'industrial_and_commercial_bank_of_china_(malaysia)_berhad',
  JPMORGAN_CHASE_BANK_BERHAD = 'jpmorgan_chase_bank_berhad',
  MALAYAN_BANKING_BERHAD = 'malayan_banking_berhad',
  MAYBANK_ISLAMIC_BANK_BERHAD = 'maybank_islamic_bank_berhad',
  MAYBANK_INTERNATIONAL_L_LTD = 'maybank_international_(l)_ltd',
  OCBC_BANK_M_BERHAD = 'ocbc_bank_(m)_berhad',
  OCBC_AL_AMIN_BANK_BERHAD = 'ocbc_al-amin_bank_berhad',
  PUBLIC_BANK_BERHAD = 'public_bank_berhad',
  PUBLIC_BANK_L_LTD = 'public_bank_(l)_ltd',
  PUBLIC_ISLAMIC_BERHAD = 'public_islamic_berhad',
  THE_ROYAL_BANK_OF_SCOTLAND_M_BERHAD = 'the_royal_bank_of_scotland_(m)_berhad',
  RHB_BANK_BERHAD = 'rhb_bank_berhad',
  RHB_ISLAMIC_BANK_BERHAD = 'rhb_islamic_bank_berhad',
  RHB_BANK_L_LTD = 'rhb_bank_(l)_ltd',
  STANDARD_CHARTERED_BANK_BERHAD = 'standard_chartered_bank_berhad',
  STANDARD_CHARTERED_SAADIQ_BANK_BERHAD = 'standard_chartered_saadiq_bank_berhad',
  SUMITOMO_MITSUI_BANKING_CORPORATION_MALAYSIA_BERHAD = 'sumitomo_mitsui_banking_corporation_malaysia_berhad',
  UNITED_OVERSEAS_BANK_MALAYSIA_BERHAD = 'united_overseas_bank_(malaysia)_berhad',
}

export enum HistoryEventType {
  CREATED = 'created',
  UPDATED = 'updated',
}

export interface ISecurityDeposit {
  id?: string;
  applicationId?: string;
  startDate?: string;
  endDate?: string;
  securityDepositType?: SecurityDepositTypes | string;
  securityDepositAmount?: number | string;
  securityDepositReferenceNumber?: string;
  bankAccountType?: BankAccountTypes | string;
  bankName?: BankNames | string;
  bankAccountNumber?: string;
  sapReferenceNumber?: string;
  remarks?: string;
  createdBy?: string;
  updatedBy?: string;
}

export type SmartpayBalanceTempoCreditLimit = {
  amount: number;
  startDate: string;
  endDate: string;
  merchantId?: string;
  enterpriseId?: string;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
};

export type SmartpayBalanceSummary = {
  approvedCreditLimit: number;
  totalCreditLimit: number;
  txsAmount: number;
  availableBalance: number;
};

export type SmartpayAssessmentHistory = {
  id: string;
};

export type MerchantAuditLog = {
  name: string;
  auditLogId: string;
  featureName: string;
  refId: string;
  eventType: string;
  updatedOn: string;
  currentRecord: any;
  lastRecord: any;
  updatedBy: {
    userId: string;
    fullName: string;
    namespace: string;
  };
};

export enum SmartpayType {
  APPLICATION = 'application',
  ACCOUNT = 'account',
}

export enum AuditLogFeatureName {
  SECURITY_DEPOSIT = 'SECURITY_DEPOSIT',
  CREDIT_ASSESSMENT = 'CREDIT_ASSESSMENT',
}

export const AuditLogEventTypeOptions = [
  {
    label: 'All event types',
    value: '',
  },
  {
    label: 'Created',
    value: 'created',
  },
  {
    label: 'Updated',
    value: 'updated',
  },
];

export type CreditPeriodOverrun = {
  id: string;
  approvalRequestId?: string;
  startDate: string;
  endDate: string;
  status: string;
  merchantStatus: string;
  remark?: string;
  createdAt?: string;
  createdBy?: string;
  isBulkImport?: boolean;
};

export type CreditPeriodOverrunPayload = {
  startDate: string;
  endDate: string;
  remark: string;
  createdBy: string;
};

export type CreditLimitOverrun = {
  id: string;
};

export type CreditPeriodOverrunHistory = {
  id: string;
};

export type CreditLimitOverrunHistory = {
  id: string;
};

export type MerchantUser = {
  user: {
    email: string;
    userId: string;
    name: string;
  };
};

export enum FleetTransactionStatus {
  //CREATED = 'created',
  //PENDING = 'pending',
  AUTHORISED = 'AUTHORISED',
  SUCCEEDED = 'SUCCEEDED',
  //SETTLED = 'settled',
  //POSTED = 'posted',
  //FAILED = 'failed',
  VOIDED = 'VOIDED',
  //PARTIALLY_VOIDED = 'partially_voided',
  //UNPOSTED = 'unposted',
  //BILLED = 'billed'
}

export enum FleetTransactionTypes {
  CHARGE = 'CHARGE',
  FLEET_TOPUP = 'TOPUP',
}

export const FleetTransactionTypesOptions = [
  {
    label: 'Charge',
    value: FleetTransactionTypes.CHARGE,
  },
  {
    label: 'Top up',
    value: FleetTransactionTypes.FLEET_TOPUP,
  },
];

export type SmartpayBalanceTransaction = {
  id: string;
  amount: number;
  status: string;
  type: string;
  createdAt: string;
};

export type PaginatedV2Request = {
  perPage?: number;
  page?: number;
  offset?: number;
  toLast?: boolean;
};

type PaginatedV2Metadata = {
  currentPage: number;
  lastPage: number;
  offset: number;
  pageSize: number;
};

export type SmartpayBalancesPaginatedV2 = {
  metadata: PaginatedV2Metadata;
  items: SmartpayBalanceTransaction[];
};

export type SmartpayAccountImportRes = {
  importedMerchantId: string[];
  errCsv: string;
};

export type SPABulkAdjustmentsValidateRes = {
  totalAmount: number;
  totalTransaction: number;
  transactionType: string;
};
