export enum ORDER_STATES {
  FUEL_ORDER_INIT = 'FUEL_ORDER_INIT',
  FUEL_ORDER_INIT_SUCCESS = 'FUEL_ORDER_INIT_SUCCESS',
  FUEL_ORDER_INIT_ERROR = 'FUEL_ORDER_INIT_ERROR',
  FUEL_ORDER_EXTERNAL_INIT = 'FUEL_ORDER_EXTERNAL_INIT',
  FUEL_ORDER_EXTERNAL_INIT_SUCCESS = 'FUEL_ORDER_EXTERNAL_INIT_SUCCESS',
  FUEL_ORDER_EXTERNAL_INIT_ERROR = 'FUEL_ORDER_EXTERNAL_INIT_ERROR',
  FUEL_ORDER_EXTERNAL_PAYMENT = 'FUEL_ORDER_EXTERNAL_PAYMENT',
  FUEL_ORDER_EXTERNAL_PAYMENT_SUCCESS = 'FUEL_ORDER_EXTERNAL_PAYMENT_SUCCESS',
  FUEL_ORDER_EXTERNAL_PAYMENT_ERROR = 'FUEL_ORDER_EXTERNAL_PAYMENT_ERROR',
  FUEL_ORDER_TRANSACTION_STARTED = 'FUEL_ORDER_TRANSACTION_STARTED',
  FUEL_ORDER_TRANSACTION_STARTED_SUCCESS = 'FUEL_ORDER_TRANSACTION_STARTED_SUCCESS',
  FUEL_ORDER_TRANSACTION_STARTED_ERROR = 'FUEL_ORDER_TRANSACTION_STARTED_ERROR',
  FUEL_ORDER_TRANSACTION_STARTED_NO_RESP = 'FUEL_ORDER_TRANSACTION_STARTED_NO_RESP',
  FUEL_ORDER_TRANSACTION_STARTED_SKIPPED = 'FUEL_ORDER_TRANSACTION_STARTED_SKIPPED',
  FUEL_ORDER_PRE_AUTH_STARTED = 'FUEL_ORDER_PRE_AUTH_STARTED',
  FUEL_ORDER_PRE_AUTH_STARTED_SUCCESS = 'FUEL_ORDER_PRE_AUTH_STARTED_SUCCESS',
  FUEL_ORDER_PRE_AUTH_STARTED_ERROR = 'FUEL_ORDER_PRE_AUTH_STARTED_ERROR',
  FUEL_ORDER_PRE_AUTH_STARTED_NO_RESP = 'FUEL_ORDER_PRE_AUTH_STARTED_NO_RESP',
  FUEL_ORDER_FULFILL_STARTED = 'FUEL_ORDER_FULFILL_STARTED',
  FUEL_ORDER_FULFILL_STARTED_SUCCESS = 'FUEL_ORDER_FULFILL_STARTED_SUCCESS',
  FUEL_ORDER_FULFILL_STARTED_ERROR = 'FUEL_ORDER_FULFILL_STARTED_ERROR',
  FUEL_ORDER_FULFILL_STARTED_NO_RESP = 'FUEL_ORDER_FULFILL_STARTED_NO_RESP',
  FUEL_ORDER_FULFILL_CONFIRMATION_STARTED = 'FUEL_ORDER_FULFILL_CONFIRMATION_STARTED',
  FUEL_ORDER_FULFILL_CONFIRMATION_SUCCESS = 'FUEL_ORDER_FULFILL_CONFIRMATION_SUCCESS',
  FUEL_ORDER_FULFILL_CONFIRMATION_ERROR = 'FUEL_ORDER_FULFILL_CONFIRMATION_ERROR',
  FUEL_ORDER_FULFILL_CONFIRMATION_NO_RESP = 'FUEL_ORDER_FULFILL_CONFIRMATION_NO_RESP',
  FUEL_ORDER_CHARGE = 'FUEL_ORDER_CHARGE',
  FUEL_ORDER_CHARGE_SUCCESS = 'FUEL_ORDER_CHARGE_SUCCESS',
  FUEL_ORDER_CHARGE_ERROR = 'FUEL_ORDER_CHARGE_ERROR',
  FUEL_ORDER_CHARGE_NO_RESP = 'FUEL_ORDER_CHARGE_NO_RESP',
  FUEL_ORDER_RECOVERY_CHARGE = 'FUEL_ORDER_RECOVERY_CHARGE',
  FUEL_ORDER_RECOVERY_CHARGE_SUCCESS = 'FUEL_ORDER_RECOVERY_CHARGE_SUCCESS',
  FUEL_ORDER_RECOVERY_CHARGE_ERROR = 'FUEL_ORDER_RECOVERY_CHARGE_ERROR',
  FUEL_ORDER_RECOVERY_CHARGE_NO_RESP = 'FUEL_ORDER_RECOVERY_CHARGE_NO_RESP',
  FUEL_ORDER_CONFIRM = 'FUEL_ORDER_CONFIRM',
  FUEL_ORDER_CONFIRM_SUCCESS = 'FUEL_ORDER_CONFIRM_SUCCESS',
  FUEL_ORDER_CONFIRM_ERROR = 'FUEL_ORDER_CONFIRM_ERROR',
  FUEL_ORDER_REWARDS_CREATE_ACTION = 'FUEL_ORDER_REWARDS_CREATE_ACTION',
  FUEL_ORDER_REWARDS_CREATE_ACTION_SUCCESS = 'FUEL_ORDER_REWARDS_CREATE_ACTION_SUCCESS',
  FUEL_ORDER_REWARDS_CREATE_ACTION_NO_RESP = 'FUEL_ORDER_REWARDS_CREATE_ACTION_NO_RESP',
  FUEL_ORDER_REWARDS_CREATE_ACTION_ERROR = 'FUEL_ORDER_REWARDS_CREATE_ACTION_ERROR',
  FUEL_ORDER_LOYALTY_POINTS_SETEL = 'FUEL_ORDER_LOYALTY_POINTS_SETEL',
  FUEL_ORDER_LOYALTY_POINTS_SETEL_SUCCESS = 'FUEL_ORDER_LOYALTY_POINTS_SETEL_SUCCESS',
  FUEL_ORDER_LOYALTY_POINTS_SETEL_SKIPPED = 'FUEL_ORDER_LOYALTY_POINTS_SETEL_SKIPPED',
  FUEL_ORDER_LOYALTY_POINTS_SETEL_NO_RESP = 'FUEL_ORDER_LOYALTY_POINTS_SETEL_NO_RESP',
  FUEL_ORDER_LOYALTY_POINTS_SETEL_ERROR = 'FUEL_ORDER_LOYALTY_POINTS_SETEL_ERROR',
  FUEL_ORDER_LOYALTY_POINTS_PETRONAS = 'FUEL_ORDER_LOYALTY_POINTS_PETRONAS',
  FUEL_ORDER_LOYALTY_POINTS_PETRONAS_SKIPPED = 'FUEL_ORDER_LOYALTY_POINTS_PETRONAS_SKIPPED',
  FUEL_ORDER_LOYALTY_POINTS_PETRONAS_SUCCESS = 'FUEL_ORDER_LOYALTY_POINTS_PETRONAS_SUCCESS',
  FUEL_ORDER_LOYALTY_POINTS_PETRONAS_NO_RESP = 'FUEL_ORDER_LOYALTY_POINTS_PETRONAS_NO_RESP',
  FUEL_ORDER_LOYALTY_POINTS_PETRONAS_ERROR = 'FUEL_ORDER_LOYALTY_POINTS_PETRONAS_ERROR',
  FUEL_ORDER_LOYALTY_POINTS_FINISHED = 'FUEL_ORDER_LOYALTY_POINTS_FINISHED',
  FUEL_ORDER_FULFILL_CONFIRMATION_LOST = 'FUEL_ORDER_FULFILL_CONFIRMATION_LOST',
  ORDER_CANCELED = 'ORDER_CANCELED',
}

