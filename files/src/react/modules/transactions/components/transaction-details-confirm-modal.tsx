import {Button, Dialog, DialogContent, DialogFooter} from '@setel/portal-ui';
import * as React from 'react';
import {useReleaseAuthFleetTransaction, useReleaseAuthTransaction} from '../transaction.queries';
interface IReleaseTransaction {
  onClose?: () => void;
  data?: any;
  visible: boolean;
}

export const CardTransactionConfirmModal = (props: IReleaseTransaction) => {
  const {mutate: setReleaseAuthTransaction} = useReleaseAuthTransaction(props.data?.transactionUid);

  const cancelBtnRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Dialog isOpen={props.visible} onDismiss={props.onClose} leastDestructiveRef={cancelBtnRef}>
      <DialogContent header="Are you sure to release the amount?">
        This action cannot be undone and you will not be able to recover any data
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={props.onClose} ref={cancelBtnRef}>
          CANCEL
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            setReleaseAuthTransaction(null, {onSuccess: props.onClose});
          }}>
          CONFIRM
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export const CardFleetTransactionConfirmModal = (props: IReleaseTransaction) => {
  const {mutate: setReleaseAuthTransaction} = useReleaseAuthFleetTransaction(
    props.data?.transactionUid,
  );

  const cancelBtnRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Dialog isOpen={props.visible} onDismiss={props.onClose} leastDestructiveRef={cancelBtnRef}>
      <DialogContent header="Are you sure to release the amount?">
        This action cannot be undone and you will not be able to recover any data
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={props.onClose} ref={cancelBtnRef}>
          CANCEL
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            setReleaseAuthTransaction(null, {onSuccess: props.onClose});
          }}>
          CONFIRM
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
