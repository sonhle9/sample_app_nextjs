import {
  Modal,
  ModalHeader,
  ModalBody,
  Alert,
  AlertMessages,
  FieldContainer,
  TextInput,
  ModalFooter,
  Button,
  Fieldset,
  DropdownSelect,
  TextareaField,
  formatDate,
} from '@setel/portal-ui';

import * as React from 'react';
import {ITerminal} from 'src/react/services/api-terminal.type';
import {
  EditTerminalStatus,
  EditTerminalStatusOptions,
  SetelTerminalErrorMessage,
  SetelTerminalNotificationMessage,
  TerminalStatus,
  TerminalSwitchSource,
  TerminalTypeOptions,
} from '../setel-terminals.const';
import {EditTerminalSchema} from '../setel-terminals.schema';
import {
  useCheckPendingSettlement,
  useDeactivateTerminal,
  useUpdateTerminal,
} from '../setel-terminals.queries';
import _, {capitalize} from 'lodash';
import TerminalDeactivationDialog from './terminal-deactivation-dialog';
import {useRouter} from 'src/react/routing/routing.context';

interface ITerminalsModalProps {
  merchantName: string;
  merchantAddress: string;
  visible: boolean;
  terminal: ITerminal;
  onClose: () => void;
  onSuccessUpdate: (message: string, description?: string) => void;
}

