import {
  Modal,
  ModalHeader,
  ModalBody,
  Alert,
  FieldContainer,
  ModalFooter,
  Button,
  MultiInput,
  Text,
  AlertMessages,
} from '@setel/portal-ui';
import * as React from 'react';
import {SetelTerminalErrorCodes, SetelTerminalErrorMessage} from '../setel-terminals.const';
import {convertStringWithSquareBracketsToArray} from '../setel-terminals.helper';
import {useImportSerialNumbers} from '../setel-terminals.queries';
import {IsAlphanumericSchema, TerminalSerialNumbersSchema} from '../setel-terminals.schema';

interface ImportSerialNumberModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccessCreate: () => void;
}
const title = 'Import serial number';

const ImportSerialNumberModal = ({
  visible,
  onClose,
  onSuccessCreate,
}: ImportSerialNumberModalProps) => {
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const [errorValidationMessage, setErrorValidationMessage] = React.useState<string[] | string>();
  const [serialNumbers, setSerialNumbers] = React.useState<string[]>([]);
  const [invalidSerialNumbers, setInvalidSerialNumbers] = React.useState<string[]>([]);

  const {mutate, isLoading} = useImportSerialNumbers();

  const displayedValues = serialNumbers.map((value: string) => ({
    value,
    color: invalidSerialNumbers.includes(value) ? ('error' as 'error') : ('grey' as 'grey'),
  }));

  const isInvalidExist =
    serialNumbers.filter((v: string) => invalidSerialNumbers.includes(v)).length > 0;

  const handleImportSerialNumbers = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validSchema = serialNumbers.reduce((accumulator, value) => {
      const isAlphanumeric = IsAlphanumericSchema.isValidSync(value);
      if (!isAlphanumeric) {
        setInvalidSerialNumbers((oldValue) => [...oldValue, value]);
        setErrorMessage(SetelTerminalErrorMessage.SERIAL_NUM_ALPHANUMERIC);
      }
      return accumulator && isAlphanumeric;
    }, true);

    if (validSchema) {
      mutate(
        {serialNum: serialNumbers},
        {
          onSuccess: () => {
            onSuccessCreate();
            onClose();
          },
          onError: (e: any) => {
            const errMsg = e.response?.data?.message;
            const errorCode = e.response?.data?.errorCode;
            if (errMsg && errorCode === SetelTerminalErrorCodes.DUPLICATE_KEY) {
              const match = convertStringWithSquareBracketsToArray(errMsg);
              if (match) {
                setInvalidSerialNumbers(match);
              }
              setErrorMessage(SetelTerminalErrorMessage.DUPLICATE_KEY);
            } else {
              setErrorValidationMessage(errMsg ?? e.message);
            }
          },
        },
      );
    }
  };

  return (
    <Modal
      isOpen={visible}
      onDismiss={() => onClose()}
      aria-label={title}
      data-testid="import-serial-no-modal">
      <form onSubmit={handleImportSerialNumbers}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <Text color="darkgrey" className="text-sm mb-4">
            This serial number will be imported in the admin portal record. You may enter multiple
            serial numbers separated by commas.
          </Text>
          {errorMessage && isInvalidExist && (
            <Alert className="mb-4" variant="error" description={errorMessage}></Alert>
          )}
          {errorValidationMessage && (
            <Alert className="mb-2" variant="error" description="Unknown error">
              <AlertMessages messages={[errorValidationMessage].flat()} />
            </Alert>
          )}
          <FieldContainer status={isInvalidExist ? 'error' : null}>
            <MultiInput
              values={displayedValues}
              onChangeValues={setSerialNumbers}
              variant="textarea"
              data-testid="serial-num-input"
            />
          </FieldContainer>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-end space-x-2">
            <Button variant="outline" onClick={() => onClose()}>
              CANCEL
            </Button>
            <Button
              data-testid="serial-num-confirm-btn"
              isLoading={isLoading}
              type="submit"
              variant="primary"
              disabled={
                !TerminalSerialNumbersSchema.isValidSync({serialNum: serialNumbers}) ||
                isInvalidExist
              }>
              CONFIRM
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default ImportSerialNumberModal;
