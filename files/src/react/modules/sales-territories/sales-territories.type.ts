export type ISalesTerritory = {
  id?: string;
  name: string;
  code: string;
  salesPersonEmail: string;
  merchantTypeId: string;
  enterpriseId: string;
  inUse?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ITerritoryMerchant = {
  id?: string;
  name: string;
  merchantId: string;
};

export enum SalesTerritoryModalMessage {
  CREATE_SUCCESS = 'CREATE_SUCCESS',
  EDIT_SUCCESS = 'EDIT_SUCCESS',
  DELETE_SUCCESS = 'DELETE_SUCCESS',
  DELETE_ERROR = 'DELETE_ERROR',
  IMPORT_SUCCESS = 'IMPORT_SUCCESS',
  TRANSFER_SUCCESS = 'TRANSFER_SUCCESS',
  ADD_SUCCESS = 'ADD_SUCCESS',
}

interface IRequest {
  perPage?: number;
  page?: number;
}

export interface ISearchMerchantRequest extends IRequest {
  searchText?: string;
  merchantTypeId?: string;
}
