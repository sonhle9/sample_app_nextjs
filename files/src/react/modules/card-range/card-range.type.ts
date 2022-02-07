import {EType} from 'src/shared/enums/card.enum';

interface IRequest {
  perPage?: number;
  page?: number;
  sortDate?: 'asc' | 'desc';
}

export interface ICardRangesRequest extends IRequest {
  id?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  type?: EType;
}

export interface ICardRange {
  id: string;
  type: string;
  name: string;
  description?: string;
  startNumber: string;
  currentNumber?: string;
  endNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICardRangeInput {
  id: string;
  type?: string;
  name?: string;
  description: string;
  startNumber?: string;
  currentNumber?: string;
  endNumber: string;
}

export interface ICardRangeInputCurrentNumber {
  id: string;
  description: string;
  endNumber: string;
}

export const FilterByMap = [
  {label: 'Fleet', value: EType.FLEET},
  {label: 'Loyalty', value: EType.LOYALTY},
  {label: 'Gift', value: EType.GIFT},
];
