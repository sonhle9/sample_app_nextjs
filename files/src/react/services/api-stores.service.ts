import {
  apiClient,
  getData,
  fetchPaginatedData,
  IPaginationParam,
  IPaginationResult,
  filterEmptyString,
  ajax,
} from 'src/react/lib/ajax';
import {environment} from 'src/environments/environment';
import {
  IMerchant,
  IProduct,
  IStore,
  IStoresFilter,
  DEFAULT_STORE_VALUES,
  INITIAL_PRODUCT,
  WaitingAreasFilter,
  IStoreHistory,
  IStoreHistoryFilter,
  IStoreHistoryUserFilter,
  IStoreHistoryUser,
  IStation,
} from './api-stores.type';
import _pickBy from 'lodash/pickBy';
import {
  INITIAL_WAITING_AREA,
  WaitingAreaPayload,
  WaitingArea,
  UpdateWaitingAreaPayload,
} from '../modules/waiting-areas/waiting-areas.types';

export function constructProductFormData(product: IProduct, imgFile?: File): FormData {
  const formData = new FormData();

  Object.keys(INITIAL_PRODUCT).forEach((key: keyof IProduct) => {
    if (product.hasOwnProperty(key)) {
      const value = String(product[key]).trim();
      if (value) {
        formData.append(key, value);
      }
    }
  });

  if (imgFile) {
    formData.append('image', imgFile);
  } else {
    formData.delete('image');
  }

  return formData;
}

export function postProduct(newProduct: IProduct, imgFile: File): Promise<IProduct> {
  const formData = constructProductFormData(newProduct, imgFile);
  return apiClient
    .post<IProduct>(`${environment.storeApiBaseUrl}/api/stores/admin/items`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data);
}

export function putProduct(productUpdates: IProduct, imgFile?: File): Promise<IProduct> {
  const formData = constructProductFormData(productUpdates, imgFile);
  return apiClient
    .put<IProduct>(
      `${environment.storeApiBaseUrl}/api/stores/admin/items/${productUpdates.itemId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    .then((res) => res.data);
}

export function getStores(
  pagination?: IPaginationParam,
  filter?: IStoresFilter,
): Promise<IPaginationResult<IStore>> {
  return fetchPaginatedData<IStore>(
    `${environment.storeApiBaseUrl}/api/stores/admin/stores`,
    pagination,
    {
      params: _pickBy(filter, Boolean),
    },
  );
}

export function getStore(storeId: string) {
  return getData<IStore>(`${environment.storeApiBaseUrl}/api/stores/admin/stores/${storeId}`);
}

export function postStore(store: Partial<IStore>) {
  return apiClient
    .post<IStore>(`${environment.storeApiBaseUrl}/api/stores/admin/stores`, {
      ...DEFAULT_STORE_VALUES,
      ...store,
    })
    .then((response) => response.data);
}

export function putStore(storeId: string, values: Partial<IStore>) {
  return apiClient
    .put<IStore>(`${environment.storeApiBaseUrl}/api/stores/admin/stores/${storeId}`, values)
    .then((response) => response.data);
}

export function getWaitingAreas(
  pagination?: IPaginationParam,
  filter?: WaitingAreasFilter,
): Promise<IPaginationResult<WaitingArea>> {
  return fetchPaginatedData<WaitingArea>(
    `${environment.storeApiBaseUrl}/api/stores/admin/waiting-areas`,
    pagination,
    {
      params: _pickBy(filter, Boolean),
    },
  );
}

export function constructWaitingAreaFormData(waitingArea: WaitingAreaPayload): FormData {
  const formData = new FormData();

  Object.keys(INITIAL_WAITING_AREA).forEach((key: keyof WaitingArea) => {
    if (waitingArea.hasOwnProperty(key)) {
      const value = waitingArea[key];
      if (Array.isArray(value)) {
        value.forEach((val) => {
          formData.append(`${key}[]`, val);
        });
      } else {
        formData.append(key, value);
      }
    }
  });

  if (waitingArea.image !== undefined) {
    formData.append('image', waitingArea.image);
  } else {
    formData.delete('image');
  }

  if (waitingArea.nameLocale) {
    formData.append('nameLocale', JSON.stringify(waitingArea.nameLocale));
  } else {
    formData.delete('nameLocale');
  }

  return formData;
}

export function createWaitingArea(waitingAreaPayload: WaitingAreaPayload): Promise<WaitingArea> {
  const formData = constructWaitingAreaFormData(waitingAreaPayload);
  return apiClient
    .post<WaitingArea>(`${environment.storeApiBaseUrl}/api/stores/admin/waiting-areas`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data);
}

export function updateWaitingArea(
  waitingAreaPayload: UpdateWaitingAreaPayload,
): Promise<WaitingArea> {
  const formData = constructWaitingAreaFormData(waitingAreaPayload);
  return ajax.put<WaitingArea>(
    `${environment.storeApiBaseUrl}/api/stores/admin/waiting-areas/${waitingAreaPayload.id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
}

export function getWaitingArea(waitingAreaid: string) {
  return getData<WaitingArea>(
    `${environment.storeApiBaseUrl}/api/stores/admin/waiting-areas/${waitingAreaid}`,
  );
}

export function getStation(stationId: string) {
  return getData<IStation>(`${environment.opsApiBaseUrl}/api/stations/stations/${stationId}`);
}

export function getMerchant(merchantId: string) {
  return getData<IMerchant>(
    `${environment.merchantsApiBaseUrl}/api/merchants/admin/merchants/${merchantId}`,
  );
}

export function getStoreHistory(
  pagination?: IPaginationParam,
  filter?: IStoreHistoryFilter,
): Promise<IPaginationResult<IStoreHistory>> {
  return fetchPaginatedData<IStoreHistory>(
    `${environment.storeApiBaseUrl}/api/stores/activity-logs`,
    pagination,
    {
      params: filterEmptyString(filter),
    },
  );
}

export function getStoreHistoryUsers(
  pagination?: IPaginationParam,
  filter?: IStoreHistoryUserFilter,
): Promise<IPaginationResult<IStoreHistoryUser>> {
  return fetchPaginatedData<IStoreHistoryUser>(
    `${environment.storeApiBaseUrl}/api/stores/activity-logs/users`,
    pagination,
    {
      params: filterEmptyString(filter),
    },
  );
}

export function downloadStoreHistory(filter?: IStoreHistoryFilter): Promise<string> {
  return apiClient
    .get(`${environment.storeApiBaseUrl}/api/stores/activity-logs/csv`, {
      params: filterEmptyString(filter),
      responseType: 'blob',
    })
    .then((response) => response.data);
}
