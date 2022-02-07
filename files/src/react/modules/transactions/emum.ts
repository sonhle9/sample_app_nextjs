export enum EStatus {
  CREATED = 'created',
  PENDING = 'pending',
  AUTHORISED = 'authorised',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  SETTLED = 'settled',
  POSTED = 'posted',
  UNPOSTED = 'unposted',
  VOIDED = 'voided',
  VERIFIED = 'verified',
  REFUNDED = 'refunded',
}

export enum ETransaction_Type {
  BALANCE_CHECK = 'balance_check',
  CHARGE = 'charge',
  TOPUP = 'topup',
  REFUND = 'refund',
  SETTLEMENT = 'settlement',
  TRANSFER = 'transfer',
  ADJUSTMENT = 'adjustment',
}

export enum ETransaction_Filter_By {
  RRN = 'rrn',
  BATCHID = 'batchId',
  TERMINALID = 'terminalId',
  REQUEST_ID = 'requestId',
}

export enum ETransactionFleet_Filter_By {
  BATCHNUMBER = 'batchId',
  REFERENCE_NUMBER = 'referenceId',
  INVENCO = 'ipt_opt',
  SETEL = 'setel_terminal',
  CARDLESS = 'cardless',
  ROVR = 'rovr',
}

export enum EFleetStatus {
  CREATED = 'created',
  PENDING = 'pending',
  AUTHORISED = 'authorised',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  SETTLED = 'settled',
  POSTED = 'posted',
  UNPOSTED = 'unposted',
  REFUNDED = 'refunded',
  VERIFIED = 'verified',
  VOIDED = 'voided',
}

export const EStatusTextPair = {
  [EStatus.CREATED]: 'Created',
  [EStatus.PENDING]: 'Pending',
  [EStatus.AUTHORISED]: 'Authorised',
  [EStatus.SUCCEEDED]: 'Succeeded',
  [EStatus.FAILED]: 'Failed',
  [EStatus.SETTLED]: 'Settled',
  [EStatus.POSTED]: 'Posted',
  [EStatus.UNPOSTED]: 'Unposted',
  [EStatus.VOIDED]: 'Voided',
  [EStatus.REFUNDED]: 'Refunded',
  [EFleetStatus.VOIDED]: 'Voided',
};

export enum ETRANSACTION_TYPE {
  CHARGE = 'charge',
  TOPUP = 'topup',
  SETTLEMENT = 'settlement',
  VOID = 'void',
  REVERSAL = 'reversal',
  BALANCE_CHECK = 'balance_check',
  REFUND = 'refund',
}

export const ETransactionTypeTextPair = {
  [ETransaction_Type.BALANCE_CHECK]: 'Balance check',
  [ETransaction_Type.CHARGE]: 'Charge',
  [ETransaction_Type.TOPUP]: 'Top up',
  [ETransaction_Type.REFUND]: 'Refund',
  [ETransaction_Type.SETTLEMENT]: 'Settlement',
  [ETransaction_Type.TRANSFER]: 'Transfer',
  [ETransaction_Type.ADJUSTMENT]: 'Adjustment',
  [ETRANSACTION_TYPE.REVERSAL]: 'Reversal',
  [ETRANSACTION_TYPE.VOID]: 'Void',
};

export const ETransactionFilterByTextPair = {
  [ETransaction_Filter_By.TERMINALID]: 'Terminal Id',
  [ETransaction_Filter_By.RRN]: 'RRN',
  [ETransaction_Filter_By.BATCHID]: 'Batch number',
};

export const ETransactionFleetFilterByTextPair = {
  [ETransactionFleet_Filter_By.REFERENCE_NUMBER]: 'Reference number',
  [ETransactionFleet_Filter_By.BATCHNUMBER]: 'Batch number',
  [ETransactionFleet_Filter_By.INVENCO]: 'Invenco terminal',
  [ETransactionFleet_Filter_By.CARDLESS]: 'Cardless smartpay',
  [ETransactionFleet_Filter_By.ROVR]: 'ROVR',
  [ETransactionFleet_Filter_By.SETEL]: 'Setel terminal',
};
export const LESS_FILTERS = ['status', 'type', 'dateRange', 'merchantId', 'cardNumber'];
export const LESS_FLEETFILTERS = [
  'status',
  'type',
  'dateRange',
  'merchantId',
  'cardNumber',
  'smartPayAccountId',
  'vehicleNumber',
];

export interface OptStatusFilter {
  label: string;
  value: EStatus;
}

export interface OptStatusFleetFilter {
  label: string;
  value: EFleetStatus;
}

export interface OptTransactionTypeFilter {
  label: string;
  value: ETransaction_Type;
}

export interface OptTransactionFilterBy {
  label: string;
  value: ETransaction_Filter_By;
}

export interface OptTransactionFleetFilterBy {
  label: string;
  value: ETransactionFleet_Filter_By;
}

