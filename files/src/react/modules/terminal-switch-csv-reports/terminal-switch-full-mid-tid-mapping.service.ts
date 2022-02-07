import {environment} from 'src/environments/environment';
import {apiClient, filterEmptyString} from 'src/react/lib/ajax';
import {TOTAL_COUNT_HEADER_NAME} from 'src/react/services/service.type';
import {
  IFullMidTidMappingFilter,
  IFullMidTidMappingReportResponse,
} from './terminal-switch-full-mid-tid-mapping.type';

const legacyTerminalFullMidTidReportBaseUrl = `${environment.terminalAPIBaseUrl}/api/legacy-terminals`;

export const getFullMidTidMapping = async (filter: IFullMidTidMappingFilter) => {
  try {
    const result = await apiClient.get<IFullMidTidMappingReportResponse[]>(
      `${legacyTerminalFullMidTidReportBaseUrl}/admin/full-mid-tid-mapping-reports`,
      {
        params: filterEmptyString(filter),
      },
    );
    const {data: fullMidTidReports, headers} = result;
    return {
      fullMidTidReports,
      total: headers[TOTAL_COUNT_HEADER_NAME],
    };
  } catch (e) {
    return {
      fullMidTidReports: [],
      total: 0,
    };
  }
};

export const generateSignedLinkS3FullMidTidMappingReportFile = async (
  keys: string[],
): Promise<string[]> => {
  try {
    const result = await apiClient.post<{temporaryS3Links: string[]}>(
      `${legacyTerminalFullMidTidReportBaseUrl}/admin/s3/gen-temp-s3-links`,
      {
        s3ObjectKeys: keys,
      },
    );
    return result.data.temporaryS3Links;
  } catch (e) {
    return [];
  }
};

export const generateFullMidTidReport = async (params: {month: number; year: number}) => {
  try {
    await apiClient.post(
      `${legacyTerminalFullMidTidReportBaseUrl}/admin/full-mid-tid-mapping-reports`,
      {},
      {
        params: filterEmptyString(params),
      },
    );
  } catch (e) {}
};
