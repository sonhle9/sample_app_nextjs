export enum onDemandReportUrls {
  EXPIRED_CARD_BALANCE_DETAILS = 'expired-card-balance-details',
  EXPIRED_CARD_BALANCE_SUMMARY = 'expired-card-balance-summary',
  APPROVED_ADJUSTMENT_TRANSACTIONS = 'approved-adjustment-transactions',
  APPROVED_TOPUP_TRANSACTIONS = 'approved-topup-transactions',
  GIFT_CARD_ITEMISED_TRANSACTION = 'gift-card-itemised-transactions',
  GIFT_CARD_ITEMISED_TRANSACTION_DOWNLOAD = 'gift-card-itemised-transactions-download',
  GIFT_CARD_TRANSACTIONS_SUMMARY = 'giftcard-transactions-summary',
}

export enum ECardStatus {
  ISSUED = 'issued',
  ACTIVE = 'active',
  CLOSED = 'closed',
  FROZEN = 'frozen',
}

export const ECardStatusTextPair = {
  [ECardStatus.ISSUED]: 'Issued',
  [ECardStatus.ACTIVE]: 'Active',
  [ECardStatus.CLOSED]: 'Closed',
  [ECardStatus.FROZEN]: 'Frozen',
};

export const optStatus = [
  {
    label: 'All statuses',
    value: '',
  },
  {
    label: ECardStatusTextPair[ECardStatus.ISSUED],
    value: ECardStatus.ISSUED,
  },
  {
    label: ECardStatusTextPair[ECardStatus.ACTIVE],
    value: ECardStatus.ACTIVE,
  },
  {
    label: ECardStatusTextPair[ECardStatus.FROZEN],
    value: ECardStatus.FROZEN,
  },
  {
    label: ECardStatusTextPair[ECardStatus.CLOSED],
    value: ECardStatus.CLOSED,
  },
];
