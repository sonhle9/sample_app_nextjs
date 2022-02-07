import {Button, Dialog} from '@setel/portal-ui';
import React from 'react';

interface HostDeleteProps {
  onConfirm: () => any;
  onClose: () => void;
  isVisible: boolean;
}
const HostDeleteDialog = ({onConfirm, isVisible, onClose}: HostDeleteProps) => {
  const cancelRef = React.useRef(null);

  return (
    <>
      {isVisible && (
        <Dialog
          data-testid="terminal-deactivation-dialog"
          onDismiss={onClose}
          leastDestructiveRef={cancelRef}>
          <Dialog.Content header="Are you sure you want to delete this TID/MID configuration?">
            This TID/MID configuration will be deleted immedieately. You can’t undo this action
          </Dialog.Content>
          <Dialog.Footer>
            <Button variant="outline" onClick={onClose} ref={cancelRef}>
              CANCEL
            </Button>
            <Button variant="error" onClick={onConfirm}>
              DELETE
            </Button>
          </Dialog.Footer>
        </Dialog>
      )}
    </>
  );
};

export default HostDeleteDialog;
