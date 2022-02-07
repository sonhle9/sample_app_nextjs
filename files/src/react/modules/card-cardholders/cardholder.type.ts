import {getAllCountries} from 'countries-and-timezones';
import {ICard} from '../../modules/cards/card.type';
import {Merchant} from '../merchants/merchants.type';
interface IRequest {
  perPage?: number;
  page?: number;
  sortDate?: 'asc' | 'desc';
}

export interface ICardholderIndexRequest extends IRequest {
  filterBy?: string;
  values?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
export interface ICardholder {
  id?: string;
  name?: string;
  displayName?: string;
  salutation?: string;
  email?: string;
  phoneNumber?: string;
  type?: string;
  address1?: string;
  address2?: string;
  city?: string;
  postcode?: string;
  idType?: string;
  mailingIndicator?: boolean;
  createdAt?: Date;
  card?: ICard;
  updatedAt?: Date;
  state?: string;
  country?: string;
  idNumber?: string;
  merchant?: Merchant;
  merchantId?: string;
}

export interface ICardholderRole {
  hasView: boolean;
  hasRead: boolean;
  hasCreate: boolean;
  hasUpdate: boolean;
}

export enum ButtonModalCardholder {
  CREATE = 'Create',
  EDIT = 'Edit',
}

export const Salutations = [
  {
    label: 'Mr.',
    value: 'Mr.',
  },
  {
    label: 'Mrs.',
    value: 'Mrs.',
  },
  {
    label: 'Ms.',
    value: 'Ms.',
  },
  {
    label: "Dato'",
    value: "Dato'",
  },
  {
    label: 'Datuk',
    value: 'Datuk',
  },
  {
    label: 'Datin',
    value: 'Datin',
  },
  {
    label: 'Tan Sri',
    value: 'Tan Sri',
  },
  {
    label: 'Puan Sri',
    value: 'Puan Sri',
  },
];

export const ID_TYPE = [
  {
    label: 'NRIC',
    value: 'nric',
  },
  {
    label: 'Passport number',
    value: 'passport_number',
  },
  {
    label: 'Others',
    value: 'others',
  },
];

export enum FilterBy {
  cardholderName = 'cardholderName',
  contactNumber = 'contactNumber',
  idNumber = 'passportNumber',
}

export const FilterByMap = [
  {label: 'Cardholder name', value: FilterBy.cardholderName},
  {label: 'Contact number', value: FilterBy.contactNumber},
  {label: 'NRIC/Passport number', value: FilterBy.idNumber},
];

export enum EMessage {
  REQUIRED_FIELD = 'This is required field.',
  NOT_EMPTY = 'Name must not be empty',
  INVALID_MAIL = 'Invalid email format.',
  IS_NUMBER = 'Numeric only',
  INVALID_ID_NUMBER = 'Required to be in 12 digits',
}

export enum MalaysiaStates {
  JOHOR = 'JHR - Johor',
  KEDAH = 'KDH - Kedah',
  KELANTAN = 'KTN - Kelantan',
  KUALA_LUMPUR = 'KUL - Kuala Lumpur',
  LABUAN = 'LBN - Labuan',
  MELAKA = 'MLK - Melaka',
  NEGERI_SEMBILAN = 'NSN - Negeri Sembilan',
  PAHANG = 'PHG - Pahang',
  PENANG = 'PNG - Penang',
  PERAK = 'PRK - Perak',
  PERLIS = 'PLS - Perlis',
  PUTRAJAYA = 'PJY - Putrajaya',
  SABAH = 'SBH - Sabah',
  SARAWAK = 'SWK - Sarawak',
  SELANGOR = 'SGR - Selangor',
  TERENGGANU = 'TRG - Terengganu',
}

export const countryOptions = Object.values(getAllCountries()).map((country) => ({
  label: country.id + ' - ' + country.name,
  value: country.id,
}));

export enum validateIdNumber {
  PASSPORT_NUMBER = 'passport_number',
  NRIC = 'nric',
  OTHERS = 'others',
}
