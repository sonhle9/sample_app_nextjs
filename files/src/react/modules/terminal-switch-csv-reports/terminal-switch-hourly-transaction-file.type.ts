export interface ITerminalSwitchHourlyTransactionFileFilter {
  from?: string;
  to?: string;
  page?: number;
  perPage?: number;
  startIndex?: number;
  endIndex?: number;
}

export interface IHourlyRecord {
  hour: number;
  s3ObjectKey: string;
  isGenerated: boolean;
  generatedAt?: Date;
  soonestAvailableAt: Date;
}

export interface IHourlyTransactionFile {
  id: string;
  date: Date;
  hours: IHourlyRecord[];
  createdAt: Date;
}

export enum SelectMonthRangeType {
  ALL_YEAR = 'All_YEAR',
  THIS_YEAR = 'THIS_YEAR',
  LAST_YEAR = 'LAST_YEAR',
  CUSTOM_DATE = 'CUSTOM_DATE',
}
