import {environment} from 'src/environments/environment';
import {
  ajax,
  fetchPaginatedData,
  filterEmptyString,
  getData,
  IPaginationParam,
} from 'src/react/lib/ajax';
import {
  IIndexStation,
  IReadStation,
  IStationFeatureType,
  IUpdateStation,
  StationStatus,
} from 'src/shared/interfaces/station.interface';

const baseUrl = `${environment.stationsApiBaseUrl}/api/stations`;

export interface StationFilter {
  status?: string;
  name?: string;
  vendorStatus?: string;
}
export const getStation = (stationId: string) => {
  return getData<IReadStation>(`${baseUrl}/stations/${stationId}`);
};

export const getStationFeatureTypes = () => {
  return getData<IStationFeatureType[]>(`${baseUrl}/stations/feature/types`);
};

export const indexStations = (params: IPaginationParam & StationFilter) =>
  fetchPaginatedData<IIndexStation>(`${baseUrl}/stations`, filterEmptyString(params));

export interface AddStationData {
  stationId: string;
  vendorType: string;
}

export const addStation = (data: AddStationData) =>
  ajax.post(`${baseUrl}/administration/stations`, {
    id: data.stationId,
    stationId: data.stationId,
    vendorType: data.vendorType,
  });

export interface UpdateStationBasicDetailsData {
  status: StationStatus;
  vendorType: string;
}

export const updateStationBasicDetails = (stationId: string, data: IUpdateStation) =>
  ajax.patch<IReadStation>(`${baseUrl}/administration/stations/${stationId}`, data);

export const downloadStations = (params: StationFilter) =>
  ajax.get<Blob>(`${baseUrl}/stations`, {
    params: filterEmptyString(params),
    responseType: 'blob',
    headers: {
      accept: 'text/csv',
    },
  });
