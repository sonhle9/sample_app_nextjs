import {environment} from 'src/environments/environment';
import {apiClient, fetchPaginatedData, IPaginationParam} from '../../lib/ajax';
import {extractErrorWithConstraints} from '../../lib/utils';
import {
  ISalesTerritory,
  ISearchMerchantRequest,
  ITerritoryMerchant,
} from './sales-territories.type';

const baseUrl = `${environment.merchantsApiBaseUrl}/api/merchants`;

export interface GetSalesTerritoriesOptions extends IPaginationParam {
  merchantTypeId: string;
  sortBy: string;
}

export interface GetTerritoryMerchantsOptions extends IPaginationParam {
  sortBy: string;
}

export const getSalesTerritoriesPaginated = (options: GetSalesTerritoriesOptions) =>
  fetchPaginatedData<ISalesTerritory>(`${baseUrl}/admin/sale-territories`, options);

export const getSalesTerritoryDetails = (salesTerritoryId: string) => {
  if (!salesTerritoryId) {
    return null;
  }
  return apiClient
    .get<ISalesTerritory>(`${baseUrl}/admin/sale-territories/${salesTerritoryId}`)
    .then((res) => res.data)
    .catch((e) =>
      Promise.reject({
        message: extractErrorWithConstraints(e),
      }),
    );
};

export const createSalesTerritory = (salesTerritory: ISalesTerritory) => {
  return apiClient
    .post<ISalesTerritory>(`${baseUrl}/admin/sale-territories`, salesTerritory)
    .then((res) => res.data)
    .catch((e) =>
      Promise.reject({
        message: extractErrorWithConstraints(e),
      }),
    );
};

export const updateSalesTerritory = (salesTerritory: ISalesTerritory) => {
  return apiClient
    .put<ISalesTerritory>(`${baseUrl}/admin/sale-territories/${salesTerritory.id}`, salesTerritory)
    .then((res) => res.data)
    .catch((e) =>
      Promise.reject({
        message: extractErrorWithConstraints(e),
      }),
    );
};

export const deleteSalesTerritory = (salesTerritoryId: string) => {
  return apiClient.delete(`${baseUrl}/admin/sale-territories/${salesTerritoryId}`);
};

export const getTerritoryMerchantsPaginated = (
  salesTerritoryId: string,
  options: GetTerritoryMerchantsOptions,
) =>
  fetchPaginatedData<ITerritoryMerchant>(
    `${baseUrl}/admin/sale-territories/${salesTerritoryId}/merchants`,
    options,
  );

export const addSalesTerritoryMerchants = (salesTerritoryId: string, merchantIds: string[]) => {
  return apiClient
    .put(`${baseUrl}/admin/sale-territories/${salesTerritoryId}/add-merchants`, {
      merchantIds,
    })
    .then((res) => res.data)
    .catch((e) =>
      Promise.reject({
        message: extractErrorWithConstraints(e),
      }),
    );
};

export const removeSalesTerritoryMerchants = (salesTerritoryId: string, merchantIds: string[]) => {
  return apiClient
    .put(`${baseUrl}/admin/sale-territories/${salesTerritoryId}/remove-merchants`, {
      merchantIds,
    })
    .then((res) => res.data)
    .catch((e) =>
      Promise.reject({
        message: extractErrorWithConstraints(e),
      }),
    );
};

export const transferSalesTerritoryMerchants = (
  salesTerritoryId: string,
  newSaleTerritoryId: string,
) => {
  return apiClient
    .put(`${baseUrl}/admin/sale-territories/${salesTerritoryId}/transfer-merchants`, {
      newSaleTerritoryId,
    })
    .then((res) => res.data)
    .catch((e) =>
      Promise.reject({
        message: extractErrorWithConstraints(e),
      }),
    );
};
export const exportSalesTerritoryMerchants = (salesTerritoryId: string) => {
  return apiClient
    .get(`${baseUrl}/admin/sale-territories/${salesTerritoryId}/export`, {
      headers: {
        accept: 'text/csv',
      },
      responseType: 'blob',
    })
    .then((res) => res.data)
    .catch((e) =>
      Promise.reject({
        message: extractErrorWithConstraints(e),
      }),
    );
};

export const importSalesTerritory = (merchantTypeId: string, file: File) => {
  const data = new FormData();
  data.append('file', file);
  return apiClient
    .post(`${baseUrl}/admin/sale-territories/merchantType/${merchantTypeId}/import`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data)
    .catch((e) =>
      Promise.reject({
        message: extractErrorWithConstraints(e),
      }),
    );
};

export const getNoTerritoryMerchants = (req: ISearchMerchantRequest) => {
  if (!req.merchantTypeId) {
    return null;
  }
  return apiClient
    .get(`${baseUrl}/admin/merchants/no-sale-territory/merchantType`, {
      params: req,
    })
    .then((res) => {
      return res.data;
    })
    .catch((e) =>
      Promise.reject({
        message: extractErrorWithConstraints(e),
      }),
    );
};
