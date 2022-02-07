import {FleetPlan, ICard} from '../cards/card.type';
import {Merchant} from '../merchants/merchants.type';
import {ETransaction_Type, ETRANSACTION_STATUS, ETransaction_Filter_By, EStatus} from './emum';
interface IRequest {
  perPage?: number;
  page?: number;
}
export interface ITransactionsRequest extends IRequest {
  merchantId?: string;
  cardNumber?: string;
  keyWord?: string;
  dateFrom?: string;
  dateTo?: string;
  values?: any[];
  level?: string;
  type?: string;
  status?: string;
  created?: string;
}

export interface ITransactionsRequestId extends IRequest {
  requestId: string;
}

export interface IRelatedTransaction extends IRequest {
  transactionId: string;
}

export interface IEmailTransactionByHolistic {
  emails: string[];
  reportName: string;
  format: string;
  filters: Filters;
}

export interface IIMerchantRequest extends IRequest {
  searchValue?: string;
  merchantType?: string;
}

export interface ICardTransaction {
  id: string;
  amount?: number;
  cardNumber: string;
  currency?: string;
  merchant?: Merchant;
  rawRequest?: TransactionRequest;
  rawResponse?: TransactionResponse;
  status: EStatus;
  transactionUid?: string;
  type: ETransaction_Type;
  remark?: string;
  attachment?: string;
  updatedAt?: string;
  createdAt: string;
  timeline: TransactionTimeline[];
  cardDetail: ICard;
  multiplier?: 'cr' | 'dr';
  isoTransactionType?: string;
  transactionDate: string;
  merchantId?: string;
}

export interface ICardFleetTransaction {
  id: string;
  amount?: number;
  cardNumber: string;
  merchant?: Merchant;
  rawRequest?: FleetTransactionRequest;
  rawResponse?: FleetTransactionResponse;
  status: EStatus;
  transactionUid?: string;
  type: ETransaction_Type;
  createdAt: string;
  timeline: FleetTransactionTimeline[];
  isoTransactionType?: string;
  transactionDate: string;
  merchantId?: string;
  merchantName?: string;
  source?: string;
  subtype?: string;
  fleetPlan?: FleetPlan;
}

interface FleetTransactionTimeline {
  id: string;
  status: string;
  transactionUid: string;
  createdAt: string;
  updatedAt: string;
  amount: string;
  batchNumber: string;
}

interface FleetTransactionResponse {
  transactionType: string;
  rrn: string;
  stan: string;
  merchantId: string;
  responseCode: string;
  errorDescription?: string;
  authorizationId?: string;
  settlementBatchId?: string;
  terminalId: string;
  authIdResponse?: string;
}

interface FleetTransactionRequest {
  settlementBatchId: string;
  merchantId: string;
  cardNumber: string;
  rrn: string;
  stan: string;
  products: Items;
  driverInfo?: DriverInfo;
  cardData?: CardData;
  terminalId?: string;
}

interface DriverInfo {
  autoMeterMileageReading: string;
}

interface CardData {
  authorisedCard: string;
}

export interface LoyaltyCategory {
  id: string;
  categoryName: string;
  categoryCode: string;
  categoryDescription: string;
  createdAt: string;
  updatedAt: string;
}

interface TransactionTimeline {
  id: string;
  status: string;
  transactionUid: string;
  createdAt: string;
  updatedAt: string;
}

interface TransactionResponse {
  creationDatetime: string;
  transactionType: string;
  rrn: string;
  stan: string;
  nii: string;
  merchantId: string;
  deviceId: string;
  responseCode: string;
  errorDescription?: string;
  authorizationId?: string;
  settlementBatchId?: string;
  products: Items;
}

interface TransactionRequest {
  txnId: string;
  settlementBatchId: string;
  creationDatetime: string;
  merchantId: string;
  deviceId: string;
  cardNumber: string;
  cardExpiry: string;
  transactionType: string;
  rrn: string;
  stan: string;
  transactionAmount: number;
  transactionDetails: TransactionDetail[];
  products: Items;
}

interface Items {
  items: ItemisedDetails[];
}

export interface ItemisedDetails {
  id?: string;
  categoryCode: string;
  quantity?: number;
  totalAmount?: number;
  unitPrice?: number;
}

interface TransactionDetail {
  categoryCode: string;
  price: number;
  litre: string;
  amount: number;
  taxNo: string;
}

enum AcquirerType {
  MAYBANK = 'maybank',
  CIMB = 'cimb',
  GIFT = 'gift',
  LOYALTY = 'loyalty',
  FLEET = 'fleet',
}

export interface ITransactionAcquirer {
  type: AcquirerType;
  merchantId: string;
  terminalId: string;
}

export interface IAcquirerResponse {
  approvalCode?: string;
  responseCode?: string;
}

// export interface ICardTransactionIndexParams {
//   dateFrom?: string;
//   dateTo?: string;
//   values?: any[];
//   level?: string;
//   type?: string;
//   status?: string;
// }

export interface ICardTransactionRole {
  hasView: boolean;
  hasRead: boolean;
  hasCreate: boolean;
  hasUpdate: boolean;
}

export interface IEmailTransactionInput {
  toEmails: string[];
  transactionId?: string;
  filters: Filters;
}

export interface ISendEmailResponse {
  success: boolean;
  text: string;
}

export interface IMerchant {
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

interface SettlementsSchedule {
  delayDays: number;
  delayDayType: string;
  interval: string;
}

export interface Filters {
  page?: number;
  perPage?: number;
  status?: ETRANSACTION_STATUS;
  dateFrom?: string;
  dateTo?: string;
  type?: ETransaction_Type;
  level?: ETransaction_Filter_By;
  values?: string[];
  merchantId?: string;
  cardNumber?: string;
}

export interface LoyalTyCardAttributes {
  maskedPan: string;
  maskedExpiryDate: string;
  id: string | null;
}

export interface FleetCardAttributes {
  cardAidDriver?: string;
  cardNumberDriver?: string;
  maskedCardNumberDriver?: string;
  cardExpiryDateDriver?: string;
  odometer?: number;
  products: ItemisedDetails[];
}
