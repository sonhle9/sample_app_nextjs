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
import {IServices} from '../contants/outage.contants';
import {useUpdateServices} from '../outage.query';

interface IOutageMaintainServicesModalProps {
  onClose: () => void;
  services: IServices;
}
export const OutageMaintainServicesModal = (props: IOutageMaintainServicesModalProps) => {
  const [accounts, setAccounts] = useState(props.services.accounts);
  const [orders, setOrders] = useState(props.services.orders);
  const [payments, setPayments] = useState(props.services.payments);
  const [loyalty, setLoyalty] = useState(props.services.loyalty);
  const [rewards, setRewards] = useState(props.services.rewards);
  const [stations, setStations] = useState(props.services.stations);
  const [emails, setEmails] = useState(props.services.emails);
  const [storeOrders, setStoreOrders] = useState(props.services.storeOrders);

  const {mutate: updateServices} = useUpdateServices();

  const handleSubmit = () => {
    updateServices(
      {
        accounts,
        orders,
        payments,
        loyalty,
        rewards,
        stations,
        emails,
        storeOrders,
      },
      {
        onSuccess: () => {
          props.onClose();
        },
      },
    );
  };
  return (
    <Modal isOpen={true} onDismiss={props.onClose} aria-label={'Edit details'}>
      <ModalHeader>Edit announcement</ModalHeader>
      <ModalBody className="space-y-4">
        <FieldContainer className="mt-5" label="Accounts" layout="horizontal">
          <Toggle on={accounts} onChangeValue={setAccounts} />
        </FieldContainer>
        <FieldContainer className="mt-5" label="Orders" layout="horizontal">
          <Toggle on={orders} onChangeValue={setOrders} />
        </FieldContainer>
        <FieldContainer className="mt-5" label="Store Orders" layout="horizontal">
          <Toggle on={storeOrders} onChangeValue={setStoreOrders} />
        </FieldContainer>
        <FieldContainer className="mt-5" label="Payments" layout="horizontal">
          <Toggle on={payments} onChangeValue={setPayments} />
        </FieldContainer>
        <FieldContainer className="mt-5" label="Loyalty" layout="horizontal">
          <Toggle on={loyalty} onChangeValue={setLoyalty} />
        </FieldContainer>
        <FieldContainer className="mt-5" label="Rewards" layout="horizontal">
          <Toggle on={rewards} onChangeValue={setRewards} />
        </FieldContainer>
        <FieldContainer className="mt-5" label="Stations" layout="horizontal">
          <Toggle on={stations} onChangeValue={setStations} />
        </FieldContainer>
        <FieldContainer className="mt-5" label="Emails" layout="horizontal">
          <Toggle on={emails} onChangeValue={setEmails} />
        </FieldContainer>
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
