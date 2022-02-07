import {environment} from 'src/environments/environment';
import {apiClient, fetchPaginatedData, filterEmptyString} from 'src/react/lib/ajax';
import {
  ITerminalRequest,
  ITerminal,
  ITerminalFilterRequest,
  ISerialNumbers,
  ITerminalIds,
  ITerminalImportSerialNumbersFilterRequest,
  ITerminalUpdateRequest,
  ITerminalTerminalIdFilterRequest,
  ITerminalAddHostTerminalRegRequest,
  ITerminalEditHostTerminalRegRequest,
  ITerminalInventory,
  ITerminalInventoryListingReq,
} from './api-terminal.type';

const terminalsBaseUrl = `${environment.setelTerminalApiBaseUrl}/api/terminal`;

export const getTerminals = async ({page, perPage, ...filter}: ITerminalFilterRequest = {}) => {
  const {items: terminals, total} = await fetchPaginatedData<ITerminal>(
    `${terminalsBaseUrl}/terminals`,
    {
      page,
      perPage,
    },
    {
      params: filterEmptyString(filter),
    },
  );

  return {
    terminals,
    total,
  };
};

export const getTerminalDetails = async (serialNum: string) => {
  const {data} = await apiClient.get<ITerminal>(`${terminalsBaseUrl}/terminals/${serialNum} `);

  return data;
};

export const createTerminal = async (terminalRequest: ITerminalRequest) => {
  const {data} = await apiClient.post<ITerminal>(`${terminalsBaseUrl}/terminals`, {
    ...terminalRequest,
  });

  return data;
};

export const updateTerminal = async ({
  serialNum,
  request,
}: {
  serialNum: string;
  request: ITerminalUpdateRequest;
}) => {
  const {data} = await apiClient.put<ITerminal>(
    `${terminalsBaseUrl}/terminals/${serialNum}`,
    request,
  );

  return data;
};

export const addHostTerminalReg = async ({
  serialNum,
  request,
}: {
  serialNum: string;
  request: ITerminalAddHostTerminalRegRequest;
}) => {
  const {data} = await apiClient.put<ITerminal>(
    `${terminalsBaseUrl}/terminals/host/${serialNum}`,
    request,
  );

  return data;
};

export const editHostTerminalReg = async ({
  serialNum,
  hostId,
  request,
}: {
  serialNum: string;
  hostId: string;
  request: ITerminalEditHostTerminalRegRequest;
}) => {
  const {data} = await apiClient.put<ITerminal>(
    `${terminalsBaseUrl}/terminals/host/${serialNum}/${hostId}`,
    request,
  );

  return data;
};

export const deleteHostTerminalReg = async ({
  serialNum,
  hostId,
}: {
  serialNum: string;
  hostId: string;
}) => {
  const {data} = await apiClient.delete<ITerminal>(
    `${terminalsBaseUrl}/terminals/host/${serialNum}/${hostId}`,
  );

  return data;
};

export const getTerminalTerminalIds = async ({terminalId}: ITerminalTerminalIdFilterRequest) => {
  const {items, total} = await fetchPaginatedData<ITerminalIds>(
    `${terminalsBaseUrl}/terminals/terminalId`,
    {},
    {
      params: {
        terminalId,
      },
    },
  );

  return {
    items,
    total,
  };
};

export const importTerminalSerialNumbers = async (
  request: ITerminalImportSerialNumbersFilterRequest,
) => {
  const {data} = await apiClient.post<ISerialNumbers[]>(
    `${terminalsBaseUrl}/admin/inventory/manual`,
    request,
  );

  return data;
};

export const uploadCSV = async ({file}: {file: File}) => {
  const url = `${terminalsBaseUrl}/admin/inventory/upload`;
  const csvData = new FormData();
  csvData.append('file', file);
  const {data} = await apiClient.post<string[]>(url, csvData);
  return data;
};

export const getTerminalInventory = async ({
  page,
  perPage,
  ...filter
}: ITerminalInventoryListingReq = {}) => {
  const {items: terminals, total} = await fetchPaginatedData<ITerminalInventory>(
    `${terminalsBaseUrl}/admin/inventory`,
    {
      page,
      perPage,
    },
    {
      params: filterEmptyString(filter),
    },
  );

  return {
    terminals,
    total,
  };
};

export const downloadTerminalReports = async (request: ITerminalFilterRequest) => {
  const {data} = await apiClient.get<Blob>(`${terminalsBaseUrl}/report/download-details`, {
    params: filterEmptyString(request),
    headers: {
      accept: 'text/csv',
    },
    responseType: 'blob',
  });

  return data;
};

export const deactivateTerminal = async ({
  serialNum,
  request,
}: {
  serialNum: string;
  request: {reason: string};
}) => {
  const {data} = await apiClient.put<ISerialNumbers[]>(
    `${terminalsBaseUrl}/terminals/deactivate/${serialNum}`,
    request,
  );

  return data;
};

export const updateTerminalInventory = async ({
  serialNum,
  request,
}: {
  serialNum: string;
  request: {serialNum: string};
}) => {
  const {data} = await apiClient.put<ITerminalInventory>(
    `${terminalsBaseUrl}/admin/inventory/${serialNum}`,
    request,
  );

  return data;
};
