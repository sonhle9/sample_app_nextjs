import * as React from 'react';
import {Button, EditIcon, Dialog} from '@setel/portal-ui';
import {useNotification} from 'src/react/hooks/use-notification';
import {useStore, useUpdateStore} from '../stores.queries';
import {StoreModal} from './store-modal';
import {useUserCanUpdateStore} from '../stores.helpers';
import {IStore, StoresStatusesEnum} from 'src/react/services/api-stores.type';

function useConfirmChangeStatus(initialValue: IStore, callback: (value: Partial<IStore>) => void) {
  const [showStatusConfirm, setShowStatusConfirm] = React.useState(false);
  const [editedStore, setEditedStore] = React.useState<Partial<IStore>>(null);

  const onSave = (updatedValue: Partial<IStore>) => {
    if (
      updatedValue.status &&
      initialValue.status === StoresStatusesEnum.ACTIVE &&
      updatedValue.status !== StoresStatusesEnum.ACTIVE
    ) {
      setShowStatusConfirm(true);
      setEditedStore(updatedValue);
    } else {
      callback(updatedValue);
    }
  };

  return {
    showStatusConfirm,
    onSave,
    onConfirm: () => {
      callback(editedStore);
      setShowStatusConfirm(false);
    },
    onDismissConfirm: () => {
      setShowStatusConfirm(false);
    },
  };
}

export function StoreEditStatusConfirm({
  onConfirm,
  onDismiss,
}: {
  onConfirm: () => void;
  onDismiss: () => void;
}) {
  const cancelRef = React.useRef(null);
  return (
    <Dialog
      onDismiss={onDismiss}
      leastDestructiveRef={cancelRef}
      data-testid="store-edit-status-confirm-modal">
      <Dialog.Content header="Are you sure you want to change your store status?">
        By doing this, all active orders will be cancelled
      </Dialog.Content>
      <Dialog.Footer>
        <Button variant="outline" onClick={onDismiss} ref={cancelRef} minWidth="small">
          CANCEL
        </Button>
        <Button
          variant="error"
          onClick={onConfirm}
          minWidth="small"
          data-testid="store-edit-status-confirm-btn">
          CONFIRM
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

export function StoreEdit(props: {storeId: string}) {
  const [isOpen, setOpen] = React.useState(false);
  const showMessage = useNotification();
  const {data: store, refetch} = useStore(props.storeId);
  const {
    mutate: updateStore,
    isLoading,
    error,
  } = useUpdateStore(props.storeId, {
    onSuccess: () => {
      setOpen(false);
      showMessage({
        title: 'Store updated successfully!',
      });
      refetch();
    },
  });

  const {showStatusConfirm, onSave, onConfirm, onDismissConfirm} = useConfirmChangeStatus(
    store,
    updateStore,
  );

  if (!useUserCanUpdateStore()) {
    return null;
  }

  const disableStatus = store?.operatingHours?.length === 0;

  return (
    <>
      <Button
        variant="outline"
        minWidth="small"
        disabled={isLoading}
        leftIcon={<EditIcon />}
        onClick={() => setOpen(true)}
        data-testid={'store-edit-btn'}>
        EDIT
      </Button>
      {isOpen && (
        <StoreModal
          header="Edit store"
          initialValues={store}
          isLoading={isLoading}
          error={error && (error.response?.data?.message || String(error))}
          fieldProps={{
            status: {
              disabled: disableStatus,
              helpText: disableStatus
                ? 'You can update the status after adding operating hours'
                : '',
            },
          }}
          onSave={onSave}
          onDismiss={() => setOpen(false)}
        />
      )}
      {showStatusConfirm && (
        <StoreEditStatusConfirm onConfirm={onConfirm} onDismiss={onDismissConfirm} />
      )}
    </>
  );
}
