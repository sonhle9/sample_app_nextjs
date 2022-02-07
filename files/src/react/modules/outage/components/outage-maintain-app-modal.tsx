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
import {useCompleteMaintenance, useScheduleMaintenance} from '../outage.query';

interface IOutageMaintainAppModalProps {
  onClose: () => void;
  app: {ios: boolean; android: boolean};
}
export const OutageMaintainAppModal = (props: IOutageMaintainAppModalProps) => {
  const [scopeAndroid, setScopeAndroid] = useState(props.app.android);
  const [scopeIOS, setScopeIOS] = useState(props.app.ios);
  const [changeMaintainAndroid, setChangeMaintainAndroid] = useState(false);
  const [changeMaintainIOS, setChangeMaintainIOS] = useState(false);

  const {mutate: completeMaintain} = useCompleteMaintenance();
  const {mutate: scheduleMaintenance} = useScheduleMaintenance();

  const handleSubmit = () => {
    if (changeMaintainAndroid) {
      scopeAndroid
        ? scheduleMaintenance('Android', {
            onSuccess: () => {
              props.onClose();
            },
          })
        : completeMaintain('Android', {
            onSuccess: () => {
              props.onClose();
            },
          });
    }
    if (changeMaintainIOS) {
      scopeIOS
        ? scheduleMaintenance('Ios', {
            onSuccess: () => {
              props.onClose;
            },
          })
        : completeMaintain('Ios', {
            onSuccess: () => {
              props.onClose;
            },
          });
    }
  };
  return (
    <Modal isOpen={true} onDismiss={props.onClose} aria-label={'Edit details'}>
      <ModalHeader>Edit announcement</ModalHeader>
      <ModalBody className="space-y-4">
        <FieldContainer className="mt-5" label="Android" layout="horizontal">
          <Toggle
            on={scopeAndroid}
            onChangeValue={(value) => {
              setScopeAndroid(value);
              setChangeMaintainAndroid(true);
            }}
          />
        </FieldContainer>
        <FieldContainer className="mt-5" label="iOS" layout="horizontal">
          <Toggle
            on={scopeIOS}
            onChangeValue={(value) => {
              setScopeIOS(value);
              setChangeMaintainIOS(true);
            }}
          />
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
