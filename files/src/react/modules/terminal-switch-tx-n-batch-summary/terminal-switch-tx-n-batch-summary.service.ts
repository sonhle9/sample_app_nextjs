import _ from 'lodash';
import {environment} from 'src/environments/environment';
import {apiClient, filterEmptyString, getData} from 'src/react/lib/ajax';
import {downloadFile, formatUrlWithQuery} from 'src/react/lib/utils';
import {TOTAL_COUNT_HEADER_NAME} from 'src/react/services/service.type';
import {
  ITxNBatchSummaryResponseDto,
  ITxNBatchSummaryFilterDto,
} from './terminal-switch-tx-n-batch-summary.type';

export const terminalSwitchTxNBatchSummaryBaseUrl = `${environment.terminalSwitchApiBaseUrl}/api/terminal-switch/admin`;

export const getTxNBatchSummary = async (filter: ITxNBatchSummaryFilterDto) => {
  try {
    const result = await apiClient.get<ITxNBatchSummaryResponseDto[]>(
      `${terminalSwitchTxNBatchSummaryBaseUrl}/transaction-n-batch-summaries`,
      {
        params: filterEmptyString(filter),
      },
    );
    const {data: txNBatchSummary, headers} = result;
    return {
      txNBatchSummary,
      total: headers[TOTAL_COUNT_HEADER_NAME],
    };
  } catch (e) {
    return {
      txNBatchSummary: [],
      total: 0,
    };
  }
};

export const downloadTerminalSwitchTxNBatchSummary = async (filter: ITxNBatchSummaryFilterDto) => {
  const genDownloadSession = `${terminalSwitchTxNBatchSummaryBaseUrl}/transaction-n-batch-summaries/downloads`;
  const queryParams = _.mapValues(_.pickBy(filter, _.identity));
  const {data} = await apiClient.post<{id: string}>(genDownloadSession);
  const downloadUrl = formatUrlWithQuery(
    `${terminalSwitchTxNBatchSummaryBaseUrl}/transaction-n-batch-summaries/downloads/${data.id}`,
    queryParams as Record<string, string | string[]>,
  );
  const csvData = await getData<string>(downloadUrl, {
    responseType: 'blob' as 'json',
    headers: {
      accept: 'text/csv',
    },
  });
  return downloadFile(csvData, 'terminal-switch-tx-n-batch-summary.csv');
};

export const sentTerminalTxNBatchSummaryBatchesViaEmail = (
  emails: string[],
  filter: ITxNBatchSummaryFilterDto,
) => {
  const queryParams = _.mapValues(_.pickBy(filter, _.identity));
  const url = `${terminalSwitchTxNBatchSummaryBaseUrl}/transaction-n-batch-summaries/send-email`;
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
