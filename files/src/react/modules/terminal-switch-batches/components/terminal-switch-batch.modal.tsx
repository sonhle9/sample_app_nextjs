import {Alert, AlertMessages, Button, FieldContainer, Modal, TextareaField} from '@setel/portal-ui';
import {Form, Formik} from 'formik';
import * as React from 'react';
import {useQueryClient} from 'react-query';
import {getCurrentEmail} from 'src/react/lib/utils';
import {ConfirmDialog} from '../../attribution/components/attribution-form';
import {TERMINAL_SWITCH_BATCH_DETAIL, useForceCloseRequest} from '../terminal-switch-batch.query';
import {validationForceCloseSchema} from '../terminal-switch-batches.schema';
import {ForceCloseRequestType} from '../terminal-switch-batches.type';
import {FORCE_CLOSE_DIALOG, FORCE_CLOSE_MODAL_TITLE} from './constant';

interface ITerminalSwitchBatchModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccessUpdate?: (message: string) => void;
  batchId: string;
  typeForceClose: ForceCloseRequestType;
}

const initialValues = {
  remark: '',
  userEmail: '',
};

export const TerminalSwitchBatchModal = ({
  visible,
  onClose,
  batchId,
  onSuccessUpdate,
  typeForceClose,
}: ITerminalSwitchBatchModalProps) => {
  const {mutate, isLoading} = useForceCloseRequest();
  const queryClient = useQueryClient();
  const currentEmeail = getCurrentEmail();
  const [errorMessage, setErrorMessage] = React.useState<string[]>([]);
  const [isConfirm, toggleConfirm] = React.useState<boolean>(false);
  const [data, setData] = React.useState(initialValues);

  const handleSubmit = async ({values}) => {
    setData({
      remark: values.remark,
      userEmail: currentEmeail,
    });
    onClose();
    toggleConfirm(true);
  };

  const handleConfirm = () => {
    mutate(
      {batchId, request: data, type: typeForceClose},
      {
        onSuccess: () => {
          onSuccessUpdate(`Force close approval successfully.`);
          queryClient.invalidateQueries(TERMINAL_SWITCH_BATCH_DETAIL);
        },
        onError: (e: any) => {
          const errorMessage = e.response?.data?.message;
          setErrorMessage([errorMessage].flat());
        },
        onSettled: () => {
          toggleConfirm(false);
        },
      },
    );
  };

  return (
    <>
      <Modal
        isOpen={visible}
        onDismiss={onClose}
        aria-label="Test Modal"
        data-testid="force-close-approval-modal">
        <Formik
          initialValues={initialValues}
          validationSchema={validationForceCloseSchema}
          onSubmit={async (values) => handleSubmit({values})}>
          {({values, errors, isSubmitting, setFieldValue}) => (
            <Form data-testid="force-close-approval-form">
              <Modal.Header>{FORCE_CLOSE_MODAL_TITLE[typeForceClose]}</Modal.Header>
              <Modal.Body>
                {errorMessage.length > 0 && (
                  <Alert className="mb-2" variant="error" description="Wrong validation">
                    <AlertMessages messages={errorMessage} />
                  </Alert>
                )}
                <FieldContainer
                  status={errors.remark ? 'error' : undefined}
                  helpText={errors.remark ? errors.remark : undefined}
                  label="Remarks"
                  layout="horizontal-responsive"
                  labelAlign="start">
                  <TextareaField
                    data-testid="force-close-approval-remark-type-textarea"
                    value={values.remark}
                    onChange={(e) => setFieldValue('remark', e.target.value)}
                    placeholder="Enter remarks"
                  />
                </FieldContainer>
              </Modal.Body>
              <Modal.Footer className="rounded-lg text-right">
                <Button variant="outline" className="mr-3" onClick={onClose}>
                  CANCEL
                </Button>
                <Button
                  isLoading={isLoading}
                  disabled={!validationForceCloseSchema.isValidSync(values) || isSubmitting}
                  data-testid="force-close-approval-submit-form"
                  variant="primary"
                  type="submit">
                  CONFIRM
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
      <ConfirmDialog
        header={FORCE_CLOSE_DIALOG[typeForceClose].header}
        confirmLabel={FORCE_CLOSE_DIALOG[typeForceClose].confirmLabel}
        onConfirm={handleConfirm}
        open={isConfirm}
        toggleOpen={toggleConfirm}>
        {FORCE_CLOSE_DIALOG[typeForceClose].content}
      </ConfirmDialog>
    </>
  );
};
