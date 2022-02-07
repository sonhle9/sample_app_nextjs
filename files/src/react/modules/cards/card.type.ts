import {EStatus, Reason} from 'src/app/cards/shared/enums';
import {EFormFactor, EPhysicalType, ESubtype, EType} from 'src/shared/enums/card.enum';
import {ICardExpiryDate} from '../../../shared/interfaces/card-expiry-date.interface';
import {EApprovalRequestsStatus} from '../approval-requests/approval-requests.enum';
import {EFeature_Type} from '../approval-rules/approval-rules.type';
import {VehicleTypeEnum} from '../vehicle/interface/vehicle.interface';

type Merchant = {
  id: string;
  name?: string;
  status: string;
  fleetPlan?: FleetPlan;
  smartPayAccountAttributes?: ISmartPayAccountAttributes;
};

export enum FleetPlan {
  PREPAID = 'prepaid',
  POSTPAID = 'postpaid',
}

export interface ISmartPayAccountAttributes {
  fleetPlan?: FleetPlan;
}

export enum ERestrictionType {
  COMPANY = 'company',
  MERCHANT = 'merchant',
  CARD_GROUP = 'card_group',
  CARD = 'card',
}

export enum ESortBy {
  _UPDATED_AT = '-updatedAt',
  _CREATED_AT = '-createdAt',
  CARD_NUMBER = 'cardNumber',
}

export interface ICardRestriction {
  type: string;
  belongTo: string;
  maximumBalance: number;
  accumulate: any;
  createdAt: string;
  updatedAt: string;
  singleTransactionLimit: {
    amountTransaction: number;
    createdAt: string | number | Date;
    updatedAt?: string | number | Date;
  };
  velocity: {
    dailyAmount: number;
    dailyCount: number;
    monthlyAmount: number;
    monthlyCount: number;
    dailyLimit?: {
      amount: number;
      count: number;
      balance?: number;
      createdOn: string;
      updatedOn?: string;
      createdAt: string | number | Date;
      updatedAt?: string | number | Date;
      lastTransactionOn: string;
    };
    monthlyLimit?: {
      amount: number;
      count: number;
      balance?: number;
      createdOn: string;
      updatedOn?: string;
      createdAt: string | number | Date;
      updatedAt?: string | number | Date;
      lastTransactionOn: string;
    };
  };
  itemAcceptances: string[];
}

export interface ICard {
  id?: string;
  _id?: string;
  type: EType;
  formFactor: EFormFactor;
  physicalType?: EPhysicalType;
  subtype?: ESubtype;
  merchant?: Merchant;
  merchantId: string;
  cardNumber: string;
  processType?: string;
  status?: EStatus;
  cardholder?: CardholderDetails;
  fleetVehicle?: string;
  createdAt?: string;
  reason?: string;
  cardBalance?: CardBalance;
  remark?: string;
  cardGroup?: ICardGroup;
  company?: Company;
  expiry?: ICardExpiryDate;
  timeline?: Array<ITimeline>;
  limitation: Limitation;
  lastRequest: LastRequest;
  numberOfCards?: number;
  displayName?: string;
  name: string;
  expiryDate?: string;
  maximumBalance: number;
  loyaltyMember?: ILoyaltyMember;
  brand?: CreationData;
  creationData?: CreationData;
  cardRange?: any;
  vehicleNumber?: string;
}

export interface CreationData {
  vehicleNumber: string;
}

export interface ILoyaltyMember {
  id: string;
  cardNumber: string;
}

export interface LastRequest {
  transfer?: TransferDetails;
  adjustment?: TransferDetails;
}
export interface Company {
  name: string;
}

export interface IndexCard {
  id?: string;
  _id?: string;
  status?: EStatus;
  reason?: Reason;
  remark?: string;
  cardGroup: string;
  cardRange?: string;
  formFactor: EFormFactor;
  merchant?: string;
  merchantId?: string;
  numberOfCards?: number;
  physicalType: EPhysicalType;
  subtype: ESubtype;
  displayName?: string;
  name: string;
  type: EType;
  preload?: number;
}

