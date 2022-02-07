import {BadgeProps} from '@setel/portal-ui';

export enum ECardPinMailerStatus {
  READY = 'ready',
  PRINTING = 'printing',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

export enum ECardPinMailerType {
  REISSUE_NEW_PIN = 'reissueNewPIN',
  CARD_REPLACEMENT = 'cardReplacement',
  NEW_CARD = 'newCard',
}

export type OptCardPinMailerStatusFilter = {
  label: string;
  value: ECardPinMailerStatus;
};

export type OptCardPinMailerTypeFilter = {
  label: string;
  value: ECardPinMailerType;
};

export const cardPinMailerStatusTextPair = {
  [ECardPinMailerStatus.READY]: 'Ready',
  [ECardPinMailerStatus.PRINTING]: 'Printing',
  [ECardPinMailerStatus.SUCCEEDED]: 'Succeeded',
  [ECardPinMailerStatus.FAILED]: 'Failed',
};

export const cardPinMailerTypeTextPair = {
  [ECardPinMailerType.REISSUE_NEW_PIN]: 'Reissue new PIN',
  [ECardPinMailerType.CARD_REPLACEMENT]: 'Card replacement',
  [ECardPinMailerType.NEW_CARD]: 'New card',
};

export const cardPinMailerColorStatus: Record<ECardPinMailerStatus, BadgeProps['color']> = {
  [ECardPinMailerStatus.READY]: 'blue',
  [ECardPinMailerStatus.PRINTING]: 'warning',
  [ECardPinMailerStatus.SUCCEEDED]: 'success',
  [ECardPinMailerStatus.FAILED]: 'error',
};

export const optCardPinMailerStatusFilter: OptCardPinMailerStatusFilter[] = [
  {
    label: cardPinMailerStatusTextPair[ECardPinMailerStatus.READY],
    value: ECardPinMailerStatus.READY,
  },
  {
    label: cardPinMailerStatusTextPair[ECardPinMailerStatus.PRINTING],
    value: ECardPinMailerStatus.PRINTING,
  },
  {
    label: cardPinMailerStatusTextPair[ECardPinMailerStatus.SUCCEEDED],
    value: ECardPinMailerStatus.SUCCEEDED,
  },
  {
    label: cardPinMailerStatusTextPair[ECardPinMailerStatus.FAILED],
    value: ECardPinMailerStatus.FAILED,
  },
];

export const optCardPinMailerTypeFilter: OptCardPinMailerTypeFilter[] = [
  {
    label: cardPinMailerTypeTextPair[ECardPinMailerType.REISSUE_NEW_PIN],
    value: ECardPinMailerType.REISSUE_NEW_PIN,
  },
  {
    label: cardPinMailerTypeTextPair[ECardPinMailerType.CARD_REPLACEMENT],
    value: ECardPinMailerType.CARD_REPLACEMENT,
  },
  {
    label: cardPinMailerTypeTextPair[ECardPinMailerType.NEW_CARD],
    value: ECardPinMailerType.NEW_CARD,
  },
];

export interface ICardPinMailer {
  id?: string;
  status?: string;
  type?: string;
  cardNumber?: string;
  merchantName?: string;
  createdAt?: string;
  isLatest?: boolean;
}

interface IRequest {
  perPage?: number;
  page?: number;
  sortDate?: 'asc' | 'desc';
}

export interface ICardPinMailersRequest extends IRequest {
  name?: string;
  type?: string;
  status?: string;
  merchantName?: string;
  cardNumber?: string;
}
