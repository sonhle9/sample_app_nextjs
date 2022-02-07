import {environment} from 'src/environments/environment';
import {apiClient, fetchPaginatedData} from 'src/react/lib/ajax';
import {formatParameters} from 'src/shared/helpers/common';
import {
  IVehicleBrandListResponse,
  IVehicleModelListResponse,
} from '../vehicle/interface/vehicle.interface';
import {
  IIndexVehicleBrandRequest,
  IIndexVehicleModelRequest,
} from './interface/vehicle-directory.interface';

export const getVehicleBrandListing = (req: IIndexVehicleBrandRequest = {}) =>
  fetchPaginatedData<IVehicleBrandListResponse>(
    `${environment.vehicleDirectoryApiBaseUrl}/api/vehicle-directory/admin/brand/list`,
    {
      perPage: req && req.perPage,
      page: req && req.page,
    },
    {
      params: formatParameters({...req}),
    },
  );

export const getVehicleModelListing = (brandId: number, req: IIndexVehicleModelRequest = {}) =>
  fetchPaginatedData<IVehicleModelListResponse>(
    `${environment.vehicleDirectoryApiBaseUrl}/api/vehicle-directory/admin/model/list/${brandId}`,
    {
      perPage: req && req.perPage,
      page: req && req.page,
    },
    {
      params: formatParameters({...req}),
    },
  );

export const getVehicleBrandDetails = (brandId: number): Promise<IVehicleBrandListResponse> =>
  apiClient
    .get(`${environment.vehicleApiBaseUrl}/api/vehicle-directory/admin/brand/${brandId}`)
    .then((res) => res.data);
