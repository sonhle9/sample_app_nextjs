export const DEFAULT_PAGINATION_PAGE = 1;
export const DEFAULT_PAGINATION_MAX_PER_PAGE = 300;

export interface IIndexVehicleResponse {
  vehicleId: string;
  ownerId: string;
  vehicleNumber: string;
  vehicleBrand: string;
  vehicleModel: string;
  lastOdometer: number;
  vehicleType: VehicleTypeEnum;
  engineCapacity: number;
  engineCapacityUnit: EngineCapacityUnitEnum;
  createdAt: Date;
}

export interface IIndexVehicleRequest {
  perPage?: number;
  page?: number;
  brandId?: string;
  modelId?: string;
  startDate?: string;
  endDate?: string;
  searchValue?: string;
  vehicleType?: VehicleTypeEnum;
  ownerId?: string;
}

export enum VehicleTypeEnum {
  CAR = 'car',
  MOTORCYCLE = 'motorcycle',
  TRUCK = 'truck',
  OTHERS = 'others',
}

export const VehicleTypeMap = [
  {label: 'Car', value: VehicleTypeEnum.CAR},
  {label: 'Motorcycle', value: VehicleTypeEnum.MOTORCYCLE},
  {label: 'Truck', value: VehicleTypeEnum.TRUCK},
  {label: 'Others', value: VehicleTypeEnum.OTHERS},
];

export interface IVehicleBrandListResponse {
  id: number;
  name: string;
  logo: string;
  vehicleType: VehicleTypeEnum;
}

export interface IVehicleModelListResponse {
  id: number;
  name: string;
  vehicleType: VehicleTypeEnum;
}

export interface IVehicleDetailsResponse {
  vehicleId: string;
  ownerId: string;
  vehicleNumber: string;
  vehicleBrand: string;
  vehicleModel: string;
  lastOdometer: number;
  engineCapacity: number;
  engineCapacityUnit: EngineCapacityUnitEnum;
  vehicleType: VehicleTypeEnum;
  yearOfMake: number;
  transmission: TransmissionTypeEnum;
  color: VehicleColorEnum;
  engineType: EngineTypeEnum;
  createdAt: Date;
  userDetails?: IUserDetails;
}

export enum EngineCapacityUnitEnum {
  CC = 'cc',
  LITER = 'L',
}

export enum TransmissionTypeEnum {
  AUTOMATIC = 'Automatic',
  MANUAL = 'Manual',
}

export enum VehicleColorEnum {
  RED = 'red',
  ORANGE = 'orange',
  YELLOW = 'yellow',
  GREEN = 'green',
  BLUE = 'blue',
  INDIGO = 'indigo',
  VIOLET = 'violet',
  BROWN = 'brown',
  BLACK = 'black',
  SILVER = 'silver',
  WHITE = 'silver',
}

export enum EngineTypeEnum {
  PETROL = 'Petrol',
  DIESEL = 'Diesel',
  NGV = 'NGV',
  HYBRID = 'Hybrid',
  ELECTRIC = 'Electric',
}

interface IUserDetails {
  fullName: string;
  phone: string;
}

export interface IIndexVehicleActivitiesRequest {
  vehicleId: string;
  activityType?: string;
  perPage?: number;
  page?: number;
}

export interface IIndexVehicleActivitiesResponse {
  vehicleId: string;
  activityDate: Date;
  userId: string;
  odometer: number;
  activityType: string;
  activityTypeDisplayName?: string;
  efficiency?: number;
  efficiencyUnit?: string;
  efficiencyPercentage?: number;
  fuelType?: string;
  noOfLiters?: number;
  totalCost?: number;
  isFullTank?: boolean;
  description?: string;
}

export interface IVehiclePaginatedResult<T> {
  page: number;
  perPage: number;
  pageCount: number;
  total: number;
  items: T[];
}

export const VehicleFuelTypeMaps = {
  fuel_primax_95: 'PRIMAX 95',
  fuel_primax_97: 'PRIMAX 97',
  fuel_dynamic_diesel: 'DIESEL',
  fuel_euro_5_diesel: 'EURO5',
};

export enum ActivityTypeEnum {
  FUEL = 'fuel',
  NON_FUEL = 'nonfuel',
}

export const ActivityTypeMaps = [
  {label: 'Refuel', value: ActivityTypeEnum.FUEL.toString()},
  {label: 'Non-fuel', value: ActivityTypeEnum.NON_FUEL.toString()},
];
