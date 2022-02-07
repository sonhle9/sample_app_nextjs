export enum CreditNotesStatus {
  REFUND_DUE = 'REFUND_DUE',
  REFUNDED = 'REFUNDED',
  VOIDED = 'VOIDED',
  ADJUSTED = 'ADJUSTED',
}

export enum CreditNotesType {
  ADJUSTMENT = 'ADJUSTMENT',
  REFUNDABLE = 'REFUNDABLE',
}

export interface ICreditNote {
  id: string;
  type: CreditNotesType;
  totalAmount: number;
  status: CreditNotesStatus;
  issuedDate: Date;
  enterpriseId: string;
  merchantId: string;
  attributes: {merchantName: string};
  creditNoteID: string;
}

export interface ICreditNotesQueryParams {
  page: number;
  perPage: number;
  status: CreditNotesStatus;
  type: CreditNotesType;
  searchCreditNote: string;
}
