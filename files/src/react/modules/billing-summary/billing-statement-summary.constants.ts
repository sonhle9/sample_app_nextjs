import {BadgeProps} from '@setel/portal-ui';

export enum StatementStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  PAYMENT_DUE = 'payment_due',
  PAID = 'paid',
}

export enum SummaryTypes {
  PURCHASE = 'PURCHASE',
  PAYMENT = 'PAYMENT',
  ADJUSTMENT = 'ADJUSTMENT',
  FEE_AND_CHARGES = 'FEE_AND_CHARGES',
}

export enum SubSummaryTypes {
  PURCHASE_CURRENT = 'PURCHASE_CURRENT',

  PAYMENT_CASH = 'PAYMENT_CASH',
  PAYMENT_CASH_SERVICE = 'PAYMENT_CASH_SERVICE',
  PAYMENT_CHEQUE = 'PAYMENT_CHEQUE',
  PAYMENT_CHEQUE_SERVICE = 'PAYMENT_CHEQUE_SERVICE',
  PAYMENT_VIRTUAL_ACCOUNT = 'PAYMENT_VIRTUAL_ACCOUNT',
  PAYMENT_TOP_UP = 'PAYMENT_TOP_UP',

  ADJUSTMENT_DEBIT = 'ADJUSTMENT_DEBIT',
  ADJUSTMENT_CREDIT = 'ADJUSTMENT_CREDIT',
  ADJUSTMENT_VOLUMEREBATE_OR_CREDIT = 'ADJUSTMENT_VOLUMEREBATE_OR_CREDIT',
  ADJUSTMENT_DEBIT_CHEQUE_FEE = 'ADJUSTMENT_DEBIT_CHEQUE_FEE',
  ADJUSTMENT_SUBSIDY_REBATE_OR_CREDIT = 'ADJUSTMENT_SUBSIDY_REBATE_OR_CREDIT',

  FEE_AND_CHARGES_PRINTING = 'FEE_AND_CHARGES_PRINTING',
  FEE_AND_CHARGES_WAIVE = 'FEE_AND_CHARGES_WAIVE',
  FEE_AND_CHARGES_PENALTY_CHARGE = 'FEE_AND_CHARGES_PENALTY_CHARGE',
}

export const SummaryTypesTextPair = {
  [SummaryTypes.ADJUSTMENT]: 'Adjustment',
  [SummaryTypes.FEE_AND_CHARGES]: 'Fee & Charges',
  [SummaryTypes.PAYMENT]: 'Payment',
  [SummaryTypes.PURCHASE]: 'Purchase',
};

export const TitleStatementTransaction = {
  [SubSummaryTypes.PURCHASE_CURRENT]: 'Purchase details',

  [SubSummaryTypes.PAYMENT_TOP_UP]: 'Top-up details',
  [SubSummaryTypes.PAYMENT_VIRTUAL_ACCOUNT]: 'Payment through virtual account',
  [SubSummaryTypes.PAYMENT_CHEQUE]: 'Cheque payment through bank',
  [SubSummaryTypes.PAYMENT_CASH]: 'Cash payment through bank',
  [SubSummaryTypes.PAYMENT_CASH_SERVICE]: 'Cash payment through bank (collect service)',
  [SubSummaryTypes.PAYMENT_CHEQUE_SERVICE]: 'Cheque payment through bank (collect service)',

  [SubSummaryTypes.ADJUSTMENT_SUBSIDY_REBATE_OR_CREDIT]: 'Subsidy rebate transaction details',
  [SubSummaryTypes.ADJUSTMENT_VOLUMEREBATE_OR_CREDIT]: 'Volume rebate transaction details',
  [SubSummaryTypes.ADJUSTMENT_CREDIT]: 'Credit adjustment',
  [SubSummaryTypes.ADJUSTMENT_DEBIT]: 'Debit adjustment',

  [SubSummaryTypes.FEE_AND_CHARGES_PRINTING]: 'Charge',
  [SubSummaryTypes.FEE_AND_CHARGES_WAIVE]: 'Waive',
  [SubSummaryTypes.FEE_AND_CHARGES_PENALTY_CHARGE]: 'Penalty',
};

