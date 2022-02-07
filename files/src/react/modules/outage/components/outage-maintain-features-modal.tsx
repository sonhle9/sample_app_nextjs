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
import {IFeatures} from '../contants/outage.contants';
import {useUpdateFeatures} from '../outage.query';

interface IOutageMaintainFeaturesModalProps {
  onClose: () => void;
  features: IFeatures;
}
export const OutageMaintainFeaturesModal = (props: IOutageMaintainFeaturesModalProps) => {
  const [redeemLoyaltyPoints, setRedeemLoyaltyPoints] = useState(
    props.features.redeemLoyaltyPoints,
  );
  const [topUpWithBank, setTopUpWithBank] = useState(props.features.topUpWithBank);
  const [topUpWithCard, setTopUpWithCard] = useState(props.features.topUpWithCard);

  const {mutate: updateFeatures} = useUpdateFeatures();

  const handleSubmit = () => {
    updateFeatures(
      {
        redeemLoyaltyPoints,
        topUpWithBank,
        topUpWithCard,
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
        <FieldContainer className="mt-5" label="Top-up with card" layout="horizontal">
          <Toggle on={redeemLoyaltyPoints} onChangeValue={setRedeemLoyaltyPoints} />
        </FieldContainer>
        <FieldContainer className="mt-5" label="Top-up with bank" layout="horizontal">
          <Toggle on={topUpWithBank} onChangeValue={setTopUpWithBank} />
        </FieldContainer>
        <FieldContainer
          className="mt-5"
          label="Redeem Mesra points to Wallet Balance"
          layout="horizontal">
          <Toggle on={topUpWithCard} onChangeValue={setTopUpWithCard} />
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
