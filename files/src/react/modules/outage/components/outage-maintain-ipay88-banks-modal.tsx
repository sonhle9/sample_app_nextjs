import {
  Button,
  FieldContainer,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Toggle,
} from '@setel/portal-ui';
import React, {useState} from 'react';
import {IIPay88Bank} from '../contants/outage.contants';
import {useUpdateIPay88Bank} from '../outage.query';

interface IOutageMaintainIPay88BanksModalProps {
  onClose: () => void;
  iPay88Banks: IIPay88Bank[];
}

export const OutageMaintainIPay88BanksModal = (props: IOutageMaintainIPay88BanksModalProps) => {
  const [iPay88Banks, setIPay88Banks] = useState(
    props.iPay88Banks.map((iPay88Bank) => ({...iPay88Bank})),
  );
  const {mutate: updateIPay88Bank} = useUpdateIPay88Bank();

  const onChangeIPay88BankUpdate = (value: boolean, index) => {
    const iPay88BanksChanged = [...iPay88Banks];
    iPay88BanksChanged[index].isMaintenance = value;
    setIPay88Banks(iPay88BanksChanged);
  };

  const handleSubmit = () => {
    const iPay88BankUpdate = iPay88Banks.filter((iPay88Bank) =>
      props.iPay88Banks.find(
        ({isMaintenance, paymentId}) =>
          iPay88Bank.isMaintenance !== isMaintenance && iPay88Bank.paymentId === paymentId,
      ),
    );
    iPay88BankUpdate.map((iPay88Bank) => {
      updateIPay88Bank(iPay88Bank, {
        onSuccess: () => {
          props.onClose();
        },
      });
    });
  };

  return (
    <Modal isOpen={true} onDismiss={props.onClose} aria-label={'Edit details'}>
      <ModalHeader>Edit announcement</ModalHeader>
      <ModalBody className="space-y-4">
        {iPay88Banks.map((iPay88Bank, index) => (
          <FieldContainer className="mt-5" label={iPay88Bank.name} layout="horizontal" key={index}>
            <Toggle
              on={iPay88Bank.isMaintenance}
              onChangeValue={(value) => onChangeIPay88BankUpdate(value, index)}
            />
          </FieldContainer>
        ))}
      </ModalBody>
      <ModalFooter>
        <div className="flex items-center justify-end">
          <Button variant="outline" onClick={props.onClose}>
            CANCEL
          </Button>
          <div style={{width: 12}} />
          <Button
            variant="primary"
            onClick={() => handleSubmit()}
            data-testid="submit-transfer-to-operating-account">
            SUBMIT
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};
