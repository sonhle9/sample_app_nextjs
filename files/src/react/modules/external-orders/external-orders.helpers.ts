import {
  EXTERNAL_ORDER_STATUS_LABELS,
  EXTERNAL_ORDER_PURCHASE_LABELS,
} from './external-orders.const';
import {
  ExternalOrderStatus,
  //ExternalOrderStates
} from 'src/react/services/api-external-orders.type';
import {titleCase} from '@setel/portal-ui';

export function getExternalOrderStatusLabel(value: ExternalOrderStatus): string {
  return EXTERNAL_ORDER_STATUS_LABELS[value] || titleCase(value);
}

export function getExternalOrderStatusOptions(): {value: string; label: string}[] {
  return [
    {
      value: '',
      label: 'All',
    },
    ...Object.entries(EXTERNAL_ORDER_STATUS_LABELS).map((entry) => ({
      value: entry[0],
      label: entry[1],
    })),
  ];
}

export function getExternalOrderPurchaseOptions(): {value: string; label: string}[] {
  return [
    {
      value: '',
      label: 'All',
    },
    ...Object.entries(EXTERNAL_ORDER_PURCHASE_LABELS).map((entry) => ({
      value: entry[0],
      label: entry[1],
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
