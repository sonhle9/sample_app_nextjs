import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from '@setel/portal-ui';

import React, {useState} from 'react';
import {useFormik} from 'formik';

import {CashflowsInputValue} from './common/cashflows-input-value';
import {ICashflowsModalProps, IPlatformAdjustInput} from '../shared/cashflows.interface';
import {AccountGroupBalanceTypes, PlatformAccounts} from '../shared/cashflows.enum';
import {useAdjustOperatingAccount} from '../cashflows.query';
import {cashflowsSchema} from '../shared/cashflows.constants';

export const CashflowsModalAdjustOperation = (props: ICashflowsModalProps) => {
  const [errorMsg, setErrorMsg] = useState('');
  const {mutate: adjustOperatingAccount} = useAdjustOperatingAccount();

  const [operatingAccount, setOperatingAccount] = useState<IPlatformAdjustInput>({
    account: PlatformAccounts.operating,
    balanceType: AccountGroupBalanceTypes.PLATFORM_AVAILABLE,
    amount: 0,
    reason: '',
  });

  const submitForm = () => {
    adjustOperatingAccount(operatingAccount, {
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
    const account = {...operatingAccount, amount: parseFloat(valueMoney)};
    setOperatingAccount(account);
  };

  const onChangeValueReason = (valueReason: string) => {
    const account = {...operatingAccount, reason: valueReason};
    setOperatingAccount(account);
  };

  return (
    <Modal isOpen={props.visible} onDismiss={close} aria-label={'Edit detail'}>
      <ModalHeader>Edit detail</ModalHeader>
      <ModalBody className="space-y-4">
        <CashflowsInputValue
          balanceLabel="Operating account adjustment value"
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
          <Button variant="primary" onClick={() => handleSubmit()}>
            SAVE
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};
