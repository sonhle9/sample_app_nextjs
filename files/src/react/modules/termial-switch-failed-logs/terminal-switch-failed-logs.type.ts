export interface IInvalidRequestFilterDto {
  merchantId?: string;
  terminalId?: string;
  source?: TerminalSwitchTransactionSource;
  errorMessage?: string;
  urlEndPoint?: string;
  from?: string;
  to?: string;
}

export interface IFailedLogResponseDto {
  id: string;
  terminalId: string;
  merchantId: string;
  source: string;
  errorMessage: string;
  urlEndpoint: string;
  requestBody: unknown;
  createdAt: Date;
  type: FailedLogType;
}

export enum FailedLogType {
  InvalidParameters = 'invalidParameters',
  InvalidMac = 'invalidMac',
}

export enum TerminalSwitchTransactionSource {
  SETEL = 'setel',
  INVENCO = 'invenco',
}
