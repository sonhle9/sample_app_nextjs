export enum OnDemandReportCategory {
  NONE = 'NONE',
  TREASURY = 'TREASURY',
  CARD = 'CARD',
  MERCHANT = 'MERCHANT',
  INVOICING = 'INVOICING',
}

export enum OnDemandReportMappingType {
  DEFAULT = 'DEFAULT',
  SUMMARY = 'SUMMARY',
}

export enum SnapshotReportScheduleType {
  EVERY = 'EVERY',
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum SnapshotReportEveryPeriod {
  TenMin = 'TenMin',
  FifteenMin = 'FifteenMin',
  ThirtyMin = 'ThirtyMin',
  OneHour = 'OneHour',
  TwoHour = 'TwoHour',
  ThreeHour = 'ThreeHour',
  SixHour = 'SixHour',
  TwelveHour = 'TwelveHour',
}