export const FuelColorState = {
  [ORDER_STATES.FUEL_ORDER_LOYALTY_POINTS_PETRONAS]: 'warning',
  [ORDER_STATES.FUEL_ORDER_LOYALTY_POINTS_SETEL_SKIPPED]: 'warning',
  [ORDER_STATES.FUEL_ORDER_LOYALTY_POINTS_PETRONAS_NO_RESP]: 'warning',
  [ORDER_STATES.FUEL_ORDER_REWARDS_CREATE_ACTION_NO_RESP]: 'warning',
  [ORDER_STATES.FUEL_ORDER_RECOVERY_CHARGE_NO_RESP]: 'warning',
  [ORDER_STATES.FUEL_ORDER_CHARGE_NO_RESP]: 'warning',
  [ORDER_STATES.FUEL_ORDER_FULFILL_CONFIRMATION_NO_RESP]: 'warning',
  [ORDER_STATES.FUEL_ORDER_FULFILL_STARTED_NO_RESP]: 'warning',
  [ORDER_STATES.FUEL_ORDER_PRE_AUTH_STARTED_NO_RESP]: 'warning',
  [ORDER_STATES.FUEL_ORDER_TRANSACTION_STARTED_SKIPPED]: 'warning',
  [ORDER_STATES.FUEL_ORDER_TRANSACTION_STARTED_NO_RESP]: 'warning',

  [ORDER_STATES.FUEL_ORDER_LOYALTY_POINTS_PETRONAS_ERROR]: 'error',
  [ORDER_STATES.FUEL_ORDER_LOYALTY_POINTS_SETEL_ERROR]: 'error',
  [ORDER_STATES.FUEL_ORDER_REWARDS_CREATE_ACTION_ERROR]: 'error',
  [ORDER_STATES.FUEL_ORDER_REWARDS_CREATE_ACTION_ERROR]: 'error',
  [ORDER_STATES.FUEL_ORDER_REWARDS_CREATE_ACTION_ERROR]: 'error',
  [ORDER_STATES.FUEL_ORDER_CHARGE_ERROR]: 'error',
  [ORDER_STATES.FUEL_ORDER_FULFILL_CONFIRMATION_ERROR]: 'error',
  [ORDER_STATES.FUEL_ORDER_FULFILL_STARTED_ERROR]: 'error',
  [ORDER_STATES.FUEL_ORDER_PRE_AUTH_STARTED_ERROR]: 'error',
  [ORDER_STATES.FUEL_ORDER_TRANSACTION_STARTED_ERROR]: 'error',

  [ORDER_STATES.FUEL_ORDER_LOYALTY_POINTS_PETRONAS_SUCCESS]: 'success',
  [ORDER_STATES.FUEL_ORDER_LOYALTY_POINTS_SETEL_SUCCESS]: 'success',
  [ORDER_STATES.FUEL_ORDER_REWARDS_CREATE_ACTION_SUCCESS]: 'success',
  [ORDER_STATES.FUEL_ORDER_CONFIRM_SUCCESS]: 'success',
  [ORDER_STATES.FUEL_ORDER_RECOVERY_CHARGE_SUCCESS]: 'success',
  [ORDER_STATES.FUEL_ORDER_CHARGE_SUCCESS]: 'success',
  [ORDER_STATES.FUEL_ORDER_FULFILL_CONFIRMATION_SUCCESS]: 'success',
  [ORDER_STATES.FUEL_ORDER_FULFILL_STARTED_SUCCESS]: 'success',
  [ORDER_STATES.FUEL_ORDER_PRE_AUTH_STARTED_SUCCESS]: 'success',
  [ORDER_STATES.FUEL_ORDER_TRANSACTION_STARTED_SUCCESS]: 'success',
  [ORDER_STATES.FUEL_ORDER_EXTERNAL_PAYMENT_SUCCESS]: 'success',
  [ORDER_STATES.FUEL_ORDER_EXTERNAL_INIT_SUCCESS]: 'success',
  [ORDER_STATES.FUEL_ORDER_INIT_SUCCESS]: 'success',
} as const;
