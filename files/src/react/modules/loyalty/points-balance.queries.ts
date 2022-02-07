import {useQuery} from 'react-query';
import {getPointsBalanceExpiry} from './points-balance.service';
import {AxiosError} from 'axios';

export const useGetPointsBalanceExpiry = (memberId?: string) =>
  useQuery(['getPointsBalanceExpiry', memberId], () => getPointsBalanceExpiry(memberId), {
    retry: (_, error) => {
      return (error as AxiosError)?.response?.status !== 404;
    },
    enabled: !!memberId,
  });
