import {BadgeProps, TimelineItemProps} from '@setel/portal-ui';

export enum TerminalStatus {
  NEW = 'NEW',
  CREATED = 'CREATED',
  ACTIVATED = 'ACTIVATED',
  DEPLOYED = 'DEPLOYED',
  SUSPENDED = 'SUSPENDED',
  TERMINATED = 'TERMINATED',
  LOST = 'LOST',
  DEACTIVATED = 'DEACTIVATED',
}

export enum AcquirerType {
  MAYBANK = 'maybank',
  CIMB = 'cimb',
  FLEET = 'fleet',
}

export enum CardBrand {
  AMERICAN_EXPRESS = 'americanExpress',
  MASTER_CARD = 'mastercard',
  MYDEBIT = 'myDebit',
  PETRONAS_SMARTPAY = 'petronasSmartpay',
  VISA = 'visa',
}

export const AcquirerTypePrettyTextMapping: Record<AcquirerType, string> = {
  [AcquirerType.MAYBANK]: 'Maybank',
  [AcquirerType.CIMB]: 'CIMB',
  [AcquirerType.FLEET]: 'Fleet',
};

export const CardBrandPrettyTextMapping: Record<CardBrand, string> = {
  [CardBrand.AMERICAN_EXPRESS]: 'AMEX',
  [CardBrand.MASTER_CARD]: 'Mastercard',
  [CardBrand.MYDEBIT]: 'MyDebit',
  [CardBrand.PETRONAS_SMARTPAY]: 'PETRONAS SmartPay',
  [CardBrand.VISA]: 'Visa',
};

const BASE_ASSETS_CARD_BRAND_URL = 'assets/images/payment-method-logo';
const BASE_ASSETS_ACQUIRER_TYPE_URL = 'assets/images/acquirer-logo';

export const CardBrandIconMapping: Record<CardBrand, string> = {
  [CardBrand.AMERICAN_EXPRESS]: `${BASE_ASSETS_CARD_BRAND_URL}/american-express.svg`,
  [CardBrand.MASTER_CARD]: `${BASE_ASSETS_CARD_BRAND_URL}/mastercard.svg`,
  [CardBrand.MYDEBIT]: `${BASE_ASSETS_CARD_BRAND_URL}/mydebit.svg`,
  [CardBrand.PETRONAS_SMARTPAY]: `${BASE_ASSETS_CARD_BRAND_URL}/petronas-smart-pay.svg`,
  [CardBrand.VISA]: `${BASE_ASSETS_CARD_BRAND_URL}/visa.svg`,
};

export const AcquirerTypeBrandIconMapping: Record<AcquirerType, string> = {
  [AcquirerType.MAYBANK]: `${BASE_ASSETS_ACQUIRER_TYPE_URL}/maybank.svg`,
  [AcquirerType.CIMB]: `${BASE_ASSETS_ACQUIRER_TYPE_URL}/cimb.svg`,
  [AcquirerType.FLEET]: `${BASE_ASSETS_ACQUIRER_TYPE_URL}/fleet.svg`,
};

