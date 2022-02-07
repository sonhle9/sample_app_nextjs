import {useQuery} from 'react-query';
import {getSettlementsV2} from './settlements.service';

export const useListSettlements = (filter: Parameters<typeof getSettlementsV2>[0]) => {
  return useQuery(['GetListSettlements', filter], () => getSettlementsV2(filter), {
    keepPreviousData: true,
  });
};
