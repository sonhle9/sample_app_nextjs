import {
  Button,
  FieldContainer,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MoneyInput,
  TextareaField,
} from '@setel/portal-ui';
import {useFormik} from 'formik';
import React from 'react';
import * as Yup from 'yup';
import {AuthContext} from 'src/react/modules/auth';
import {useAddFundFromBuffer, useCreateTopUpPrepaid} from '../../prefunding-balance.query';
import {MerchantBalanceType} from '../../shared/prefunding-balance.type';

interface IPrefundingBalanceAdjustModalProps {
  visible: boolean;
  onClose?: () => void;
  adjustType: MerchantBalanceType;
  maxDataBuffer: number;
}

export const PrefundingBalanceAdjustModal = (props: IPrefundingBalanceAdjustModalProps) => {
  const prefundingBalancePrepaidSchema = Yup.object({
    adjustmentValue: Yup.number()
      .required('This field is required')
      .positive('Amount must be a positive number')
      .max(props.maxDataBuffer, `Amount must be less than or equal to ${props.maxDataBuffer}`),
  });

  const {session} = React.useContext(AuthContext);

  const {mutate: addFundFromBuffer} = useAddFundFromBuffer();
  const {mutate: createTopUpPrepaid} = useCreateTopUpPrepaid();

  const submitForm = () => {
    props.adjustType === MerchantBalanceType.AVAILABLE
      ? addFundFromBuffer(
          {
            amount: parseFloat(values.adjustmentValue),
            attributes: {
              comment: values.reason,
            },
            userId: session && session.sub,
          },
          {
            onSuccess: () => {
              close();
            },
          },
        )
      : createTopUpPrepaid(
          {
            amount: parseFloat(values.adjustmentValue),
            currency: 'MYR',
          },
          {
            onSuccess: () => {
              close();
            },
          },
        );
  };

  const {values, errors, touched, handleBlur, handleSubmit, setFieldValue} = useFormik({
    initialValues: {
      adjustmentValue: '',
      reason: '',
    },
    validationSchema: prefundingBalancePrepaidSchema,
    onSubmit: submitForm,
  });

  const close = () => {
    props.onClose();
  };

  return (
    <Modal
      isOpen={props.visible}
      onDismiss={close}
      aria-label={
        props.adjustType === MerchantBalanceType.AVAILABLE
          ? 'Add funds from buffer'
          : 'Transfer available to prepaid'
      }>
      <ModalHeader>
        {props.adjustType === MerchantBalanceType.AVAILABLE
          ? 'Add funds from buffer'
          : 'Transfer available to prepaid'}
      </ModalHeader>
      <ModalBody className="space-y-4">
        <FieldContainer
          helpText={touched.adjustmentValue && errors.adjustmentValue}
          status={touched.adjustmentValue && errors.adjustmentValue ? 'error' : null}
          className="mt-4"
          label="Amount"
          layout="horizontal-responsive">
          <MoneyInput
            className="w-52"
            name="adjustmentValue"
            onBlur={handleBlur}
            value={values.adjustmentValue}
            onChangeValue={(value) => setFieldValue('adjustmentValue', value)}
          />
        </FieldContainer>
        <FieldContainer className="mt-4" label="Reason" layout="horizontal-responsive">
          <TextareaField
            className="h-11"
            value={values.reason}
            onChangeValue={(value) => setFieldValue('reason', value)}
          />
        </FieldContainer>
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
