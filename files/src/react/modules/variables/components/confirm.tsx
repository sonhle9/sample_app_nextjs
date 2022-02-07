import * as React from 'react';
import {Button, Dialog, DialogContent, DialogFooter} from '@setel/portal-ui';

interface IConfirmProps {
  header: any;
  caption: any;
  cancel: any;
  confirm: any;
  open?: boolean;
  children(onTrigger: () => void): any;
  onConfirm(): void;
  onCancel?(): void;
}

export function Confirm({
  children,
  onConfirm,
  onCancel,
  header,
  caption,
  cancel,
  confirm,
  open = false,
}: IConfirmProps) {
  const [showDialog, setShowDialog] = React.useState(false);
  const cancelRef = React.useRef();

  return (
    <>
      {children(() => setShowDialog(true))}
      {(open || showDialog) && (
        <Dialog
          onDismiss={() => setShowDialog(false)}
          leastDestructiveRef={cancelRef}
          data-testid="dialog">
          <DialogContent header={header}>{caption}</DialogContent>
          <DialogFooter>
            <Button
              variant="outline"
              className="uppercase"
              onClick={() => {
                setShowDialog(false);
                if (onCancel != null) onCancel();
              }}
              ref={cancelRef}
              data-testid="btn-cancel">
              {cancel}
            </Button>
            <Button
              variant="primary"
              className="uppercase"
              onClick={() => {
                setShowDialog(false);
                onConfirm();
              }}
              data-testid="btn-confirm">
              {confirm}
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
}
