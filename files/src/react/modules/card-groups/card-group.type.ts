import {Merchant} from '../merchants/merchants.type';

interface IRequest {
  perPage?: number;
  page?: number;
  sortDate?: 'asc' | 'desc';
}
export interface ICardGroupsRequest extends IRequest {
  merchantId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  level?: string;
  cardType?: string;
}

export interface ICardGroup {
  id: string;
  name: string;
  description?: string;
  level: string;
  cardType: string;
  merchantId: string;
  createdAt: Date;
  merchant?: Merchant;
  updatedAt: string;
}

export interface ICardGroupInput {
  id?: string;
  name: string;
  description: string;
  level: string;
  cardType: string;
  merchantId: string;
}

export enum CardGroupType {
  FLEET = 'fleet',
  GIFT = 'gift',
  LOYALTY = 'loyalty',
}
