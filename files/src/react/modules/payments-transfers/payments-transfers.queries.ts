import {useQuery} from 'react-query';
import {merchantTransactionDetails} from 'src/react/services/api-merchants.service';

export const paymentTransfersQueryKey = {
  indexTransfers: 'indexPaymentTransfers',
  transferDetails: 'paymentTransferDetails',
};

export const useTransferDetails = (id: string) =>
  useQuery([paymentTransfersQueryKey.transferDetails, id], () => merchantTransactionDetails(id));
