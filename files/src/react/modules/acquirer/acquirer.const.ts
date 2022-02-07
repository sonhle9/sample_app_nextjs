import {AcquirersPaymentProcessor} from 'src/react/services/api-switch.service';

export const PaymentProcessorName: Record<AcquirersPaymentProcessor, string> = {
  [AcquirersPaymentProcessor.BOOST]: 'Boost',
  [AcquirersPaymentProcessor.IPAY88]: 'iPay88',
  [AcquirersPaymentProcessor.SETEL_LOYALTY]: 'Loyalty',
};

export const paymentProcessorOptions = Object.values(AcquirersPaymentProcessor).map((value) => ({
  value,
  label: PaymentProcessorName[value],
}));
