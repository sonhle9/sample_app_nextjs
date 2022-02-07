import {environment} from 'src/environments/environment';
import {PaginationMetadata} from 'src/shared/interfaces/pagination.interface';
import {getData, ajax} from 'src/react/lib/ajax';
import {
  SessionsParams,
  SessionData,
  SessionDetailsResponse,
  LocationParams,
  LocationData,
} from './parking.type';
import {transformPaginationQueriesGo} from 'src/shared/helpers/transform-pagination-queries';
import {deleteEmptyKeys} from 'src/shared/helpers/parseJSON';
// import {MOCK_SESSIONS} from './mocks/parking.service.mocks';

const parkingBaseUrl = `${environment.parkingBaseUrl}/api/parking`;

export const getParkingSessions = (queryParams?: SessionsParams) => {
  queryParams = {
    ...queryParams,
    createdSince: queryParams?.dateRange[0],
    createdUntil: queryParams?.dateRange[1],
    dateRange: undefined,
  };
  deleteEmptyKeys(queryParams);
  const params = transformPaginationQueriesGo<SessionsParams>(queryParams);
  return getData<PaginationMetadata<SessionData[]>>(`${parkingBaseUrl}/sessions`, {
    params,
  });
};

export const getParkingSessionDetails = (id: string) =>
  getData<SessionDetailsResponse>(`${parkingBaseUrl}/sessions/${id}`);

export const getLocations = (queryParams?: LocationParams) => {
  deleteEmptyKeys(queryParams);
  const params = transformPaginationQueriesGo<LocationParams>(queryParams);
  return getData<PaginationMetadata<LocationData[]>>(`${parkingBaseUrl}/locations`, {params});
};

export const voidParkingSession = (id: string) => ajax.put<any>(`${parkingBaseUrl}/sessions/${id}`);
