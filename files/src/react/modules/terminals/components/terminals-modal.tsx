import {
  Alert,
  AlertMessages,
  Button,
  DaySelector,
  DropdownSelect,
  FieldContainer,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  SearchableDropdown,
  TextareaField,
  TextInput,
} from '@setel/portal-ui';
import * as React from 'react';
import {useMutation, useQueryClient} from 'react-query';
import {
  TerminalTypeOptions,
  TerminalStatusOptions,
  CreateTerminalStatusOptions,
  TerminalStatus,
} from '../terminals.constant';
import {useGetMerchants} from '../terminals.queries';
import {createTerminal, updateTerminal} from '../terminals.service';
import {ITerminal} from '../terminals.type';
import {TerminalSchema} from '../terminals.schema';
interface ITerminalsModalProps {
  visible: boolean;
  terminal?: ITerminal;
  onClose?: () => void;
  onSuccessCreate?: Function;
  onSuccessUpdate?: (message: string) => void;
}

export const TerminalsModal = ({
  terminal,
  visible,
  onClose,
  onSuccessCreate,
  onSuccessUpdate,
}: ITerminalsModalProps) => {
  const [terminalId, setTerminalId] = React.useState<string>(
    (terminal && terminal.terminalId) || '',
  );
  const [type, setType] = React.useState<string>((terminal && terminal.type) || '');
  const [status, setStatus] = React.useState<string>((terminal && terminal.status) || '');
  const [deploymentDate, setDeploymentDate] = React.useState<Date>(
    (terminal && new Date(terminal.deploymentDate)) || undefined,
  );
  const [serialNumber, setSerialNumber] = React.useState<string>(
    (terminal && terminal.serialNumber) || '',
  );
  const [modelTerminal, setModelTerminal] = React.useState<string>(
    (terminal && terminal.modelTerminal) || '',
  );
  const [remarks, setRemarks] = React.useState<string>((terminal && terminal.remarks) || '');
  const [name, setName] = React.useState<string>('');
  const {data: merchants} = useGetMerchants({name});
  const [merchant, setMerchant] = React.useState<string>((terminal && terminal.merchant.id) || '');
  const [errorMessage, setErrorMessage] = React.useState([]);
  const {mutateAsync: mutateCreateTerminal, isLoading: isCreateLoading} =
    useMutation(createTerminal);
  const {mutateAsync: mutateUpdateTerminal, isLoading: isUpdateLoading} =
    useMutation(updateTerminal);
  const queryClient = useQueryClient();

  const inputTerminal = {
    terminalId,
    type,
    status,
    merchantId: merchant,
    serialNumber,
    modelTerminal,
    remarks,
    deploymentDate,
  };

  const handleCreateTerminal = async (e) => {
    e.preventDefault();

    try {
      await mutateCreateTerminal(inputTerminal);
      onSuccessCreate(
        'terminal',
        <a
          className={'text-turquoise-800 font-bold'}
          target={'_blank'}
          href={`/gateway/terminals/${terminalId}/merchants/${merchant}`}>
          {`Show terminal ${terminalId} details`}
        </a>,
      );
      queryClient.invalidateQueries(['terminals']);
      onClose();
    } catch ({response}) {
      setErrorMessage(response && response.data && [response.data.message].flat());
    }
  };

  const handleUpdateTerminal = async (e) => {
    e.preventDefault();

    try {
      await mutateUpdateTerminal(inputTerminal);
      queryClient.invalidateQueries(['terminals_details']);
      onSuccessUpdate('Update terminal successfully');
      onClose();
    } catch ({response}) {
      setErrorMessage(response && response.data && [response.data.message].flat());
    }
  };

  const close = () => {
    onClose();
  };

  const title = !!terminal ? 'Edit terminal details' : 'Add terminal';

  return (
    <Modal isOpen={visible} onDismiss={close} aria-label={title} data-testid="terminal-modal">
      <form onSubmit={!terminal ? handleCreateTerminal : handleUpdateTerminal}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          {errorMessage.length > 0 && (
            <Alert className="mb-2" variant="error" description="Wrong validation">
              <AlertMessages messages={errorMessage} />
            </Alert>
          )}
          <FieldContainer label="Terminal ID" layout="horizontal-responsive">
            <TextInput
              disabled={!!terminal}
              value={terminalId}
              onChangeValue={setTerminalId}
              placeholder="Enter terminal ID"
            />
          </FieldContainer>
          <FieldContainer label="Type" layout="horizontal-responsive">
            <DropdownSelect<string>
              data-testid="terminal-type-input"
              className="w-1/2"
              placeholder="Please select"
              value={type}
              onChangeValue={setType}
              options={TerminalTypeOptions}
            />
          </FieldContainer>
          <FieldContainer label="Status" layout="horizontal-responsive">
            <DropdownSelect<string>
              data-testid="terminal-status-input"
              disabled={!!terminal && terminal.status === TerminalStatus.TERMINATED}
              className="w-1/2"
              placeholder="Please select"
              value={status}
              onChangeValue={setStatus}
              options={!terminal ? CreateTerminalStatusOptions : TerminalStatusOptions}
            />
          </FieldContainer>
          <FieldContainer label="Deployment date" layout="horizontal-responsive">
            <DaySelector
              className="w-1/2"
              value={deploymentDate}
              onChangeValue={setDeploymentDate}
              placeholder="Select date"
            />
          </FieldContainer>
          <FieldContainer label="Serial Number" layout="horizontal-responsive">
            <TextInput
              value={serialNumber}
              onChangeValue={setSerialNumber}
              placeholder="Enter serial number"
            />
          </FieldContainer>
          <FieldContainer label="Model" layout="horizontal-responsive">
            <TextInput
              value={modelTerminal}
              onChangeValue={setModelTerminal}
              placeholder="Enter model"
            />
          </FieldContainer>
          <FieldContainer label="Merchant" layout="horizontal-responsive">
            {!terminal ? (
              <SearchableDropdown
                disabled={!!terminal}
                placeholder="Search merchant"
                onChange={(e) => setName(e.target.value)}
                value={merchant}
                onChangeValue={setMerchant}
                options={merchants}
              />
            ) : (
              <TextInput disabled value={terminal.merchant.name} />
            )}
          </FieldContainer>
          <TextareaField
            label="Remarks"
            layout="horizontal-responsive"
            value={remarks}
            onChangeValue={setRemarks}
          />
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-end space-x-2">
            <Button variant="outline" onClick={close}>
              CANCEL
            </Button>
            {!terminal && (
              <Button
                isLoading={isCreateLoading}
                type="submit"
                variant="primary"
                disabled={!TerminalSchema.isValidSync(inputTerminal)}>
                SAVE
              </Button>
            )}
            {!!terminal && (
              <Button
                isLoading={isUpdateLoading}
                type="submit"
                variant="primary"
                disabled={!TerminalSchema.isValidSync(inputTerminal)}>
                SAVE CHANGES
              </Button>
            )}
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
};
