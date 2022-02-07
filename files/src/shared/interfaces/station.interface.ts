import {ConciergeStatus, FuelInCarStatus} from 'src/app/stations/shared/const-var';
import {PumpStatus} from '../../react/modules/stations/stations.enum';

export interface IPump {
  pumpId: string;
  stationId: string;
  isAvailable: string;
  isReserved: string;
  isInUse: string;
  status: PumpStatus;
  lastReservedAt: Date;
  fuelOptions: PumpFuelOption;
}

export interface IPosStationPump {
  pumpId: string;
  stationId: string;
  isAvailable: string;
  isReserved: string;
  isInUse: string;
  lastReservedAt: Date;
  fuelOptions: PumpFuelOption;
}

export interface IStationFeature {
  typeId: string;
  featureItems: string[];
}

export interface IStationFeatureItem {
  id: string;
  name: string;
}

export interface IStationFeatureType {
  typeId: string;
  name: string;
  features: IStationFeatureItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IOperatingDay {
  day: number;
  timeSlots: [IOperatingHours];
}

export interface IOperatingHours {
  from: number;
  to: number;
}

export interface ITimeSlot {
  slots: Date[][];
}

export enum StationStatus {
  COMIN_SOON = 'coming-soon',
  MAINTENANCE = 'maintenance',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum StationStoreStatus {
  COMIN_SOON = 'coming-soon',
  MAINTENANCE = 'maintenance',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum StationHealthStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
export interface StationHealthCheck {
  status: string;
  updateAt: Date;
}

export enum StationSetelAcceptedFor {
  FUEL = 'fuel',
  STORE = 'store',
  KIOSK = 'kiosk',
}

export interface IReadStation {
  id?: string;
  name: string;
  address: string;
  country: string;
  restaurants: string[];
  latitude: number;
  longitude: number;
  geofenceLatitude: number;
  geofenceLongitude: number;
  geofenceRadius: number;
  startActiveAt: Date;
  endActiveAt: Date;
  merchant: IMerchant;
  isActive?: boolean;
  loyaltyVendorMerchantId?: string;
  kiplerMerchantId?: string;
  status: StationStatus;
  storeStatus: StationStoreStatus;
  setelAcceptedFor: StationSetelAcceptedFor[];
  pumps: IPump[];
  features: IStationFeature[];
  createdAt: Date;
  updatedAt: Date;
  healthCheck: StationHealthCheck;
  vendorType: string;
  fuelMerchantId: string;
  storeMerchantId: string;
  fuelInCarStatus: FuelInCarStatus;
  conciergeStatus: ConciergeStatus;
  operatingHours: IOperatingDay[];
  fuelInCarOperatingHours: IOperatingDay[];
  isOperating24Hours?: boolean;
  allPumps?: string;
  kipleMerchantId?: string;
}

export interface IIndexStation {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
  status: StationStatus;
  storeStatus: StationStoreStatus;
  latitude: number;
  longitude: number;
  geofenceLatitude?: number;
  geofenceLongitude?: number;
  geofenceRadius?: number;
  features: IStationFeature[];
  healthCheck: StationHealthCheck;
  vendorType: string;
  vendor: StationHealthCheck;
  fuelMerchantId?: string;
  storeMerchantId?: string;
  fuelInCarStatus: FuelInCarStatus;
  conciergeStatus: ConciergeStatus;
  fuelInCarOperatingHours?: IOperatingDay[];
  operatingHours: IOperatingDay[];
  setelAcceptedFor?: StationSetelAcceptedFor[];
  distance?: number;
  isAtStation?: boolean;
}

export interface IUpdatePump {
  pumpId: string;
  status: string;
}

export interface IMerchant {
  tradingCompanyName: string;
  gstNumber: string;
  phoneNumber: string;
  retailerNumber?: string;
}

export interface IPosStationMerchant {
  merchantId: string;
  retailerNumber: string;
  tradingCompanyName: string;
  gstNumber: string;
  phoneNumber: string;
}

export interface IFeature {
  typeId: string;
  featureItems: string[];
}

export interface IUpdateStation {
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  geofenceLatitude?: number;
  geofenceLongitude?: number;
  geofenceRadius?: number;
  loyaltyVendorMerchantId?: string;
  kipleMerchantId?: string;
  merchant?: IMerchant;
  status?: StationStatus;
  vendorType?: string;
  setelAcceptedFor?: string[];
  pumps?: IPump[];
  features?: IFeature[];
  operatingHours?: IOperatingDay[];
  fuelInCarOperatingHours?: IOperatingDay[];
  isOperating24Hours?: boolean;
}

export interface IUpdateMerchant {
  tradingCompanyName: string;
  gstNumber: string;
  phoneNumber: string;
}

export interface IStationRole {
  hasStationView: boolean;
  hasStationCreate: boolean;
  hasStationUpdate: boolean;
  hasStationExport: boolean;
}

export interface PumpFuelOption {
  mesraCode: string;
  isAvailable: boolean;
  grade: string;
  price: number;
  taxCode: string;
  taxPercentage: number;
  multipleOf?: number;
  taxAmount: number;
}

export interface PosStationPumpFuelOption {
  mesraCode: string;
  isAvailable: boolean;
  grade: string;
  price: number;
  taxCode: string;
  taxPercentage: number;
  taxAmount: number;
}

export interface IReadPosStation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  geofenceLatitude: number;
  geofenceLongitude: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  startActiveAt: Date;
  endActiveAt: Date;
  merchant: IPosStationMerchant;
  pumps: IPump[];
}
