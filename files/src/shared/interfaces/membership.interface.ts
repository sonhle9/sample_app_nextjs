export interface ITierRequirement {
  type: string;
  min: number;
  max?: number;
  unitLabel: string;
  titleLabel: string;
}

export interface ITierRequirementProgress {
  type: string;
  value: number;
  unitLabel: string;
  titleLabel: string;
}

export interface ITierPrivileges {
  type: string;
  value: number;
  label: string;
}

export enum MembershipTierTitle {
  JUNIOR = 'Junior',
  EXPLORER = 'Explorer',
  HERO = 'Hero',
}

export interface ITier {
  _id: string;
  level: number;
  title: MembershipTierTitle;
  validity: string | null;
  privileges: ITierPrivileges[];
  requirements: ITierRequirement[];
}

export interface IUserTierProgress {
  _id: string;
  userId: string;
  appliedAt: string;
  expiredAt: string | null;
  currentTier: ITier;
  requirementsProgress: ITierRequirementProgress[];
  currentTierHeader?: string;
  congratulationsMessage?: string;
}

export interface IMembershipAction {
  _id: string;
  type: string;
  amount: number;
  userId: string;
  relatedDocumentId: string;
  createdAt: string;
  updatedAt: string;
}
