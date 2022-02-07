import {
  createEventBus,
  isNumber,
  Notification,
  NotificationPortal,
  NotificationProps,
  useListState,
} from '@setel/portal-ui';
import * as React from 'react';

type Msg = {
  variant: NotificationProps['variant'];
  title?: string;
  description?: React.ReactNode;
};

export interface NotificationOptions extends Partial<Msg> {
  removeAfterMs?: number;
}

export const notificationEventBus = createEventBus<[NotificationOptions]>();

export const useNotification = () => React.useCallback(notificationEventBus.emit, []);

export const NotificationDisplay = () => {
  const {items, append} =
    useListState<
      Msg & {
        autoDismiss?: boolean;
      }
    >();

  React.useEffect(
    () =>
      notificationEventBus.listen(
        ({title, description, variant = 'success', removeAfterMs = 2000}) =>
          append(
            {
              title,
              description,
              variant,
              autoDismiss: isNumber(removeAfterMs),
            },
            {
              removeAfterMs,
            },
          ),
      ),
    [],
  );

  return (
    <NotificationPortal>
      {items.map((item) => (
        <Notification
          title={item.value.title}
          variant={item.value.variant}
          description={item.value.description}
          onDismiss={item.value.autoDismiss ? undefined : item.remove}
          key={item.key}
        />
      ))}
    </NotificationPortal>
  );
};
