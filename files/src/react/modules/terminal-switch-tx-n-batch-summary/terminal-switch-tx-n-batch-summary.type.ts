import {AcquirerType} from '@setel/payment-interfaces';
import {TerminalSwitchTransactionCardDto} from '../terminal-switch-transactions/terminal-switch-transaction.type';

export class ITxNBatchSummaryFilterDto {
  merchantIds?: string[];
  terminalId?: string;
  batchNum?: string;
  from?: Date;
  to?: Date;
  page?: number;
  perPage?: number;
}

export interface ITransactionAcquirer {
  type: AcquirerType;
  merchantId: string;
  terminalId: string;
}

export class ITxNBatchSummaryResponseDto {
  terminalId: string;
  merchantId: string;
  acquirer: ITransactionAcquirer;
  merchantName: string;
  createdDateTxt: string;
  createdTimeTxt: string;
  stan: string;
  batchNum: string;
  cardTypeTxt: string;
  mti: string;
  terminalTypeTxt: string;
  amountTxt: number;
  referenceId: string;
  authNum: string;
  card: TerminalSwitchTransactionCardDto;
}