export enum FilterBy {
  company = 'company',
  cardGroup = 'cardGroup',
  merchant = 'merchant',
  cardNumber = 'cardNumber',
}

export const StatusMap = [
  {label: 'Pending', value: EStatus.PENDING},
  {label: 'Issued', value: EStatus.ISSUED},
  {label: 'Active', value: EStatus.ACTIVE},
  {label: 'Frozen', value: EStatus.FROZEN},
  {label: 'Closed', value: EStatus.CLOSED},
];

export const FilterByMap = [
  {label: 'Company', value: FilterBy.company},
  {label: 'Card group', value: FilterBy.cardGroup},
  {label: 'Merchant', value: FilterBy.merchant},
  {label: 'Card number', value: FilterBy.cardNumber},
];

export enum EditMode {
  CREATE = 'create',
  EDIT = 'edit',
}

export interface CardBalance {
  balance?: number;
  cardNumber: string;
  cardType?: EType;
}

export type Limitation = {
  singleTransactionLimit: number;
  dailyCardLimit: number;
  dailyCardLimitBalance?: number;
  monthlyCardLimit: number;
  monthlyCardLimitBalance?: number;
  dailyCountLimit: number;
  dailyCountLimitBalance?: number;
  monthlyCountLimit: number;
  monthlyCountLimitBalance?: number;
  allowedFuelProducts: string[];
};

export type ITimeline = {
  id: string;
  status?: string;
  data?: {
    before?: number;
    after?: number;
    updatedBy?: string;
    reason?: Reason;
    remark?: string;
  };
  date?: string;
  createdAt?: string;
};
interface IRequest {
  perPage?: number;
  page?: number;
  sortDate?: 'asc' | 'desc';
}

export interface ICardsRequest extends IRequest {
  cardNumber?: string;
  status?: EStatus;
  dateFrom?: string;
  dateTo?: string;
  filterBy?: FilterBy;
  values?: any[];
  cardNumberFrom?: string;
  cardNumberTo?: string;
  sort?: string;
  referenceRequestId?: string;
  type?: EType;
}

export interface IMerchantsRequest extends IRequest {
  name?: string;
  merchantTypes?: string[];
}

export interface ICardRangesRequest extends IRequest {
  type?: string;
}

export interface ICardRangesFilterByRequest extends IRequest {
  search?: string;
}

export interface ICardGroupsRequest extends IRequest {
  cardType?: string;
  merchantId?: string;
  search?: string;
}

export interface ICardGroupsFilterByRequest extends IRequest {
  search?: string;
  idNumber?: string;
  phoneNumber?: string;
}

export interface ICompaniesRequest extends IRequest {
  keyWord?: string;
}

export interface ICardholdersFilterByRequest extends IRequest {
  filterBy?: string;
  values?: string;
}

export type CardholderDetails = {
  id: string;
  name: string;
  displayName?: string;
  createdAt?: string;
};

export type TransferDetails = {
  id?: string;
  status?: EApprovalRequestsStatus;
  amount: number;
  transferType: ETransferType;
  remark?: string;
  attachments?: string[];
  cardId: string;
  rawRequest?: RawRequest;
  fileName?: string;
  isAccess?: boolean;
  feature?: EFeature_Type;
  createdAt?: string;
};

export type RawRequest = {
  cardNumber?: string;
  remark?: string;
  transactionId?: string;
  transactionUid?: string;
  transferType?: ETransferType;
  adjustmentType?: EAdjustmentType;
  adjustmentTarget?: EAdjustmentTarget;
  cardNumberTarget?: string;
  fileName?: string;
  isAccess?: boolean;
  createdAt?: string;
};

export interface IGetRequest extends IRequest {
  cardNumber: string;
}

export type AdjustmentDetails = {
  id?: string;
  status?: EApprovalRequestsStatus;
  amount?: number;
  remark?: string;
  attachments?: string[];
  cardId: string;
  rawRequest?: RawRequest;
  feature?: EFeature_Type;
  fileName?: string;
  isAccess?: boolean;
  createdAt?: string;
};

export interface ICardGroup {
  id: string;
  name: string;
  description: string;
  level: string;
  cardType: string;
  merchantId: string;
  createdAt: Date;
}

