import {LOCALES, UNLOCK_BY} from './badge-campaigns.const';
import {IPeriod} from 'src/shared/interfaces/reward.interface';

export type IUnlockBy = typeof UNLOCK_BY[number];
export type ILocale = typeof LOCALES[number];
export type I18nString = {[key in ILocale]: string};

export type BadgeAction = {
  link: string;
  webLink: string;
  title: I18nString;
};

interface IRequest {
  perPage?: number;
  page?: number;
  sortDate?: 'asc' | 'desc';
}

export interface IBadgeGroupSearchRequest extends IRequest {
  name?: string;
}

export interface IUserBadgesSearchRequest extends IRequest {
  userId: string;
}

export interface IBadgeListSearchRequest extends IRequest {
  fromDate: string;
  toDate: string;
  status: IBadgeStatus;
  all?: string;
  badgeName?: string;
  campaignName?: string;
  tags?: string;
}

interface IBadgeGroup {
  score: number;
  status: 'VISIBLE' | 'HIDDEN';
  totalBadgeCampaigns: number;
  badges: IBadge[];
}

// GET /badges-groups
export interface IBadgeGroupInList extends IBadgeGroup {
  id: string;
  name: string;
  description: string;
  action?: {
    link: string;
    webLink: string;
    title: string;
  };
}

// GET /badges-groups/:id, POST / PUT payload
export interface IBadgeGroupInDetails extends IBadgeGroup {
  _id: string;
  name: I18nString;
  description: I18nString;
  action?: {
    link: string;
    webLink: string;
    title: I18nString;
  };
}

export type IBadgeCategory = 'OPT_IN' | 'TARGETED' | 'ENROLLMENT';
export type IBadgeProgression =
  | 'Single Badge'
  | 'Series Badge'
  | 'Recurring Badge'
  | 'Periodic Badge';

export type IBadgeStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface IBadgeGalleryIcon {
  id: string;
  filename: string;
  originalname: string;
  s3Url: string;
  key: string;
  byteSize: number;
  contentType: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBadgeIconGalleryPayload {
  status: UserBadgeStatus;
  filename?: string;
  sort?: string;
}

export interface IBadge {
  id: string;
  name: string;
  content: IBadgeContent;
  totalBadgeUnlocked: number;
  availabilityStatus: IBadgeStatus;
  createdAt: string;
  updatedAt: string;
  campaign?: {name: string};
  group: IBadgeGroupInDetails;
  progressionType: IBadgeProgression;
  recurringMaxLimit: number;
  category: IBadgeCategory;
  startDate: string;
  period: IPeriod;
  grantsCampaigns: Array<string>;
  dependsOnCampaign?: string;
  hidePreviousVirtualPeriod?: boolean;
  hideVirtual?: boolean;
}

type IBadgeContent = {
  title?: string | I18nString;
  summary?: string | I18nString;
  action?: BadgeAction;
  campaignProgress?: {sectionTitle: I18nString};
  iconUrls?: Record<UserBadgeStatus, string>;
  benefits?: {
    sectionTitle?: I18nString;
    items?: Array<{
      title: I18nString;
      subtitle?: I18nString;
    }>;
  };
  termsAndConditions?: {
    sectionTitle?: I18nString;
    items?: Array<{value: I18nString}>;
  };
  // Instructions
  verification?: {
    sectionTitle: I18nString; // Header
    title: I18nString; // Section description
    openButtonText: I18nString; // Verify/CTA
    form: {
      title: I18nString;
      submitButtonText: I18nString;
      fields: Array<IBadgeVerificationFormField>;
      onSubmitText: I18nString;
    };
    statusMessageMap: {
      SUBMITTED: I18nString;
      REJECTED: I18nString;
    };
  };
  rewardInfo?: {
    sectionTitle?: I18nString;
    items?: Array<{
      title: I18nString;
      subtitle: I18nString;
      imageUrl?: string;
      action?: {
        LOCKED: {
          title: I18nString;
          webLink: string;
          deepLink: string;
        };
        UNLOCKED: {
          title: I18nString;
          webLink: string;
          deepLink: string;
        };
      };
    }>;
  };
  badgeEnrollment?: {
    sectionTitle: I18nString;
    description?: I18nString;
    action: {
      displayText: I18nString;
      deepLink?: string;
      webLink?: string;
    };
  };
};

export type IBadgeVerificationFormField = {
  key: string;
  type: 'TEXT' | 'IMAGE';
  name: I18nString;
  description: I18nString;
  sampleImageUrl: string;
  sampleImageDescription: I18nString;
  hint: I18nString;
};

export interface ICreateBadgePayload
  extends Pick<IBadge, 'name' | 'group' | 'category' | 'startDate'> {
  tags: string[];
  period?: IBadge['period'];
  recurringMaxLimit?: IBadge['recurringMaxLimit'];
  hidePreviousVirtualPeriod?: IBadge['hidePreviousVirtualPeriod'];
  hideVirtual?: IBadge['hideVirtual'];
}

export interface IUpdateBadgePayload extends Pick<IBadge, 'id'> {
  group?: IBadge['group'];
  startDate?: IBadge['startDate'];
  tags?: string[];
  name?: IBadge['name'];
  availabilityStatus?: IBadge['availabilityStatus'];
  content?: IBadge['content'];
  dependsOnCampaign?: IBadge['dependsOnCampaign'];
  grantsCampaigns?: IBadge['grantsCampaigns'];
  hidePreviousVirtualPeriod?: IBadge['hidePreviousVirtualPeriod'];
  hideVirtual?: IBadge['hideVirtual'];
}

export type UserBadgeStatus = 'LOCKED' | 'UNLOCKED' | 'IN_PROGRESS';
export interface IUserBadge {
  id: string;
  content: {title: string};
  status: UserBadgeStatus;
  badge?: {name: string};
  createdAt: string;
  unlockedAt: string;
  campaign?: {name: string};
  goals: Array<{_id: string; title: string}>;
  category: IBadgeCategory;
  periodIndex: number;
  recurringIndex: number;
}
