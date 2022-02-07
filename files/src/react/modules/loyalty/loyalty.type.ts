import {IdType} from './loyalty-members.type';
import {OptionsOrGroups} from '@setel/portal-ui';
import {LoyaltyReferenceTypesEnum} from 'src/shared/enums/loyalty.enum';

export type BadgeTranslation = {
  text: string;
  color:
    | 'turquoise'
    | 'grey'
    | 'purple'
    | 'lemon'
    | 'success'
    | 'info'
    | 'warning'
    | 'error'
    | 'blue'
    | 'offwhite';
  altText?: string;
};

export enum CardIssuers {
  SETEL = 'setel',
  PETRONAS = 'petronas',
}

export enum CardProvider {
  SETEL = 'SETEL',
  LMS = 'LMS',
}

export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'successful',
  FAIL = 'failed',
  DECLINE = 'declined',
  VOID = 'voided',
  REJECTED = 'rejected',
}

export const TransactionStatusName = new Map<TransactionStatus, BadgeTranslation>([
  [TransactionStatus.PENDING, {text: 'Pending', color: 'warning'}],
  [TransactionStatus.SUCCESS, {text: 'Succeeded', color: 'success', altText: 'Success'}],
  [TransactionStatus.FAIL, {text: 'Failed', color: 'error'}],
  [TransactionStatus.DECLINE, {text: 'Declined', color: 'error'}],
  [TransactionStatus.VOID, {text: 'Voided', color: 'error'}],
  [TransactionStatus.REJECTED, {text: 'Rejected', color: 'error'}],
]);

export const CardIssuersName = new Map<CardIssuers, string>([
  [CardIssuers.SETEL, 'Setel'],
  [CardIssuers.PETRONAS, 'Petronas'],
]);

export enum TransactionTypes {
  EARN = 'earn',
  REDEEM = 'redeem',
  EARN_REVERSAL = 'earnReversal',
  EARN_VOID = 'earnVoid',
  REDEEM_AUTH = 'redeemAuth',
  REDEEM_CAPTURE = 'redeemCapture',
  REDEEM_REVERSAL = 'redeemReversal',
  REDEEM_VOID = 'redeemVoid',
  // For loyalty transaction outside of Setel, e.g. Mesra transaction
  EXTERNAL_EARN = 'externalEarn',
  EXTERNAL_REDEEM = 'externalRedeem',
  ADJUSTMENT = 'adjustment',
  REVERSAL = 'reversal',
  TRANSFER = 'transfer',
}

export const TransactionTypesName = new Map<TransactionTypes, string>([
  [TransactionTypes.EARN, 'Earnings'],
  [TransactionTypes.REDEEM, 'Redemptions'],
  [TransactionTypes.EARN_REVERSAL, 'Earnings - Reversal'],
  [TransactionTypes.EARN_VOID, 'Adjustments'],
  [TransactionTypes.REDEEM_AUTH, 'Redemptions - Auth'],
  [TransactionTypes.REDEEM_CAPTURE, 'Redemptions'],
  [TransactionTypes.REDEEM_REVERSAL, 'Redemptions - Reversal'],
  [TransactionTypes.REDEEM_VOID, 'Redemptions - Void'],
  [TransactionTypes.EXTERNAL_EARN, 'Earnings'],
  [TransactionTypes.EXTERNAL_REDEEM, 'Redemptions'],
  [TransactionTypes.ADJUSTMENT, 'Adjustments'],
  [TransactionTypes.TRANSFER, 'Transfer'],
]);

export const TransactionTypeOptions = new Map<
  TransactionTypes,
  OptionsOrGroups<string | TransactionTypes>
>([
  [
    TransactionTypes.EARN,
    [
      {label: 'All', value: TransactionTypes.EARN},
      {label: 'Earnings', value: TransactionTypes.EXTERNAL_EARN},
      {label: 'Earnings - Reversal', value: TransactionTypes.EARN_REVERSAL},
      {label: 'Earn - Void', value: TransactionTypes.EARN_VOID},
    ],
  ],
  [
    TransactionTypes.REDEEM,
    [
      {label: 'All', value: TransactionTypes.REDEEM},
      {label: 'Redemptions', value: TransactionTypes.EXTERNAL_REDEEM},
      {label: 'Redemptions - Capture', value: TransactionTypes.REDEEM_CAPTURE},
      {label: 'Redemptions - Auth', value: TransactionTypes.REDEEM_AUTH},
      {label: 'Redemptions - Reversal', value: TransactionTypes.REDEEM_REVERSAL},
      {label: 'Redemptions - Void', value: TransactionTypes.REDEEM_VOID},
    ],
  ],
]);

export enum CardStatuses {
  ISSUED = 'issued',
  ACTIVE = 'active',
  FROZEN = 'frozen',
  TEMPORARILY_FROZEN = 'temporarilyFrozen',
}

