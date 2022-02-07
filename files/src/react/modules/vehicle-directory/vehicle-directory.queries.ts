import {useQuery} from 'react-query';
import {
  IIndexVehicleBrandRequest,
  IIndexVehicleModelRequest,
} from './interface/vehicle-directory.interface';
import {
  getVehicleBrandDetails,
  getVehicleBrandListing,
  getVehicleModelListing,
} from './vehicle-directory.service';

const VEHICLES_BRAND_LISTING = 'vehicle-brand-listing';
const VEHICLES_MODEL_LISTING = 'vehicle-model-listing';
const VEHICLE_BRAND_DETAILS = 'vehicle-brand-details';

export const useBrandListing = (filter: IIndexVehicleBrandRequest) =>
  useQuery([VEHICLES_BRAND_LISTING, filter], () => getVehicleBrandListing(filter), {
    keepPreviousData: true,
  });

export const useModelListing = (brandId: number, filter: IIndexVehicleModelRequest) =>
  useQuery(
    [VEHICLES_MODEL_LISTING, brandId, filter],
    () => getVehicleModelListing(brandId, filter),
    {
      keepPreviousData: true,
    },
  );

export const useBrandDetails = (brandId: number) =>
  useQuery([VEHICLE_BRAND_DETAILS, brandId], () => getVehicleBrandDetails(brandId));
