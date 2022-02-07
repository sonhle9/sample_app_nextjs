import {TRANSACTION_MIX_PAYMENT_METHODS} from 'src/app/charges/shared/const-var';
import {MerchantTransaction} from 'src/react/services/api-merchants.type';

const mapping = Object.values(TRANSACTION_MIX_PAYMENT_METHODS);

export const getPaymentMethod = (
  trx: MerchantTransaction,
  {
    exact = true,
    fallback,
  }: {exact?: boolean; fallback?: keyof typeof TRANSACTION_MIX_PAYMENT_METHODS} = {},
) => {
  const matchedMapping = mapping.find((mx) => {
    if (exact || (trx && trx.paymentMethod && trx.paymentSubmethod)) {
      return mx.paymentMethod === trx.paymentMethod && mx.paymentSubmethod === trx.paymentSubmethod;
    }

    if (trx.paymentMethod || !trx.paymentSubmethod) {
      return mx.paymentMethod === trx.paymentMethod;
    }
  });

  return matchedMapping
    ? matchedMapping.text
    : fallback
    ? TRANSACTION_MIX_PAYMENT_METHODS[fallback].text
    : '';
};
