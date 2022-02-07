import {useQuery} from 'react-query';
import {getWalletTransactionDetails} from 'src/react/services/api-wallets.service';

export const topupRefundQueryKeys = {
  list: 'listTopupRefunds',
  details: 'topupRefundDetails',
};

export const useTopupRefundDetails = (id: string) =>
  useQuery([topupRefundQueryKeys.details, id], () => getWalletTransactionDetails(id));