const TerminalEditModal = ({
  visible,
  terminal,
  onClose,
  onSuccessUpdate,
  merchantName,
  merchantAddress,
}: ITerminalsModalProps) => {
  const title = 'General';
  const router = useRouter();
  const [showDeactivationDialog, setShowDeactivationDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string[]>([]);
  const [errorTitle, setErrorTitle] = React.useState<string>();
  const [status, setStatus] = React.useState(terminal.status);
  const [type, setType] = React.useState(terminal.type);
  const [remarks, setRemarks] = React.useState(terminal.remarks);
  const [reason, setReason] = React.useState(terminal.reason);
  const closeDeactivationDialog = () => setShowDeactivationDialog(false);
  const {mutate, isLoading} = useUpdateTerminal();
  const {mutate: mutateDeactivateTerminal} = useDeactivateTerminal();
  const {data: pendingSettlementData, error: pendingSettlementError} = useCheckPendingSettlement({
    source: TerminalSwitchSource.SETEL,
    merchantId: terminal.merchantId,
    terminalId: terminal.terminalId,
  });

  const displayActivatedOption =
    EditTerminalStatus.includes(terminal.status as TerminalStatus) ||
    status === TerminalStatus.ACTIVATED
      ? {
          label: capitalize(TerminalStatus.ACTIVATED),
          value: TerminalStatus.ACTIVATED,
        }
      : undefined;
  const TerminalStatusOptions = _.uniqBy(
    [
      {label: capitalize(terminal.status), value: terminal.status},
      displayActivatedOption,
      ...EditTerminalStatusOptions,
    ].filter(Boolean),
    'value',
  );
  const isReasonShown = EditTerminalStatus.includes(status as TerminalStatus);
  const isReasonRequired = terminal.reason && !reason;
  const editTerminal = {
    type,
    remarks,
    ...((isReasonShown || status === TerminalStatus.ACTIVATED) && {status}),
    ...(isReasonShown && {reason}),
  };

  const handleSubmitForm = (event) => {
    event.preventDefault();

    if (editTerminal.status === TerminalStatus.DEACTIVATED) {
      setShowDeactivationDialog(true);
      return;
    }

    handleUpdateTerminal();
  };

  const handleUpdateTerminal = () => {
    mutate(
      {serialNum: terminal.serialNum, request: editTerminal},
      {
        onSuccess: () => {
          onSuccessUpdate(SetelTerminalNotificationMessage.UPDATE_SUCCESS);
          onClose();
        },
        onError: (e: any) => {
          const errorMessage = e.response?.data?.message;
          setErrorMessage([errorMessage].flat());
        },
      },
    );
  };

  const handleDeactivateTerminal = () => {
    if (!pendingSettlementData) {
      setErrorTitle(SetelTerminalErrorMessage.DEACTIVATION_UNKNOWN_PENDING_SETTLEMENT);
      closeDeactivationDialog();
      return;
    }

    if (!pendingSettlementData.isOpenBatch && !pendingSettlementData.isPendingSettlement) {
      mutateDeactivateTerminal(
        {serialNum: terminal.serialNum, request: {reason}},
        {
          onSuccess: () => {
            onSuccessUpdate(
              SetelTerminalNotificationMessage.TERMINAL_DEACTIVATE_SUCCESS_TITLE,
              SetelTerminalNotificationMessage.TERMINAL_DEACTIVATE_SUCCESS_DESCRIPTION,
            );
            onClose();
            router.navigateByUrl(`/terminal/inventory`);
          },
          onError: (e: any) => {
            const errorMessage = e.response?.data?.message;
            setErrorMessage([errorMessage].flat());
            closeDeactivationDialog();
          },
        },
      );
    } else {
      setErrorTitle(SetelTerminalErrorMessage.DEACTIVATION_HAS_PENDING_SETTLEMENT);
      closeDeactivationDialog();
    }
  };

  React.useEffect(() => {
    if (pendingSettlementError) {
      const err = pendingSettlementError as any;
      setErrorMessage([err.response?.data?.message || err.message].flat());
    }
  }, [pendingSettlementError]);

  return (
    <>
      <Modal
        isOpen={visible}
        onDismiss={onClose}
        aria-label={title}
        data-testid="edit-terminal-modal">
        <form onSubmit={handleSubmitForm}>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>
            {(errorMessage.length > 0 || errorTitle) && (
              <Alert
                data-testid="edit-terminal-alert"
                className="mb-6"
                variant="error"
                description={errorTitle || 'Error description'}>
                {errorMessage.length > 0 && <AlertMessages messages={errorMessage} />}
              </Alert>
            )}
            <Fieldset legend="HARDWARE">
              <FieldContainer label="Terminal ID" layout="horizontal-responsive">
                <TextInput
                  disabled
                  aria-disabled
                  value={terminal.terminalId}
                  placeholder="Enter terminal ID"
                  className="w-1/2"
                />
              </FieldContainer>
              <FieldContainer label="Status" layout="horizontal-responsive">
                <DropdownSelect
                  data-testid="terminal-status-input"
                  className="w-1/2"
                  placeholder="Please select status"
                  value={status}
                  onChangeValue={(v) => setStatus(v)}
                  options={TerminalStatusOptions}
                />
              </FieldContainer>
              {isReasonShown && (
                <TextareaField
                  data-testid="reason-input"
                  status={isReasonRequired ? 'error' : undefined}
                  helpText={isReasonRequired ? 'Required field' : undefined}
                  label="Reason"
                  placeholder="Enter reason"
                  layout="horizontal-responsive"
                  value={reason}
                  onChangeValue={setReason}
                />
              )}
              <FieldContainer label="Type" layout="horizontal-responsive">
                <DropdownSelect
                  data-testid="terminal-type-input"
                  className="w-1/2"
                  placeholder="Please select type"
                  value={type}
                  onChangeValue={(v) => setType(v)}
                  options={TerminalTypeOptions}
                />
              </FieldContainer>
              <FieldContainer label="Serial number" layout="horizontal-responsive">
                <TextInput
                  data-testid="terminal-serial-num-input"
                  value={terminal.serialNum}
                  placeholder="Enter serial number"
                  className="w-1/2"
                  disabled
                  aria-disabled
                />
              </FieldContainer>
              <FieldContainer label="Manufacturer" layout="horizontal-responsive">
                <TextInput
                  className="w-1/2"
                  value={terminal.manufacturer || '-'}
                  disabled
                  aria-disabled
                />
              </FieldContainer>
              <FieldContainer label="Model" layout="horizontal-responsive">
                <TextInput
                  className="w-1/2"
                  value={terminal.modelReference || '-'}
                  disabled
                  aria-disabled
                />
              </FieldContainer>
            </Fieldset>
            <Fieldset legend="MERCHANT" className="border-t border-gray-200 mt-2 pt-2">
              <FieldContainer label="Name" layout="horizontal-responsive">
                <TextInput disabled aria-disabled value={merchantName ?? '-'} />
              </FieldContainer>
              <TextareaField
                label="Address"
                layout="horizontal-responsive"
                value={merchantAddress ?? '-'}
                readOnly
                aria-readonly
                disabled
                aria-disabled
              />
            </Fieldset>
            <Fieldset legend="OTHER" className="border-t border-gray-200 mt-2 pt-2">
              <FieldContainer label="Last seen" layout="horizontal-responsive">
                <TextInput
                  className="w-1/2"
                  value={terminal.metrics?.updatedAt ? formatDate(terminal.metrics.updatedAt) : '-'}
                  disabled
                  aria-disabled
                />
              </FieldContainer>
              <TextareaField
                data-testid="terminal-remarks"
                label="Remarks"
                layout="horizontal-responsive"
                value={remarks}
                onChangeValue={setRemarks}
              />
            </Fieldset>
          </ModalBody>
          <ModalFooter>
            <div className="flex items-center justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                CANCEL
              </Button>

              <Button
                isLoading={isLoading}
                disabled={!EditTerminalSchema.isValidSync(editTerminal)}
                type="submit"
                variant="primary">
                SAVE CHANGES
              </Button>
            </div>
          </ModalFooter>
        </form>
      </Modal>
      <TerminalDeactivationDialog
        isVisible={showDeactivationDialog}
        onConfirm={handleDeactivateTerminal}
        onClose={closeDeactivationDialog}
      />
    </>
  );
};

export default TerminalEditModal;
