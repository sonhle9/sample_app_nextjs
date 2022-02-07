import * as React from 'react';
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
  TextInput,
} from '@setel/portal-ui';
import {IReplacement} from '../terminals.type';
import {useGetMerchants, useGetTerminalsByMerchant} from '../terminals.queries';
import {TerminalReasons} from '../terminals.constant';
import {useMutation, useQueryClient} from 'react-query';
import {createReplacement} from '../terminals.service';
import {ReplacementSchema} from '../terminals.schema';

interface IReplacementModalProps {
  visible: boolean;
  replacement?: IReplacement;
  onClose?: () => void;
  onSuccessCreate?: Function;
}

export const ReplacementModal = ({visible, onClose, onSuccessCreate}: IReplacementModalProps) => {
  const [oldTerminalId, setOldTerminalId] = React.useState<string>('');
  const [replacedTerminalId, setReplacedTerminalId] = React.useState<string>('');
  const [replacementDate, setReplacementDate] = React.useState<Date>(new Date());
  const [reason, setReason] = React.useState<string>('');
  const [merchant, setMerchant] = React.useState<string>('');
  const [name, setName] = React.useState<string>('');
  const {data: merchants} = useGetMerchants({name});
  const {data: terminals} = useGetTerminalsByMerchant({
    merchantId: merchant,
  });
  const [errorMessage, setErrorMessage] = React.useState([]);
  const {mutateAsync: mutateCreateReplacement, isLoading} = useMutation(createReplacement);
  const queryClient = useQueryClient();

  const inputReplacement = {
    oldTerminalId,
    replacedTerminalId,
    merchantId: merchant,
    replacementDate,
    reason,
  };

  const handleCreateReplacement = async (e) => {
    e.preventDefault();
    try {
      await mutateCreateReplacement(inputReplacement);
      onSuccessCreate(
        'replacement',
        <div className="flex space-x-1">
          <div>Terminal</div>
          <div>
            <a
              className={'text-error-500 font-bold'}
              target={'_blank'}
              href={`/gateway/terminals/${oldTerminalId}/merchants/${merchant}`}>
              {`${oldTerminalId}`}
            </a>
          </div>
          <div>is replaced by</div>
          <div>
            <a
              className={'text-turquoise-800 font-bold'}
              target={'_blank'}
              href={`/gateway/terminals/${replacedTerminalId}/merchants/${merchant}`}>
              {`${replacedTerminalId}`}
            </a>
          </div>
        </div>,
      );

      queryClient.invalidateQueries(['terminals']);
      onClose();
    } catch ({response}) {
      setErrorMessage(response && response.data && [response.data.message].flat());
    }
  };

  const close = () => {
    onClose();
  };

  return (
    <Modal isOpen={visible} onDismiss={close} aria-label="Replace terminal">
      <form onSubmit={handleCreateReplacement}>
        <ModalHeader>{'Replace terminal'}</ModalHeader>
        <ModalBody>
          {errorMessage.length > 0 && (
            <Alert className="mb-2" variant="error" description="Wrong validation">
              <AlertMessages messages={errorMessage} />
            </Alert>
          )}
          <FieldContainer label="Merchant name" layout="horizontal-responsive">
            <SearchableDropdown
              placeholder="Search merchant"
              onChange={(e) => setName(e.target.value)}
              value={merchant}
              onChangeValue={setMerchant}
              options={merchants}
            />
          </FieldContainer>
          <FieldContainer label="Old terminal ID" layout="horizontal-responsive">
            <SearchableDropdown
              disabled={!merchant}
              placeholder="Please select"
              value={oldTerminalId}
              onChangeValue={setOldTerminalId}
              options={terminals}
            />
          </FieldContainer>
          <FieldContainer label="Replaced terminal ID" layout="horizontal-responsive">
            <SearchableDropdown
              disabled={!merchant}
              placeholder="Please select"
              value={replacedTerminalId}
              onChangeValue={setReplacedTerminalId}
              options={terminals}
            />
          </FieldContainer>
          <FieldContainer label="Replaced date" layout="horizontal-responsive">
            <DaySelector
              className="w-1/2"
              value={replacementDate}
              onChangeValue={setReplacementDate}
              placeholder="Select date"
            />
          </FieldContainer>
          <FieldContainer label="Reason" layout="horizontal-responsive">
            <DropdownSelect<string>
              className="w-1/2"
              placeholder="Please select"
              value={reason}
              onChangeValue={setReason}
              options={TerminalReasons}
            />
          </FieldContainer>
          <FieldContainer label="Last Batch ID" layout="horizontal-responsive">
            <TextInput disabled value={'100001'} />
          </FieldContainer>
          <FieldContainer label="Last settle transaction ID" layout="horizontal-responsive">
            <TextInput disabled value={'5ef12xm890100'} />
          </FieldContainer>
          <FieldContainer label="Settlement range" layout="horizontal-responsive">
            <TextInput disabled value={'2020-01-01 - 2021-01-01'} />
          </FieldContainer>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-end space-x-2">
            <Button variant="outline" onClick={close}>
              CANCEL
            </Button>
            <Button
              isLoading={isLoading}
              type="submit"
              variant="primary"
              disabled={!ReplacementSchema.isValidSync(inputReplacement)}>
              SAVE
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
};
