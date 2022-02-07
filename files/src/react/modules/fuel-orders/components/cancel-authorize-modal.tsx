import React from 'react';
import {
  Button,
  formatMoney,
  Modal,
  ModalBody,
  ModalFooter,
  MoneyInput,
  FieldContainer,
  Alert,
  Dialog,
} from '@setel/portal-ui';
import {useCancelPaymentAuthorize} from '../fuel-orders.queries';

interface CancelAuthorizeModalProps {
  onDismiss: () => void;
  orderId: string;
  isOpen: boolean;
  amount: number;
}

export function CancelAuthorizeModal({
  isOpen,
  onDismiss: setShowCancelAuthorizeModal,
  orderId,
  amount,
}: CancelAuthorizeModalProps) {
  const [showConfirmCancelAuthorizeModal, setShowConfirmCancelAuthorizeDialog] =
    React.useState(false);

  return (
    <Modal
      size="small"
      header="Cancel authorize"
      isOpen={isOpen}
      onDismiss={setShowCancelAuthorizeModal}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setShowConfirmCancelAuthorizeDialog(true);
        }}>
        <ModalBody>
          {!amount && (
            <Alert
              className="mb-5"
              variant="error"
              description="There is no existing pre-authorized amount. Unable to cancel pre-authorized amount."></Alert>
          )}
          <FieldContainer label="Pre-authorisation amount" layout="horizontal-responsive">
            <MoneyInput value={amount ? amount.toString() : ''} disabled={true} />
          </FieldContainer>
        </ModalBody>
        <ModalFooter className="text-right">
          <Button onClick={setShowCancelAuthorizeModal} variant="outline" className="mr-3">
            CANCEL
          </Button>
          <Button variant="primary" type="submit" disabled={!amount}>
            CONTINUE
          </Button>
        </ModalFooter>
      </form>
      <ConfirmCancelAuthorizeDialog
        isOpen={showConfirmCancelAuthorizeModal}
        orderId={orderId}
        amount={amount}
        setShowConfirmCancelAuthorizeDialog={setShowConfirmCancelAuthorizeDialog}
        setShowCancelAuthorizeModal={setShowCancelAuthorizeModal}
      />
    </Modal>
  );
}

function ConfirmCancelAuthorizeDialog({
  isOpen,
  amount,
  orderId,
  setShowConfirmCancelAuthorizeDialog,
  setShowCancelAuthorizeModal,
}) {
  const {mutateAsync: cancelAuthorize, isLoading: isProcessingCancelAuthorize} =
    useCancelPaymentAuthorize();
  const cancelBtnRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Dialog
      data-testid="Confirm cancel authorize modal"
      isOpen={isOpen}
      onDismiss={() => setShowConfirmCancelAuthorizeDialog(false)}
      leastDestructiveRef={cancelBtnRef}>
      <Dialog.Content header="Are you sure you want to cancel the pre-authorisation amount?">
        You are about to cancel a {formatMoney(amount, 'MYR')} authorisation charge. Click submit to
        proceed.
      </Dialog.Content>
      <Dialog.Footer>
        <Button
          onClick={() => setShowConfirmCancelAuthorizeDialog(false)}
          disabled={isProcessingCancelAuthorize}
          variant="outline"
          ref={cancelBtnRef}>
          CANCEL
        </Button>
        <Button
          onClick={() =>
            cancelAuthorize(orderId, {
              onSuccess: () => {
                setShowConfirmCancelAuthorizeDialog(false);
                setShowCancelAuthorizeModal(false);
              },
            })
          }
          variant="primary"
          isLoading={isProcessingCancelAuthorize}
          disabled={isProcessingCancelAuthorize}>
          SUBMIT
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}
