import {environment} from 'src/environments/environment';
import {apiClient} from 'src/react/lib/ajax';
import {Settlement, ISettlementRequest, Metadata} from './settlements.type';
import {TOTAL_COUNT_HEADER_NAME} from 'src/react/services/service.type';

const baseUrl = `${environment.settlementsApiBaseUrl}/api/settlements`;

const getParams = (req: ISettlementRequest) => {
  return {
    perPage: req?.perPage,
    offset: req?.offset,
    page: req?.page,
    status: req?.status || undefined,
    createdAtFrom: req?.createdAtFrom || undefined,
    createdAtTo: req?.createdAtTo || undefined,
    merchantId: req?.merchantId,
    toLast: req?.toLast,
  };
};

export const getSettlements = async (req: ISettlementRequest = {}) => {
  const {data: settlements, headers} = await apiClient.get<Settlement[]>(
    `${baseUrl}/admin/settlements`,
    {
      params: getParams(req),
    },
  );

  return {
    settlements,
    total: headers[TOTAL_COUNT_HEADER_NAME],
  };
};

export const getSettlementsV2 = async (req: ISettlementRequest = {}) => {
  const {data: settlements} = await apiClient.get<{data: Settlement[]; metadata: Metadata}>(
    `${baseUrl}/v2/admin/settlements`,
    {
      params: getParams(req),
    },
  );

  return {
    settlements: settlements.data,
    metadata: settlements.metadata,
  };
};
