export enum MemberReferrerType {
  member = 'member',
  promoter = 'promoter',
  campaign = 'campaign',
}

export interface IMemberReferralStat {
  registered: number;
  purchased: number;
}

export interface IMember {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  referrerId: string;
  referrerType: MemberReferrerType;
  referrerCode: string;
  referralCode: string;
  previousReferralCode: string;
  referralStat: IMemberReferralStat;
}

export interface IActionFirstDate {
  type: ActionTypesEnum;
  date: Date;
}

export interface IMemberWithActionsDate {
  name: string;
  actionsFirstDate: IActionFirstDate;
}

export interface IBaseMemberUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface IChangesMeta {
  createdBy: string;
  updatedBy: string;
}

export interface ITimestamps {
  createdAt: string;
  updatedAt: string;
}

export interface IReferral extends IBaseMemberUser {
  fuelPurchased: boolean;
}

export interface IReferrer extends IBaseMemberUser {
  referralCode: string;
}

export interface IReward {
  id: string;
  _id?: string;
  memberId: string;
  referenceId: string;
  goalId: string;
  isGranted?: boolean;
  amount: number;
  type: string;
  title: string;
  grantFailureReason?: string;
  grantAttempts?: number;
  lastAttemptedToGrantAt?: string;
}

export interface IRule extends ITimestamps, IChangesMeta {
  id: string;
  conditions: any[];
  consequences: any[];
  name: string;
  description: string;
  isActive: boolean;
}

export enum GoalStatusesEnum {
  active = 'active',
  exhausted = 'exhausted',
  expired = 'expired',
  completed = 'completed',
}

export interface IGoal extends ITimestamps, IChangesMeta {
  id: string;
  ruleId: string;
  campaignId: string;
  memberId: string;
  endDate: string;
  status?: GoalStatusesEnum;
}

export interface ICriteria extends ITimestamps {
  goalId: string;
  current: number;
  target: number;
  index: number;
  description?: string;
}

export interface IGoalWithRelations extends IGoal {
  campaign: IGoalCampaign;
  rule: IRule;
  rewards: IReward[];
  criteria: ICriteria[];
  title: string;
  description: string;
  member: any;
  actions?: IAction[];
}

export type IGoalDetails = {
  title: string;
  campaign: string;
  memberInfo: {
    userId: string;
  };
  criteria: Array<{
    _id: string;
    description: string;
    current: number;
    target: number;
  }>;
  rewards: Array<{
    _id: string;
    type: string;
    amount: number;
    lastAttemptedToGrantAt: string;
    isGranted: boolean;
    grantFailureReason: string;
  }>;
  actions: Array<{
    _id: string;
    type: string;
    amount: number;
    createdAt: string;
    relatedDocumentId: string;
  }>;
};

export interface IGoalCampaign extends ITimestamps, IChangesMeta {
  id: string;
  isActive: boolean;
  name: string;
  description: string;
  origin: string;
  rewardType: string;
  startDate: string;
  endDate: string;
}

export enum ActionTypesEnum {
  topup = 'topup',
  order = 'order',
  friend = 'friend',
  externalOrder = 'external_order',
  //   storeOrder = 'store_order',
  //   conciergeOrder = 'concierge_order',
  //   reward = 'reward',
  //   rewardCapped = 'reward_capped',
  //   createWallet = 'createWallet',
  //   setLoyaltyCard = 'setLoyaltyCard',
  //   setAutoTopup = 'setAutoTopup',
  //   activatePointRedemption = 'activatePointRedemption',
  //   earn_setel_points = 'earn_setel_points',
  //   earn_vendor_points = 'earn_vendor_points',
}

export interface IAction {
  _id?: string;
  userId: string;
  type: ActionTypesEnum;
  relatedDocumentId: string;
  amount: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
}

export interface IGoalWithCampaign<T = IGoalCampaign> extends IGoal {
  campaign: T;
}

export interface IRewardWithGoal<T = IGoalWithCampaign> extends IReward {
  goal: T;
}

export interface ILeaderboardResponse {
  total: number;
  data: any[];
}

const criteriaTypes = [
  'fuel_total',
  'fuel_count',
  'topup_total',
  'topup_count',
  'redeem_points_count',
  'redeem_points_total',
  'friend',
  'remaining_time',
  'create_wallet',
  'set_loyalty_card',
  'set_auto_topup',
  'activate_point_redemption',
  'quota',
  'max_reward_amount',
  'max_reward_total',
  'hybrid',
  'none',
  'deal_redemption_total',
  'deal_redemption_count',
  'e_kyc_completion',
  'cardterus_transaction_total',
  'cardterus_transaction_count',
  'cardterus_linked',
  'create_circle_group',
  'create_or_join_circle_group',
  'join_circle_group',
  'circle_member_count',
] as const;
export type CriteriaType = typeof criteriaTypes[number];

export const topUpMethodsTypes = [
  'debitAndCreditCard',
  'registrationVoucher',
  'topupVoucher',
] as const;
export type TopUpMethodsType = typeof topUpMethodsTypes[number];

