import {Button, Dialog, DialogContent, DialogFooter, DialogProps} from '@setel/portal-ui';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import * as React from 'react';

export type DeleteConfirmationProps = {
  featureName: string;
  isOpen: boolean;
  isDeleting?: boolean;
  error?: Error | null;
  onConfirm: () => void;
  onDismiss: () => void;
} & Omit<DialogProps, 'children' | 'leastDestructiveRef'>;

export const DeleteConfirmation = ({
  featureName,
  isOpen,
  isDeleting,
  error,
  onConfirm,
  onDismiss,
  ...dialogProps
}: DeleteConfirmationProps) => {
  const cancelBtnRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Dialog
      {...dialogProps}
      isOpen={isOpen}
      leastDestructiveRef={cancelBtnRef}
      onDismiss={onDismiss}>
      <DialogContent header={`Are you sure to delete ${featureName}?`}>
        {error && <QueryErrorAlert error={error} />}
        This action cannot be undone and you will not be able to recover any data.
      </DialogContent>
      <DialogFooter>
        <Button onClick={onDismiss} variant="outline" ref={cancelBtnRef}>
          CANCEL
        </Button>
        <Button onClick={onConfirm} disabled={isDeleting} variant="error">
          {isDeleting ? 'DELETING...' : 'DELETE'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