export const CardStatusesName = new Map<CardStatuses, BadgeTranslation>([
  [CardStatuses.ISSUED, {text: 'Issued', color: 'warning'}],
  [CardStatuses.ACTIVE, {text: 'Active', color: 'success'}],
  [CardStatuses.FROZEN, {text: 'Frozen', color: 'grey'}],
  [CardStatuses.TEMPORARILY_FROZEN, {text: 'Temporarily frozen', color: 'warning'}],
]);

export enum CardVendorStatuses {
  ACTIVE = 'ACTIVE',
  ISSUED = 'ISSUED',
  SUSPENDED = 'SUSPENDED',
  BLOCKED = 'BLOCKED',
  FRAUDBLOCKED = 'FRAUDBLOCKED',
  CLPBLOCKED = 'CLPBLOCKED',
  CLOSED = 'CLOSED',
}

export const CardVendorStatusesName = new Map<CardVendorStatuses, BadgeTranslation>([
  [CardVendorStatuses.ISSUED, {text: 'Issued', color: 'warning'}],
  [CardVendorStatuses.ACTIVE, {text: 'Active', color: 'success'}],
  [CardVendorStatuses.CLOSED, {text: 'Closed', color: 'grey'}],
  [CardVendorStatuses.SUSPENDED, {text: 'Suspended', color: 'warning'}],
  [CardVendorStatuses.BLOCKED, {text: 'Blocked', color: 'error'}],
  [CardVendorStatuses.FRAUDBLOCKED, {text: 'Fraud blocked', color: 'error'}],
  [CardVendorStatuses.CLPBLOCKED, {text: 'CLP blocked', color: 'error'}],
]);

export enum CardFailedActivationReasons {
  FIELDS_NOT_MATCHING = 'FieldsNotMatching',
  VENDOR_STATUS_ISSUED = 'VendorStatusIssued',
  OTHER_ISSUE = 'OtherIssue',
}

export enum CardFreezeReasons {
  UNDER_REVIEW = 'underReview',
  SUSPECTED_FRAUD = 'suspectedFraud',
  CUSTOMER_CONTACT_VENDOR = 'customerContactVendor',
  CARD_CLOSED = 'cardClosed',
  NONE = '',
}

