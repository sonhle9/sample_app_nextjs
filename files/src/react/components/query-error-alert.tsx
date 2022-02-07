import {Alert, AlertMessages, flattenArray, isNil, isString} from '@setel/portal-ui';
import axios, {AxiosError} from 'axios';
import * as React from 'react';

export interface QueryErrorAlertProps {
  error: AxiosError<unknown> | {message: string};
  description?: string;
  className?: string;
}

export const QueryErrorAlert = ({
  error,
  description = 'Error occurs while retrieving data',
  className,
}: QueryErrorAlertProps) => {
  const messages = axios.isAxiosError(error)
    ? extractMsgFromResponseData(error?.response?.data)
    : [error.message];

  return (
    <Alert variant="error" description={description} className={className}>
      <AlertMessages messages={messages} />
    </Alert>
  );
};

const extractMsgFromResponseData = (data: unknown): string[] => {
  if (!isNil(data)) {
    if (isString(data)) {
      return [data];
    }

    const d: any = data;

    if (isString(d.message)) {
      return [d.message];
    }

    if (Array.isArray(d.message) && d.message.length > 0) {
      return d.message.map((mes: any) => {
        if (!isNil(mes && mes.constraints)) return Object.values(mes.constraints).join(', ');
        return extractMsgFromResponseData(mes);
      });
    }

    if (Array.isArray(d.messages) && d.messages.length > 0) {
      return flattenArray(d.messages.map(extractMsgFromResponseData).filter(Boolean));
    }
  }

  return ['Something goes wrong'];
};
