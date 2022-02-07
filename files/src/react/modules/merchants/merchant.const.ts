import {getAllCountries, getAllTimezones} from 'countries-and-timezones';
import {toFirstUpperCase} from 'src/shared/helpers/common';
import {SubscriptionPhysicals} from '../billing-subscriptions/billing-subscriptions.types';
import categoryCodeMapping from './merchant-category-code.json';

export const categoryCodeOptions = categoryCodeMapping.map((mapping) => ({
  label: `${mapping.code} - ${mapping.desc}`,
  value: mapping.code,
}));

export const countryOptions = Object.values(getAllCountries()).map((country) => ({
  label: country.name,
  value: country.id,
}));

export const timezoneOptions = Object.values(getAllTimezones())
  .filter((tz) => !tz.name.startsWith('Etc'))
  .map((tz) => ({
    label: `(${tz.utcOffsetStr}) ${tz.name}`,
    value: tz.name,
  }))
  .sort((tzA, tzB) => {
    if (tzA.label > tzB.label) {
      return 1;
    }
    if (tzA.label < tzB.label) {
      return -1;
    }
    return 0;
  });

export const statesOfMalayOptions = [
  {
    label: 'Johor',
    value: 'johor',
  },
  {
    label: 'Kedah',
    value: 'kedah',
  },
  {
    label: 'Kelantan',
    value: 'kelantan',
  },
  {
    label: 'Melaka',
    value: 'melaka',
  },
  {
    label: 'Negeri Sembilan',
    value: 'negeri sembilan',
  },
  {
    label: 'Pahang',
    value: 'pahang',
  },
  {
    label: 'Perak',
    value: 'perak',
  },
  {
    label: 'Perlis',
    value: 'perlis',
  },
  {
    label: 'Pulau Pinang',
    value: 'pulau pinang',
  },
  {
    label: 'Sabah',
    value: 'sabah',
  },
  {
    label: 'Sarawak',
    value: 'sarawak',
  },
  {
    label: 'Selangor',
    value: 'selangor',
  },
  {
    label: 'Terengganu',
    value: 'terengganu',
  },
  {
    label: 'Wilayah Persekutuan Kuala Lumpur',
    value: 'wilayah persekutuan kuala lumpur',
  },
  {
    label: 'Wilayah Persekutuan Labuan',
    value: 'wilayah persekutuan labuan',
  },
  {
    label: 'Wilayah Persekutuan Putrajaya',
    value: 'wilayah persekutuan putrajaya',
  },
];

export const changeStatusReasonOptions = [
  {
    label: 'Activation',
    value: 'activation',
  },
  {
    label: 'Client Bankrupt',
    value: 'client_bankrupt',
  },
  {
    label: 'Client Bad Debt Risk',
    value: 'client_bad_debt_risk',
  },
  {
    label: 'Client Over Credit Limit (Manual)',
    value: 'client_over_credit_limit',
  },
  {
    label: 'End of Contract',
    value: 'end_of_contract',
  },
  {
    label: 'Customer Request',
    value: 'customer_request',
  },
  {
    label: 'Legal Proceedings',
    value: 'legal_proceedings',
  },
  {
    label: 'Account Reactivation',
    value: 'account_reactivation',
  },
  {
    label: 'Payment Overdue',
    value: 'payment_overdue',
  },
  {
    label: 'Others',
    value: 'others',
  },
];

export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export enum MerchantStatus {
  ACTIVE = 'active',
  DELETED = 'deleted',
}

export enum UpdateMerchantMessage {
  SUCCESS = 'succes',
  DELETED = 'delete_succes',
}

export enum COMPANY_TYPE {
  SMARTPAY = 'smartpay',
}

export enum BusinessRegistrationType {
  OLD = 'old',
  NEW = 'new',
}

export const businessRegistrationNumberTypeOpts = [
  {label: 'Please select', value: ''},
  ...Object.values(BusinessRegistrationType).map((type: string) => {
    return {
      label: toFirstUpperCase(type),
      value: type,
    };
  }),
];

export const dunningCodeOptions = [
  {
    value: '0',
    label: '0: No dunning letter or auto-blocking',
  },
  {
    value: '1',
    label: '1: Dunning letter with no auto-blocking',
  },
  {
    value: '3',
    label: '3: Dunning letter with auto-blocking',
  },
];

export const physicalStatementOptions: {label: string; value: string}[] = [
  {
    label: 'None',
    value: SubscriptionPhysicals.NONE,
  },
  {
    label: 'Charge',
    value: SubscriptionPhysicals.CHARGEABLE,
  },
  {
    label: 'Waive',
    value: SubscriptionPhysicals.WAIVABLE,
  },
];

export const creditTermOptions = [
  {value: 30, label: '30 days'},
  {value: 60, label: '60 days'},
  {value: 90, label: '90 days'},
];

export const physicalText = {
  NONE: '-',
  CHARGEABLE: 'Charge',
  WAIVABLE: 'Waive',
};

export const dunningText = {
  0: 'No dunning letter or auto-blocking',
  1: 'Dunning letter with no auto-blocking',
  3: 'Dunning letter with auto-blocking',
};

export const balanceStatusText = {
  init: 'Init',
  paid: 'Paid',
  pending: 'Pending',
  overdue: 'Overdue',
};

export const creditTermText = {
  30: '30 days',
  60: '60 days',
  90: '90 days',
};

export enum SPAImportType {
  LIMIT = 'limit',
  PERIOD = 'period',
  ADJUST = 'adjust',
}
