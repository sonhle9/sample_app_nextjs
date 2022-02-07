import * as React from 'react';
import {useNotification} from 'src/react/hooks/use-notification';
import {useCreateStore} from '../stores.queries';
import {StoreModal} from './store-modal';
import {IStore, INITIAL_STORE} from '../stores.types';
import {useUserCanCreateStore} from '../stores.helpers';

export function StoreCreate({
  onSuccess,
  onDismiss,
}: {
  onSuccess: (store: IStore) => void;
  onDismiss: () => void;
}) {
  const showMessage = useNotification();
  const {
    mutate: createStore,
    isLoading,
    error,
  } = useCreateStore({
    onSuccess: (value: IStore) => {
      onDismiss();
      showMessage({
        title: 'Store created successfully!',
      });
      onSuccess(value);
    },
  });
  if (!useUserCanCreateStore()) {
    return null;
  }

  return (
    <StoreModal
      header="Add store"
      initialValues={INITIAL_STORE}
      isLoading={isLoading}
      error={error && (error.response?.data?.message || String(error))}
      fieldProps={{
        status: {
          disabled: true,
          helpText: 'You can update the status after adding operating hours ',
        },
      }}
      onSave={(store) => createStore(store)}
      onDismiss={onDismiss}
    />
  );
}
