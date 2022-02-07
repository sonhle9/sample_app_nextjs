import {CardBrand} from '../terminal-switch-transactions/terminal-switch-transaction.type';

export interface IMonthlyCardSalesReportFilter
  extends Partial<{
    startMonth: number;
    endMonth: number;
    startYear: number;
    endYear: number;
    cardBrand: string;
    merchantId: string;
    merchantName: string;
  }> {}

export class CardReportResponseDTO {
  cardBrand: CardBrand;

  transactionNumber: number;

  amount: number;

  isCoBrand: boolean;

  litre: number;

  litreAmount: number;
}

export class MonthlyCardSaleReportResponseDTO {
  id: string;

  reportDate: Date;

  merchantId: string;

  merchantName: string;

  cards: CardReportResponseDTO[];

  totalTransaction: number;

  totalAmount: number;

  totalLitre: number;

  totalLitreAmount: number;
}

export enum MonthlyCardSalesReportCardBrand {
  PETRONAS_GIFT = 'petronasGift',
  PETRONAS_SMARTPAY = 'petronasSmartpay',
  PETRONAS_MESRA = 'petronasMesra',
  VISA = 'visa',
  MASTER_CARD = 'mastercard',
  AMERICAN_EXPRESS = 'americanExpress',
  MYDEBIT = 'myDebit',
}
