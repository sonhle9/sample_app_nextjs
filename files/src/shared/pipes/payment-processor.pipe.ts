import {Pipe, PipeTransform} from '@angular/core';
import {AcquirersPaymentProcessor} from 'src/app/api-switch.service';

@Pipe({
  name: 'paymentProcessor',
})
export class PaymentProcessorPipe implements PipeTransform {
  transform(value: AcquirersPaymentProcessor): string {
    switch (value) {
      case AcquirersPaymentProcessor.BOOST:
        return 'Boost';
      case AcquirersPaymentProcessor.IPAY88:
        return 'iPay88';
      case AcquirersPaymentProcessor.SETEL_LOYALTY:
        return 'Loyalty';
      default:
        return value;
    }
  }
}
