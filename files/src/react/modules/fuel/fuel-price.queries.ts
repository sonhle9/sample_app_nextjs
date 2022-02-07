import {useQuery, useMutation, useQueryClient} from 'react-query';
import {
  getCurrentFuelPrice,
  getIndexFuelPrices,
  createFuelPrice,
  getFuelPriceById,
  updateFuelPriceById,
  getFuelPriceByDate,
} from './fuel-price.service';
import {CurrentFuelPrice, CreateOrUpdateFuelPriceRequest} from './types';
import {IPaginationParam} from 'src/react/lib/ajax';

const CURRENT_FUEL_PRICE = 'current_fuel_price';
const INDEX_FUEL_PRICES = 'index_fuel_prices';
const FUEL_PRICE = 'fuel_price';
const FUEL_PRICE_BY_DATE = 'fuel_price_by_date';

export function useCurrentFuelPrice() {
  return useQuery<CurrentFuelPrice>([CURRENT_FUEL_PRICE], () => getCurrentFuelPrice());
}

export function useIndexFuelPrices(pagination: IPaginationParam) {
  return useQuery([INDEX_FUEL_PRICES, pagination], () => getIndexFuelPrices(pagination), {
    keepPreviousData: true,
  });
}

export function useGetFuelPriceById(id: string) {
  return useQuery([FUEL_PRICE, id], () => getFuelPriceById(id));
}

export function useGetFuelPriceByDate(date: Date) {
  return useQuery([FUEL_PRICE_BY_DATE, date], () => getFuelPriceByDate(date));
}

export function useCreateOrUpdateFuelPrice(id?: string) {
  const queryClient = useQueryClient();
  return useMutation(
    (body: CreateOrUpdateFuelPriceRequest) => {
      return id ? updateFuelPriceById(id, body) : createFuelPrice(body);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([INDEX_FUEL_PRICES]);
        if (id) {
          queryClient.invalidateQueries([FUEL_PRICE, id]);
        }
      },
    },
  );
}
