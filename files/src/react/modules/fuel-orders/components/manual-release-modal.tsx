import React from 'react';
import {Button, useInterval, Dialog} from '@setel/portal-ui';
import {useGetManualReleaseStatus, useManualReleaseOrder} from '../fuel-orders.queries';
import {IAdminOrder} from '../fuel-orders.interface';
import {FuelOrderStatus} from '../fuel-orders.type';

interface ManualReleaseOrderModalProps {
  onDismiss: () => void;
  getManualReleaseStatus: (string, any) => void;
  setShowManualReleaseButton: (boolean) => void;
  orderId: string;
  isOpen: boolean;
  showManualReleaseButton: boolean;
  disablePolling: boolean;
}

interface ManualReleaseOrderProps {
  order: IAdminOrder;
}

export function ManualReleaseOrder({order}: ManualReleaseOrderProps) {
  const [showManualReleaseModal, setShowManualReleaseModal] = React.useState(false);
  const [showManualReleaseButton, setShowManualReleaseButton] = React.useState(false);

  const {mutate: getManualReleaseStatus} = useGetManualReleaseStatus();

  React.useEffect(() => {
    getManualReleaseStatus(order.orderId, {
      onSuccess: ({status}) => setShowManualReleaseButton(status),
    });
  }, [order]);

  return (
    <>
      <Button
        disabled={!showManualReleaseButton}
        onClick={() => setShowManualReleaseModal(true)}
        variant="error">
        MANUAL RELEASE
      </Button>
      <ManualReleaseOrderDialog
        isOpen={showManualReleaseModal}
        onDismiss={() => setShowManualReleaseModal(false)}
        orderId={order.orderId}
        getManualReleaseStatus={getManualReleaseStatus}
        showManualReleaseButton={showManualReleaseButton}
        setShowManualReleaseButton={setShowManualReleaseButton}
        disablePolling={order.status === FuelOrderStatus.confirmed}
      />
    </>
  );
}

function ManualReleaseOrderDialog({
  isOpen,
  onDismiss,
  orderId,
  getManualReleaseStatus,
  showManualReleaseButton,
  setShowManualReleaseButton,
  disablePolling,
}: ManualReleaseOrderModalProps) {
  const {mutateAsync: manualReleaseOrder, isLoading, isSuccess} = useManualReleaseOrder();
  const cancelBtnRef = React.useRef<HTMLButtonElement>(null);

  useInterval(
    () =>
      getManualReleaseStatus(orderId, {
        onSuccess: ({status}) => setShowManualReleaseButton(status),
      }),
    disablePolling || showManualReleaseButton || isSuccess ? null : 10 * 1000,
  );

  return (
    <Dialog
      data-testid="Manual release order modal"
      isOpen={isOpen}
      onDismiss={onDismiss}
      leastDestructiveRef={cancelBtnRef}>
      <Dialog.Content header="Are you sure you want to manual release this order?">
        You are about to cancel this order. Click confirm to proceed.
      </Dialog.Content>
      <Dialog.Footer>
        <Button onClick={onDismiss} disabled={isLoading} variant="outline" ref={cancelBtnRef}>
          CANCEL
        </Button>
        <Button
          onClick={() => manualReleaseOrder(orderId, {onSettled: onDismiss})}
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}>
          CONFIRM
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}