export enum ETransferType {
  GRANT = 'grants',
  REVOKE = 'revoke',
}

export enum EAdjustmentType {
  GRANT = 'grants',
  REVOKE = 'revoke',
}

export enum EAdjustmentTarget {
  OWNER = 'owner',
  OTHER = 'other',
}

export const AllowedFuelProducts = [
  {
    value: 'primax_ron95',
    text: 'PETRONAS Primax RON95',
  },
  {
    value: 'primax_ron97',
    text: 'PETRONAS Primax RON97',
  },
  {
    value: 'diesel',
    text: 'PETRONAS Diesel',
  },
  {
    value: 'diesel_euro5',
    text: 'PETRONAS Diesel Euro 5',
  },
];

export interface IMerchantRequest {
  id: string;
  merchantId: string;
  name: string;
  legalName: string;
  countryCode: string;
  timezone: string;
  paymentsEnabled: boolean;
  settlementsEnabled: boolean;
  payoutEnabled: boolean;
  userIds: string[];
  createdAt: string;
  updatedAt: string;
  availableBalanceMyr: number;
  merchantCategoryCode: string;
}

export interface IFileBulkCardDetails {
  status: string;
  batchId: string;
}

export interface IEmailCardInput {
  filters?: Filters;
  emails?: string[];
  cardId?: string;
  reportName?: string;
}

export interface Filters {
  page: number;
  perPage: number;
  status?: EStatus;
  type?: EType;
  dateFrom?: string;
  dateTo?: string;
  filterBy?: FilterBy;
  values?: string[];
}

export const TransferTypeMap = [
  {label: 'Grant card balance', value: ETransferType.GRANT},
  {label: 'Revoke card balance', value: ETransferType.REVOKE},
];

export const TabMode = {
  DAILY_LIMIT: 'daily',
  MONTHLY_LIMIT: 'monthly',
  OTHERS: 'others',
};

export enum EDay {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export interface Time {
  from: Date;
  to: Date;
}
export interface DateTimeAcceptance {
  day: EDay;
  time: Time[];
}

export interface SiteAcceptances {
  name: string;
  sites: string[];
}

export interface IRestriction {
  type: ERestrictionType;
  belongTo: string;
  singleTransactionLimit?: any;
  expiredOn?: string;
  itemAcceptances?: string[];
  dateTimeAcceptance?: DateTimeAcceptance[];
  siteAcceptances?: SiteAcceptances[];
  createdAt?: string;
  velocity?: any;
  updatedAt?: string;
  createdBy?: string;
  dailyAmount?: number;
  monthlyAmount?: number;
}

export interface IRestrictionInput {
  type: ERestrictionType;
  belongTo: string;
}

export enum EBatchStatus {
  CREATED = 'created',
  PROCESSING = 'processing',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

export enum EBatchType {
  BULKTRANSFER_UPLOAD = 'bulkTransfer_upload',
  BULKTRANSFER_VALIDATE = 'bulkTransfer_validate',
}

export interface IBatchTransfer {
  id: string;
  status: EBatchStatus;
  type: EBatchType;
  fileName: string;
  fileBuffer: string;
  result: {
    failedCount?: number;
    succeededCount?: number;
    totalCount?: number;
    totalAmount?: number;
    errors?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export type VehiclesFilterType = {
  searchValue?: string;
  page?: number;
  perPage?: number;
  endDate?: string;
  startDate?: string;
  sortDate?: 'asc' | 'desc';
  dateVehicle?: [string, string];
  isEmptyCardNumber?: boolean;
  vehicleNumbers?: [string];
  merchantId?: string;
};

export interface IVehicle {
  vehicleId?: string;
  vehicleNumber?: string;
  description?: string;
  vehicleType?: VehicleTypeEnum;
  vehicleBrand?: string;
  merchantId?: string;
  vehicleModel?: string;
  merchantDetails?: Merchant;
  engineCapacity?: number;
  engineCapacityUnit?: string;
  createdAt: string;
  updatedAt?: string;
  lastOdometer?: string;
  cardDetail?: ICard;
  ownerId?: string;
}