export const optStatusFilter: OptStatusFilter[] = [
  {
    label: 'All',
    value: '' as any,
  },
  {
    label: EStatusTextPair[EStatus.PENDING],
    value: EStatus.PENDING,
  },
  {
    label: EStatusTextPair[EStatus.AUTHORISED],
    value: EStatus.AUTHORISED,
  },
  {
    label: EStatusTextPair[EStatus.SUCCEEDED],
    value: EStatus.SUCCEEDED,
  },
  {
    label: EStatusTextPair[EStatus.FAILED],
    value: EStatus.FAILED,
  },
  {
    label: EStatusTextPair[EStatus.SETTLED],
    value: EStatus.SETTLED,
  },
  {
    label: EStatusTextPair[EStatus.POSTED],
    value: EStatus.POSTED,
  },
  {
    label: EStatusTextPair[EStatus.UNPOSTED],
    value: EStatus.UNPOSTED,
  },
  {
    label: EStatusTextPair[EStatus.VOIDED],
    value: EStatus.VOIDED,
  },
];

export const optStatusFleetFilter: OptStatusFleetFilter[] = [
  {
    label: 'All',
    value: '' as any,
  },
  {
    label: EStatusTextPair[EFleetStatus.PENDING],
    value: EFleetStatus.PENDING,
  },
  {
    label: EStatusTextPair[EFleetStatus.AUTHORISED],
    value: EFleetStatus.AUTHORISED,
  },
  {
    label: EStatusTextPair[EFleetStatus.SUCCEEDED],
    value: EFleetStatus.SUCCEEDED,
  },
  {
    label: EStatusTextPair[EFleetStatus.FAILED],
    value: EFleetStatus.FAILED,
  },
  {
    label: EStatusTextPair[EFleetStatus.SETTLED],
    value: EFleetStatus.SETTLED,
  },
  {
    label: EStatusTextPair[EFleetStatus.POSTED],
    value: EFleetStatus.POSTED,
  },
  {
    label: EStatusTextPair[EFleetStatus.UNPOSTED],
    value: EFleetStatus.UNPOSTED,
  },
  {
    label: EStatusTextPair[EFleetStatus.REFUNDED],
    value: EFleetStatus.REFUNDED,
  },
  {
    label: EStatusTextPair[EFleetStatus.VOIDED],
    value: EFleetStatus.VOIDED,
  },
];

export const optTransactionTypeFilter: OptTransactionTypeFilter[] = [
  {
    label: 'All',
    value: '' as any,
  },
  {
    label: ETransactionTypeTextPair[ETransaction_Type.BALANCE_CHECK],
    value: ETransaction_Type.BALANCE_CHECK,
  },
  {
    label: ETransactionTypeTextPair[ETransaction_Type.CHARGE],
    value: ETransaction_Type.CHARGE,
  },
  {
    label: ETransactionTypeTextPair[ETransaction_Type.TOPUP],
    value: ETransaction_Type.TOPUP,
  },
  {
    label: ETransactionTypeTextPair[ETransaction_Type.REFUND],
    value: ETransaction_Type.REFUND,
  },
  {
    label: ETransactionTypeTextPair[ETransaction_Type.SETTLEMENT],
    value: ETransaction_Type.SETTLEMENT,
  },
  {
    label: ETransactionTypeTextPair[ETransaction_Type.TRANSFER],
    value: ETransaction_Type.TRANSFER,
  },
  {
    label: ETransactionTypeTextPair[ETransaction_Type.ADJUSTMENT],
    value: ETransaction_Type.ADJUSTMENT,
  },
];

export const optTransactionFilterBy: OptTransactionFilterBy[] = [
  {
    label: 'All',
    value: '' as any,
  },
  {
    label: ETransactionFilterByTextPair[ETransaction_Filter_By.TERMINALID],
    value: ETransaction_Filter_By.TERMINALID,
  },
  {
    label: ETransactionFilterByTextPair[ETransaction_Filter_By.RRN],
    value: ETransaction_Filter_By.RRN,
  },
  {
    label: ETransactionFilterByTextPair[ETransaction_Filter_By.BATCHID],
    value: ETransaction_Filter_By.BATCHID,
  },
];

export const optTransactionFleetFilterBy: OptTransactionFleetFilterBy[] = [
  {
    label: ETransactionFleetFilterByTextPair[ETransactionFleet_Filter_By.BATCHNUMBER],
    value: ETransactionFleet_Filter_By.BATCHNUMBER,
  },
  {
    label: ETransactionFleetFilterByTextPair[ETransactionFleet_Filter_By.REFERENCE_NUMBER],
    value: ETransactionFleet_Filter_By.REFERENCE_NUMBER,
  },
];

export const optTransactionTerminalFleetFilterBy: OptTransactionFleetFilterBy[] = [
  {
    label: ETransactionFleetFilterByTextPair[ETransactionFleet_Filter_By.INVENCO],
    value: ETransactionFleet_Filter_By.INVENCO,
  },
  {
    label: ETransactionFleetFilterByTextPair[ETransactionFleet_Filter_By.SETEL],
    value: ETransactionFleet_Filter_By.SETEL,
  },
  {
    label: ETransactionFleetFilterByTextPair[ETransactionFleet_Filter_By.CARDLESS],
    value: ETransactionFleet_Filter_By.CARDLESS,
  },
  {
    label: ETransactionFleetFilterByTextPair[ETransactionFleet_Filter_By.ROVR],
    value: ETransactionFleet_Filter_By.ROVR,
  },
];
export enum ETRANSACTION_STATUS {
  CREATED = 'created',
  PENDING = 'pending',
  AUTHORISED = 'authorised',
  FAILED = 'failed',
  SUCCEEDED = 'succeeded',
  VOIDED = 'voided',
  POSTED = 'posted',
  SETTLED = 'settled',
  UNPOSTED = 'unposted',
  REFUNDED = 'refunded',
}
