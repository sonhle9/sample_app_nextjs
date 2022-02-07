import {Button, Modal, Tabs} from '@setel/portal-ui';

import React, {useState} from 'react';
import {useFormik} from 'formik';

import {
  AccountGroupBalanceTypes,
  CollectionAccountsTab,
  PlatformAccounts,
} from '../shared/cashflows.enum';
import {ICashflowsModalProps, IPlatformAdjustInput} from '../shared/cashflows.interface';
import {CashflowsInputValue} from './common/cashflows-input-value';
import {cashflowsSchema} from '../shared/cashflows.constants';
import {useAdjustCollectionAccount} from '../cashflows.query';

export const CashflowsModalAdjustCollection = (props: ICashflowsModalProps) => {
  const [currentTab, setCurrentTab] = useState(CollectionAccountsTab.Pending);
  const [errorMsg, setErrorMsg] = useState('');
  const {mutate: adjustCollectionAccount} = useAdjustCollectionAccount();
  const [collectionAccount, setCollectionAccount] = useState<IPlatformAdjustInput>({
    account: PlatformAccounts.collection,
    balanceType: AccountGroupBalanceTypes.PLATFORM_AVAILABLE,
    amount: 0,
    reason: '',
  });

  const submitForm = () => {
    adjustCollectionAccount(collectionAccount, {
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

  const handleTabsChange = (index) => {
    setErrorMsg('');
    if (index === 0) {
      setCurrentTab(CollectionAccountsTab.Pending);
    } else {
      setCurrentTab(CollectionAccountsTab.Available);
    }
  };

  const onChangeValueMoney = (valueMoney: string) => {
    setFieldValue('inputMoney', valueMoney);
    setErrorMsg('');
    let account;
    if (currentTab === CollectionAccountsTab.Available) {
      account = {
        ...collectionAccount,
        balanceType: AccountGroupBalanceTypes.PLATFORM_AVAILABLE,
        amount: parseFloat(valueMoney),
      };
    }
    if (currentTab === CollectionAccountsTab.Pending) {
      account = {
        ...collectionAccount,
        balanceType: AccountGroupBalanceTypes.PLATFORM_PENDING,
        amount: parseFloat(valueMoney),
      };
    }
    setCollectionAccount(account);
  };

  const onChangeValueReason = (valueReason: string) => {
    let account;
    if (currentTab === CollectionAccountsTab.Available) {
      account = {
        ...collectionAccount,
        balanceType: AccountGroupBalanceTypes.PLATFORM_AVAILABLE,
        reason: valueReason,
      };
    }
    if (currentTab === CollectionAccountsTab.Pending) {
      account = {
        ...collectionAccount,
        balanceType: AccountGroupBalanceTypes.PLATFORM_PENDING,
        reason: valueReason,
      };
    }
    setCollectionAccount(account);
  };

  const tabIndex = currentTab === CollectionAccountsTab.Available ? 1 : 0;

  return (
    <Modal isOpen={props.visible} onDismiss={close} aria-label={'Edit details'}>
      <Modal.Header>Edit details</Modal.Header>
      <Tabs index={tabIndex} onChange={handleTabsChange}>
        <Tabs.TabList>
          <Tabs.Tab label="Pending balance" />
          <Tabs.Tab label="Available balance" />
        </Tabs.TabList>
        <Modal.Body className="space-y-4">
          <Tabs.Panels>
            <Tabs.Panel>
              <CashflowsInputValue
                balanceLabel="Pending balance adjustment value"
                value={values.inputMoney}
                errorMessage={errors.inputMoney || errorMsg}
                onChangeValueMoney={onChangeValueMoney}
                onChangeValueReason={onChangeValueReason}
              />
            </Tabs.Panel>
            <Tabs.Panel>
              <CashflowsInputValue
                balanceLabel="Available balance adjustment value"
                value={values.inputMoney}
                errorMessage={errors.inputMoney || errorMsg}
                onChangeValueMoney={onChangeValueMoney}
                onChangeValueReason={onChangeValueReason}
              />
            </Tabs.Panel>
          </Tabs.Panels>
        </Modal.Body>
      </Tabs>
      <Modal.Footer>
        <div className="flex items-center justify-end">
          <Button variant="outline" onClick={close}>
            CANCEL
          </Button>
          <div style={{width: 12}} />
          <Button
            variant="primary"
            onClick={() => handleSubmit()}
            data-testid="submit-adjust-collection">
            SAVE
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
