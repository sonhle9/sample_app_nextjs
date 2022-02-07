import {CONCIERGE_ORDER_STATUS_LABELS} from './store-orders.const';
import {
  OverCounterOrderStatus,
  ConciergeOrderStatus,
  ConciergeOrderStates,
} from 'src/react/services/api-store-orders.type';
import {titleCase} from '@setel/portal-ui';

export function camelToSentenceCase(value: string) {
  return value
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .replace(/^./, function (str) {
      return str.toUpperCase();
    });
}

export function getOverCounterOrderStatusBadgeColor(
  status: OverCounterOrderStatus,
): 'warning' | 'error' | 'success' | undefined {
  if (String(status).toLowerCase().includes('error')) {
    return 'error';
  }
  switch (status) {
    case OverCounterOrderStatus.created:
    case OverCounterOrderStatus.voidPending:
    case OverCounterOrderStatus.confirmed:
      return 'warning';

    case OverCounterOrderStatus.chargeSuccessful:
    case OverCounterOrderStatus.pointIssuanceSuccessful:
    case OverCounterOrderStatus.voidSuccessful:
      return 'success';

    default:
      return;
  }
}

export function getStoreOrderStateBadgeColor(
  state: ConciergeOrderStates,
): 'warning' | 'error' | 'success' | undefined {
  if (String(state).toLowerCase().includes('error')) {
    return 'error';
  }
  switch (state) {
    case ConciergeOrderStates.ORDER_CREATED:
    case ConciergeOrderStates.ORDER_HOLD_AMOUNT_SUCCESS:
    case ConciergeOrderStates.ORDER_ACKNOWLEDGED:
    case ConciergeOrderStates.ORDER_MODIFIED:
      return 'warning';

    case ConciergeOrderStates.ORDER_CHARGE_SUCCESS:
    case ConciergeOrderStates.ORDER_DELIVERED:
    case ConciergeOrderStates.ORDER_POINTS_ISSUANCE_SUCCESS:
    case ConciergeOrderStates.ORDER_PAYMENT_RECOVERY_SUCCESS:
      return 'success';

    default:
      return;
  }
}

export function getStoreOrderStatusLabel(value: ConciergeOrderStatus): string {
  return CONCIERGE_ORDER_STATUS_LABELS[value] || titleCase(value);
}

export function getStoreOrderStateLabel(state: ConciergeOrderStates): string {
  return titleCase(state.replace('ORDER_', ''), {hasUnderscore: true});
}

export function getStoreOrderStatusOptions(): {value: string; label: string}[] {
  return [
    {
      value: '',
      label: 'All',
    },
    ...Object.entries(CONCIERGE_ORDER_STATUS_LABELS).map((entry) => ({
      value: entry[0],
      label: entry[1],
    })),
  ];
}

export function getOverCounterStatusOptions(): {value: string; label: string}[] {
  return [
    {
      value: '',
      label: 'Any statuses',
    },
    ...Object.keys(OverCounterOrderStatus).map((key) => ({
      value: OverCounterOrderStatus[key],
      label: camelToSentenceCase(OverCounterOrderStatus[key]),
    })),
  ];
}

export function getStoreOrderStateOptions(): {value: string; label: string}[] {
  return [
    {
      value: '',
      label: 'Any states',
    },
    ...Object.keys(ConciergeOrderStates).map((key) => ({
      value: key,
      label: getStoreOrderStateLabel(key as ConciergeOrderStates),
    })),
  ];
}

export function downloadTextFile(textData: string, filename: string) {
  if (document) {
    const url = window.URL.createObjectURL(new Blob([textData]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }
}
