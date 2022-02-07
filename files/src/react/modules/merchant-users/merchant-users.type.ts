import {EnterpriseNameEnum} from '../../../shared/enums/enterprise.enum';

export interface IRequest {
  perPage?: number;
  page?: number;
  sortDate?: 'asc' | 'desc';
}

export interface IMerchantUserRequest extends IRequest {
  name?: string;
  email?: string;
}
export interface IGroupUser {
  id?: string;
  name?: string;
}
export interface IMerchantUser {
  userId?: string;
  name: string;
  email?: string;
  companyId?: string;
  pinCode?: string;
  groups?: IGroupUser[];
  merchants?: IMerchant[];
  relations?: any[];
  attributes?: any;
  access_level?: string;
  isManagerAccess?: boolean;
  identifier?: string;
  enterpriseId?: EnterpriseNameEnum;
  createdAt?: Date;
  updatedAt?: Date;
  merchants_under_company?: string[];
  merchants_orphant?: string[];
  createdOn?: any;
}

export interface IMerchantUserListItem {
  user?: IUser;
  merchants?: IMerchant[];
  relations?: any[];
}

export interface IUpdateMerchantUser {
  userId: string;
  companyId?: string;
  merchantIds?: string[];
}

export interface ICompany {
  id?: string;
  _id?: string;
  name: string;
  manageCatalogue?: string;
  createdAt?: string;
  created_date?: number;
  description?: string;
  merchants?: string[];
  json?: string;
  updatedAt?: string;
}
export interface IMerchant {
  id: string;
  name?: string;
  companyId?: string;
  merchantId?: string;
}

export interface ICompanyRequest extends IRequest {
  keyword?: string;
}
export interface IMerchantRequest extends IRequest {
  companyId?: string;
  name?: string;
}

export interface IMerchantUserResponse {
  user: IUser;
  merchants: IMerchant[];
}

export interface IUser {
  userId: string;
  identifier: string;
  email: string; // similar with email
  name: string;
  attributes?: any;
  companyId?: string;
  namespace: IamNamespaces;
  merchants?: IMerchant[];
  pinCode?: string;
  isManagerAccess: boolean;
  createdAt: string;
}

export enum IamNamespaces {
  SETEL_MERCHANTS = 'setel-merchants',
  SETEL_ADMINS = 'setel-admins',
  PDB_MERCHANTS = 'pdb-merchants',
  PDB_ADMINS = 'pdb-admins',
  SETEL_EXTERNAL_SERVICES = 'setel-external-services',
}

export interface IUserMerchantDetail {
  user: IUser;
  merchants: {
    under: IMerchant[];
    orphan: IMerchant[];
  };
  companyName?: string;
}
