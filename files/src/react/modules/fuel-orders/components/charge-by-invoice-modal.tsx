import React from 'react';
import {Formik} from 'formik';
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
import {useManualCharge} from '../fuel-orders.queries';
import {FormikTextareaField} from '../../../components/formik';

interface ChargeByInvoiceModalProps {
  onDismiss: (boolean) => void;
  orderId: string;
  isOpen: boolean;
  amount: number;
}

export function ChargeByInvoiceModal({
  isOpen,
  onDismiss: setShowChargeByInvoiceModal,
  orderId,
  amount,
}: ChargeByInvoiceModalProps) {
  const [showChargeByInvoiceDialog, setShowChargeByInvoiceDialog] = React.useState(false);
  const [formValues, setFormValues] = React.useState<{amount: number; remark: string}>({
    amount: 0,
    remark: '',
  });

  const onDismissDialog = () => setShowChargeByInvoiceDialog(false);
  const onSettledDialog = () => {
    setShowChargeByInvoiceDialog(false);
    setShowChargeByInvoiceModal(false);
  };

  return (
    <Modal
      size="small"
      header="Charge by invoice"
      isOpen={isOpen}
      onDismiss={setShowChargeByInvoiceModal}>
      <Formik
        initialValues={{amount, remark: ''}}
        onSubmit={(values) => {
          setFormValues(values);
          setShowChargeByInvoiceDialog(true);
        }}>
        {(formikBag) => (
          <form onSubmit={formikBag.handleSubmit}>
            <ModalBody>
              {!amount && (
                <Alert
                  className="mb-5"
                  variant="error"
                  description="There is no existing grand total amount. Unable to manually charge by grand total amount."></Alert>
              )}
              <FieldContainer label="Amount" layout="horizontal-responsive">
                <MoneyInput value={amount ? amount.toString() : ''} disabled={true} />
              </FieldContainer>
              <FormikTextareaField
                fieldName="remark"
                label="Message (Optional)"
                layout="horizontal-responsive"
              />
            </ModalBody>
            <ModalFooter className="text-right">
              <Button onClick={setShowChargeByInvoiceModal} variant="outline" className="mr-3">
                CANCEL
              </Button>
              <Button variant="primary" type="submit" disabled={!amount}>
                CONTINUE
              </Button>
            </ModalFooter>
          </form>
        )}
      </Formik>
      <ChargeByInvoiceDialog
        isOpen={showChargeByInvoiceDialog}
        orderId={orderId}
        amount={amount}
        formValues={formValues}
        onDismissDialog={onDismissDialog}
        onSettledDialog={onSettledDialog}
      />
    </Modal>
  );
}

function ChargeByInvoiceDialog({
  isOpen,
  amount,
  orderId,
  formValues,
  onDismissDialog,
  onSettledDialog,
}) {
  const {mutateAsync: manualCharge, isLoading: isProcessingManualCharge} = useManualCharge();
  const cancelBtnRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Dialog
      data-testid="Confirm charge by invoice modal"
      isOpen={isOpen}
      onDismiss={onDismissDialog}
      leastDestructiveRef={cancelBtnRef}>
      <Dialog.Content
        header={`Are you sure you want to proceed with charging ${formatMoney(amount, 'MYR')}?`}>
        You are about to charge {formatMoney(amount, 'MYR')}. Click submit to proceed.
      </Dialog.Content>
      <Dialog.Footer>
        <Button
          onClick={onDismissDialog}
          disabled={isProcessingManualCharge}
          variant="outline"
          ref={cancelBtnRef}>
          CANCEL
        </Button>
        <Button
          onClick={() =>
            manualCharge(
              {orderId, remark: formValues.remark},
              {
                onSettled: onSettledDialog,
              },
            )
          }
          variant="primary"
          isLoading={isProcessingManualCharge}
          disabled={isProcessingManualCharge}>
          SUBMIT
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}
