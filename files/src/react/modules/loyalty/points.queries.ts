import {useQuery} from 'react-query';
import {getTransactions} from './points.service';
import {PointsTransactionsQuery} from './points.type';

export const useGetPointTransactions = (params?: Partial<PointsTransactionsQuery>) =>
  useQuery(['getPointTransactions', params], () => getTransactions(params));
