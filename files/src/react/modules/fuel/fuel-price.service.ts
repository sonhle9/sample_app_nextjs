import {environment} from 'src/environments/environment';
import {apiClient, fetchPaginatedData, IPaginationParam, getData} from 'src/react/lib/ajax';
import {
  CurrentFuelPrice,
  IndexFuelPricesResponse,
  CreateOrUpdateFuelPriceRequest,
  FuelPriceResponse,
} from './types';

export async function getCurrentFuelPrice(): Promise<CurrentFuelPrice> {
  const res = await apiClient.get(`${environment.fuelApiBaseUrl}/api/fuel-pricing/prices/current`);
  return res.data;
}

export function getIndexFuelPrices(pagination: IPaginationParam): Promise<IndexFuelPricesResponse> {
  return fetchPaginatedData(
    `${environment.fuelApiBaseUrl}/api/fuel-pricing/admin/prices`,
    pagination,
  );
}

export async function createFuelPrice(body: CreateOrUpdateFuelPriceRequest) {
  const res = await apiClient.post(
    `${environment.fuelApiBaseUrl}/api/fuel-pricing/admin/prices`,
    body,
  );
  return res.data;
}

export function getFuelPriceById(id: string): Promise<FuelPriceResponse> {
  return getData<FuelPriceResponse>(
    `${environment.fuelApiBaseUrl}/api/fuel-pricing/admin/price/${id}`,
  );
}

export async function getFuelPriceByDate(date: Date): Promise<FuelPriceResponse> {
  const res = await apiClient.get(
    `${environment.fuelApiBaseUrl}/api/fuel-pricing/prices/past?date=${date}`,
  );
  return res.data;
}

export async function updateFuelPriceById(id: string, body: CreateOrUpdateFuelPriceRequest) {
  const res = await apiClient.put(
    `${environment.fuelApiBaseUrl}/api/fuel-pricing/admin/price/${id}`,
    body,
  );
  return res.data;
}
