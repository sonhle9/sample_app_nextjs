export interface ICardholderIndexParams {
  id: string;
  name: string;
  displayName: string;
  salutation: string;
  contact: IContact;
  address: IAddress;
  merchantId: string;
  createdAt: Date;
  dateFrom?: string;
  dateTo?: string;
  searchValue?: string;
}

export interface IContact {
  email: string;
  phoneNumber: string;
}

export interface IAddress {
  type: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  postcode: string;
  state: string;
  country: string;
  mailingIndicator: boolean;
}

export interface ICardholder {
  id: string;
  name: string;
  displayName: string;
  salutation: string;
  contact: IContact;
  address: IAddress;
  merchantId: string;
  createdAt: Date;
}

export interface ICardholderRole {
  hasView: boolean;
  hasRead: boolean;
  hasCreate: boolean;
  hasUpdate: boolean;
}