export enum TerminalHost {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

export const TerminalInventoryStatusOptions = [
  {label: 'New', value: TerminalStatus.NEW},
  {label: 'Created', value: TerminalStatus.CREATED},
  {label: 'Deactivated', value: TerminalStatus.DEACTIVATED},
];

export const TerminalStatusOptions = [
  {label: 'Created', value: TerminalStatus.CREATED},
  {label: 'Activated', value: TerminalStatus.ACTIVATED},
  {label: 'Deployed', value: TerminalStatus.DEPLOYED},
  {label: 'Suspended', value: TerminalStatus.SUSPENDED},
  {label: 'Terminated', value: TerminalStatus.TERMINATED},
  {label: 'Lost', value: TerminalStatus.LOST},
];

export const EditTerminalStatusOptions = [
  {label: 'Suspended', value: TerminalStatus.SUSPENDED},
  {label: 'Terminated', value: TerminalStatus.TERMINATED},
  {label: 'Lost', value: TerminalStatus.LOST},
  {label: 'Deactivated', value: TerminalStatus.DEACTIVATED},
];

export const EditTerminalStatus = [
  TerminalStatus.SUSPENDED,
  TerminalStatus.TERMINATED,
  TerminalStatus.LOST,
  TerminalStatus.DEACTIVATED,
];

export const TerminalHostRegCardBrandOptions = [
  {
    label: CardBrandPrettyTextMapping[CardBrand.AMERICAN_EXPRESS],
    value: CardBrand.AMERICAN_EXPRESS,
  },
  {label: CardBrandPrettyTextMapping[CardBrand.MASTER_CARD], value: CardBrand.MASTER_CARD},
  {label: CardBrandPrettyTextMapping[CardBrand.MYDEBIT], value: CardBrand.MYDEBIT},
  {label: CardBrandPrettyTextMapping[CardBrand.VISA], value: CardBrand.VISA},
  {
    label: CardBrandPrettyTextMapping[CardBrand.PETRONAS_SMARTPAY],
    value: CardBrand.PETRONAS_SMARTPAY,
  },
];

export const TerminalHostRegAcquirerTypeOptions = [
  {label: AcquirerTypePrettyTextMapping[AcquirerType.MAYBANK], value: AcquirerType.MAYBANK},
  {label: AcquirerTypePrettyTextMapping[AcquirerType.CIMB], value: AcquirerType.CIMB},
  {label: AcquirerTypePrettyTextMapping[AcquirerType.FLEET], value: AcquirerType.FLEET},
];

export enum TerminalType {
  EDC = 'EDC',
}

export const TerminalTypeOptions = [{label: TerminalType.EDC, value: TerminalType.EDC}];

export const TerminalHostColorMap: Record<TerminalHost, BadgeProps['color']> = {
  [TerminalHost.ENABLED]: 'success',
  [TerminalHost.DISABLED]: 'grey',
};

export const TerminalHostEnabledTextMapping: Record<TerminalHost, string> = {
  [TerminalHost.ENABLED]: 'ENABLED',
  [TerminalHost.DISABLED]: 'DISABLED',
};

export const TerminalStatusColorMap: Record<TerminalStatus, BadgeProps['color']> = {
  [TerminalStatus.NEW]: 'success',
  [TerminalStatus.CREATED]: 'purple',
  [TerminalStatus.ACTIVATED]: 'success',
  [TerminalStatus.DEPLOYED]: 'warning',
  [TerminalStatus.SUSPENDED]: 'error',
  [TerminalStatus.TERMINATED]: 'grey',
  [TerminalStatus.LOST]: 'grey',
  [TerminalStatus.DEACTIVATED]: 'grey',
};

export const TerminalStatusTimelineColorMap: Record<TerminalStatus, TimelineItemProps['color']> = {
  [TerminalStatus.NEW]: 'success',
  [TerminalStatus.CREATED]: 'purple',
  [TerminalStatus.ACTIVATED]: 'success',
  [TerminalStatus.DEPLOYED]: 'warning',
  [TerminalStatus.SUSPENDED]: 'error',
  [TerminalStatus.TERMINATED]: 'grey',
  [TerminalStatus.LOST]: 'grey',
  [TerminalStatus.DEACTIVATED]: 'grey',
};

export enum SetelTerminalErrorCodes {
  DUPLICATE_KEY = '9606113',
}

export enum SetelTerminalErrorMessage {
  SERIAL_NUM_ALPHANUMERIC = 'Serial number must be alphanumeric.',
  DUPLICATE_KEY = 'Serial number already exist.',
  DEACTIVATION_UNKNOWN_PENDING_SETTLEMENT = 'Unable to check pending settlement, please try again.',
  DEACTIVATION_HAS_PENDING_SETTLEMENT = 'Please clear the pending settlement and open batches.',
}

export enum SetelTerminalNotificationMessage {
  UPDATE_SUCCESS = 'Terminal details has been successfully updated.',
  CREATE_SUCCESS = 'Terminal details has been successfully created.',
  DELETE_SUCCESS = 'Terminal details has been successfully deleted.',
  TERMINAL_UNLOCK_TITLE = 'Terminal is unlocked!',
  TERMINAL_UNLOCK_DESCRIPTION = 'Merchant passcode retry counter has been restarted.',
  TERMINAL_UNLOCK_TITLE_ERROR = 'Unlock terminal failed!',
  TERMINAL_UNLOCK_DESCRIPTION_ERROR = 'Unknown error occured',
  TERMINAL_DEACTIVATE_SUCCESS_TITLE = 'Terminal has been successfully deactivated.',
  TERMINAL_DEACTIVATE_SUCCESS_DESCRIPTION = 'This terminal has been moved to inventory.',
}

export enum SetelTerminalMessage {
  HAS_PENDING_SETTLEMENT = 'To disable the configuration, please clear the pending settlement and open batches.',
}

export interface CardBrandOption {
  value: CardBrand;
  label: string;
}

export enum TerminalSwitchSource {
  SETEL = 'setel',
  INVENCO = 'invenco',
}
