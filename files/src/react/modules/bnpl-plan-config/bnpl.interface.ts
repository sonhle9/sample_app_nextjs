import {IPaginationParam} from 'src/react/lib/ajax';
import {Currency, Country, PlanStatus, PlanStructure, PlanType} from './bnpl.enum';

export interface IPlan {
  id?: string;
  name: string;
  instructionInterval: PlanType;
  country: Country;
  currencyCode: Currency;
  instructionQuantities: number[] | string[];
  status: PlanStatus;
  minAmount: number;
  maxAmount: number;
  expiredDate: string;
  effectiveDate?: string;
  interestFee?: number;
  latePaymentFee?: number;
  planStructure?: PlanStructure;
}

export interface IPlanIndexParams {
  status?: PlanStatus;
  planType?: PlanType;
  country?: Country;
  currency?: Currency;
  planStructure?: PlanStructure;
  amount?: any;
  search?: string;
}

export interface IGetPlanConfigOverLapping {
  minAmount?: number;
  maxAmount: number;
  effectiveDate: string;
  expiredDate: string;
}
export interface IUpdatePlanStatus {
  id: string;
  data: PlanStatus;
}
export interface ICreateBnplPlan {
  plan: IPlan;
  approvedOverlap?: boolean;
}

export interface GetBnplPlanOptions extends IPaginationParam, IPlanIndexParams {}
