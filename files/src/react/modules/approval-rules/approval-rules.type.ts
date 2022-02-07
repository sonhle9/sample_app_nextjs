interface IRequest {
  perPage?: number;
  page?: number;
}

export type ApprovalRuleStatus = 'active' | 'disabled';

export type ApprovalRuleLevel =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15';

export interface IApprovalRulesRequest extends IRequest {
  feature?: EFeature_Type;
  status?: ApprovalRuleStatus;
  level?: ApprovalRuleLevel;
}

export interface IApproversRequest extends IRequest {
  userEmail: string;
}

export interface IApprover {
  id: string;
  userEmail: string;
  approvalLimit: number;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Levels {
  level: ApprovalRuleLevel;
  approvers: IApprover[];
}

export interface IApprovalRule {
  id: string;
  feature: EFeature_Type;
  levels: Levels[];
  status: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateApprovalRuleInput {
  feature: EFeature_Type;
  levels: Levels[];
  status: ApprovalRuleStatus;
}

export interface IUpdateApprovalRuleInput {
  id: string;
  feature: EFeature_Type;
  levels: Levels[];
  status: ApprovalRuleStatus;
}

export enum Statuses {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

export enum EFeature_Type {
  CARD_CREATE = 'card_create',
  CARDTRANSFER_CREATE = 'cardTransfer_create',
  PAYMENT_CREATE = 'payment_create',
  TRANSFER_CREATE = 'transfer_create',
  ADJUST_CREATE = 'adjust_create',
  BULKTRANSFER_CREATE = 'bulkTransfer_create',
  BULKMERCHANTADJUSTMENT = 'bulkmerchantAdjustment_create',
  MERCHANTTOPUP_CREATE = 'merchantTopUp_create',
  BULKMERCHANTTOPUP_CREATE = 'bulkmerchantTopUp_create',
  MERCHANTADJUST_CREATE = 'merchantAdjust_create',
  FLEET_CARD_REPLACEMENT = 'fleet_card_replacement',
  FLEETCARDREPLACEMENT_CREATE = 'fleetCardReplacement_create',
  PREPAIDFLEETACCOUNT_CREATE = 'prepaidFleetAccount_creation',
  POSTPAIDFLEETACCOUNT_CREATE = 'postpaidFleetAccount_creation',
  FLEETCARD_CREATE = 'fleetCard_create',
  LOYALTY_ADJUSTMENT = 'loyalty_adjustment',
}

export const EFeatureTypeText = {
  [EFeature_Type.CARD_CREATE]: 'Gift card creation',
  [EFeature_Type.CARDTRANSFER_CREATE]: 'Gift card creation with transfer',
  [EFeature_Type.PAYMENT_CREATE]: 'Merchant payment',
  [EFeature_Type.TRANSFER_CREATE]: 'Gift card transfer',
  [EFeature_Type.ADJUST_CREATE]: 'Gift card adjustment',
  [EFeature_Type.BULKTRANSFER_CREATE]: 'File upload - gift card transfer',
  [EFeature_Type.BULKMERCHANTADJUSTMENT]: 'File upload merchant payment',
  [EFeature_Type.MERCHANTTOPUP_CREATE]: 'Merchant topup create',
  [EFeature_Type.BULKMERCHANTTOPUP_CREATE]: 'Bulk merchant top up create',
  [EFeature_Type.MERCHANTADJUST_CREATE]: 'Merchant adjust create',
  [EFeature_Type.FLEETCARDREPLACEMENT_CREATE]: 'Fleet card replacement',
  [EFeature_Type.PREPAIDFLEETACCOUNT_CREATE]: 'Fleet prepaid account creation',
  [EFeature_Type.POSTPAIDFLEETACCOUNT_CREATE]: 'Fleet postpaid account creation',
  [EFeature_Type.FLEETCARD_CREATE]: 'Fleet card creation',
  [EFeature_Type.LOYALTY_ADJUSTMENT]: 'Loyalty Point Adjustment',
};

export enum Mode {
  EDIT_GENERAL = 'edit_general',
  EDIT_APPROVER = 'edit_approver',
  ADD = 'add',
}
