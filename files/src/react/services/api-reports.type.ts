import {
  OnDemandReportMappingType,
  SnapshotReportEveryPeriod,
  SnapshotReportScheduleType,
} from './api-reports.enum';

export type HolisticsColumnTypes = 'auto' | 'string' | 'number' | 'date' | 'timestamp';

export type HolisticsColumnOption = {
  number_format: string;
  date_format: string;
  string_format: string;
  name: string;
};

export type ReportData = {
  status: 'success';
  seconds_taken: number;
  values: Array<Array<string | number>>;
  orig_fiels: string[];
  final_fields: string[];
  orig_column_types: HolisticsColumnTypes[];
  final_column_types: HolisticsColumnTypes[];
  orig_column_options: HolisticsColumnOption[];
  final_column_options: HolisticsColumnOption[];
  record_count: number;
  is_single_value: boolean;
  title: string;
  settings: {
    column_options: Array<{
      name: string;
    }>;
  };
  paginated: {
    record_count: number;
    page: number;
    num_pages: number;
    page_size: number;
  };
  job_id: number;
  url: string;
  can_crud: boolean;
  data_source_name: string;
  owner_name: string;
};

export enum ReportDestination {
  WEB_ADMIN = 'web-admin',
  WEB_DASHBOARD = 'web-dashboard',
  EMAIL = 'email',
}

export interface IOnDemandReportConfig {
  id: string;
  createdAt: string;
  updatedAt: string;
  reportName: string;
  reportDescription: string;
  reportMappings: ReportMapping[];
  url: string;
  permissions: string[];
  category: string;
  destination: ReportDestination;
  icon?: string;
}

export type ReportMapping = {
  reportId: string;
  exportOnly: boolean;
  mappingType: OnDemandReportMappingType;
  prefilter: {
    [prop: string]: string;
  };
};

export type OnDemandReportData = Omit<IOnDemandReportConfig, 'id' | 'createdAt' | 'updatedAt'>;

export interface ISnapshotReportConfig {
  reportName: string;
  reportId: string;
  folderName: string;
  fileNamePattern: string;
  schedule: ISnapshotReportSchedule;
  prefilter: Record<string, string>;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type SnapshotReportConfigData = Omit<
  ISnapshotReportConfig,
  'id' | 'createdAt' | 'updatedAt'
>;

interface IEveryDayAt {
  hours: number;
  minutes: number;
}

interface IEveryWeekAt {
  weekOfDay: number[]; // 0 is Sunday, 6 is Saturday
  hours: number;
  minutes: number;
}

interface IEveryMonthAt {
  dayOfMonth: number; // 1-31 (not sure the behavior of 29-31 in Holistics as not every month has those)
  hours: number;
  minutes: number;
}

export interface ISnapshotReportSchedule {
  scheduleType: SnapshotReportScheduleType;
  everyPeriod?: SnapshotReportEveryPeriod;
  everyHourAtMinute?: number;
  everyDayAt?: IEveryDayAt;
  everyWeekAt?: IEveryWeekAt;
  everyMonthAt?: IEveryMonthAt;
}

export interface ISnapshotReportData {
  id: string;
  configId: string;
  s3Key: string;
  fileName: string;
  downloadUrl: string;
  enterprise: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISnapshotParams {
  from: string;
  to: string;
}