export const dependencyActionTypes = [
  'concierge_order_total',
  'fuel_total',
  'store_order_total',
  'topup_total',
] as const;
export type DependencyActionType = typeof dependencyActionTypes[number];

export interface ICampaignGoalCriteria {
  type: CriteriaType;
  current: number;
  target: number;
  operator?: 'lte' | 'gte' | 'equal';
  dependency?: {
    singleTransaction: boolean;
    stations?: string;
    fuelType?: string[];
    topUpMethods?: Record<TopUpMethodsType, boolean | null>;
    actionType?: Record<DependencyActionType, boolean>;
    friendThreshold?: number | null;
    enrollment?: boolean;
    voucherBatchId?: string;
  };
  description?: string;
  descriptionLocalized?: string;
  transactionTypes: [];
}

export type ConsequenceType =
  | 'campaign'
  | 'loyaltyPoints'
  | 'percent'
  | 'loyaltyPointsPercent'
  | 'cashback'
  | 'voucher'
  | 'none';

export type ConsequenceExpiryType = 'duration' | 'date' | '';

export interface ICampaignConsequence {
  type: ConsequenceType;
  value: number;
  expiry: {
    type: ConsequenceExpiryType;
    value: number;
  };
  from?: CriteriaType;
  voucherBatchId?: string;
}

export const consequenceExpiryTypeOptions: Array<{
  label: string;
  value: ConsequenceExpiryType;
}> = [
  {label: 'No expiry', value: ''},
  {label: 'Date', value: 'date'},
  {label: 'Duration', value: 'duration'},
];

export const fuelTypes = [
  {label: 'Primax 95', value: 'fuel_primax_95'},
  {label: 'Primax 97', value: 'fuel_primax_97'},
  {label: 'Dynamic Diesel', value: 'fuel_dynamic_diesel'},
  {label: 'Diesel Euro 5', value: 'fuel_euro_5_diesel'},
  {label: 'NGV', value: 'fuel_ngv'},
] as const;

export const transactionTypeOptions = [
  {label: 'Petrol', value: 'multi_fuel_total'},
  {label: 'Top-up', value: 'multi_topup_total'},
  {label: 'In-store', value: 'multi_store_order_total'},
  {label: 'Deliver2me', value: 'multi_concierge_order_total'},
];

export interface ICampaignCode {
  _id?: string;
  code: string;
  status?: 'new' | 'existing' | 'deleted';
  campaign?: string;
  merchantId?: string;
}

export interface ICampaignGoal {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isSequenceGoal: boolean;
  campaignCategory: CampaignCategoryType;
  criteria: ICampaignGoalCriteria[];
  // API can return both array or object:
  consequence: ICampaignConsequence | ICampaignConsequence[];
  multiReward?: boolean;
  groupGoal?: boolean;
  codes: ICampaignCode[];
}

export interface ICampaignTargeting {
  _id?: string;
  filename: string;
  usersId: string[];
  manualGrantingStatus?: 'pending' | 'triggered' | null; // null for legacy data
}

export type CampaignRestrictionType =
  | 'newMember'
  | 'memberReferral'
  | 'withoutPromoCode'
  | 'brazeCustomer'
  | 'hidden'
  | 'birthdayMonth';

export const campaignCategories = ['mission', 'perk', 'achievement'] as const;
export type CampaignCategoryType = typeof campaignCategories[number];

export type PeriodType = 'day' | 'month';
export const periodTypeOptions: Array<{
  label: string;
  value: PeriodType;
}> = [
  {label: 'Custom range', value: 'day'},
  {label: 'Calendar month', value: 'month'},
];

export interface IPeriod {
  type: PeriodType;
  startEvery?: number;
  endEvery?: number;
}

export interface ICampaign {
  _id: string;
  id: string;
  name: string;
  description: string;
  category: CampaignCategoryType;
  restriction: CampaignRestrictionType[];
  codes: ICampaignCode[];
  goals: ICampaignGoal[];
  isActive?: boolean;
  startDate: string;
  endDate?: string;
  metadata?: unknown;
  includeList?: ICampaignTargeting[];
  excludeList?: ICampaignTargeting[];
  disqualifyVoucherBatches?: string[];
  maxMembersCap: number;
  type?: string;
  manualOperation?: boolean;
  period?: IPeriod;
  rejectProgressAfterCampaignEnd: boolean;
  includePastActions: boolean;
  multiGrant: boolean;
}

export interface ICampaignEnum {
  criteria: unknown;
  operator: unknown;
  consequence: unknown;
}

export interface ICampaignCustomer {
  _id: string;
  title: string;
  status: GoalStatusesEnum;
  createdAt: string;
  member: {
    user: {
      id: string;
      fullName: string;
    };
  };
}

export interface IFailedAction {
  _id: string;
  userId: string;
  relatedDocumentId: string;
  amount: number;
  type: string;
  createdAt: string;
  ackUrl: string;
  sentAt: string;
}

export interface IFailedServiceStats {
  service: string;
  data: {
    total: number;
    success: number;
    failed: number;
    successRate: number;
  };
}

export interface IContest {
  _id: string;
  name: string;
  description: string;
  isPublished: boolean;
  campaign: string;
  startDate: string;
  endDate: string;
}
