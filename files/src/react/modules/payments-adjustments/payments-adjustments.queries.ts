import {useQuery} from 'react-query';
import {merchantTransactionDetails} from 'src/react/services/api-merchants.service';
import {getWalletTransactionDetails} from 'src/react/services/api-wallets.service';

export const paymentAdjustmentsQueryKey = {
  indexMerchantAdjustments: 'indexPaymentMerchantAdjustments',
  merchantAdjustmentDetails: 'paymentMerchantAdjustmentDetails',
  indexCustomerAdjustments: 'indexPaymentCustomerAdjustments',
  customerAdjustmentDetails: 'paymentCustomerAdjustmentDetails',
};

export const useMerchantAdjustmentDetails = (id: string) =>
  useQuery([paymentAdjustmentsQueryKey.merchantAdjustmentDetails, id], () =>
    merchantTransactionDetails(id),
  );

export const useCustomerAdjustmentDetails = (id: string) =>
  useQuery([paymentAdjustmentsQueryKey.customerAdjustmentDetails, id], () =>
    getWalletTransactionDetails(id),
  );
