import _ from 'lodash';
import {useQuery} from 'react-query';
import {environment} from 'src/environments/environment';
import {apiClient, filterEmptyString, getData} from 'src/react/lib/ajax';
import {downloadFile, formatUrlWithQuery} from 'src/react/lib/utils';
import {searchMerchantsWithNameOrID} from 'src/react/services/api-merchants.service';
import {IIndexMerchantFilters} from 'src/react/services/api-merchants.type';
import {
  IsPendingSettlementRes,
  ITerminalGetPendingSettlementReq,
} from 'src/react/services/api-terminal.type';
import {TOTAL_COUNT_HEADER_NAME} from 'src/react/services/service.type';
import {
  ITerminalSwitchTransactionalFilterParam,
  ITerminalSwitchTransactionDetailParam,
  ITerminalSwitchTransactionResponseDto,
} from './terminal-switch-transaction.type';

const terminalSwitchTransactionAdminBaseUrl = `${environment.terminalSwitchApiBaseUrl}/api/terminal-switch/admin`;

export const getTransactions = async (filter: ITerminalSwitchTransactionalFilterParam = {}) => {
  try {
    const result = await apiClient.get<ITerminalSwitchTransactionResponseDto[]>(
      `${terminalSwitchTransactionAdminBaseUrl}/transactions`,
      {
        params: filterEmptyString(filter),
      },
    );
    const {data: switchTransactions, headers} = result;
    return {
      switchTransactions,
      total: headers[TOTAL_COUNT_HEADER_NAME],
    };
  } catch (e) {
    return {
      switchTransactions: [],
      total: 0,
    };
  }
};

export const getTerminalSwitchTransactionDetail = async ({
  transactionId,
}: ITerminalSwitchTransactionDetailParam) => {
  const result = await apiClient.get<ITerminalSwitchTransactionResponseDto>(
    `${terminalSwitchTransactionAdminBaseUrl}/transactions/${transactionId}`,
  );
  return result.data;
};

export const downloadTerminalSwitchTransactionCsv = async (
  filter: ITerminalSwitchTransactionalFilterParam,
) => {
  const genDownloadSession = `${terminalSwitchTransactionAdminBaseUrl}/transactions/downloads`;
  const queryParams = _.mapValues(_.pickBy(filter, _.identity));
  const {data} = await apiClient.post<{id: string}>(genDownloadSession);
  const downloadUrl = formatUrlWithQuery(
    `${terminalSwitchTransactionAdminBaseUrl}/transactions/downloads/${data.id}`,
    queryParams as Record<string, string | string[]>,
  );
  const csvData = await getData<string>(downloadUrl, {
    responseType: 'blob' as 'json',
    headers: {
      accept: 'text/csv',
    },
  });
  return downloadFile(csvData, 'terminal-switch-transaction.csv');
};

export const sentTerminalSwitchTransactionViaEmail = async (
  emails: string[],
  filter: ITerminalSwitchTransactionalFilterParam,
) => {
  const queryParams = _.mapValues(_.pickBy(filter, _.identity));
  const url = `${terminalSwitchTransactionAdminBaseUrl}/transactions/send-email`;
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

export const useGetMerchants = (filter: IIndexMerchantFilters) => {
  return useQuery(['merchants', filter], () => searchMerchantsWithNameOrID(filter), {
    keepPreviousData: true,
    select: (result) =>
      result.map((merchant) => ({
        value: merchant.merchantId,
        label: merchant.name,
        metadata: merchant.merchantId,
      })),
  });
};

export const checkPendingSettlements = async (params: ITerminalGetPendingSettlementReq) => {
  const {data} = await apiClient.get<IsPendingSettlementRes>(
    `${terminalSwitchTransactionAdminBaseUrl}/settlements/pending`,
    {params},
  );
  return data;
};
