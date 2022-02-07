import {Button, Dialog} from '@setel/portal-ui';
import React from 'react';

interface TerminalDeactivationProps {
  onConfirm: () => any;
  onClose: () => void;
  isVisible: boolean;
}
const TerminalDeactivationDialog = ({onConfirm, isVisible, onClose}: TerminalDeactivationProps) => {
  const cancelRef = React.useRef(null);

  return (
    <>
      {isVisible && (
        <Dialog
          data-testid="terminal-deactivation-dialog"
          onDismiss={onClose}
          leastDestructiveRef={cancelRef}>
          <Dialog.Content header="Are you sure you want to deactivate this terminal?">
            Upon deactivating, all terminal details related to the merchant will be deleted.
          </Dialog.Content>
          <Dialog.Footer>
            <Button variant="outline" onClick={onClose} ref={cancelRef}>
              CANCEL
            </Button>
            <Button variant="error" onClick={onConfirm}>
              DEACTIVATE
            </Button>
          </Dialog.Footer>
        </Dialog>
      )}
    </>
  );
};

export default TerminalDeactivationDialog;
