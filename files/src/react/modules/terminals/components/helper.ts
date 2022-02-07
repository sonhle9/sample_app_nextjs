import {CardBrand, ClosedLoopCardsBrand} from '@setel/payment-interfaces';
import {AcquirerType} from '../terminals.constant';
import {CardBrandType} from '../terminals.type';

export const getCardTypeDisplay = (cardBrand: CardBrandType): {src?: string; title: string} => {
  return {
    title: mappingCardBrandToDisplayName.get(cardBrand) || upperFirstChar(cardBrand),
    src: mappingCardBrandToLogos.get(cardBrand),
  };
};

export const getAcquirerDisplay = (acquirerType: AcquirerType): {src?: string; title: string} => {
  return {
    title: mappingAcquirerTypeDisplayName.get(acquirerType) || upperFirstChar(acquirerType),
    src: mappingAcquirerTypeLogos.get(acquirerType),
  };
};

export const upperFirstChar = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const mappingAcquirerTypeLogos = new Map([
  [AcquirerType.CIMB, '/assets/images/acquirer-type/cimb.png'],
  [AcquirerType.FLEET, '/assets/images/acquirer-type/pdb.png'],
  [AcquirerType.GIFT, '/assets/images/acquirer-type/pdb.png'],
  [AcquirerType.LOYALTY, '/assets/images/acquirer-type/pdb.png'],
  [AcquirerType.MAYBANK, '/assets/images/acquirer-type/maybank.png'],
]);

export const mappingCardBrandToLogos = new Map<ClosedLoopCardsBrand | CardBrand, string>([
  [CardBrand.MYDEBIT, 'assets/images/payment-method-logo/mydebit.svg'],
  [CardBrand.VISA, 'assets/images/payment-method-logo/visa.svg'],
  [CardBrand.MASTER_CARD, 'assets/images/payment-method-logo/mastercard.svg'],
  [CardBrand.AMERICAN_EXPRESS, 'assets/images/payment-method-logo/american-express.svg'],
  [CardBrand.UNION_PAY, 'assets/images/payment-method-logo/union-pay.svg'],
  [ClosedLoopCardsBrand.PETRONAS_GIFT, 'assets/images/payment-method-logo/petronas-gift.svg'],
  [ClosedLoopCardsBrand.PETRONAS_MESRA, 'assets/images/payment-method-logo/petronas-mesra.svg'],
  [
    ClosedLoopCardsBrand.PETRONAS_SMART_PAY,
    'assets/images/payment-method-logo/petronas-smart-pay.svg',
  ],
]);

export const mappingAcquirerTypeDisplayName = new Map([
  [AcquirerType.FLEET, 'PDB Fleet'],
  [AcquirerType.GIFT, 'PDB Gift'],
  [AcquirerType.LOYALTY, 'PDB Loyalty'],
]);

export const mappingCardBrandToDisplayName = new Map<ClosedLoopCardsBrand | CardBrand, string>([
  [ClosedLoopCardsBrand.PETRONAS_GIFT, 'Gift'],
  [ClosedLoopCardsBrand.PETRONAS_MESRA, 'Mesra'],
  [ClosedLoopCardsBrand.PETRONAS_SMART_PAY, 'Smartpay'],
  [CardBrand.AMERICAN_EXPRESS, 'AMEX'],
]);
