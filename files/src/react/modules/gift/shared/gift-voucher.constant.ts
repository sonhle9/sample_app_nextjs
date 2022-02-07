import * as Yup from 'yup';

const URL =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/i;

export const editVoucherSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  expiryDate: Yup.date().test('expiryDate', 'This Date must be greater than now date', (value) => {
    return !(value && new Date() > value);
  }),
  vouchersCount: Yup.number().when('generationType', {
    is: 'instant',
    then: Yup.number().required('Required').positive('Number greater than 0'),
  }),
  startDate: Yup.string()
    .required('Start date required')
    .test('startDate', 'Start date should be later than current date', (value) => {
      return !(value && new Date().setHours(0, 0, 0, 0) > new Date(value).setHours(0, 0, 0, 0));
    }),
  termsUrl: Yup.string().matches(URL, 'URL is invalid'),
  bannerUrl: Yup.string().matches(URL, 'URL is invalid'),
  iconUrl: Yup.string().matches(URL, 'URL is invalid'),
});

export const addVoucherSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  expiryDate: Yup.date().test('expiryDate', 'This Date must be greater than now date', (value) => {
    return !(value && new Date() > value);
  }),
  redeemExpiry: Yup.object().shape({
    date: Yup.date().test('date', 'This Date must be greater than now date', (value) => {
      return !(value && new Date() > value);
    }),
  }),
  redeemType: Yup.string().required('Redeem type required'),
  generationType: Yup.string().required('Generation type required'),
  vouchersCount: Yup.number().when('generationType', {
    is: 'instant',
    then: Yup.number().required('Required').positive('Number greater than 0'),
  }),
  startDate: Yup.string()
    .required('Start date required')
    .test('startDate', 'Start date should be later than current date', (value) => {
      return !(value && new Date().setHours(0, 0, 0, 0) > new Date(value).setHours(0, 0, 0, 0));
    }),
});

export const addRuleSchema = Yup.object({
  rules: Yup.array(
    Yup.object({
      name: Yup.string().required('Name is required'),
      amount: Yup.number().required('Required').positive('Number greater than 0'),
      type: Yup.string().required('Rule type required'),
      expiryDate: Yup.date().test(
        'expiryDate',
        'This Date must be greater than now date',
        (value) => {
          return !(value && new Date() > value);
        },
      ),
      tag: Yup.string().required('Tag is required'),
    }),
  ),
});

export enum DisplayAs {
  text = 'Text',
  barcode_and_text = 'Text & Barcode',
}

export enum VoucherBatchGenerationType {
  'on-demand' = 'On demand',
  'instant' = 'Instant',
  'upload' = 'Upload',
}

export enum ModeType {
  Edit = 'EDIT',
  Add = 'ADD',
  Clone = 'CLONE',
  EditRules = 'EDIT-RULES',
}

export enum VoucherBatchSection {
  general = 'General',
  details = 'Details',
  rules = 'Rules',
}

export enum VoucherBatchStatus {
  active = 'Active',
  expired = 'Expired',
}

export enum VoucherRedeemType {
  topup = 'Topup',
  registration = 'Registration',
  fuel = 'Fuel',
  external = 'External',
  store = 'Store',
}

export interface IVoucherBatch {
  _id: string;
  merchantId: string;
  name: string;
  expiryDate: string;
  redeemType: string;
  redeemed: number;
  startDate: string;
  vouchersCount: number;
}

export interface IVoucher {
  _id: string;
  batchId: string;
  bonusAmount: number;
  expiryDate: string;
  gifted: number;
  linked: number;
  name: string;
  redeemType: string;
  redeemExpiry: IRedeem;
  regularAmount: number;
  startDate: string;
  vouchersCount: number;
  id: string;
  generationType: string;
  termsUrl: string;
  bannerUrl: string;
  iconUrl: string;
  description: string;
  termContent: string;
  displayAs: string;
  rules: IRule[];
  postfix: string;
  prefix: string;
  breakDown: IBreakDown;
  duration: number;
}

interface IRedeem {
  date: Date;
  days: string;
}

interface IRule {
  name: string;
  amount: string;
  expiryDate: Date;
  daysToExpire: Date;
  tag: string;
  type: string;
}

export interface IVoucherParameters {
  _id?: string;
  batchId: string;
  name: string;
  redeemType: string;
  expiryDate: Date | string;
  startDate: Date | string;
  // redeemExpiry: IRedeem;
  generationType: string;
  termsUrl: string;
  bannerUrl: string;
  iconUrl: string;
  description: string;
  termContent: string;
  displayAs: string;
  rules: IRule[];
  vouchersCount: number;
  postfix: string;
  prefix: string;
}

export interface IBreakDown {
  granted: number;
  issued: number;
  redeemed: number;
  expired: number;
  voided: number;
}

export interface IVoidVouchers {
  code: string;
  status: string;
}