export const SubSummaryTypesTextPair = {
  [SubSummaryTypes.PURCHASE_CURRENT]: 'Current purchase',
  [SubSummaryTypes.PAYMENT_CASH]: 'Cash payment through bank',
  [SubSummaryTypes.PAYMENT_CASH_SERVICE]: 'Cash payment through bank (collect service)',
  [SubSummaryTypes.PAYMENT_CHEQUE]: 'Cheque payment through bank',
  [SubSummaryTypes.PAYMENT_CHEQUE_SERVICE]: 'Cheque payment through bank (collect service)',
  [SubSummaryTypes.PAYMENT_VIRTUAL_ACCOUNT]: 'Payment through virtual account',
  [SubSummaryTypes.PAYMENT_TOP_UP]: 'Top-up',

  [SubSummaryTypes.ADJUSTMENT_DEBIT]: 'Debit adjustment',
  [SubSummaryTypes.ADJUSTMENT_CREDIT]: 'Credit adjustment',
  [SubSummaryTypes.ADJUSTMENT_VOLUMEREBATE_OR_CREDIT]:
    'Volume rebate or credit adjustment to rebate',
  [SubSummaryTypes.ADJUSTMENT_DEBIT_CHEQUE_FEE]: 'Debit adjustment to return cheque fee',
  [SubSummaryTypes.ADJUSTMENT_SUBSIDY_REBATE_OR_CREDIT]:
    'Subsidy rebate or credit adjustment to rebate',

  [SubSummaryTypes.FEE_AND_CHARGES_PRINTING]: 'SOA printing charges',
  [SubSummaryTypes.FEE_AND_CHARGES_WAIVE]: 'Waive',
  [SubSummaryTypes.FEE_AND_CHARGES_PENALTY_CHARGE]: 'Penalty',
};

export const mappingTransactionDesc = {
  [SubSummaryTypes.PURCHASE_CURRENT]: 'Current purchase',
  [SubSummaryTypes.PAYMENT_CASH]: 'Cash payment through bank',
  [SubSummaryTypes.PAYMENT_CASH_SERVICE]: 'Cash payment through bank (collect service)',
  [SubSummaryTypes.PAYMENT_CHEQUE]: 'Cheque payment through bank',
  [SubSummaryTypes.PAYMENT_CHEQUE_SERVICE]: 'Cheque payment through bank (collect service)',
  [SubSummaryTypes.PAYMENT_VIRTUAL_ACCOUNT]: 'Payment through virtual account',
  [SubSummaryTypes.PAYMENT_TOP_UP]: 'Top-up',

  [SubSummaryTypes.ADJUSTMENT_DEBIT]: 'Debit adjustment',
  [SubSummaryTypes.ADJUSTMENT_CREDIT]: 'Credit adjustment',
  [SubSummaryTypes.ADJUSTMENT_VOLUMEREBATE_OR_CREDIT]: 'Volume rebate',
  [SubSummaryTypes.ADJUSTMENT_DEBIT_CHEQUE_FEE]: 'Debit adjustment to return cheque fee',
  [SubSummaryTypes.ADJUSTMENT_SUBSIDY_REBATE_OR_CREDIT]:
    'Subsidy rebate or credit adjustment to rebate',

  [SubSummaryTypes.FEE_AND_CHARGES_PRINTING]: 'SOA printing charges',
  [SubSummaryTypes.FEE_AND_CHARGES_WAIVE]: 'Waive',
  [SubSummaryTypes.FEE_AND_CHARGES_PENALTY_CHARGE]: 'Penalty',
};

export const mappingStatusColor: Record<StatementStatus, BadgeProps['color']> = {
  [StatementStatus.PAID]: 'success',
  [StatementStatus.PAYMENT_DUE]: 'error',
  [StatementStatus.PENDING]: 'lemon',
  [StatementStatus.PARTIAL]: 'error',
};

export const mappingStatusName = {
  [StatementStatus.PAID]: 'PAID',
  [StatementStatus.PAYMENT_DUE]: 'PAYMENT DUE',
  [StatementStatus.PENDING]: 'PENDING',
  [StatementStatus.PARTIAL]: 'PARTIAL',
};

export enum MerchantTypes {
  SMART_PAY_ACCOUNT = 'smartPayAccount',
}

export enum BalanceStatus {
  INIT = 'init',
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
}

export const mappingBalanceStatus = {
  [BalanceStatus.PAID]: 'PAID',
  [BalanceStatus.OVERDUE]: 'OVERDUE',
  [BalanceStatus.PENDING]: 'PENDING',
  [BalanceStatus.INIT]: 'INIT',
};

export const BalanceStatusOptions = [
  {
    label: 'All statuses',
    value: '',
  },
  {
    label: 'Init',
    value: BalanceStatus.INIT,
  },
  {
    label: 'Pending',
    value: BalanceStatus.PENDING,
  },
  {
    label: 'Paid',
    value: BalanceStatus.PAID,
  },
  {
    label: 'Overdue',
    value: BalanceStatus.OVERDUE,
  },
];
