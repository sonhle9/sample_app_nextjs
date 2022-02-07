import {Dialog, Button} from '@setel/portal-ui';
import * as React from 'react';
import {useDeleteBadgeGroup} from '../../badge-campaigns.queries';

type DeleteBadgeGroupModalProps = {
  id: string;
  isOpen: boolean;
  onClose: (success?: boolean) => void;
};
export function DeleteBadgeGroupModal({id, isOpen, onClose}: DeleteBadgeGroupModalProps) {
  const {mutateAsync: deleteBadgeGroup, isLoading} = useDeleteBadgeGroup();
  const cancelRef = React.useRef(null);
  return (
    isOpen && (
      <Dialog onDismiss={() => onClose()} leastDestructiveRef={cancelRef}>
        <Dialog.Content header="Are you sure to delete badge group?">
          This action cannot be undone and you will not be able to recover any data.
        </Dialog.Content>
        <Dialog.Footer>
          <Button ref={cancelRef} variant="outline" disabled={isLoading} onClick={() => onClose()}>
            CANCEL
          </Button>
          <Button
            variant="error"
            isLoading={isLoading}
            disabled={isLoading}
            onClick={() => {
              deleteBadgeGroup(id, {
                onSuccess: () => onClose(true),
              });
            }}>
            DELETE
          </Button>
        </Dialog.Footer>
      </Dialog>
    )
  );
}
