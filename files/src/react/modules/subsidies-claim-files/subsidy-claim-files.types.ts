import {IPaginationParam} from '../../lib/ajax';
export type SubsidyClaimFile = {
  id?: string;
  claimFileTime: string;
  createdAt: Date;
};

export interface ISubsidyClaimFileParams extends IPaginationParam {}
