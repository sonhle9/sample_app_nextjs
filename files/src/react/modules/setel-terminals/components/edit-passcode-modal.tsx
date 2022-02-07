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
  Checkbox,
} from '@setel/portal-ui';
import * as React from 'react';
import {ITerminal, ITerminalUpdateRequest} from 'src/react/services/api-terminal.type';
import {SetelTerminalNotificationMessage} from '../setel-terminals.const';
import {EditPasscodeManagementSchema, PasscodeSchema} from '../setel-terminals.schema';
import {useUpdateTerminal} from '../setel-terminals.queries';

interface ITerminalsModalProps {
  visible: boolean;
  terminal: ITerminal;
  onClose: () => void;
  onSuccessUpdate: (message: string) => void;
}

const TerminalEditPasscodeModal = ({
  visible,
  terminal,
  onClose,
  onSuccessUpdate,
}: ITerminalsModalProps) => {
  const title = 'Passcode management';
  const [errorMessage, setErrorMessage] = React.useState<string[]>([]);
  const [merchantPasscodeEnabled, setMerchantPasscodeEnabled] = React.useState(
    terminal.merchantPass.isEnabled,
  );
  const [merchantPasscode, setMerchantPasscode] = React.useState(terminal.merchantPass.value);
  const [adminPasscode, setAdminPasscode] = React.useState(terminal.adminPass);
  const {mutate, isLoading} = useUpdateTerminal();
  const editTerminal: ITerminalUpdateRequest = {
    merchantPass: {
      value: merchantPasscode,
      isEnabled: merchantPasscodeEnabled,
    },
    adminPass: adminPasscode,
  };

  const isInvalidPasscode = (value: string): string | undefined => {
    try {
      PasscodeSchema.validateSync(value);
      if (isPasscodeIdentical()) throw new Error('Passcode cannot be identical');
    } catch (e) {
      return e.message;
    }
  };

  const isPasscodeIdentical = () => merchantPasscode === adminPasscode;
  const handleUpdateTerminal = (e) => {
    e.preventDefault();

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

  return (
    <Modal
      isOpen={visible}
      onDismiss={onClose}
      aria-label={title}
      data-testid="edit-passcode-modal">
      <form onSubmit={handleUpdateTerminal}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          {errorMessage.length > 0 && (
            <Alert className="mb-2" variant="error" description="Wrong validation">
              <AlertMessages messages={errorMessage} />
            </Alert>
          )}
          <Fieldset legend="MERCHANT PASSCODE">
            <FieldContainer label="Passcode status" layout="horizontal-responsive">
              <Checkbox
                data-testid="merchant-pass-checkbox"
                checked={merchantPasscodeEnabled}
                onChangeValue={setMerchantPasscodeEnabled}
                label="Enable"
              />
            </FieldContainer>
            <FieldContainer
              status={isInvalidPasscode(merchantPasscode) ? 'error' : undefined}
              helpText={isInvalidPasscode(merchantPasscode)}
              label="Passcode"
              layout="horizontal-responsive">
              <TextInput
                data-testid="merchant-pass-input"
                disabled={!merchantPasscodeEnabled}
                aria-disabled={!merchantPasscodeEnabled}
                value={merchantPasscodeEnabled ? merchantPasscode : '-'}
                onChangeValue={setMerchantPasscode}
                placeholder="Enter merchant passcode"
                className="w-1/2"
              />
            </FieldContainer>
          </Fieldset>
          <Fieldset legend="ADMIN PASSCODE" className="border-t border-gray-200 mt-2 pt-2">
            <FieldContainer
              status={isInvalidPasscode(adminPasscode) ? 'error' : undefined}
              helpText={isInvalidPasscode(adminPasscode)}
              label="Passcode"
              layout="horizontal-responsive">
              <TextInput
                value={adminPasscode}
                onChangeValue={setAdminPasscode}
                placeholder="Enter admin passcode"
                className="w-1/2"
              />
            </FieldContainer>
          </Fieldset>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              CANCEL
            </Button>

            <Button
              isLoading={isLoading}
              disabled={
                !EditPasscodeManagementSchema.isValidSync(editTerminal) || isPasscodeIdentical()
              }
              type="submit"
              variant="primary">
              SAVE CHANGES
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default TerminalEditPasscodeModal;
