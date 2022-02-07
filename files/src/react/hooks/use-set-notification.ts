import * as React from 'react';
import {SvgProps} from '@setel/web-utils';
import {useTransientState} from '@setel/portal-ui';

type NotificationProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  onDismiss?: () => void;
  variant?: 'error' | 'info' | 'warning' | 'success';
  className?: string;
  Icon?: (props: SvgProps) => React.ReactElement<any, any> | null;
  actions?: React.ReactNode;
};

export type UseNotification = {
  setShowNotifications: (val: NotificationProps) => void;
  notificationProps: NotificationProps;
};

export const useNotification = (): UseNotification => {
  const [isShow, setIsShow] = useTransientState(false);
  const [notificationProps, setNotificationProps] = React.useState(undefined);

  const setShowNotifications = (val) => {
    setNotificationProps(val);
    setIsShow(true);
  };

  return {
    setShowNotifications,
    notificationProps: {isShow, ...notificationProps},
  };
};
