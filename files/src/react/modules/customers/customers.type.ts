import {PaymentMethod} from 'src/app/transactions/shared/const-var';
import {TransactionSubType, TransactionType} from 'src/react/services/api-payments.service';
import {CircleStatus, CircleUserRole, CircleMemberStatus} from 'src/shared/enums/circle.enum';
import {Pagination} from '../../../shared/interfaces/pagination.interface';
import {MemberStatus} from '../loyalty/loyalty-members.type';

interface IRequest {
  perPage?: number;
  page?: number;
  sortDate?: 'asc' | 'desc';
}

export interface ICustomerRequest extends IRequest {
  search?: string;
}
export interface ICustomerLatestOrders extends IRequest {
  userId: string;
  type?: string;
  orderType?: string;
}

export interface ICustomerTransactions extends IRequest {
  userId?: string;
  type?: TransactionType | '';
  subtype?: TransactionSubType | '';
  status?: string;
  dateRange?: [string, string];
  paymentMethod?: PaymentMethod | '';
  paymentSubmethod?: string;
  orderId?: string;
}

enum StoreOrderEnum {
  created = 'created',
  successfulCharge = 'successfulCharge',
  errorCharge = 'errorCharge',
  successfulVoid = 'successfulVoid',
  pendingVoid = 'pendingVoid',
  errorVoid = 'errorVoid',
  successfulPointIssuance = 'successfulPointIssuance',
  errorPointIssuance = 'errorPointIssuance',
  successfulPointVoid = 'successfulPointVoid',
  errorPointVoid = 'errorPointVoid',
  confirmed = 'confirmed',
  error = 'error',
}
enum StoreVendorType {
  sapure = 'sapure',
  sentinel = 'sentinel',
  setel = 'setel',
}
enum StorePaymentProvider {
  wallet = 'wallet',
  card = 'card',
}

export interface IStoreOrdersFilter {
  to?: Date;
  from?: Date;
  status?: StoreOrderEnum;
  stationName?: string;
  userId?: string;
  query?: string; //retailerId, orderId, and customer name
  vendorType?: StoreVendorType;
  merchantId?: string;
  paymentProvider?: StorePaymentProvider;
}

export interface IUpdateCustomer {
  userId: string;
  name: string;
  email: string;
}
export enum IdentityTypesEnum {
  icNumber = 'ic_number',
  oldIcNumber = 'old_ic_number',
  passportNumber = 'passport_number',
}

export interface ICustomerPinPreferences {
  fuelPurchase: boolean;
  storePurchase: boolean;
}
export interface ICustomerAccountSettings {
  userId: string;
  pinPreferences: ICustomerPinPreferences;
  emailSubscriptionStatus: boolean;
  isSafetyAgreed: {
    value: boolean;
    updatedAt: Date;
  };
  preferredPetrolBrand: string;
}

export interface IMutationCustomer {
  id?: string;
  email: string;
  name: string;
  password?: string;
}

export interface ICustomerLite {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ICustomerWalletInfo {
  id: string;
  balance: number;
  isCreated?: boolean;
  limit?: number;
}

export interface ICustomerRefreshBalanceResponse {
  id: string;
  balance: number;
}

export interface ICustomerSetelShareHistoryResponse {
  circleId: string;
  status: CircleStatus;
  isDeleted: boolean;
  createdAt: string;
  role: CircleUserRole;
  memberStatus: CircleMemberStatus;
}
export interface ICustomer extends ICustomerLite {
  tierTitle: string;
  referralCode: string;
  referrerCode?: any;
  isBonusGranted: boolean;
  isBonusUnlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  deviceId: string;
  verified: boolean;
  internal: boolean;
  isEmailVerified: boolean;
  isEnabled: boolean;
  identityType?: IdentityTypesEnum;
  identityNumber?: string;
  language?: string;
  walletLimit?: number;
}

export interface ICustomerStorecard {
  id: string;
  isCreated?: boolean;
  balance: number;
  limit?: number;
}

export interface ICustomerRole {
  hasMenu: boolean;
  hasRead: boolean;
  hasIndex: boolean;
  hasSearch: boolean;
  hasEdit: boolean;
  hasTransactions: boolean;
  hasWallet: boolean;
  hasLoyaltyPointsGranting: boolean;
  hasBudget: boolean;
  hasTreasury: boolean;
  hasRecordAdjustment: boolean;
  hasStatement: boolean;
}

export interface IBudget {
  createdAt: string;
  fuelOrders: IBudgetFuelOrders;
  month: string;
  updatedAt: string;
  userId: string;
  year: string;
  __v?: number;
  _id: string;
}

export interface IBudgetFuelOrders {
  summaries: IBudgetSummaries[];
  totals: IBudgetTotal;
  _id: string;
}
export interface IBudgetSummaries {
  amountFuelled: number;
  fuelType: string;
  litresFuelled: number;
  purchaseCount: number;
  _id: string;
}

export interface IBudgetTotal {
  amountFuelled: number;
  litresFuelled: number;
  purchaseCount: number;
  _id: string;
}

export interface ICustomBudget {
  type: string;
  year?: string;
  month?: string;
  startDate: any;
  endDate: any;
}

export interface ICustomerCardActivationResponse {
  retryCount: number;
}

export enum RegexEnum {
  password = '((?=.*[0-9])(?=.*[A-Z])(?!.*[~`<>()|+#{}?!@$%^&*-]).{8,32})',
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICustomerPagination extends Pagination {}

export interface ICustomerApiResponse {
  pagination: ICustomerPagination;
  data: ICustomer[];
}

export interface IUpdateDeviceData {
  id?: string;
  isBlocked?: boolean | undefined;
  deviceId: string;
  updateOrDelete: 'update' | 'delete';
}

export const loyaltyCardStatusColor = {
  [MemberStatus.ACTIVE]: 'success',
  [MemberStatus.FROZEN]: 'grey',
  [MemberStatus.ISSUED]: 'success',
  [MemberStatus.FROZEN_TEMP]: 'lemon',
} as const;
