import {
  rebateSettingLevel,
  RebateSettingStatus,
} from '../modules/rebate-setting/rebate-settings.constant';
import {IRequest} from '../modules/merchant-users/merchant-users.type';

export interface IRebateReport {
  processDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  id?: string;
}

export interface IRebateSettingBase {
  planId: number;
  name?: string;
  spId: string;
  level: rebateSettingLevel;
  startDate: Date;
  endDate: Date;
  status?: RebateSettingStatus;
  remarks: string;
  id?: string;
}

export interface IRebatePlansRequest extends IRequest {
  level?: rebateSettingLevel;
  searchSPAccountsCompanies?: string;
  status?: RebateSettingStatus;
  planId?: number;
}

export interface ISearchAccountOrCompanyRequest {
  searchSPAccountsCompanies?: string;
  level: string;
}

export interface IAccountOrCompany {
  id: string;
  code: string;
  name: string;
  latestDate?: Date;
}

export enum rebatePlanTypes {
  AMOUNT = 'Amount',
  VOLUME = 'Volume',
}

export interface IRebatePlan {
  planName: string;
  planId?: number;
  type: rebatePlanTypes;
  loyaltyCategoryIds?: string[];
  isAllLoyaltyCategoryIds?: boolean;
  remarks?: string;
  createdBy?: string;
  updatedBy?: string;
  tiers?: ITierBase[];
  createdAt?: Date;
  updatedAt?: Date;
  id?: string;
}

export interface IEditGeneralRebatePlan {
  planName: string;
  type: rebatePlanTypes;
  loyaltyCategoryIds?: string[];
  isAllLoyaltyCategoryIds?: boolean;
  remarks?: string;
}

export interface IEditTierRebatePlan {
  tiers?: ITierBase[];
}

export interface ITierBase {
  maximumValue: string;
  minimumValue: string;
  basicValue: string;
  billedValue: string;
}

export interface IRebatePlansRequest extends IRequest {
  ids?: string[];
  searchRebatePlan?: string;
}

export interface ILoyaltyCategoryCodes {
  categoryName: string;
  categoryCode: string;
  description: string;
}
export interface IRebatePlanDetailProps {
  planId: string;
}
