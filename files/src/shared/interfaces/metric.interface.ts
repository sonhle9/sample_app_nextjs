export interface IWeeklyMetric {
  cw: number;
  cwMinusOne: number;
  mtd: number;
  lmtd: number;
  ytd: number;
}

export interface IMetrics {
  totalUsersRegistered: IWeeklyMetric;
  totalUsersPurchasedFuel: IWeeklyMetric;
  totalFuelOrderCount: IWeeklyMetric;
  totalFuelOrderValue: IWeeklyMetric;
  totalUsersTopup: IWeeklyMetric;
  totalTopupValue: IWeeklyMetric;
  totalRepeatUsersPurchasedFuel: IWeeklyMetric;
}

export interface IDateRange {
  from: Date;
  to: Date;
}

export interface IDateIntervals {
  cw: IDateRange;
  cwMinusOne: IDateRange;
  mtd: IDateRange;
  lmtd: IDateRange;
  ytd: IDateRange;
}

export interface IMetricRport {
  metrics: IMetrics;
  dateIntervals: IDateIntervals;
}
