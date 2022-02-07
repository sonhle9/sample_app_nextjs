import _ from 'lodash';
import {environment} from 'src/environments/environment';
import {apiClient, filterEmptyString, getData} from 'src/react/lib/ajax';
import {downloadFile, formatUrlWithQuery} from 'src/react/lib/utils';
import {TOTAL_COUNT_HEADER_NAME} from 'src/react/services/service.type';
import {
  ForceCloseRequestType,
  IBatchesResponseDto,
  IForceCloseApprovalDto,
  ITerminalSwitchBatchAcquirerCode,
  ITerminalSwitchBatchesFilterDto,
} from './terminal-switch-batches.type';

export const terminalSwitchBatchesBaseUrl = `${environment.terminalSwitchApiBaseUrl}/api/terminal-switch/admin`;

export const getTerminalSwitchBatches = async (filter: ITerminalSwitchBatchesFilterDto) => {
  try {
    const result = await apiClient.get<IBatchesResponseDto[]>(
      `${terminalSwitchBatchesBaseUrl}/batches`,
      {
        params: filterEmptyString(filter),
      },
    );
    const {data: switchBatches, headers} = result;
    return {
      switchBatches,
      total: headers[TOTAL_COUNT_HEADER_NAME],
    };
  } catch (e) {
    return {
      switchBatches: [],
      total: 0,
    };
  }
};

export const getTerminalSwitchAcquirerCode = async (): Promise<
  ITerminalSwitchBatchAcquirerCode[]
> => {
  try {
    const result = await apiClient.get<ITerminalSwitchBatchAcquirerCode[]>(
      `${terminalSwitchBatchesBaseUrl}/batches/acquirer-codes`,
    );
    const {data: acquirerCodes} = result;
    return acquirerCodes;
  } catch (e) {
    return [];
  }
};

export const downloadTerminalSwitchBatches = async (filter: ITerminalSwitchBatchesFilterDto) => {
  const genDownloadSession = `${terminalSwitchBatchesBaseUrl}/batches/downloads`;
  const queryParams = _.mapValues(_.pickBy(filter, _.identity));
  const {data} = await apiClient.post<{id: string}>(genDownloadSession);
  const downloadUrl = formatUrlWithQuery(
    `${terminalSwitchBatchesBaseUrl}/batches/downloads/${data.id}`,
    queryParams as Record<string, string | string[]>,
  );
  const csvData = await getData<string>(downloadUrl, {
    responseType: 'blob' as 'json',
    headers: {
      accept: 'text/csv',
    },
  });
  return downloadFile(csvData, 'terminal-switch-batches.csv');
};

export const sentTerminalSwitchBatchesViaEmail = (
  emails: string[],
  filter: ITerminalSwitchBatchesFilterDto,
) => {
  const queryParams = _.mapValues(_.pickBy(filter, _.identity));
  const url = `${terminalSwitchBatchesBaseUrl}/batches/send-email`;
  return apiClient.post(
    url,
    {
      emails,
    },
    {
      params: queryParams,
    },
  );
};

export const getTerminalSwitchBatchDetail = async ({batchId}: {batchId: string}) => {
  const result = await apiClient.get<IBatchesResponseDto>(
    `${terminalSwitchBatchesBaseUrl}/batches/${batchId}`,
  );
  return result.data;
};

export const sentForceCloseRequest = async ({
  batchId,
  request,
  type,
}: {
  batchId: string;
  request: IForceCloseApprovalDto;
  type: ForceCloseRequestType;
}) => {
  const result = await apiClient.post<IBatchesResponseDto>(
    `${terminalSwitchBatchesBaseUrl}/batches/${batchId}/force-close/${type}`,
    request,
  );
  return result.data;
};
