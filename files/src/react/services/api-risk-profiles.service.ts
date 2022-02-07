import {environment} from 'src/environments/environment';
import {ajax, fetchPaginatedData, filterEmptyString, IPaginationParam} from '../lib/ajax';

const BASE_URL = `${environment.blacklistApiBaseUrl}/api/risk-profiles`;

interface RiskScoringShortcut {
  value: string;
  description: string;
}

export interface RiskProfile {
  id: string;
  createdAt: string;
  updatedAt: string;
  accountId: string;
  idType: string;
  idNumber: string;
  customerType: RiskScoringShortcut;
  countryOfResident: RiskScoringShortcut;
  nationality: RiskScoringShortcut;
  watchList: RiskScoringShortcut;
  natureOfBusiness: RiskScoringShortcut;
  walletSize: RiskScoringShortcut;
  kyc: RiskScoringShortcut;
  annualTransaction: RiskScoringShortcut;
  checkFor: string;
  remark: string;
  totalScore: number;
  riskRating: string;
  updatedBy: string;
  scoredAt: string;
}

export interface RiskProfileDetails {
  id: string;
  createdAt: string;
  updatedAt: string;
  accountId: string;
  accountName: string;
  idType: string;
  idNumber: string;
  customerType: RiskScoring;
  countryOfResident: RiskScoring;
  nationality?: RiskScoring;
  watchList: RiskScoring;
  natureOfBusiness: RiskScoring;
  walletSize: RiskScoring;
  walletLimit: number;
  kyc: RiskScoring;
  annualTransaction: RiskScoring;
  annualTransactionAmount: number;
  checkFor: string;
  remark: string;
  totalScore: number;
  riskRating: string;
  scoredAt: string;
}

export interface CreateRiskProfile {
  accountId: string;
  typeOfId: string;
  idNumber: string;
  customerType: string;
  countryOfResident?: string;
  nationality?: string;
  watchList: string;
  natureOfBusiness: string;
  checkFor: string;
  remarks: string;
}

export type UpdateRiskProfile = Pick<
  CreateRiskProfile,
  'watchList' | 'natureOfBusiness' | 'checkFor' | 'remarks'
>;

export interface RiskScoring {
  value: string;
  score: number;
  description: string;
}

export interface RiskScoringConfig {
  type: string;
  name: string;
  riskScorings: RiskScoring[];
}

export enum RiskRatingLevel {
  Low = 'LOW',
  Medium = 'MEDIUM',
  High = 'HIGH',
  Blocked = 'BLOCKED',
}

export interface IIndexRiskProfileFilters extends IPaginationParam {
  rating?: RiskRatingLevel;
  endDate?: string;
  startDate?: string;
  identifier?: string;
}

export const indexRiskProfiles = ({perPage, page, ...filter}: IIndexRiskProfileFilters) => {
  return fetchPaginatedData<RiskProfile>(
    `${BASE_URL}/risk-profiles`,
    {perPage, page},
    {params: filterEmptyString(filter)},
  );
};

export const indexRiskProfilesHistories = (id: string, pagination: IIndexRiskProfileFilters) => {
  const {perPage, page} = pagination;
  return fetchPaginatedData<RiskProfile>(`${BASE_URL}/risk-profiles/${id}/histories`, {
    perPage,
    page,
  });
};

export const createRiskProfile = (riskProfileData: CreateRiskProfile): Promise<RiskProfile> =>
  ajax.post<RiskProfile>(`${BASE_URL}/risk-profiles`, riskProfileData).then((res) => res);

export const getCustomerScorings = () =>
  ajax.get<RiskScoringConfig[]>(`${BASE_URL}/risk-scorings`).then((res) => res);

export const getRiskProfileDetails = (riskProfileId: string) =>
  ajax.get<RiskProfileDetails>(`${BASE_URL}/risk-profiles/${riskProfileId}`).then((res) => res);

export const getRiskProfileDetailsByUserId = (userId: string) =>
  indexRiskProfiles({
    perPage: 1,
    page: 1,
    identifier: userId,
  }).then((res) => res.items.find(({accountId}) => accountId === userId));

export const updateRiskProfile = (
  riskProfileId: string,
  riskProfileData: UpdateRiskProfile,
): Promise<void> =>
  ajax.put(`${BASE_URL}/risk-profiles/${riskProfileId}`, riskProfileData).then((res) => res);
