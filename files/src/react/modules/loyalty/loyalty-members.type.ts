import * as yup from 'yup';

export enum FormFactor {
  PHYSICAL = 'physical',
  VIRTUAL = 'virtual',
}

export enum MemberType {
  SETEL = 'setel_user',
  MERCHANT = 'merchant_user',
  NON_SETEL = 'non_setel_user',
}

export enum MemberStatus {
  ISSUED = 'issued',
  ACTIVE = 'active',
  FROZEN = 'frozen',
  FROZEN_TEMP = 'temporarily_frozen',
}

export enum ValidFileTypes {
  MSWORD = 'application/msword',
  PDF = 'application/pdf',
  JPG = 'image/jpeg',
  PNG = 'image/png',
  ZIP = 'application/zip',
}

export const MemberStatusName = new Map<MemberStatus, string>([
  [MemberStatus.ISSUED, 'Issued'],
  [MemberStatus.ACTIVE, 'Active'],
  [MemberStatus.FROZEN, 'Frozen'],
  [MemberStatus.FROZEN_TEMP, 'Temporarily frozen'],
]);

export enum CardStatus {
  ACTIVE = 'active',
  FROZEN = 'frozen',
  PENDING = 'pending',
  CLOSED = 'closed',
}

export const CardStatusName = new Map<CardStatus, string>([
  [CardStatus.PENDING, 'Temporarily frozen'],
  [CardStatus.ACTIVE, 'Active'],
  [CardStatus.FROZEN, 'Frozen'],
  [CardStatus.CLOSED, 'Close'],
]);

export enum IdType {
  NEW_IC = 'ic_number',
  OLD_IC = 'old_ic_number',
  PASSPORT = 'passport_number',
  PHONE = 'mobileNo',
  EMAIL = 'email',
  NAME = 'name',
  CARD_NUMBER = 'cardNumber',
}

export enum SearchIdTypes {
  NEW_IC = 'ic_number',
  PASSPORT = 'passport_number',
  PHONE = 'mobileNo',
  CARD_NUMBER = 'cardNumber',
  EMAIL = 'email',
}

export const IdTypeName = new Map<IdType, string>([
  [IdType.NEW_IC, 'IC number'],
  [IdType.OLD_IC, 'IC number'],
  [IdType.PASSPORT, 'Passport number'],
  [IdType.PHONE, 'Mobile number'],
  [IdType.EMAIL, 'Email'],
  [IdType.NAME, 'Name'],
  [IdType.CARD_NUMBER, 'Card number'],
]);

export const IdTypeTranslation = {
  ic_number: 'IC number',
  old_ic_number: 'IC number',
  passport_number: 'Passport number',
};

export const IdTypeDropdownTranslation = {
  ic_number: 'IC number',
  old_ic_number: 'IC number (Old)',
  passport_number: 'Passport number',
  mobileNo: 'Phone number',
  email: 'Email',
  name: 'Member name',
  cardNumber: 'Mesra card number',
};

export enum MalaysiaStates {
  JOHOR = 'Johor',
  KEDAH = 'Kedah',
  KELANTAN = 'Kelantan',
  KUALA_LUMPUR = 'Kuala Lumpur',
  LABUAN = 'Labuan',
  MELAKA = 'Melaka',
  NEGERI_SEMBILAN = 'Negeri Sembilan',
  PAHANG = 'Pahang',
  PENANG = 'Penang',
  PERAK = 'Perak',
  PERLIS = 'Perlis',
  PUTRAJAYA = 'Putrajaya',
  SABAH = 'Sabah',
  SARAWAK = 'Sarawak',
  SELANGOR = 'Selangor',
  TERENGGANU = 'Terengganu',
}

export const AddressSchema = yup.object({
  street: yup.string().nullable(),
  city: yup.string().nullable(),
  state: yup.mixed().oneOf(Object.values(MalaysiaStates)).nullable(),
  zipcode: yup
    .string()
    .matches(/^\d{5}$/, {excludeEmptyString: true, message: 'Enter a valid zipcode'})
    .nullable(),
});

export type Address = yup.InferType<typeof AddressSchema>;

export const MemberSchema = yup.object({
  name: yup.string().nullable(),
  email: yup.string().email('Enter a valid email address').nullable(),
  mobileNo: yup.string().min(10).max(12).nullable(),
  address: AddressSchema,
});

export type Member = yup.InferType<typeof MemberSchema> & {
  id: string;
  userId?: string;
  legacyLmsAccount?: string;
  memberType: MemberType;
  memberStatus: MemberStatus;
  cardId?: string;
  cardNumber?: string;
  cardFormFactor?: FormFactor;
  _deleted?: boolean;
  idRef?: string;
  idType?: IdType;
  cardGroupId?: string;
  dateOfBirth?: string;
  memberStatusRemarks?: string;
  createdAt?: string;
  firstActivatedOn?: string;
  lastActivatedOn?: string;
};

export type LoyaltyMembersParams = {
  memberType?: MemberType;
  memberStatus?: MemberStatus;
  cardGroupId?: string;
  limit?: number;
  nextToken?: string;
  idRef?: string;
  idType?: IdType;
  mobileNo?: string;
  email?: string;
  cardNumber?: string;
  name?: string;
  excludeEmptyCardNumber?: boolean;
};

export type UnlinkHistoryParams = {
  nextPageToken?: string;
  page?: number;
  perPage?: number;
  id?: string;
  userId?: string;
};

export type UnlinkHistory = {
  remarks: string;
  pointsBalance: number;
  cardStatusBeforeUnlink: string;
  cardNumber: string;
  cardType?: string;
  createdAt: string;
};

export type CardBalance = {
  cardNumber: string;
  memberStatus: MemberStatus;
  cardBalance: number;
};

export type CardIssuance = {
  cardNumber: string;
  memberStatus: MemberStatus;
  userId: string;
};

export const translateMemberStatus = (input: MemberStatus) => {
  return input === MemberStatus.FROZEN_TEMP ? 'Temporarily Frozen' : input;
};

export const translateIdType = (input: IdType) => {
  return IdTypeTranslation[input] || '';
};

export const translateIdTypeDropdown = (input: IdType) => {
  return IdTypeDropdownTranslation[input] || '';
};

export interface ILoyaltyMemberWhitelist {
  ruleId: string;
  loyaltyMemberId: string;
}
