import {BadgeProps} from '@setel/portal-ui';
import {IPaginationParam} from '../../lib/ajax';

export enum SubsidyStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  FUTURE = 'FUTURE',
}

export const mappingSubsidyStatusColor: Record<SubsidyStatus, BadgeProps['color']> = {
  [SubsidyStatus.ACTIVE]: 'success',
  [SubsidyStatus.INACTIVE]: 'grey',
  [SubsidyStatus.FUTURE]: 'blue',
};

export const SubsidyPriceTypes = ['Peninsula', 'Sabah', 'Sarawak'];
export const SubsidyCostRecoveryRateTypes = ['PDB', 'Station dealer'];
export enum SubsidyPriceModel {
  Peninsula = 'Peninsula',
  Sabah = 'Sabah',
  Sarawak = 'Sarawak',
}

export enum SubsidyCostRecoveryRateModel {
  PDB = 'PDB',
  station_dealer = 'Station dealer',
}

export const SubsidyPricingModelOptions = [
  {label: 'Peninsula', value: SubsidyPriceModel.Peninsula},
  {label: 'Sabah', value: SubsidyPriceModel.Sabah},
  {label: 'Sarawak', value: SubsidyPriceModel.Sarawak},
];

export const SubsidyCostRecoveryRateModelOptions = [
  {label: 'PDB', value: SubsidyCostRecoveryRateModel.PDB},
  {label: 'Station dealer', value: SubsidyCostRecoveryRateModel.station_dealer},
];

export const SubsidyOverviewTitle = [
  {id: 'Peninsula', title: 'Peninsula subsidy price'},
  {id: 'Sabah', title: 'Sabah subsidy price'},
  {id: 'Sarawak', title: 'Sarawak subsidy price'},
  {id: 'PDB', title: 'PDB cost recovery rate'},
  {id: 'Station dealer', title: 'Dealer cost recovery rate'},
];

export enum SubsidyActionType {
  subsidy_price = 'subsidy price',
  cost_recovery_rate = 'cost recovery rate',
}

export type SubsidyPrice = {
  id?: string;
  price: string;
  startDate: Date;
  endDate: Date;
  createdBy?: string;
  createdAt?: Date;
  status?: SubsidyStatus;
};

export type SubsidyCostRecoveryRate = {
  id?: string;
  rate: string;
  startDate: Date;
  endDate: Date;
  createdBy?: string;
  createdAt?: Date;
  status?: SubsidyStatus;
};

export type SubsidyMaintenanceOverview = {
  id: string;
  amount: number;
  startDate: Date;
};

export interface ISubsidyPriceParams extends IPaginationParam {
  area?: string;
}

export interface ISubsidyCostRecoveryRateParams extends IPaginationParam {
  type?: string;
}

export const fieldClasses = 'p-2 sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start';
export const labelClasses = 'mt-2 mr-5';
export const fieldRequiredMessage = 'This field is required';
export const TITLE_SUCCESSFUL = 'Successful!';
export const ceilingNumber = 9999.9999;
export const confirmationDescriptionPrice =
  'The previous subsidy price of the same subsidy area will be set to end one day before this subsidy price starts.';
export const confirmationDescriptionCostRecoveryRate =
  'The previous cost recovery rate of the same cost recovery type will be set to end one day before this cost recovery rate starts.';
export const CURRENT_TIME_HEADER_NAME = 'x-current-time';
