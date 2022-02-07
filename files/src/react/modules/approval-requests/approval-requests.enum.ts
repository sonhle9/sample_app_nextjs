export enum EApprovalRequestsStatus {
  CANCELLED = 'cancelled',
  VERIFIED = 'verified',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING = 'pending',
  FAILED = 'failed',
  PROCESSING = 'processing',
}

export enum EApprovalRequestsFeature {
  CARD_CREATE = 'card_create',
  CARDTRANSFER_CREATE = 'cardTransfer_create',
  PAYMENT_CREATE = 'payment_create',
  TRANSFER_CREATE = 'transfer_create',
  ADJUST_CREATE = 'adjust_create',
  // MERCHANTADJUSTMENT_CREATE = 'merchantAdjustment_create',
  BULKMERCHANTADJUSTMENT_CREATE = 'bulkmerchantAdjustment_create',
  BULKTRANSFER_CREATE = 'bulkTransfer_create',
  // BULKMERCHANTADJUSTMENT = 'bulkmerchantAdjustment_create',
  MERCHANTTOPUP_CREATE = 'merchantTopUp_create',
  BULKMERCHANTTOPUP_CREATE = 'bulkmerchantTopUp_create',
  MERCHANTADJUST_CREATE = 'merchantAdjust_create',
  FLEETCARDREPLACEMENT_CREATE = 'fleetCardReplacement_create',
  // FLEETACCOUNT_CREATE = 'fleetAccount_create',
  FLEETCARD_CREATE = 'fleetCard_create',
  LOYALTY_ADJUSTMENT = 'loyalty_adjustment',
  FLEET_POSTPAID_ACCOUNT_CREATION = 'postpaidFleetAccount_creation',
  FLEET_PREPAID_ACCOUNT_CREATION = 'prepaidFleetAccount_creation',
  CREDIT_PERIOD_OVERRUN_CREATION = 'fleetAccountCreditPeriodOverrun_create',
  FLEET_REQUEST_FREEZE_ACCOUNT_CREATION = 'fleetRequestFreezeAccount_create',
  FLEET_BULK_IMPORT_ADJUSTMENTS = 'fleetBulkImportAdjustment_create',
}

export const EStatusTextPair = {
  [EApprovalRequestsStatus.CANCELLED]: 'Cancelled',
  [EApprovalRequestsStatus.VERIFIED]: 'Verified',
  [EApprovalRequestsStatus.APPROVED]: 'Approved',
  [EApprovalRequestsStatus.REJECTED]: 'Rejected',
  [EApprovalRequestsStatus.PENDING]: 'Pending',
  [EApprovalRequestsStatus.FAILED]: 'Failed',
};

export const EFeatureTextPair = {
  [EApprovalRequestsFeature.CARD_CREATE]: 'Gift card creation',
  [EApprovalRequestsFeature.CARDTRANSFER_CREATE]: 'Gift card creation with transfer',
  [EApprovalRequestsFeature.PAYMENT_CREATE]: 'Merchant payment',
  [EApprovalRequestsFeature.TRANSFER_CREATE]: 'Gift card transfer',
  [EApprovalRequestsFeature.ADJUST_CREATE]: 'Gift card adjustment',
  [EApprovalRequestsFeature.BULKMERCHANTADJUSTMENT_CREATE]: 'File upload merchant payment',
  [EApprovalRequestsFeature.BULKTRANSFER_CREATE]: 'File upload gift card transfer',
  [EApprovalRequestsFeature.MERCHANTTOPUP_CREATE]: 'Merchant topup create',
  [EApprovalRequestsFeature.BULKMERCHANTTOPUP_CREATE]: 'Bulk merchant top up create',
  [EApprovalRequestsFeature.MERCHANTADJUST_CREATE]: 'Merchant adjust create',
  [EApprovalRequestsFeature.FLEETCARDREPLACEMENT_CREATE]: 'Fleet card replacement',
  [EApprovalRequestsFeature.FLEETCARD_CREATE]: 'Fleet card creation',
  [EApprovalRequestsFeature.LOYALTY_ADJUSTMENT]: 'Loyalty Point Adjustment',
  [EApprovalRequestsFeature.FLEET_POSTPAID_ACCOUNT_CREATION]: 'Fleet postpaid account creation',
  [EApprovalRequestsFeature.FLEET_PREPAID_ACCOUNT_CREATION]: 'Fleet prepaid account creation',
  [EApprovalRequestsFeature.CREDIT_PERIOD_OVERRUN_CREATION]: 'Fleet account deferment period',
  [EApprovalRequestsFeature.FLEET_REQUEST_FREEZE_ACCOUNT_CREATION]: 'Fleet request freeze account',
  [EApprovalRequestsFeature.FLEET_BULK_IMPORT_ADJUSTMENTS]: 'Fleet bulk adjustments',
};

export interface OptStatusFilter {
  label: string;
  value: EApprovalRequestsStatus;
}

export interface OptFeatureFilter {
  label: string;
  value: EApprovalRequestsFeature;
}

