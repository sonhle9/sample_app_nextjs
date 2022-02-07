export enum DataViewerFields {
  transactiondategmtplus8 = 'Transaction date gmt +8',
  errorcode = 'Error code',
  feeamount = 'Fee amount',
  transactiondate = 'Transaction date',
  bankname = 'Bank name',
  bankcode = 'Bank code',
  bankaccountno = 'Bank account no',
  bankaccountholdername = 'Bank accountholder name',
  identificationdocumenttype = 'Identification document type',
  identificationdocumentno = 'Identification document no',
  settlementid = 'Settlement id',
  merchantid = 'Merchant id',
  idempotencykey = 'Idempotency key',
  createdat = 'Created at',
  updatedat = 'Updated at',
  payoutbatchid = 'Payout batch id',
  amountbreakdown = 'Amount breakdown',
}

export const ReportIcons = {
  reward: {
    value: 'reward',
    label: 'Reward',
    bgDark: 'bg-purple-500',
    bgLight: 'bg-purple-200',
  },
  membership: {
    value: 'membership',
    label: 'Membership',
    bgDark: 'bg-turquoise-500',
    bgLight: 'bg-turquoise-200',
  },
  vehicle: {
    value: 'vehicle',
    label: 'Vehicle',
    bgDark: 'bg-carbon-500',
    bgLight: 'bg-carbon-200',
  },
};

export const ReportMappingType = {
  default: 'DEFAULT',
  summary: 'SUMMARY',
};
