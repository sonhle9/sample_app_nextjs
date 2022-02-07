import * as React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FieldContainer,
  TextField,
  TextareaField,
  Button,
  isNil,
} from '@setel/portal-ui';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {useCheckValidMesraCardForTransfer} from '../../custom-hooks/use-check-valid-mesra-card';
import {useGetCardBalanceByCardNumber} from '../../loyalty.queries';
import {Member} from '../../loyalty-members.type';
import {useTransferPoints} from '../../loyalty.queries';
import {removeDashes} from 'src/shared/helpers/format-text';

type LoyaltyMemberPointTransferModalProps = {
  isOpen: boolean;
  onDismiss: () => void;
  member?: Member;
};

export const LoyaltyMemberPointTransferModal: React.VFC<LoyaltyMemberPointTransferModalProps> = ({
  isOpen,
  onDismiss,
  member,
}) => {
  const [cardNumber, setCardNumber] = React.useState('');
  const [amount, setAmount] = React.useState<number | null>(null);
  const [remarks, setRemarks] = React.useState('');

  const {data: balance} = useGetCardBalanceByCardNumber(member?.cardNumber);
  const {isValid, isLoading, errorMessage} = useCheckValidMesraCardForTransfer(cardNumber);
  const {
    mutateAsync: mutateTransferPoints,
    isLoading: transferLoading,
    isError,
    error,
    reset,
  } = useTransferPoints();

  const handleAmount = (val: string) => {
    if (Number(val) < 0) {
      setAmount(Number(val) * -1);
    } else if (val === '') {
      setAmount(null);
    } else {
      setAmount(Number(val));
    }
  };

  const isInsufficient = (balance?.pointTotalBalance || 0) < amount;

  const onReset = () => {
    setCardNumber('');
    setAmount(null);
    setRemarks('');
    reset();
  };

  const handleDismiss = () => {
    onReset();
    onDismiss();
  };

  const handleSubmit = async () => {
    const res = await mutateTransferPoints({
      sourceCardNumber: member?.cardNumber,
      destinationCardNumber: cardNumber,
      amount: Number(amount),
      remarks,
    });

    if (res) {
      handleDismiss();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={handleDismiss}
      aria-label="point-transfer"
      data-testid="point-transfer-modal">
      <ModalHeader>Transfer point</ModalHeader>
      <ModalBody>
        {isError && (
          <div className="pb-4 col-span-3">
            <QueryErrorAlert error={error as any} description="Error while transferring points" />
          </div>
        )}
        <FieldContainer
          label="Transfer to"
          layout="horizontal-responsive"
          className="mb-0"
          labelAlign="start">
          <TextField
            className="w-72"
            value={cardNumber}
            placeholder="Insert card number"
            onChangeValue={(value) => setCardNumber(removeDashes(value))}
            helpText={<span className="text-error-500">{errorMessage}</span>}
          />
        </FieldContainer>
        <FieldContainer
          label="Amount"
          layout="horizontal-responsive"
          className="mb-0"
          labelAlign="start">
          <div className="relative mb-5 w-48">
            <TextField
              type="number"
              value={isNil(amount) ? '' : amount}
              onChangeValue={handleAmount}
              placeholder="0"
              helpText={
                isInsufficient && <span className="text-error-500">Insufficient balance</span>
              }
            />
            <div className="absolute inset-y-0 right-0 px-2 my-1 mr-1 bg-white h-8 flex items-center">
              pts
            </div>
          </div>
        </FieldContainer>
        <FieldContainer
          label="Description"
          layout="horizontal-responsive"
          className="mb-0"
          labelAlign="start">
          <TextareaField value={remarks} onChangeValue={setRemarks} />
        </FieldContainer>
      </ModalBody>
      <ModalFooter className="text-right">
        <Button variant="outline" className="mr-5" onClick={handleDismiss}>
          CANCEL
        </Button>
        <Button
          variant="primary"
          isLoading={isLoading || transferLoading}
          disabled={!amount || !isValid || isInsufficient}
          onClick={handleSubmit}>
          SUBMIT
        </Button>
      </ModalFooter>
    </Modal>
  );
};
