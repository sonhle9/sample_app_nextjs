import {
  FleetCardAttributes,
  IAcquirerResponse,
  ItemisedDetails,
  ITransactionAcquirer,
  LoyalTyCardAttributes,
} from '../transactions/transaction.type';

export class ITerminalSwitchTransactionalFilterParam {
  merchantId?: string;

  terminalId?: string;

  stan?: string;

  batchNum?: string;

  status?: TerminalSwitchTransactionStatus;

  type?: TerminalSwitchTransactionType;

  from?: string;

  to?: string;

  page?: number;
  perPage?: number;
  startIndex?: number;
  endIndex?: number;
}

export interface ITerminalSwitchTransactionDetailParam {
  transactionId: string;
}

export enum CardType {
  GIFT_CARD = 'gift',
  LOYALTY_CARD = 'loyalty',
  FLEET_CARD = 'fleet',
  OPEN_LOOP_CARD = 'openLoopCard',
}

export enum CardBrand {
  AMERICAN_EXPRESS = 'americanExpress',
  MASTER_CARD = 'mastercard',
  MYDEBIT = 'myDebit',
  PETRONAS_GIFT = 'petronasGift',
  PETRONAS_MESRA = 'petronasMesra',
  PETRONAS_SMARTPAY = 'petronasSmartpay',
  UNION_PAY = 'unionPay',
  VISA = 'visa',
}
export class TerminalSwitchTransactionCardDto {
  type: CardType;
  brand: CardBrand;
  fullPan: string;
  maskedPan: string;
}

export enum Currency {
  MYR = 'MYR',
}

export enum TerminalSwitchTransactionType {
  CHARGE = 'CHARGE',
  VOID = 'VOID',
  BATCH_UPLOAD = 'BATCH_UPLOAD',
  TC_UPLOAD = 'TC_UPLOAD',
  REVERSAL = 'REVERSAL',
  AUTHORIZE = 'AUTHORIZE',
  CAPTURE = 'CAPTURE',
  BALANCE_INQUIRY = 'BALANCE_INQUIRY', // close-loop card only,
  TOP_UP = 'TOP_UP', // close-loop card only
  POINT_ISSUANCE = 'POINT_ISSUANCE',
  POINT_RETURN = 'POINT_RETURN',
  POINT_COMPLETION = 'POINT_COMPLETION',
}

export enum TerminalSwitchTransactionStatus {
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CLOSED = 'CLOSED',
  SETTLED = 'SETTLED',
  POSTED = 'POSTED',
  PENDING = 'PENDING',
  AUTHORISED = 'AUTHORISED',
  UNPOSTED = 'UNPOSTED',
  VOIDED = 'VOIDED',
}

export class Timeline {
  status: TerminalSwitchTransactionStatus;
  date: Date;
}

export class ITerminalSwitchTransactionResponseDto {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  merchantId: string;

  terminalId: string;

  merchantName: string;

  card: TerminalSwitchTransactionCardDto;

  transactionDate: Date;

  amount: number;

  currency: Currency;

  stan: string;

  batchNum: string;

  invoiceNum: string;

  type: TerminalSwitchTransactionType;

  status: TerminalSwitchTransactionStatus;

  attributes: any;

  timeline: Array<Timeline>;

  referenceId: string;

  products: ItemisedDetails[];

  loyaltyCardAttributes?: LoyalTyCardAttributes;

  fleetCardAttributes?: FleetCardAttributes;

  acquirer: ITransactionAcquirer;

  acquirerResponse: IAcquirerResponse;
}
