export enum VouchersMessagePattern {
  VOUCHERS_EVENT = 'vouchers-event',
}

export enum VoucherRedeemType {
  TOPUP = 'topup',
  REGISTRATION = 'registration',
  FUEL = 'fuel',
  EXTERNAL = 'external',
}

export enum VoucherStatus {
  ISSUED = 'issued',
  REDEEMED = 'redeemed',
  EXPIRED = 'expired',
  VOIDED = 'voided',
}

export enum RuleType {
  TOPUP_REGULAR = 'topup-regular',
  TOPUP_BONUS = 'topup-bonus',
}

export enum VouchersBatchStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
}

export enum ActionType {
  ISSUED = 'issued',
  LINKED = 'linked',
  REDEEMED = 'redeemed',
  GRANTED = 'granted',
  GIFTED = 'gifted',
  EXPIRED = 'expired',
  VOIDED = 'voided',
}

export enum VoucherBatchGenerationType {
  ON_DEMAND = 'on-demand',
  INSTANT = 'instant',
  UPLOAD = 'upload',
}

export enum VoucherRuleStatus {
  INITIATED = 'initiated',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

export interface IVoucher {
  batchId: string;
  code: string;
  expiryDate: Date;
  active: boolean;
  status: VoucherStatus;
  startDate: Date;
  redeemType: VoucherRedeemType;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRule {
  _id: string;
  batchId: string;
  name: string;
  amount: number;
  expiryDate?: Date;
  daysToExpire?: number;
  tag: string;
  type: RuleType;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBaseVouchersBatch {
  _id?: string;
  name: string;
  startDate: Date;
  vouchersCount: number;
  expiryDate: Date;
  redeemType: VoucherRedeemType;
  description: string;
  termContent: string;
  content: {
    title: {en: string};
    description?: {en: string};
  };
  termsUrl: string;
  bannerUrl: string;
  iconUrl: string;
  merchant?: {
    id: string;
    name: string;
  };
  rules?: IRule[];
  createdAt?: string;
  updatedAt?: string;
  generationType: VoucherBatchGenerationType;
  redeemExpiry?: {
    days?: number;
    date?: Date;
  };
}

export interface IUpdateVouchersBatchInput {
  name: string;
  startDate: Date;
  expiryDate: Date;
  description: string;
  termContent: string;
  termsUrl: string;
  bannerUrl: string;
  iconUrl: string;
  rules: IRule[];
}

export interface IVouchersBatch extends IBaseVouchersBatch {
  vouchers: IVoucher[];
}

export interface IVouchersBatchReportItem {
  name: string;
  vouchersCount: number;
  redeemType: VoucherRedeemType;
  startDate: Date;
  expiryDate: Date;
  regularAmount: number;
  bonusAmount: number;
  issued: number;
  redeemed: number;
  voided: number;
  linked: number;
  gifted: number;
  expired: number;
}

export interface IVouchersBatchReportResponse {
  items: IVouchersBatchReportItem[];
}

export interface IVouchersBatchBreakdown {
  issued: number;
  granted: number;
  redeemed: number;
  expired: number;
  voided: number;
}

export interface IndexVouchersBatchFilters {
  status?: VouchersBatchStatus;
  type?: VoucherRedeemType;
}

export interface IndexVouchersBatchReportFilters {
  name?: string;
}

export interface ICuttedRule {
  status: VoucherStatus;
  name: string;
  amount: number;
  expiryDate?: Date;
  daysToExpire?: number;
  tag: string;
  type: RuleType;
  createdAt: Date;
}

export interface ICuttedAction {
  type: ActionType;
  createdAt: Date;
}

export interface ICuttedBatch {
  name: string;
}

export interface IVouchersInfo {
  batchId: string;
  code: string;
  expiryDate: Date;
  status: VoucherStatus;
  startDate: Date;
  redeemType: VoucherRedeemType;
  rules: ICuttedRule[];
  actions: ICuttedAction[];
  batch: ICuttedBatch[];
  createdAt: Date;
  userId: string;
}

export interface IExtVoucherReportRecord {
  date: Date;
  title: string;
  voucherSerialNumber: string;
  value: number;
  terminalId: string;
  retailerName: string;
  match: boolean;
  voucherCode?: string;
}

export interface IExtVoucherReport {
  docName: string;
  records: IExtVoucherReportRecord;
  createdAt: Date;
}

export interface IIndexExtVouchersReportFilters {
  match?: boolean;
  startDate?: string;
  endDate?: string;
}
