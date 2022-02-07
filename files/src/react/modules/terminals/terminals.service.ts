import {environment} from 'src/environments/environment';
import {apiClient, filterEmptyString} from 'src/react/lib/ajax';
import {TOTAL_COUNT_HEADER_NAME} from 'src/react/services/service.type';
import {
  ITerminalRequest,
  ITerminal,
  ITerminalDetails,
  ITerminalDetailsRequest,
  ITerminalFilterRequest,
  IReplacementRequest,
  IReplacement,
  ICreateAcquirerRequest,
  IUpdateAcquirerRequest,
  IAcquirerDetailsRequest,
  IAcquirer,
} from './terminals.type';

const terminalsBaseUrl = `${environment.terminalAPIBaseUrl}/api/legacy-terminals`;

export const getTerminals = async (filter: ITerminalFilterRequest = {}) => {
  const {data: terminals, headers} = await apiClient.get<ITerminal[]>(
    `${terminalsBaseUrl}/terminals`,
    {
      params: filterEmptyString(filter),
    },
  );

  return {
    terminals,
    total: headers[TOTAL_COUNT_HEADER_NAME],
  };
};

export const getTerminalDetails = async ({terminalId, merchantId}: ITerminalDetailsRequest) => {
  const {data} = await apiClient.get<ITerminalDetails>(
    `${terminalsBaseUrl}/terminals/${terminalId}/merchant/${merchantId}`,
  );

  return data;
};

export const createTerminal = async (terminalRequest: ITerminalRequest) => {
  const {data} = await apiClient.post<ITerminal>(`${terminalsBaseUrl}/terminals`, {
    ...terminalRequest,
  });

  return data;
};

export const updateTerminal = async (terminalRequest: ITerminalRequest) => {
  const {data} = await apiClient.put<ITerminal>(
    `${terminalsBaseUrl}/terminals/${terminalRequest.terminalId}/merchant/${terminalRequest.merchantId}`,
    {
      ...terminalRequest,
    },
  );

  return data;
};

export const createReplacement = async (replacementRequest: IReplacementRequest) => {
  const {data} = await apiClient.post<IReplacement>(`${terminalsBaseUrl}/replacements`, {
    ...replacementRequest,
  });

  return data;
};

export const getAcquirers = async ({terminalId, merchantId}: ITerminalDetailsRequest) => {
  const {data} = await apiClient.get<IAcquirer[]>(
    `${terminalsBaseUrl}/admin/terminals/${terminalId}/merchant/${merchantId}/acquirers`,
  );

  return data;
};

export const createAcquirer = async (request: ICreateAcquirerRequest) => {
  const {data} = await apiClient.post<ITerminal>(
    `${terminalsBaseUrl}/admin/terminals/${request.terminalId}/merchant/${request.merchantId}/acquirers`,
    {
      ...request,
    },
  );
  return data;
};

export const updateAcquirer = async (request: IUpdateAcquirerRequest) => {
  const {data} = await apiClient.put<ITerminal>(
    `${terminalsBaseUrl}/admin/terminals/${request.terminalId}/merchant/${request.merchantId}/acquirers/${request.id}`,
    {
      ...request,
    },
  );
  return data;
};

export const deleteAcquirer = async (request: IAcquirerDetailsRequest) => {
  const {data} = await apiClient.delete<ITerminal>(
    `${terminalsBaseUrl}/admin/terminals/${request.terminalId}/merchant/${request.merchantId}/acquirers/${request.acquirerId}`,
  );
  return data;
};

export const getAcquirerDetails = async ({
  terminalId,
  merchantId,
  acquirerId,
}: IAcquirerDetailsRequest) => {
  const {data} = await apiClient.get<IAcquirer>(
    `${terminalsBaseUrl}/admin/terminals/${terminalId}/merchant/${merchantId}/acquirers/${acquirerId}`,
  );

  return data;
};
