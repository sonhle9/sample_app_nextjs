import {SessionStatuses, PaymentId} from './parking.type';
import {OptionsOrGroups} from '@setel/portal-ui';

type BadgeTranslation = {
  text: string;
  color:
    | 'turquoise'
    | 'grey'
    | 'purple'
    | 'lemon'
    | 'success'
    | 'info'
    | 'warning'
    | 'error'
    | 'blue'
    | 'offwhite';
  altText?: string;
};

export const SessionStatusesBadge = new Map<SessionStatuses, BadgeTranslation>([
  [SessionStatuses.UNKNOWN, {text: 'Unknown', color: 'grey'}],
  [SessionStatuses.VOIDED, {text: 'Voided', color: 'error'}],
  [SessionStatuses.ACTIVE, {text: 'Active', color: 'purple'}],
  [SessionStatuses.COMPLETED, {text: 'Completed', color: 'success'}],
]);

export const SessionStatusesOptions: OptionsOrGroups<string | SessionStatuses> = [
  {label: 'All', value: ''},
  {
    label: SessionStatusesBadge.get(SessionStatuses.ACTIVE).text,
    value: SessionStatuses.ACTIVE,
  },
  {
    label: SessionStatusesBadge.get(SessionStatuses.COMPLETED).text,
    value: SessionStatuses.COMPLETED,
  },
  {
    label: SessionStatusesBadge.get(SessionStatuses.VOIDED).text,
    value: SessionStatuses.VOIDED,
  },
];

export const EditSessionStatusesOptions: OptionsOrGroups<string | SessionStatuses> = [
  {
    label: SessionStatusesBadge.get(SessionStatuses.ACTIVE).text,
    value: SessionStatuses.ACTIVE,
    disabled: true,
  },
  {
    label: SessionStatusesBadge.get(SessionStatuses.COMPLETED).text,
    value: SessionStatuses.COMPLETED,
    disabled: true,
  },
  {
    label: SessionStatusesBadge.get(SessionStatuses.VOIDED).text,
    value: SessionStatuses.VOIDED,
  },
];

export const PaymentTypeOptions: OptionsOrGroups<string | PaymentId> = [
  {label: 'All', value: ''},
  {label: 'Setel Wallet', value: PaymentId.SETEL_WALLET},
  {label: 'Credit/debit card', value: PaymentId.CREDIT_CARD},
];
