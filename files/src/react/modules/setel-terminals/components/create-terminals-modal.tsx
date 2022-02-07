import {
  Alert,
  AlertMessages,
  Button,
  FieldContainer,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  SearchableDropdown,
  TextareaField,
  useDebounce,
} from '@setel/portal-ui';
import * as React from 'react';
import {useMutation, useQueryClient} from 'react-query';
import {SETEL_TERMINAL_QUERY_KEY, useGetInventorySerialNumbers} from '../setel-terminals.queries';
import {createTerminal} from 'src/react/services/api-terminal.service';
import {ITerminal} from 'src/react/services/api-terminal.type';
import {SetelTerminalSchema} from '../setel-terminals.schema';
import {useMerchantSearch} from 'src/react/modules/merchants/merchants.queries';

interface ITerminalsModalProps {
  visible: boolean;
  terminal?: ITerminal;
  onClose?: () => void;
  onSuccessCreate?: Function;
}

export const CreateTerminalsModal = ({visible, onClose, onSuccessCreate}: ITerminalsModalProps) => {
  const [serialNumber, setSerialNumber] = React.useState<string>('');
  const [remarks, setRemarks] = React.useState<string>('');
  const [name, setName] = React.useState<string>('');
  const [merchant, setMerchant] = React.useState<string>('');
  const searchMerchant = useDebounce(name);
  const searchSerialNumber = useDebounce(serialNumber);
  const {data: merchants} = useMerchantSearch({name: searchMerchant});
  const {data: serialNumbers} = useGetInventorySerialNumbers({
    serialNum: searchSerialNumber,
    excludeCreatedStatus: true,
  });
  const [errorMessage, setErrorMessage] = React.useState([]);

  const {mutateAsync: mutateCreateTerminal, isLoading: isCreateLoading} =
    useMutation(createTerminal);

  const queryClient = useQueryClient();

  const inputTerminal = {
    merchantId: merchant,
    serialNum: serialNumber,
    remarks,
  };

  const handleCreateTerminal = async (e) => {
    e.preventDefault();

    try {
      const res = await mutateCreateTerminal(inputTerminal);
      onSuccessCreate(
        'terminal',
        <a
          className={'text-turquoise-800 font-bold'}
          target={'_blank'}
          href={`/terminal/details/setel/${res.serialNum}`}>
          {`Show terminal ${res.serialNum} details`}
        </a>,
      );
      queryClient.invalidateQueries([SETEL_TERMINAL_QUERY_KEY.TERMINALS_LISTING]);
      onClose();
    } catch ({response}) {
      setErrorMessage(response && response.data && [response.data.message].flat());
    }
  };

  const close = () => {
    onClose();
  };

  const title = 'Add terminal';

  return (
    <Modal isOpen={visible} onDismiss={close} aria-label={title} data-testid="terminal-modal">
      <form onSubmit={handleCreateTerminal}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          {errorMessage.length > 0 && (
            <Alert className="mb-2" variant="error" description="Wrong validation">
              <AlertMessages messages={errorMessage} />
            </Alert>
          )}

          <FieldContainer label="Serial number" layout="horizontal-responsive">
            <SearchableDropdown
              placeholder="Enter serial number"
              value={serialNumber}
              onChangeValue={setSerialNumber}
              onInputValueChange={setSerialNumber}
              options={serialNumbers}
            />
          </FieldContainer>

          <FieldContainer label="Merchant" layout="horizontal-responsive">
            <SearchableDropdown
              placeholder="Enter merchant name"
              value={merchant}
              onChangeValue={setMerchant}
              onInputValueChange={setName}
              options={merchants?.items?.map((merchant) => ({
                value: merchant.id,
                label: merchant.name,
              }))}
            />
          </FieldContainer>
          <TextareaField
            label="Remarks"
            layout="horizontal-responsive"
            placeholder="Enter remarks"
            value={remarks}
            onChangeValue={setRemarks}
          />
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-end space-x-2">
            <Button variant="outline" onClick={close}>
              CANCEL
            </Button>
            <Button
              isLoading={isCreateLoading}
              type="submit"
              variant="primary"
              disabled={!SetelTerminalSchema.isValidSync(inputTerminal)}>
              SAVE
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
};
