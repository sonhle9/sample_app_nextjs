import {useQuery, useMutation, useQueryClient} from 'react-query';
import {
  getParkingSessions,
  getParkingSessionDetails,
  getLocations,
  voidParkingSession,
} from './parking.service';
import {SessionsParams, LocationParams} from './parking.type';

export const useGetParkingSessions = (params?: SessionsParams) =>
  useQuery(['getParkingSessions', params], () => getParkingSessions(params));

export const useGetParkingSessionDetails = (id: string) =>
  useQuery(['getParkingSessionDetails', id], () => getParkingSessionDetails(id));

export const useGetLocations = (params?: LocationParams) =>
  useQuery(['getLocations', params], () => getLocations(params));

export const useVoidSession = () => {
  const queryClient = useQueryClient();

  return useMutation((id: string) => voidParkingSession(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('getParkingSessionDetails');
      queryClient.invalidateQueries('getParkingSessions');
    },
  });
};
