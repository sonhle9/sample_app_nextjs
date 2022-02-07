import {Alert, AlertMessages, Button, FieldContainer, Modal, TextInput} from '@setel/portal-ui';
import React from 'react';
import {ITerminalInventory} from 'src/react/services/api-terminal.type';
import {SetelTerminalErrorCodes, SetelTerminalErrorMessage} from '../setel-terminals.const';
import {useUpdateTerminalInventory} from '../setel-terminals.queries';
import {editTerminalSerialNumberSchema} from '../setel-terminals.schema';

interface EditSerialNumberProps {
  isVisible: boolean;
  terminal: ITerminalInventory;
  onClose: () => void;
  onSuccess: () => void;
}

const TerminalInventoryEditSerialNumberModal = ({
  isVisible,
  terminal,
  onClose,
  onSuccess,
}: EditSerialNumberProps) => {
  const [serialNum, setSerialNum] = React.useState(terminal.serialNum);
  const [errorCode, setErrorCode] = React.useState<string>();
  const [errorMessage, setErrorMessage] = React.useState<string[]>([]);
  const {mutate, isLoading} = useUpdateTerminalInventory();

  const title = 'Edit serial number';

  const handleForm = (e) => {
    e.preventDefault();
    mutate(
      {serialNum: terminal.serialNum, request: {serialNum}},
      {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
        onError: (e: any) => {
          const error = e.response?.data;
          setErrorCode(error?.errorCode);
          if (error?.errorCode !== SetelTerminalErrorCodes.DUPLICATE_KEY) {
            setErrorMessage([error?.message].flat());
          }
        },
      },
    );
  };

  const isInvalidSerialNumber = React.useMemo((): string | undefined => {
    try {
      editTerminalSerialNumberSchema.validateSync(serialNum);
      if (errorCode === SetelTerminalErrorCodes.DUPLICATE_KEY) {
        throw new Error(SetelTerminalErrorMessage.DUPLICATE_KEY);
      }
    } catch (e) {
      return e.message;
    }
  }, [serialNum, errorCode]);

  /** To clear the error message in helpText when user type new input */
  React.useEffect(() => {
    if (errorCode) setErrorCode(undefined);
  }, [serialNum]);

  return (
    <Modal header={title} isOpen={isVisible} onDismiss={onClose}>
      <form onSubmit={handleForm}>
        <Modal.Body>
          {errorMessage.length > 0 && (
            <Alert className="mb-2" variant="error" description="Unknown error">
              <AlertMessages messages={errorMessage} />
            </Alert>
          )}
          <FieldContainer
            status={isInvalidSerialNumber ? 'error' : undefined}
            helpText={isInvalidSerialNumber}
            label="Serial number"
            layout="horizontal-responsive">
            <TextInput
              data-testid="serial-number-input"
              value={serialNum}
              onChangeValue={setSerialNum}
              placeholder="Enter serial number"
              className="w-1/2"
            />
          </FieldContainer>

          <FieldContainer label="Terminal ID" layout="horizontal-responsive">
            <TextInput
              disabled
              aria-disabled
              value={terminal.terminalId || '-'}
              className="w-1/2"
            />
          </FieldContainer>

          <FieldContainer label="Status" layout="horizontal-responsive">
            <TextInput disabled aria-disabled value={terminal.status} className="w-1/2" />
          </FieldContainer>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex items-center justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              CANCEL
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={isLoading}
              disabled={Boolean(isInvalidSerialNumber)}>
              SAVE
            </Button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default TerminalInventoryEditSerialNumberModal;