export type BonusTransaction = {
  id?: string;
  vendorTransactionId?: string;
  vendorCreatedAt?: Date;
  amount: number;
  tags?: string[];
  membershipTierTitle?: string;
  membershipPointMultiplier?: number;
  membershipIconPrimary?: string;
  membershipIconDetails?: string;
  issuedBy: CardIssuers;
  failureReason?: string;
  vendorFailureReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type LoyaltyTransaction = {
  categoryCode: string;
  categoryValue: number;
  categoryQuantity: number;
  categoryUnitPrice: number;
  categoryName: string;
  categoryDescription?: string;
};

export type ExtraTransactionInfo = {
  membershipTierTitle?: string;
  membershipPointMultiplier?: number;
  membershipIconPrimary?: string;
  membershipIconDetails?: string;
  vendorPointMultiplier?: number;
  vendorPointAmount?: number;
  fuelVolume?: number;
};

export type TransactionsParams = {
  nextToken?: string;
  page?: number;
  perPage?: number;
  startDate?: string;
  endDate?: string;
  userId?: string;
  merchantId?: string;
  referenceId?: string;
  referenceTypes?: string[];
  types?: TransactionTypes | TransactionTypes[];
  statuses?: TransactionStatus | TransactionStatus[];
  issuers?: CardIssuers | CardIssuers[];
  tags?: string[];
  transactionId?: string;
  cardNumber?: string;
};

export type DailyTransactionParams = {
  page?: number;
  perPage?: number;
  fromDate?: string;
  toDate?: string;
  csv?: boolean;
};

export type TransactionSummaryID = {
  day: number;
  month: number;
  year: number;
};

export type TransactionSummary = {
  _id: TransactionSummaryID;
  totalIssuance: number;
  totalRedeemed: number;
  TotalRedemptionReversed: number;
  totalAmountToWalletBalanceInCent: number;
  totalSettlement: number;
};

export type Transactions = {
  id?: any;
  bonusTransaction?: BonusTransaction;
  previousTransactionId: string;
  relatedTransactionId?: string;
  approvalCode?: string;
  processedDateTime?: string;
  vendorTransactionId: string;
  vendorCreatedAt: Date;
  referenceId?: string;
  referenceType?: string;
  referenceAmount?: number;
  status: TransactionStatus;
  type: TransactionTypes;
  userId: string;
  senderCardNumber?: string;
  receiverCardNumber: string;
  senderBalance: number;
  receiverBalance: number;
  amount: number;
  totalPoints?: number;
  merchantId?: string;
  merchantName?: string;
  tags?: string[];
  extraInfo?: ExtraTransactionInfo;
  issuedBy: CardIssuers;
  title: string;
  failureReason?: string;
  vendorFailureReason?: string;
  loyaltyTransactions?: LoyaltyTransaction[];
  userAccount?: LoyaltyAccount;
  deductedPoints?: number;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Card = {
  id: string;
  cardNumber: string;
  pointBalance: number;
  userId: string;
  type: string;
  status: CardStatuses;
  vendorStatus: CardVendorStatuses;
  issuedBy: CardIssuers;
  isPhysicalCard: boolean;
  isActive: boolean;
  isActivatedAt: Date;
  isFailedActivation: boolean;
  isFailedActivationAt: Date;
  failedActivationReason?: CardFailedActivationReasons;
  overriddenToFrozen: boolean;
  isFrozenAt: Date;
  overriddenToTemporarilyFrozen: boolean;
  isTemporarilyFrozenAt: Date;
  freezeReason?: CardFreezeReasons;
  isRemoved: boolean;
  isPointEarningEnabled: boolean;
  isPointRedemptionEnabled: boolean;
  vendorCardType?: string;
  vendorCardTypeDescription?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  provider?: CardProvider;
};

export type CardParams = {
  nextPageToken?: string;
  page?: number;
  perPage?: number;
  userId?: string;
  cardNumber?: string;
  status?: CardStatuses;
  createdDateFrom?: string;
  createdDateTo?: string;
  updatedDateFrom?: string;
  updatedDateTo?: string;
  issuedBy?: CardIssuers;
  type?: string;
  isPhysicalCard?: boolean;
  isActive?: boolean;
  isPointEarningEnabled?: boolean;
  isPointRedemptionEnabled?: boolean;
  vendorStatus?: CardVendorStatuses;
  freezeReason?: string;
  isFailedActivation?: boolean;
  isFailedActivationFrom?: string;
  isFailedActivationTo?: string;
  failedActivationReason?: CardFailedActivationReasons;
  overriddenToFrozen?: boolean;
  overriddenToTemporarilyFrozen?: boolean;
};

export type SearchParams = {
  icType?: IdType;
  icNumber?: string;
};

export enum MediaStatus {
  ACTIVE = 'Active',
  SUSPEND = 'Suspend',
  BLOCK = 'Block',
  CLOSED = 'Closed',
}

export type SearchLoyaltyCardInfo = {
  acctNo: string;
  mediaId: string;
  mediaType: string;
  mediaStatus: MediaStatus;
  cardHolderName: string;
  availablePointBalance: string;
  mediaRegistrationDate: string;
};

export type SearchResponse = {
  icNumber?: string;
  icType?: IdType;
  cardsInfo?: SearchLoyaltyCardInfo[];
  cardsInfoDB?: Card;
};

export type UploadResponse = {
  fileName: string;
  url: string;
};

export type LoyaltyAccount = {
  cardNumber: string;
  cardAccountStatus?: string;
  sourceId?: string;
  accountNumber?: string;
  fullName?: string;
  email?: string;
  nationality?: string;
  newIc?: string;
  oldIc?: string;
  passportNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: any;
  homeNumber?: string;
  mobileNumber?: string;
  officeNumber?: string;
};

export enum FraudRules {
  TRANSACTIONS_PER_DAY_PER_STATION = 'loyalty-fraud-rule-frequency-per-day',
  TRANSACTION_AMOUNT = 'loyalty-fraud-rule-amount-per-transaction',
  TOTAL_TRANSACTION_AMOUNT_PER_MONTH = 'loyalty-fraud-rule-amount-per-month',
}

export type LoyaltyPointsExpiryDate = {
  expiringPointsAmount: number;
  expiringPointsDate: Date;
};

export type LoyaltyCardBalance = {
  pointsExpiryDates: LoyaltyPointsExpiryDate[];
  pointTotalBalance: number;
  pointRedeemableBalance: number;
  cardNumber: string;
  cardId: string;
  status?: string;
};

export type LoyaltyProgrammesParams = {
  memberId: string;
  code: string;
};

export type LoyaltyProgrammesOptOutParams = LoyaltyProgrammesParams & {
  reason?: string;
};

export type LoyaltyProgramme = {
  id: string;
  code: string;
  name: string;
  status: ProgrammeStatuses;
  cardNumber: string;
  memberId: string;
  memberName: string;
  idType: IdType;
  idNumber: string;
  mobileNo?: string;
  email?: string;
  pointsRetained?: number;
  pointsRetainedTransactionId?: string;
  pointsReturnedTransactionId?: string;
  optInDate?: string;
  optOutAt?: string;
  reason?: string;
  errorDescription?: string;
};

export enum ProgrammeStatuses {
  CREATED = 'created',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  FAILED = 'failed',
}

export type LoyaltyManualGrantPointsParams = {
  userId: string;
  grandTotal: number;
  transactionId?: string;
  transactionDateTime?: Date;
  referenceId?: string;
  referenceType?: LoyaltyReferenceTypesEnum;
};

export type CardUnlinkParams = {
  cardNumber: string;
  userId: string;
  remarks?: string;
};

export type CardLinkParams = {
  userId: string;
  cardNumber: string;
};

export type CardActivationParams = {
  userId?: string;
  idRef?: string;
  idType?: IdType;
  cardNumber?: string;
};
