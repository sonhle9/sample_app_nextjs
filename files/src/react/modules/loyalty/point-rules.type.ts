export type OptionData<T> = {
  type?: 'option';
  value: T;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export enum TargetType {
  CURRENCY = 'currency',
  LOYALTY_POINT = 'loyalty_point',
}

export enum Sources {
  MESRA = 'mesra',
  LITRE = 'litre',
  MYR = 'myr',
  AIRASIA_BIG = 'aa_big_points',
}

export const SourcesName = new Map<Sources, string>([
  [Sources.MESRA, 'Mesra'],
  [Sources.LITRE, 'Fuel'],
  [Sources.MYR, 'Currency'],
  [Sources.AIRASIA_BIG, 'Air Asia'],
]);

export enum Target {
  MYR = 'myr',
  MESRA = 'mesra',
}

export const TargetName = new Map<Target, string>([
  [Target.MYR, 'Currency'],
  [Target.MESRA, 'Mesra'],
]);

export enum Statuses {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

export enum SourcesType {
  LOYALTY_POINT = 'loyalty_point',
  CURRENCY = 'currency',
  FUEL_VOLUME = 'fuel_volume',
}

export const SourcesTypeName = new Map<SourcesType, OptionData<SourcesType>>([
  [SourcesType.LOYALTY_POINT, {label: 'Loyalty point earnings', value: SourcesType.LOYALTY_POINT}],
  [SourcesType.CURRENCY, {label: 'Currency earnings', value: SourcesType.CURRENCY}],
  [SourcesType.FUEL_VOLUME, {label: 'Fuel earnings', value: SourcesType.FUEL_VOLUME}],
]);

export enum OperationType {
  EARN = 'earn',
  REDEMPTION = 'redemption',
}

export enum Unit {
  MONEY = 'money',
  VOLUME = 'volume',
}

export enum ExpiryType {
  HARD = 'hard',
  ROLLING = 'rolling',
}

export type PointRules = {
  id: string;
  operationType: OperationType;
  title: string;
  priority: number;
  sourceType: SourcesType;
  source: Sources;
  targetType: TargetType;
  target: Target;
  ratio: number;
  status: Statuses;
  loyaltyCategory?: string[];
  cardCategory?: string[];
  unit?: Unit;
  startAt?: Date;
  expireAt?: Date;
  remarks?: string;
  merchantId?: string;
};

export type ExpireAfter = {
  months?: number;
  days?: number;
};

export type PointRulesExpiries = {
  id: string;
  title?: string;
  operationType: OperationType;
  status: Statuses;
  cardCategory?: string[];
  source?: Sources;
  target?: Target;
  sourceType: SourcesType;
  expiryType: ExpiryType;
  expireAfter: ExpireAfter;
  remarks?: string;
  startAt?: string;
  expireAt?: string;
  deletedAt?: string;
};

export type PointRulesExpiriesParams = Partial<Omit<PointRulesExpiries, 'id'>>;

export type LoyaltyCategory = {
  categoryCode: string;
  categoryName: string;
  categoryDescription?: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export enum CategoryType {
  CATEGORY_NAME = 'categoryName',
  CODE = 'categoryCode',
}
