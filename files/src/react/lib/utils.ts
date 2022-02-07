import {isDefined} from '@setel/portal-ui';
import {AxiosError} from 'axios';
import * as React from 'react';

export const uniq = (list) => Array.from(new Set(list));
const DEFAULT_PAGE_SIZE = 25;
export function formatFuelPrice(price: number) {
  return (price / 100).toFixed(2);
}

export function downloadFile(csvData: string | Blob, filename: string) {
  const url = window.URL.createObjectURL(csvData instanceof Blob ? csvData : new Blob([csvData]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
}

export function downloadFileFromLink(href: string, fileName?: string) {
  const link = document.createElement('a');
  link.href = href;
  link.setAttribute('download', fileName || 'download.txt');
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function getCurrentEmail(): string | undefined {
  const session = React.useMemo(() => {
    const sessionRaw: string = localStorage.getItem('session');
    if (sessionRaw) {
      return JSON.parse(sessionRaw);
    }
    return {};
  }, []);

  return session?.email;
}

export const extractErrorWithConstraints = (error: AxiosError): string | string[] => {
  if (error.response) {
    const errors = error.response.data?.message;

    if (Array.isArray(errors) && errors.length > 0) {
      return errors.map(({children}: {children: Record<string, any>}) => {
        return children.map(({constraints}: {constraints: Record<string, string>}) =>
          Object.values(constraints).join(', '),
        );
      });
    } else if (typeof errors === 'string') {
      return errors;
    }
    return error.message;
  }
  return error.message;
};

export const formatUrlWithQuery = (baseUrl: string, query: Record<string, string | string[]>) => {
  const url = new URL(baseUrl);
  Object.entries(query).forEach(([k, v]) => {
    if (!isDefined(v)) return;
    if (Array.isArray(v)) v.forEach((ve) => url.searchParams.append(k, ve));
    else url.searchParams.append(k, v);
  });
  return url.toString();
};

export const getDefaultPageSize = (): number => {
  return DEFAULT_PAGE_SIZE;
};
