import {environment} from 'src/environments/environment';
import {apiClient, filterEmptyString} from 'src/react/lib/ajax';
import {TOTAL_COUNT_HEADER_NAME} from 'src/react/services/service.type';
import {
  IHourlyTransactionFile,
  ITerminalSwitchHourlyTransactionFileFilter,
} from './terminal-switch-hourly-transaction-file.type';

const terminalSwitchHourlyTnxAdminBaseUrl = `${environment.terminalSwitchApiBaseUrl}/api/terminal-switch/admin`;

export const getHourlyTransactionFile = async (
  filter: ITerminalSwitchHourlyTransactionFileFilter,
) => {
  try {
    const result = await apiClient.get<IHourlyTransactionFile[]>(
      `${terminalSwitchHourlyTnxAdminBaseUrl}/hourly-transaction-files`,
      {
        params: filterEmptyString(filter),
      },
    );
    const {data: hourlyTnxFiles, headers} = result;
    return {
      hourlyTnxFiles,
      total: headers[TOTAL_COUNT_HEADER_NAME],
    };
  } catch (e) {
    return {
      hourlyTnxFiles: [],
      total: 0,
    };
  }
};

export const generateSignedS3ObjectKey = async (keys: string[]): Promise<string[]> => {
  try {
    const result = await apiClient.post<{temporaryS3Links: string[]}>(
      `${terminalSwitchHourlyTnxAdminBaseUrl}/s3/gen-temp-s3-links`,
      {
        s3ObjectKeys: keys,
      },
    );
    return result.data.temporaryS3Links;
  } catch (e) {
    return [];
  }
};

export const getHourlyTransactionDetail = async (id: string) => {
  try {
    const result = await apiClient.get<IHourlyTransactionFile>(
      `${terminalSwitchHourlyTnxAdminBaseUrl}/hourly-transaction-files/${id}`,
    );
    const {data: hourlyTnxDetail, headers} = result;
    return {
      hourlyTnxDetail,
      total: headers[TOTAL_COUNT_HEADER_NAME],
    };
  } catch (e) {
    return {
      hourlyTnxDetail: {
        hours: [],
      } as IHourlyTransactionFile,
      total: 0,
    };
  }
};

export const generateHourlyTransactionFile = async (params: {
  year: number;
  month: number;
  date: number;
  hour: number;
}) => {
  try {
    await apiClient.post(
      `${terminalSwitchHourlyTnxAdminBaseUrl}/hourly-transaction-files`,
      {},
      {
        params: filterEmptyString(params),
      },
    );
  } catch (e) {}
};
