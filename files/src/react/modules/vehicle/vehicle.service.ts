import {environment} from 'src/environments/environment';
import {apiClient, fetchPaginatedData} from 'src/react/lib/ajax';
import {formatParameters} from 'src/shared/helpers/common';
import {
  DEFAULT_PAGINATION_MAX_PER_PAGE,
  DEFAULT_PAGINATION_PAGE,
  IIndexVehicleActivitiesRequest,
  IIndexVehicleActivitiesResponse,
  IIndexVehicleRequest,
  IIndexVehicleResponse,
  IVehicleBrandListResponse,
  IVehicleDetailsResponse,
  IVehicleModelListResponse,
} from './interface/vehicle.interface';

export const getVehicles = (req: IIndexVehicleRequest = {}) => {
  if (req.startDate && !req.endDate) {
    req.endDate = new Date().toISOString();
  }

  return fetchPaginatedData<IIndexVehicleResponse>(
    `${environment.vehicleApiBaseUrl}/api/vehicle/admin/vehicle/list`,
    {
      perPage: req && req.perPage,
      page: req && req.page,
    },
    {
      params: formatParameters({...req}),
    },
  );
};

export const getVehicleBrands = (): Promise<IVehicleBrandListResponse[]> => {
  return apiClient
    .get(`${environment.vehicleDirectoryApiBaseUrl}/api/vehicle-directory/admin/brand/list`, {
      params: {
        page: DEFAULT_PAGINATION_PAGE,
        perPage: DEFAULT_PAGINATION_MAX_PER_PAGE,
      },
    })
    .then((res) => res.data);
};

export const getVehicleModels = (brandId: number): Promise<IVehicleModelListResponse[]> => {
  if (!brandId) {
    return Promise.resolve([]);
  }

  return apiClient
    .get(
      `${environment.vehicleDirectoryApiBaseUrl}/api/vehicle-directory/admin/model/list/${brandId}`,
      {
        params: {
          page: DEFAULT_PAGINATION_PAGE,
          perPage: DEFAULT_PAGINATION_MAX_PER_PAGE,
        },
      },
    )
    .then((res) => res.data);
};

export const getVehicleDetails = (vehicleId: string): Promise<IVehicleDetailsResponse> =>
  apiClient
    .get(`${environment.vehicleApiBaseUrl}/api/vehicle/admin/vehicle/${vehicleId}`)
    .then((res) => res.data);

export const getVehicleActivities = (req: IIndexVehicleActivitiesRequest) =>
  fetchPaginatedData<IIndexVehicleActivitiesResponse>(
    `${environment.vehicleActivitiesApiBaseUrl}/api/vehicle-activities/admin/activities/list`,
    {
      perPage: req && req.perPage,
      page: req && req.page,
    },
    {
      params: formatParameters({...req}),
    },
  );
