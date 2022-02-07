import {PaginationParams} from 'src/shared/interfaces/pagination.interface';

export enum OperationTypes {
  EARN = 'earn',
  REDEEM = 'redeem',
  EARN_REVERSAL = 'earnReversal',
  EARN_VOID = 'earnVoid',
  REDEEM_AUTH = 'redeemAuth',
  REDEEM_CAPTURE = 'redeemCapture',
  REDEEM_REVERSAL = 'redeemReversal',
  REDEEM_VOID = 'redeemVoid',
  // For loyalty transaction outside of Setel, e.g. Mesra transaction
  EXTERNAL_EARN = 'externalEarn',
  EXTERNAL_REDEEM = 'externalRedeem',
  ADJUSTMENT = 'adjustment',
  REVERSAL = 'reversal',
  TRANSFER = 'transfer',
}

export enum TransactionStatus {
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

export const TransactionStatusName = new Map<TransactionStatus, {text?: string; color?: string}>([
  [TransactionStatus.SUCCESSFUL, {text: 'Approved', color: 'success'}],
  [TransactionStatus.FAILED, {text: 'Failed', color: 'error'}],
  [TransactionStatus.REJECTED, {text: 'Rejected', color: 'error'}],
  [TransactionStatus.PENDING, {text: 'Pending', color: 'warning'}],
]);

export enum AdjustmentTypes {
  GRANT = 'grant',
  REVOKE = 'revoke',
}

export enum AdjustmentApprovalStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export const AdjustmentTypesName = new Map<AdjustmentTypes, string>([
  [AdjustmentTypes.GRANT, 'Grant loyalty points (CR)'],
  [AdjustmentTypes.REVOKE, 'Revoke loyalty points (DR)'],
]);

export type PointsTransferParams = {
  referenceId?: string;
  sourceCardNumber: string;
  destinationCardNumber: string;
  amount: number;
  merchantId?: string;
  remarks?: string;
};

export type PointsTransferResponse = {
  id: string;
  cardNumber: string;
  operationType: OperationTypes;
  status: TransactionStatus;
  pointsAmount: number;
  approvalCode: string;
  expiryDate?: string;
  processDate: string;
};

export type PointsAdjustmentParams = {
  referenceId?: string;
  cardNumber: string;
  adjustmentType: AdjustmentTypes;
  amount: number;
  merchantId?: string;
  remarks?: string;
  attachment?: string;
};

export type PointsAdjusmentApprovalParams = {
  referenceId?: string;
  cardNumber?: string;
  adjustmentStatus: AdjustmentApprovalStatus;
  workflowId?: string;
};

export type PointsAdjustmentResponse = {
  id: string;
  cardNumber: string;
  operationType: OperationTypes;
  status: TransactionStatus;
  pointsAmount: number;
  approvalCode: string;
  expiryDate?: string;
  processDate: string;
};

export type PointsTransactionsQuery = PaginationParams & {
  cardNumber?: string;
  loyaltyMembersId?: string;
  referenceId?: string;
  operationType?: OperationTypes;
  status?: TransactionStatus;
  merchantId?: string;
  approvalCode?: string;
  transactionDateTimeSince: string;
  transactionDateTimeUntil: string;
  loyaltyCategoryCode: string;
  expiryDateSince: string;
  expiryDateUntil: string;
};

export type Transaction = {
  id: string;
  cardNumber: string;
  sourceCardNumber?: string;
  destinationCardNumber?: string;
  loyaltyMembersId: string;
  referenceId: string;
  operationType: OperationTypes;
  status: TransactionStatus;
  merchantId?: string;
  amount: number;
  pointsAmount: number;
  approvalCode?: string;
  transactionDateTime: string;
  remarks?: string;
  failureReason?: string;
  loyaltyCategories?: any;
  originalTransactionDetails?: any;
  expiryDate?: string;
  createdAt?: string;
  workflowId?: string;
  attachment?: string;
  updatedAt?: string;
};
