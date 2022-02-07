export class ITerminalSwitchBatchesFilterDto {
  merchantId?: string;

  terminalId?: string;

  batchNum?: string;

  from?: string;

  to?: string;

  cardBrands?: string[];

  acquirerType?: string;

  status?: string;

  isPendingForceCloseApprovalOnly?: boolean;
}

export class IForceCloseApprovalDto {
  userEmail: string;
  remark: string;
}

export enum Enterprise {
  SETEL = 'setel',
  PDB = 'pdb',
}

export enum BatchStatus {
  OPEN = 'OPEN',
  ACQUIRER_PROCESSING = 'ACQUIRER_PROCESSING',
  NEED_BATCH_UPLOAD = 'NEED_BATCH_UPLOAD',
  BATCH_UPLOADING = 'BATCH_UPLOADING',
  FAILED = 'FAILED',
  CLOSED = 'CLOSED',
}

export enum BatchTimelineStatus {
  REQUESTED = 'REQUESTED',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
}

export enum TransactionSource {
  SETEL = 'setel',
  INVENCO = 'invenco',
}

export class BatchTimelineResponseDto {
  status: BatchTimelineStatus;
  date: Date;
}

export class ITerminalSwitchBatchAcquirerCode {
  code: string;
  text: string;
}

export class IBatchesResponseDto {
  id: string;
  enterprise: Enterprise;

  source: TransactionSource;

  merchantId: string;

  merchantName: string;

  terminalId: string;

  batchNum: string;

  acquirerType: string;

  cardBrands: string[];

  acquirerCode: string;

  saleCount: number;

  saleAmount: number;

  topupCount: number;

  topupAmount: number;

  status: BatchStatus;

  timeline: BatchTimelineResponseDto[];

  firstTxAt: Date;

  lastTxAt: Date;

  createdAt: Date;

  forceClose: ForceClose;

  retriedCnt: number;

  succeededBatchUploadTxIds: any[];

  pointAmount: number;

  pointCount: number;

  acquirerMID: string;

  acquirerTID: string;

  updatedAt: string;

  canRequestForceClose: boolean;

  canApproveForceClose: boolean;

  canRejectForceClose: boolean;

  hasExclamationMark: boolean;

  didReachMaxRetries: boolean;
}

export class ForceClose {
  status: BatchTimelineStatus;
  retriedCnt: number;
  timeline: ForceCloseTimelineResponseDto[];
}

export class ForceCloseTimelineResponseDto {
  userId: string;
  userEmail: string;
  remark: string;
  date: string;
  status: BatchTimelineStatus;
}

export type ForceCloseRequestType = 'request' | 'approve' | 'reject';
