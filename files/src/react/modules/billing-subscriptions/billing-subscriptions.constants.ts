import {
  BillingAtStatus,
  CancelMidTermIssuingStatus,
  CancelStatus,
  ExistingUnpaidCancellationStatus,
  PaymentTermStatus,
  SubscriptionPhysicals,
} from './billing-subscriptions.types';

export const subscriptionNotifications = {
  created: 'You have successfully created a new billing subscription',
  updated: 'You have successfully updated your billing subscription',
  scheduledUpdate: 'You have successfully scheduled your changed subscription',
  revertedUpdate: 'You have successfully removed your changed subscription',
  cancelled: 'You have successfully cancelled your billing subscription',
  scheduledCancel: 'You have successfully scheduled your cancellation subscription',
  revertedCancel: 'You have successfully removed your cancellation subscription',
};

export const startDateNote =
  'If trial period exist, subscription will go into trial on the start date';

export const paymentTermOptions = [
  {
    label: 'None',
    value: PaymentTermStatus.NONE.toString(),
  },
  {
    label: 'Due immediately',
    value: PaymentTermStatus.DUE_IMMEDIATELY.toString(),
  },
  {
    label: '30 days interval',
    value: PaymentTermStatus.SOME_DAYS.toString(),
  },
];

export const paymentTermDayOptions = [
  {
    label: '30 days',
    value: '30',
  },
  {
    label: '60 days',
    value: '60',
  },
  {
    label: '90 days',
    value: '90',
  },
  {
    label: '120 days',
    value: '120',
  },
  {
    label: '150 days',
    value: '150',
  },
  {
    label: '180 days',
    value: '180',
  },
  {
    label: '210 days',
    value: '210',
  },
  {
    label: '240 days',
    value: '240',
  },
  {
    label: '270 days',
    value: '270',
  },
  {
    label: '300 days',
    value: '300',
  },
  {
    label: '330 days',
    value: '330',
  },
  {
    label: '360 days',
    value: '360',
  },
];

export const billAtOptions = [
  {
    label: 'Start of interval',
    value: BillingAtStatus.START.toString(),
  },
  {
    label: 'End of interval',
    value: BillingAtStatus.END.toString(),
  },
];

export const mappingStatus = {
  PENDING: 'PENDING',
  FUTURE: 'FUTURE',
  IN_TRIAL: 'IN TRIAL',
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
};

export const mappingPricingModel = {
  PER_UNIT: 'Per unit',
  FLAT_FEE: 'Flat fee',
  METERED: 'Metered',
};

export const mappingInterval = {
  START: 'Start of interval',
  END: 'End of interval',
};

export const applyChangeEditStatusOptions = [
  {label: 'Immediately', value: 'IMMEDIATELY'},
  {label: 'On next renewal', value: 'ON_NEXT_RENEWAL'},
  {label: 'On specific date', value: 'ON_SPECIFIC_DATE'},
];

export const cancelActiveSubscriptionStatusOptions = [
  {label: 'Cancel immediately', value: CancelStatus.IMMEDIATELY.toString()},
  {label: 'Cancel at the end of interval', value: CancelStatus.END_OF_INTERVAL.toString()},
  {label: 'Cancel on specific date', value: CancelStatus.SPECIFIC_DATE.toString()},
];

export const cancelPendingFutureSubscriptionStatusOptions = [
  {label: 'Cancel immediately', value: CancelStatus.IMMEDIATELY.toString()},
];

export const cancelInTrialSubscriptionStatusOptions = [
  {label: 'Cancel immediately', value: CancelStatus.IMMEDIATELY.toString()},
  {label: 'Cancel at the end of trial', value: CancelStatus.END_OF_TRIAL.toString()},
];

export const CancelMidTermIssuingStatusOptions = [
  {label: "Don't issue credits", value: CancelMidTermIssuingStatus.DO_NOT.toString()},
  {
    label: 'Issue prorated credits',
    value: CancelMidTermIssuingStatus.PRORATED_CREDIT.toString(),
    disabled: false,
  },
  {label: 'Issue full credit', value: CancelMidTermIssuingStatus.FULL_CREDIT.toString()},
];

