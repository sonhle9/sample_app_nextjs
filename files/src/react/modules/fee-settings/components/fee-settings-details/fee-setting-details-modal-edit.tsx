import * as React from 'react';
import {
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Modal,
  TextField,
  FieldContainer,
  MoneyInput,
  formatMoney,
  DecimalInput,
} from '@setel/portal-ui';
import {useFormik} from 'formik';
import {FEE_SETTINGS_NOTIFICATION_TEXT, MAX_FEE_AMOUNT} from '../../fee-settings.constant';
import {useEditFeeSetting} from '../../fee-settings.queries';
import {useNotification} from 'src/react/hooks/use-notification';
import {isEmpty} from 'lodash';
import {removeCommasInBigNumber} from 'src/react/modules/fee-plans/fee-plans.helper';

export const FeeSettingDetailModalEdit = ({
  feeSettingId,
  name,
  amount,
  setShowModal,
}: {
  feeSettingId: string;
  name: string;
  amount: string;
  setShowModal: Function;
}) => {
  const showMessage = useNotification();
  const {mutateAsync: editFeeSetting, isLoading} = useEditFeeSetting();
  const onSubmit = async () => {
    if (isEmpty(values.amount)) {
      return;
    }

    await editFeeSetting({
      feeSettingId: feeSettingId,
      body: {
        amount: DecimalInput.getNumberValue(removeCommasInBigNumber(values.amount)),
      },
    });

    showMessage({
      title: FEE_SETTINGS_NOTIFICATION_TEXT.TITLES.SUCCESS,
      description: FEE_SETTINGS_NOTIFICATION_TEXT.MESSAGES.EDIT_SUCCESS,
    });

    setShowModal(false);
  };

  const {values, setFieldValue, handleSubmit} = useFormik({
    initialValues: {
      name: name,
      amount: formatMoney(amount),
    },
    onSubmit,
  });

  return (
    <Modal
      isOpen={true}
      onDismiss={() => setShowModal(false)}
      aria-label="Edit fee setting details"
      data-testid="edit-fee-setting-details"
      initialFocus="content">
      <ModalHeader>Edit details</ModalHeader>
      <ModalBody>
        <TextField
          label="Fee name"
          value={values.name}
          layout="horizontal-responsive"
          disabled={true}
          className="w-2/3"
        />
        <FieldContainer
          label="Fee amount"
          layout="horizontal-responsive"
          status={values.amount === '' ? 'error' : 'success'}
          helpText={values.amount === '' && 'This field is required.'}>
          <MoneyInput
            max={MAX_FEE_AMOUNT}
            allowTrailingZero
            widthClass="w-1/3"
            decimalPlaces={2}
            value={values.amount}
            onChangeValue={(value) => {
              setFieldValue('amount', value);
            }}
          />
        </FieldContainer>
      </ModalBody>
      <ModalFooter className="text-right space-x-2">
        <Button onClick={() => setShowModal(false)} variant="outline">
          CANCEL
        </Button>
        <Button isLoading={isLoading} onClick={() => handleSubmit()} variant="primary">
          SAVE CHANGES
        </Button>
      </ModalFooter>
    </Modal>
  );
};
