export interface IFullMidTidMappingReportResponse {
  id: string;
  scheduleDate: Date;
  isGenerated: boolean;
  generatedAt: Date;
  s3ObjectKey: string;
  fileName: string;
}

export interface IFullMidTidMappingFilter {
  monthFrom?: number;
  yearFrom?: number;
  monthTo?: number;
  yearTo?: number;
  page?: number;
  perPage?: number;
}