export const ExistingUnpaidCancellationStatusOptions = [
  {label: 'Retain as unpaid', value: ExistingUnpaidCancellationStatus.RETAIN.toString()},
  {
    label: 'Attempt Collection',
    value: ExistingUnpaidCancellationStatus.ATTEMPT_COLLECTION.toString(),
  },
  {label: 'Write off', value: ExistingUnpaidCancellationStatus.WRITE_OFF.toString()},
];

export const DaysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const DatesOfMonth = [
  '1st',
  '2nd',
  '3rd',
  '4th',
  '5th',
  '6th',
  '7th',
  '8th',
  '9th',
  '10th',
  '11th',
  '12th',
  '13th',
  '14th',
  '15th',
  '16th',
  '17th',
  '18th',
  '19th',
  '20th',
  '21st',
  '22nd',
  '23rd',
  '24th',
  '25th',
  '26th',
  '27th',
  '28th',
  '29th',
  '30th',
  '31st',
];

export const DayOptions = [
  {
    label: 'Monday',
    value: 1,
  },
  {
    label: 'Tuesday',
    value: 2,
  },
  {
    label: 'Wednesday',
    value: 3,
  },
  {
    label: 'Thursday',
    value: 4,
  },
  {
    label: 'Friday',
    value: 5,
  },
  {
    label: 'Saturday',
    value: 6,
  },
  {
    label: 'Sunday',
    value: 7,
  },
];

export const StateOptions = [
  {
    label: 'Johor',
    value: 'Johor',
  },
  {
    label: 'Kedah',
    value: 'Kedah',
  },
  {
    label: 'Kelantan',
    value: 'Kelantan',
  },
  {
    label: 'Melaka',
    value: 'Melaka',
  },
  {
    label: 'Negeri Sembilan',
    value: 'Negeri Sembilan',
  },
  {
    label: 'Pahang',
    value: 'Pahang',
  },
  {
    label: 'Perak',
    value: 'Perak',
  },
  {
    label: 'Perlis',
    value: 'Perlis',
  },
  {
    label: 'Pulau Pinang',
    value: 'Pulau Pinang',
  },
  {
    label: 'Sarawak',
    value: 'Sarawak',
  },
  {
    label: 'Selangor',
    value: 'Selangor',
  },
  {
    label: 'Terengganu',
    value: 'Terengganu',
  },
  {
    label: 'Kuala Lumpur',
    value: 'Kuala Lumpur',
  },
  {
    label: 'Labuan',
    value: 'Labuan',
  },
  {
    label: 'Sabah',
    value: 'Sabah',
  },
  {
    label: 'Putrajaya',
    value: 'Putrajaya',
  },
];

export const HistoryTabLabels = {
  Invoice: 'Invoice',
  CreditNote: 'Credit note',
};

export const physicalOptions: {label: string; value: string}[] = [
  {
    label: 'None',
    value: SubscriptionPhysicals.NONE,
  },
  {
    label: 'Chargeable',
    value: SubscriptionPhysicals.CHARGEABLE,
  },
  {
    label: 'Waivable',
    value: SubscriptionPhysicals.WAIVABLE,
  },
];

export const paymentDueNoticePeriodOptions = [
  {
    label: 'None',
    value: '0',
  },
  {
    label: '1 day earlier',
    value: '1',
  },
  {
    label: '2 days earlier',
    value: '2',
  },
  {
    label: '3 days earlier',
    value: '3',
  },
  {
    label: '4 days earlier',
    value: '4',
  },
  {
    label: '5 days earlier',
    value: '5',
  },
  {
    label: '6 days earlier',
    value: '6',
  },
  {
    label: '7 days earlier',
    value: '7',
  },
  {
    label: '8 days earlier',
    value: '8',
  },
  {
    label: '9 days earlier',
    value: '9',
  },
  {
    label: '10 days earlier',
    value: '10',
  },
];
