import {environment} from 'src/environments/environment';
import {apiClient, filterEmptyString} from 'src/react/lib/ajax';
import {TOTAL_COUNT_HEADER_NAME} from 'src/react/services/service.type';
import {IInvalidRequestFilterDto, IFailedLogResponseDto} from './terminal-switch-failed-logs.type';

const terminalSwitchTransactionFailedLogsUrl = `${environment.terminalSwitchApiBaseUrl}/api/terminal-switch/admin/failed-logs`;

export const getTerminalSwitchFailedLogs = async (
  filter: IInvalidRequestFilterDto,
): Promise<{
  failedLogs: IFailedLogResponseDto[];
  total: number;
}> => {
  try {
    const result = await apiClient.get<IFailedLogResponseDto[]>(
      terminalSwitchTransactionFailedLogsUrl,
      {
        params: filterEmptyString(filter),
      },
    );
    const {data: failedLogs, headers} = result;
    return {
      failedLogs,
      total: headers[TOTAL_COUNT_HEADER_NAME],
    };
  } catch (e) {
    return {
      failedLogs: [],
      total: 0,
    };
  }
};

export const getTerminalSwitchFailedLogsDetail = async ({failedLogId}: {failedLogId: string}) => {
  const result = await apiClient.get<IFailedLogResponseDto>(
    `${terminalSwitchTransactionFailedLogsUrl}/${failedLogId}`,
  );
  return result.data;
};
