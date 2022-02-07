export enum VoucherBatchGenerationType {
  ON_DEMAND = 'on-demand',
  INSTANT = 'instant',
  UPLOAD = 'upload',
}

export interface IVoucher {
  batchId: string;
  bonusAmount: number;
  expired: number;
  expiryDate: string;
  gifted: number;
  granted: number;
  issued: number;
  linked: number;
  name: string;
  redeemType: string;
  redeemed: number;
  regularAmount: number;
  startDate: string;
  voided: number;
  vouchersCount: number;
  id: string;
  _id: string; // from API res VouchersBatchDto
  generationType: string;
}

export enum ModeType {
  Edit = 'EDIT',
  Add = 'ADD',
  Clone = 'CLONE',
  EditRules = 'EDIT-RULES',
}

export interface IExtVoucher {
  docName: string;
  records: IRecordsExtVoucher;
}

interface IRecordsExtVoucher {
  date: string;
  title: string;
  voucherSerialNumber: string;
  voucherCode: string;
  value: number;
  terminalId: string;
  retailerName: string;
  match: boolean;
}
