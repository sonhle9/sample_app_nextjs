import {IPaginationParam} from '../../lib/ajax';
export type SubsidyRate = {
  id?: string;
  rate: string;
  startDate: Date;
  endDate: Date;
  createdBy?: string;
  createdAt?: Date;
};

export type SubsidyRateOverview = {
  id: string;
  rate: number;
  startDate: Date;
};

export interface ISubsidyRateParams extends IPaginationParam {
  type?: string;
}
