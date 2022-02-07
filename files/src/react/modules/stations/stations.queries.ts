import {formatDate} from '@setel/portal-ui';
import {useMutation, useQuery, useQueryClient, UseQueryOptions} from 'react-query';
import {IPaginationParam, IPaginationResult} from 'src/react/lib/ajax';
import {downloadFile} from 'src/react/lib/utils';
import {getSystemState} from 'src/react/services/api-maintenance.service';
import {
  addStation,
  downloadStations,
  getStationFeatureTypes,
  indexStations,
  StationFilter,
  updateStationBasicDetails,
} from 'src/react/services/api-stations.service';
import {
  IIndexStation,
  IReadStation,
  IStationFeatureType,
  IUpdateStation,
} from 'src/shared/interfaces/station.interface';
import {getStation} from 'src/react/services/api-stations.service';
import {AxiosError} from 'axios';
import {useNotification} from 'src/react/hooks/use-notification';

export const useSystemState = () => useQuery([stationQueryKey.systemDate], () => getSystemState());

export const useStations = (
  filter: StationFilter & IPaginationParam,
  options: UseQueryOptions<IPaginationResult<IIndexStation>> = {},
) =>
  useQuery([stationQueryKey.indexStations, filter], () => indexStations(filter), {
    staleTime: 30000,
    ...options,
  });

export const useStation = <Result = IReadStation, Error = AxiosError>(
  stationId: string,
  config?: UseQueryOptions<IReadStation, Error, Result>,
) => useQuery([stationQueryKey.stationDetails, stationId], () => getStation(stationId), config);

export const useStationFeatureTypes = <Result = IStationFeatureType[], Error = AxiosError>(
  config?: UseQueryOptions<IStationFeatureType[], Error, Result>,
) => useQuery([stationQueryKey.stationDetails], () => getStationFeatureTypes(), config);

export const useAddStation = () => {
  const queryClient = useQueryClient();
  return useMutation(addStation, {
    onSuccess: () => queryClient.invalidateQueries(stationQueryKey.indexStations),
  });
};

export const useUpdateStationBasicDetails = (stationId: string) => {
  const queryClient = useQueryClient();
  const setNotify = useNotification();

  return useMutation((data: IUpdateStation) => updateStationBasicDetails(stationId, data), {
    onSuccess: () => {
      queryClient
        .invalidateQueries(stationQueryKey.indexStations)
        .then(() => queryClient.invalidateQueries([stationQueryKey.stationDetails, stationId]))
        .then(() =>
          setNotify({
            variant: 'success',
            title: 'Success!',
            description: 'You have successfully updated the details.',
          }),
        );
    },
  });
};

export const useDownloadStations = () =>
  useMutation(downloadStations, {
    onSuccess: (result) =>
      downloadFile(result, `station-${formatDate(new Date(), {format: 'yyyyMMddhhmmss'})}.csv`),
  });

export const stationQueryKey = {
  systemDate: 'stationSystemDate',
  indexStations: 'indexStations',
  stationDetails: 'stationDetails',
  stationFeatureTypes: 'stationFeatureTypes',
} as const;
