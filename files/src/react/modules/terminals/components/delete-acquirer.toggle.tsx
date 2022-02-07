import {DialogProps, Dialog, DialogContent, DialogFooter, Button, Alert} from '@setel/portal-ui';
import * as React from 'react';

type DeleteAcquirerConfirmationDialogProps = {
  isOpen: boolean;
  isEditing?: boolean;
  error?: any;
  onConfirm: (e) => void;
  onDismiss: () => void;
} & Omit<DialogProps, 'children' | 'leastDestructiveRef'>;

export const DeleteAcquirerConfirmationDialog = ({
  isOpen,
  isEditing,
  onConfirm,
  onDismiss,
  error,
  ...dialogProps
}: DeleteAcquirerConfirmationDialogProps) => {
  const cancelBtnRef = React.useRef<HTMLButtonElement>(null);
  return (
    <Dialog
      {...dialogProps}
      isOpen={isOpen}
      leastDestructiveRef={cancelBtnRef}
      onDismiss={onDismiss}>
      <DialogContent header={`Are you sure you want to delete this TID/MID configuration?`}>
        {error && (
          <Alert
            className="mb-2"
            variant="error"
            description={error || 'Something went wrong'}></Alert>
        )}
        This TID/MID configuration will be deleted immediately. You can’t undo this action
      </DialogContent>
      <DialogFooter>
        <Button onClick={onDismiss} variant="outline" ref={cancelBtnRef}>
          CANCEL
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isEditing}
          variant={'error'}
          data-testid="confirm-delete-btn"
          isLoading={isEditing}>
          {'DELETE'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