export const optStatusFilter: OptStatusFilter[] = [
  {
    label: 'All status',
    value: '' as any,
  },
  {
    label: EStatusTextPair[EApprovalRequestsStatus.CANCELLED],
    value: EApprovalRequestsStatus.CANCELLED,
  },
  {
    label: EStatusTextPair[EApprovalRequestsStatus.VERIFIED],
    value: EApprovalRequestsStatus.VERIFIED,
  },
  {
    label: EStatusTextPair[EApprovalRequestsStatus.APPROVED],
    value: EApprovalRequestsStatus.APPROVED,
  },
  {
    label: EStatusTextPair[EApprovalRequestsStatus.REJECTED],
    value: EApprovalRequestsStatus.REJECTED,
  },
  {
    label: EStatusTextPair[EApprovalRequestsStatus.PENDING],
    value: EApprovalRequestsStatus.PENDING,
  },
  {
    label: EStatusTextPair[EApprovalRequestsStatus.FAILED],
    value: EApprovalRequestsStatus.FAILED,
  },
];

export const optFeatureFilter: OptFeatureFilter[] = [
  {
    label: 'All features',
    value: '' as any,
  },
  {
    label: EFeatureTextPair[EApprovalRequestsFeature.CARD_CREATE],
    value: EApprovalRequestsFeature.CARD_CREATE,
  },
  {
    label: EFeatureTextPair[EApprovalRequestsFeature.CARDTRANSFER_CREATE],
    value: EApprovalRequestsFeature.CARDTRANSFER_CREATE,
  },
  {
    label: EFeatureTextPair[EApprovalRequestsFeature.PAYMENT_CREATE],
    value: EApprovalRequestsFeature.PAYMENT_CREATE,
  },
  {
    label: EFeatureTextPair[EApprovalRequestsFeature.TRANSFER_CREATE],
    value: EApprovalRequestsFeature.TRANSFER_CREATE,
  },
  {
    label: EFeatureTextPair[EApprovalRequestsFeature.ADJUST_CREATE],
    value: EApprovalRequestsFeature.ADJUST_CREATE,
  },
  {
    label: EFeatureTextPair[EApprovalRequestsFeature.BULKMERCHANTADJUSTMENT_CREATE],
    value: EApprovalRequestsFeature.BULKMERCHANTADJUSTMENT_CREATE,
  },
  {
    label: EFeatureTextPair[EApprovalRequestsFeature.BULKTRANSFER_CREATE],
    value: EApprovalRequestsFeature.BULKTRANSFER_CREATE,
  },
  // {
  //   label: EFeatureTextPair[EApprovalRequestsFeature.BULKMERCHANTADJUSTMENT],
  //   value: EApprovalRequestsFeature.BULKMERCHANTADJUSTMENT,

  // },
  {
    label: EFeatureTextPair[EApprovalRequestsFeature.MERCHANTTOPUP_CREATE],
    value: EApprovalRequestsFeature.MERCHANTTOPUP_CREATE,
  },
  {
    label: EFeatureTextPair[EApprovalRequestsFeature.BULKMERCHANTTOPUP_CREATE],
    value: EApprovalRequestsFeature.BULKMERCHANTTOPUP_CREATE,
  },
  {
    label: EFeatureTextPair[EApprovalRequestsFeature.MERCHANTADJUST_CREATE],
    value: EApprovalRequestsFeature.MERCHANTADJUST_CREATE,
  },
  {
    label: EFeatureTextPair[EApprovalRequestsFeature.FLEETCARDREPLACEMENT_CREATE],
    value: EApprovalRequestsFeature.FLEETCARDREPLACEMENT_CREATE,
  },
  {
    label: EFeatureTextPair[EApprovalRequestsFeature.FLEETCARD_CREATE],
    value: EApprovalRequestsFeature.FLEETCARD_CREATE,
  },
  {
    label: EFeatureTextPair[EApprovalRequestsFeature.LOYALTY_ADJUSTMENT],
    value: EApprovalRequestsFeature.LOYALTY_ADJUSTMENT,
  },
  {
    label: EFeatureTextPair[EApprovalRequestsFeature.FLEET_POSTPAID_ACCOUNT_CREATION],
    value: EApprovalRequestsFeature.FLEET_POSTPAID_ACCOUNT_CREATION,
  },
  {
    label: EFeatureTextPair[EApprovalRequestsFeature.FLEET_PREPAID_ACCOUNT_CREATION],
    value: EApprovalRequestsFeature.FLEET_PREPAID_ACCOUNT_CREATION,
  },
  {
    label: EFeatureTextPair[EApprovalRequestsFeature.CREDIT_PERIOD_OVERRUN_CREATION],
    value: EApprovalRequestsFeature.CREDIT_PERIOD_OVERRUN_CREATION,
  },
  {
    label: EFeatureTextPair[EApprovalRequestsFeature.FLEET_REQUEST_FREEZE_ACCOUNT_CREATION],
    value: EApprovalRequestsFeature.FLEET_REQUEST_FREEZE_ACCOUNT_CREATION,
  },
  {
    label: EFeatureTextPair[EApprovalRequestsFeature.FLEET_BULK_IMPORT_ADJUSTMENTS],
    value: EApprovalRequestsFeature.FLEET_BULK_IMPORT_ADJUSTMENTS,
  },
];
