import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from '@setel/portal-ui';

import * as React from 'react';
import {useFormik} from 'formik';
import {useState} from 'react';

import {CashflowsInputValue} from './common/cashflows-input-value';
import {IAdjustBufferInput, ICashflowsModalProps} from '../shared/cashflows.interface';
import {cashflowsSchema} from '../shared/cashflows.constants';
import {useAdjustBufferAvailable} from '../cashflows.query';

export const CashflowsModalAdjustTrustAccount = (props: ICashflowsModalProps) => {
  const [errorMsg, setErrorMsg] = useState('');
  const {mutate: adjustBufferAvailable} = useAdjustBufferAvailable();

  const [bufferAvailable, setBufferAvailable] = useState<IAdjustBufferInput>({
    amount: 0,
    reason: '',
  });

  const submitForm = () => {
    adjustBufferAvailable(bufferAvailable, {
      onSuccess: () => {
        close();
      },
      onError: (err: any) => {
        const response = err.response && err.response.data;
        setErrorMsg(response.message);
      },
    });
  };

  const {values, errors, setFieldValue, handleSubmit} = useFormik({
    initialValues: {
      inputMoney: '',
    },
    validationSchema: cashflowsSchema,
    onSubmit: submitForm,
  });

  const close = () => {
    props.onClose();
  };

  const onChangeValueMoney = (valueMoney: string) => {
    setFieldValue('inputMoney', valueMoney);
    setErrorMsg('');
    const account = {...bufferAvailable, amount: parseFloat(valueMoney)};
    setBufferAvailable(account);
  };

  const onChangeValueReason = (valueReason: string) => {
    const account = {...bufferAvailable, reason: valueReason};
    setBufferAvailable(account);
  };

  return (
    <Modal isOpen={props.visible} onDismiss={close} aria-label={'Edit details'}>
      <ModalHeader>Edit details</ModalHeader>
      <ModalBody className="space-y-4">
        <CashflowsInputValue
          balanceLabel="Buffer balance adjustment value"
          value={values.inputMoney}
          errorMessage={errors.inputMoney || errorMsg}
          onChangeValueMoney={onChangeValueMoney}
          onChangeValueReason={onChangeValueReason}
        />
      </ModalBody>
      <ModalFooter>
        <div className="flex items-center justify-end">
          <Button variant="outline" onClick={close}>
            CANCEL
          </Button>
          <div style={{width: 12}} />
          <Button
            variant="primary"
            onClick={() => handleSubmit()}
            data-testid="submit-adjust-trust-account">
            SUBMIT
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};
