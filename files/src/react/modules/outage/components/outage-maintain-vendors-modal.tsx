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
import {IVendors} from '../contants/outage.contants';
import {useUpdateVendors} from '../outage.query';

interface IOutageMaintainVendorsModalProps {
  onClose: () => void;
  vendors: IVendors;
}
export const OutageMaintainVendorsModal = (props: IOutageMaintainVendorsModalProps) => {
  const [pos, setPos] = useState(props.vendors?.pos);
  const [posSapura, setPosSapura] = useState(props.vendors?.posSapura);
  const [posSentinel, setPosSentinel] = useState(props.vendors?.posSentinel);
  const [posSetel, setPosSetel] = useState(props.vendors?.posSetel);
  const [cardTrendLms, setCardTrendLms] = useState(props.vendors?.cardtrendLms);
  const [kiplePay, setKiplePay] = useState(props.vendors?.kiple);
  const [silverStreet, setSilverStreet] = useState(props.vendors?.silverstreet);

  const {mutate: updateVendors} = useUpdateVendors();

  const handleSubmit = () => {
    updateVendors(
      {
        pos,
        cardtrendLms: cardTrendLms,
        kiple: kiplePay,
        posSapura,
        posSentinel,
        posSetel,
        silverstreet: silverStreet,
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
        <FieldContainer
          className="mt-5"
          label="Orders Vendor (All Orders Vendors)"
          layout="horizontal">
          <Toggle
            on={pos}
            onChangeValue={(value) => {
              setPos(value);
              if (value) {
                setPosSapura(!value);
                setPosSentinel(!value);
                setPosSetel(!value);
              }
            }}
          />
        </FieldContainer>
        <FieldContainer className="mt-5" label="Orders Vendor (Sapura POS)" layout="horizontal">
          <Toggle
            on={posSapura}
            onChangeValue={(value) => {
              setPosSapura(value);
              if (value) {
                setPos(!value);
              }
            }}
          />
        </FieldContainer>
        <FieldContainer className="mt-5" label="Orders Vendor (Sentinel POS)" layout="horizontal">
          <Toggle
            on={posSentinel}
            onChangeValue={(value) => {
              setPosSentinel(value);
              if (value) {
                setPos(!value);
              }
            }}
          />
        </FieldContainer>
        <FieldContainer className="mt-5" label="Orders Vendor (Setel POS)" layout="horizontal">
          <Toggle
            on={posSetel}
            onChangeValue={(value) => {
              setPosSetel(value);
              if (value) {
                setPos(!value);
              }
            }}
          />
        </FieldContainer>
        <FieldContainer className="mt-5" label="Payments Vendor (kiplePay)" layout="horizontal">
          <Toggle on={cardTrendLms} onChangeValue={setCardTrendLms} />
        </FieldContainer>
        <FieldContainer className="mt-5" label="Loyalty Vendor (Cardtrend LMS)" layout="horizontal">
          <Toggle on={kiplePay} onChangeValue={setKiplePay} />
        </FieldContainer>
        <FieldContainer className="mt-5" label="SMS Vendor (Silverstreet)" layout="horizontal">
          <Toggle on={silverStreet} onChangeValue={setSilverStreet} />
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
