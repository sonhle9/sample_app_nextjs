import {CardBrand, ClosedLoopCardsBrand} from '@setel/payment-interfaces';
import {AcquirerStatus, AcquirerType} from './terminals.constant';

export interface ITerminal {
  terminalId: string;
  status: string;
  type: string;
  serialNumber: string;
  modelTerminal: string;
  deploymentDate: Date;
  merchant: {id: string; name: string};
  createdAt: string;
  updatedAt: string;
  remarks?: string;
}

export interface IReplacement {
  oldTerminalId?: string;
  replacedTerminalId?: string;
  merchantId?: string;
  replacementDate?: Date;
  reason?: string;
  lastBatchId?: string;
  settlementTransactionId?: string;
  settlementRange?: string;
}

export interface ITerminalDetails {
  terminal: ITerminal;
  replacement: IReplacement;
}

export interface ITerminalRequest {
  terminalId: string;
  merchantId: string;
  status: string;
  type: string;
  serialNumber: string;
  modelTerminal: string;
  remarks?: string;
  deploymentDate: Date;
}

interface IRequest {
  perPage?: number;
  page?: number;
}

export interface ITerminalFilterRequest extends IRequest {
  status?: string;
  type?: string;
  from?: string;
  to?: string;
  merchantId?: string;
  terminalId?: string;
}

export interface ITerminalDetailsRequest {
  terminalId: string;
  merchantId: string;
}

export interface IReplacementRequest {
  oldTerminalId?: string;
  replacedTerminalId?: string;
  merchantId?: string;
  replacementDate?: Date;
  reason?: string;
}

export interface IAcquirer {
  id?: any;
  tid: string;
  mid: string;
  acquirerCode: string;
  acquirerType: AcquirerType;
  cardBrands: CardBrandType[];
  createdAt?: Date;
  updatedAt?: Date;
  status: AcquirerStatus;
}

export type CardBrandType = CardBrand | ClosedLoopCardsBrand;

export interface ICreateAcquirerRequest {
  terminalId: string;
  merchantId: string;
  mid: string;
  tid: string;
  cardBrands: string[];
  acquirerType: string;
}

export interface IUpdateAcquirerRequest {
  id: string;
  terminalId: string;
  merchantId: string;
  mid: string;
  tid: string;
  cardBrands: string[];
  status: string;
}

export interface IAcquirerDetailsRequest {
  terminalId: string;
  merchantId: string;
  acquirerId: string;
}
