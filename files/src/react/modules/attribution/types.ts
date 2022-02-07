export enum AttributionRuleType {
  ACCOUNT_REGISTRATION = 'account_registration',
}

export enum AttributionRuleReferenceSource {
  REFERRER_CODE = 'referrer_code',
  REWARD_CAMPAIGN = 'reward_campaign',
  VOUCHER_BATCH = 'voucher_batch',
}

export enum AttributionRuleMetadata {
  NETWORK = 'account_attribution_register_network',
  CHANNEL = 'account_attribution_register_channel',
  CAMPAIGN = 'account_attribution_register_campaign',
}

export interface IAttributionRule {
  type: string;
  referenceSource: string;
  referenceId: string;
  metadata: {
    key: AttributionRuleMetadata;
    value: string;
  }[];
}

export type IAttributeRuleReadOnly = {
  readonly [P in keyof IAttributionRule]: IAttributionRule[P];
} & {
  readonly createdAt?: string;
};

export interface IAttributeFilter {
  searchQuery?: string;
  type?: string;
  referenceSource?: string;
}

export interface IAttributeCsvUploadResponse {
  rulesCreated: number;
  timeTakenInSecond: number;
}

export interface IAttributeError {
  statusCode: number;
  error: string;
  message: string;
}
