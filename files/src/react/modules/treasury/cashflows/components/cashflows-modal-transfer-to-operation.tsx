import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from '@setel/portal-ui';

import React, {useState} from 'react';
import {useFormik} from 'formik';

import {CashflowsInputValue} from './common/cashflows-input-value';
import {ICashflowsModalProps, ITransferAccountInput} from '../shared/cashflows.interface';
import {cashflowsSchema} from '../shared/cashflows.constants';
import {useTransferToOperatingAccount} from '../cashflows.query';
import {AccountsGroup, PlatformAccounts} from '../shared/cashflows.enum';

export const CashflowsModalTransferToOperation = (props: ICashflowsModalProps) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [transferAccount, setTransferAccount] = useState<ITransferAccountInput>({
    from: {
      accountGroup: AccountsGroup.PLATFORM,
      userId: PlatformAccounts.trust,
    },
    to: {
      accountGroup: AccountsGroup.PLATFORM,
      userId: PlatformAccounts.operating,
    },
    amount: 0,
    reason: '',
  });
  const {mutate: transferToOperatingAccount} = useTransferToOperatingAccount();

  const close = () => {
    props.onClose();
  };

  const submitForm = () => {
    transferToOperatingAccount(transferAccount, {
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

  const onChangeValueMoney = (valueMoney: string) => {
    setFieldValue('inputMoney', valueMoney);
    setErrorMsg('');
    const account = {...transferAccount, amount: parseFloat(valueMoney)};
    setTransferAccount(account);
  };

  const onChangeValueReason = (valueReason: string) => {
    const account = {...transferAccount, reason: valueReason};
    setTransferAccount(account);
  };

  return (
    <Modal isOpen={props.visible} onDismiss={close} aria-label={'Edit details'}>
      <ModalHeader>Transfer to operating account</ModalHeader>
      <ModalBody className="space-y-4">
        <CashflowsInputValue
          balanceLabel="Transfer amount"
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
            data-testid="submit-transfer-to-operating-account">
            SUBMIT
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};
