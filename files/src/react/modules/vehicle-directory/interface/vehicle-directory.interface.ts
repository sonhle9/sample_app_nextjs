import {VehicleTypeEnum} from '../../vehicle/interface/vehicle.interface';

export interface IIndexVehicleBrandRequest {
  perPage?: number;
  page?: number;
  brandId?: string;
  searchValue?: string;
  vehicleType?: VehicleTypeEnum;
}

export interface IIndexVehicleModelRequest {
  perPage?: number;
  page?: number;
  modelId?: string;
  searchValue?: string;
  vehicleType?: VehicleTypeEnum;
}

export interface IModelListingProps {
  brandId: string;
}
