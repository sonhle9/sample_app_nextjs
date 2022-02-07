import {useQuery} from 'react-query';
import {IIndexVehicleActivitiesRequest} from './interface/vehicle.interface';
import {
  getVehicleActivities,
  getVehicleBrands,
  getVehicleDetails,
  getVehicleModels,
  getVehicles,
} from './vehicle.service';

const VEHICLES = 'vehicles';
const VEHICLE_ACTIVITIES = 'vehicle_activities';
const VEHICLES_BRANDS = 'vehiclebrands';
const VEHICLES_MODELS = 'vehiclemodels';
const VEHICLE_DETAILS = 'vehicle_details';

export const useVehicles = (
  filter: Parameters<typeof getVehicles>[0],
  options: {enabled?: boolean} = {},
) =>
  useQuery([VEHICLES, filter], () => getVehicles(filter), {
    keepPreviousData: true,
    enabled: options.enabled,
  });

export const useVehicleBrands = () => useQuery([VEHICLES_BRANDS], (_) => getVehicleBrands());

export const useVehicleModels = (brandId: number) =>
  useQuery([VEHICLES_MODELS, brandId], () => getVehicleModels(brandId));

export const useVehicleDetails = (vehicleId: string) =>
  useQuery([VEHICLE_DETAILS, vehicleId], () => getVehicleDetails(vehicleId));

export const useVehicleActivities = (filter: IIndexVehicleActivitiesRequest) =>
  useQuery([VEHICLE_ACTIVITIES, filter], () => getVehicleActivities(filter), {
    keepPreviousData: true,
  });
