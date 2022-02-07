import {environment} from 'src/environments/environment';
import {IPaginationResponse, IPaginationParams} from 'src/shared/interfaces/core.interface';
import {
  ICampaign,
  ICampaignEnum,
  ICampaignCustomer,
  IFailedAction,
  IFailedServiceStats,
  IGoal,
  IGoalWithRelations,
  IMember,
  IReferral,
  IReferrer,
  IGoalDetails,
} from 'src/shared/interfaces/reward.interface';
import {ajax, filterEmptyString, IPaginationParam} from '../lib/ajax';
import {IUserProfile} from './api-accounts.service';

const BASE_URL = `${environment.rewardsApiBaseUrl}/api/rewards/admin`;
const CAMPAIGNS_URL = `${environment.rewardsApiBaseUrl}/api/rewards/campaigns`;
const MEMBER_BASE_URL = `${BASE_URL}/member`;
const ACTIONS_URL = `${environment.rewardsApiBaseUrl}/api/rewards/actions`;
export const brazeAssignCampaignWebHookUrl = `${environment.apiBaseUrl}/api/rewards/webhook/assign-campaign-goals`;

export interface IListLeaderboardParams extends IPaginationParams {
  tags?: string;
  referralCode?: string;
  referrerCode?: string;
}

export const getRewardMemberInfo = (userId: string) =>
  ajax.get<IMember>(`${MEMBER_BASE_URL}/${userId}`);

export const regenerateReferralCode = (userId: string) =>
  ajax.put<IMember>(`${MEMBER_BASE_URL}/${userId}/regenerate-referral-code`);

export const getReferrals = (userId: string, pagination?: IPaginationParam) =>
  ajax.get<IPaginationResponse<IReferral>>(`${BASE_URL}/users/${userId}/referrals`, {
    params: pagination,
  });

export const getReferrer = (userId: string) =>
  ajax.get<IReferrer>(`${BASE_URL}/users/${userId}/referrer`);

export const addReferrerCode = (userId: string, referrerCode: string) =>
  ajax.put<IMember>(`${MEMBER_BASE_URL}/${userId}/add-referrer-code`, {referrerCode});

export const listMemberGoals = (userId: string, pagination?: IPaginationParam) =>
  ajax.get<IPaginationResponse<IGoalWithRelations>>(`${BASE_URL}/goals`, {
    params: {userId, ...pagination},
  });

const getCampaigns = (params: IPaginationParam) =>
  ajax.get<{data: Array<ICampaign>; total: number}>(CAMPAIGNS_URL, {params});

export const updateCampaign = ({id, campaign}: {id: string; campaign: ICampaign}) =>
  ajax.put<ICampaign>(`${CAMPAIGNS_URL}/${id}`, campaign);

export const createCampaign = (campaign: ICampaign) =>
  ajax.post<ICampaign>(CAMPAIGNS_URL, campaign);

interface IGrantCampaign {
  campaignId: string;
  includeListId: string;
}
export const grantCampaign = ({campaignId, ...params}: IGrantCampaign) =>
  ajax.post(`${CAMPAIGNS_URL}/${campaignId}/grant`, params);

export const getCampaignEnums = () => ajax.get<ICampaignEnum>(`${CAMPAIGNS_URL}/enum-types`);

interface ICampaignListParams extends IPaginationParams {
  fromDate: string;
  toDate: string;
  isActive: string;
  name?: string;
}

export const listCampaigns = async (params: ICampaignListParams) => {
  const [enums, campaignsResponse] = await Promise.all([getCampaignEnums(), getCampaigns(params)]);

  // display user friendly labels of enum types
  campaignsResponse?.data.forEach((campaign) => {
    campaign.goals.forEach((goal) => {
      goal.criteria.forEach((criterion) => {
        criterion.type = enums.criteria[criterion.type];
      });
      if (!Array.isArray(goal.consequence)) {
        goal.consequence.type = enums.consequence[goal.consequence.type];
      }
    });
  });

  return campaignsResponse;
};

interface IListCampaignCustomersPaginationParam extends IPaginationParam {
  id: string;
  createdAtLte: string;
  createdAtGte: string;
}

export const listCampaignCustomers = ({id, ...params}: IListCampaignCustomersPaginationParam) =>
  ajax.get<{
    total: number;
    data: Array<ICampaignCustomer>;
  }>(`${CAMPAIGNS_URL}/${id}/members`, {params});

export const downloadCampaignCustomersCsv = ({
  id,
  ...params
}: IListCampaignCustomersPaginationParam) =>
  ajax.post<string>(`${CAMPAIGNS_URL}/${id}/members/csv`, filterEmptyString(params), {
    params: filterEmptyString(params),
  });

export const getCampaignById = (id: string) => ajax.get<ICampaign>(`${CAMPAIGNS_URL}/${id}`);

export const getCampaignByCode = (code: string) =>
  ajax.get<ICampaign>(`${CAMPAIGNS_URL}/code/${code}`);

export const getFailedStats = (query: {startDate?: string; endDate?: string}) =>
  ajax.get<Array<IFailedServiceStats>>(`${ACTIONS_URL}/failed-stat`, {
    params: filterEmptyString(query),
  });

export const getFailedActions = ({
  service,
  ...query
}: {
  service: string;
  startDate?: string;
  endDate?: string;
}) =>
  ajax.get<Array<IFailedAction>>(`${ACTIONS_URL}/${service}/failed`, {
    params: filterEmptyString(query),
  });

export const retriggerFailedActions = (params: {service: string}) =>
  ajax.post(`${ACTIONS_URL}/re-trigger-failed`, {
    params: filterEmptyString(params),
  });

export const updateGoal = ({id, ...goal}: IGoal) => ajax.put(`${BASE_URL}/goals/${id}`, goal);

export const addCashbakCampaign = (userId: string) =>
  ajax.post<IGoalWithRelations>(`${MEMBER_BASE_URL}/${userId}/goal`);

export const getGoalById = (id: string) => ajax.get<IGoalDetails>(`${BASE_URL}/goals/${id}`);

export const regrantReward = (rewardId: string) =>
  ajax.post(`${BASE_URL}/rewards/${rewardId}/reprocess`);

export const listLeaderboard = (params: IListLeaderboardParams) =>
  ajax.get<ReferralLeaderboardResponse>(`${BASE_URL}/leaderboard`, {
    params: filterEmptyString(params),
  });

export const downloadLeaderboardCsv = (params: IListLeaderboardParams) =>
  ajax.post<string>(`${BASE_URL}/leaderboard/csv`, filterEmptyString(params), {
    params: filterEmptyString(params),
  });
export interface ReferralLeaderboardResponse {
  total: number;
  data: LeaderboardMember[];
}

interface LeaderboardMember extends IMember {
  user: User;
}

interface User {
  id: string;
  profile: IUserProfile;
  email: string;
  emailVerified: boolean;
  createdAt: number;
  enabled: boolean;
  fullName: string;
  userName: string; // phone number
}
