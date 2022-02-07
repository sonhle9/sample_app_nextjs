import {
  LoyaltyTransactionStatusesEnum,
  LoyaltyTransactionTypesEnum,
  LoyaltyCardIssuersEnum,
  LoyaltyCardStatusesEnum,
} from '../enums/loyalty.enum';

export interface ILoyaltyTransaction {
  id?: any;
  previousTransactionId: string;
  relatedTransactionId?: string;
  vendorTransactionId: string;
  vendorCreatedAt: Date;
  referenceId?: string;
  referenceType?: string;
  referenceAmount?: number;
  status: LoyaltyTransactionStatusesEnum;
  type: LoyaltyTransactionTypesEnum;
  senderCardNumber?: string;
  receiverCardNumber: string;
  senderBalance: number;
  receiverBalance: number;
  amount: number;
  merchantId?: string;
  merchantName?: string;
  tags?: string[];
  issuedBy: LoyaltyCardIssuersEnum;
  title: string;
  failureReason?: string;
  vendorFailureReason?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  userFullName?: string;
}

export interface ILMSTransaction {
  transactionCode: string;
  description: string;
  transactionDate: string;
  mID: string;
  merchName: string;
  amount: string;
  points: string;
  productCategory: string;
}

export interface IDailyTransaction {
  date: string;
  totalIssuence: number;
  totalRedeemed: number;
  totalRedemptionReversed: number;
  totalAmountToWalletBalance: number;
}

export interface ITransactions {
  id?: any;
  bonusTransaction?: any;
  previousTransactionId: string;
  relatedTransactionId?: string;
  approvalCode?: string;
  processedDateTime?: string;
  vendorTransactionId: string;
  vendorCreatedAt: Date;
  referenceId?: string;
  referenceType?: string;
  referenceAmount?: number;
  status: any;
  type: any;
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
  extraInfo?: any;
  issuedBy: any;
  title: string;
  failureReason?: string;
  vendorFailureReason?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IIndexTransactions {
  data: ITransactions[];
}

export interface ILoyaltyRole {
  hasMenu: boolean;
  hasRead: boolean;
  hasIndex: boolean;
  hasSearch: boolean;
}

export interface ILoyaltySearchResponse {
  cardsInfo: ILoyaltyCardsInfo[];
}

export interface ILoyaltyCardsInfo {
  acctNo: 'string';
  mediaId: 'string';
  mediaType: 'string';
  mediaStatus: 'string';
  cardHolderName: 'string';
  availablePointBalance: 'string';
  mediaRegistrationDate: 'string';
}

export interface IPaginationMetadata<T> {
  data: T;
  metadata: {
    currentPage: number;
    nextPageToken: string;
    pageCount: number;
    pageSize: number;
    totalCount: number;
  };
}

export interface IGrantPetronasPointsResponse {
  cardNumber: 'string';
  cardStatus: LoyaltyCardStatusesEnum;
  processedDateTime: 'string';
  vendorTransactionId?: 'string';
  pointBalance: 'number';
  pointRedeemBalance: 'number';
  earnedPoints: 'number';
  redeemedPoints: 'number';
}

export interface IPaginationMetadata<T> {
  data: T;
  metadata: {
    currentPage: number;
    nextPageToken: string;
    pageCount: number;
    pageSize: number;
    totalCount: number;
  };
}
