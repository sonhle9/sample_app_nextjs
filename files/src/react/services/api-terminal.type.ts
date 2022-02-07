import {PaginationParams} from '@setel/web-utils';
import {
  AcquirerType,
  TerminalStatus,
  TerminalSwitchSource,
  TerminalType,
} from '../modules/setel-terminals/setel-terminals.const';
import {CardBrand} from '../modules/terminal-switch-transactions/terminal-switch-transaction.type';

export enum EntryModes {
  SWIPE = 'swipe',
  CHIP = 'chip',
  CONTACTLESS = 'contactless',
}

export interface ITerminalMenu {
  isChargeEnabled: boolean;
  isSmartpaySaleEnabled: boolean;
  isTransactionEnabled: boolean;
  isTopUpEnabled: boolean;
  isCheckBalanceEnabled: boolean;
  isSettlementEnabled: boolean;
  isSettingsEnabled: boolean;
  isTmsFunctionsEnabled: boolean;
}
export interface ITimeline {
  status: TerminalStatus;
  date: Date;
}
export interface ILocation {
  type: ['Point'];
  coordinates?: [number, number];
}

export interface ITerminalMerchantPass {
  isEnabled: boolean;
  value: string;
}
export interface ITerminalMetrics {
  serialNum: string;
  environment?: string;
  pciPtsVersion?: string;
  pciPtsPoiProductType?: string;
  androidVersion?: string;
  imei?: string;
  screenWidth?: number;
  screenHeight?: number;
  firmwareVersion?: string;
  appVersion?: string;
  battery?: number;
  cpu?: number;
  ram?: number;
  freeStorage?: number;
  totalStorage?: number;
  wifiDetails?: Record<string, any>;
  simCardDetails?: Record<string, any>;
  location?: ILocation;
  createdAt: Date;
  updatedAt: Date;
}
export interface ITerminal {
  terminalId: string;
  status: string;
  reason?: string;
  type: TerminalType;
  serialNum: string;
  modelReference?: string;
  manufacturer?: string;
  deploymentDate?: Date;
  merchantId?: string;
  merchantName?: string;
  createdAt: string;
  updatedAt: string;
  remarks?: string;
  timeline: ITimeline[];
  metrics?: ITerminalMetrics;
  merchantPass: ITerminalMerchantPass;
  adminPass: string;
  lastSeenAt?: string;
  hostTerminalRegistration?: ITerminalHostTerminalRegistration[];
  allowedEntryModes: EntryModes[];
  myDebitOptIn: boolean;
  terminalMenu: ITerminalMenu;
}

export interface ITerminalInventory {
  terminalId: string;
  status: TerminalStatus;
  serialNum: string;
  createdAt: string;
}
export interface ITerminalRequest {
  merchantId: string;
  serialNum: string;
  remarks?: string;
}
export interface ITerminalUpdateRequest {
  status?: string;
  type?: TerminalType;
  merchantPass?: ITerminalMerchantPass;
  adminPass?: string;
  remarks?: string;
  shouldResetPasscodeCounter?: boolean;
  allowedEntryModes?: EntryModes[];
  myDebitOptIn?: boolean;
  terminalMenu?: ITerminalMenu;
}

export interface ITerminalAddHostTerminalRegRequest {
  acquirerType: string;
  cardBrand: CardBrand[];
  merchantId: string;
  terminalId: string;
}

export interface ITerminalEditHostTerminalRegRequest {
  cardBrand: CardBrand[];
  merchantId: string;
  terminalId: string;
  isEnabled: boolean;
}

export interface ITerminalFilterRequest extends PaginationParams {
  status?: string;
  type?: string;
  from?: string;
  to?: string;
  fromLastSeen?: string;
  toLastSeen?: string;
  merchantId?: string;
  terminalId?: string;
  serialNum?: string;
}

export interface ITerminalInventoryListingReq extends PaginationParams {
  status?: TerminalStatus;
  terminalId?: string;
  serialNum?: string;
  from?: string;
  to?: string;
}
export interface ITerminalTerminalIdFilterRequest {
  terminalId?: string;
}

export interface ISerialNumbers {
  id: string;
  serialNum: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITerminalIds {
  terminalId: string;
}

export interface ITerminalImportSerialNumbersFilterRequest {
  serialNum: string[];
}

export interface ITerminalHostTerminalRegistration {
  acquirerType: AcquirerType;
  batchNum: string;
  cardBrand: CardBrand[];
  currentStan: number;
  invoiceNum: number;
  isEnabled?: boolean;
  merchantId: string;
  terminalId: string;
  _id: string;
}

export interface ITerminalGetPendingSettlementReq {
  source: TerminalSwitchSource;
  merchantId: string;
  terminalId: string;
  acquirerType?: AcquirerType;
  batchNum?: string;
  acquirerTID?: string;
  acquirerMID?: string;
}

export interface IsPendingSettlementRes {
  isOpenBatch: boolean;
  isPendingSettlement: boolean;
}

export interface ISubmitButtonType {
  values: {
    acquirerType: string;
    cardBrand: CardBrand[];
    merchantId: string;
    terminalId: string;
    isEnabled: boolean;
    batchNum: string;
  };
  isEnabled: boolean;
}
