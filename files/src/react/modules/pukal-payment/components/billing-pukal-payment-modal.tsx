import {
  Button,
  Modal,
  FieldContainer,
  DropdownSelect,
  TextInput,
  MoneyInput,
  DaySelector,
} from '@setel/portal-ui';
import * as React from 'react';
import {
  GL_SETTLEMENT,
  ISSUING_BANK,
  PUKAL_AG_CODE,
  PUKAL_ST_CODE,
  PUKAL_TYPE,
  TRANSACTION_CODE,
} from '../billing-pukal-payment.constants';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {EMessage} from '../../cards/card-message.-validate';
import moment from 'moment';

interface IillingPukalPaymentProps {
  id: string;
  showEditModal: boolean;
  setShowEditModal: Function;
}

export const BillingPukalPaymentModal = (props: IillingPukalPaymentProps) => {
  const validationSchema = Yup.object({
    pukalType: Yup.string().required(EMessage.REQUIRED_FIELD),
    agCode: Yup.string().when('type', {
      is: (exist) => exist,
      then: Yup.string().required(EMessage.REQUIRED_FIELD),
    }),
    statementDate: Yup.string().required(EMessage.REQUIRED_FIELD),
    transactionDate: Yup.date().required(EMessage.REQUIRED_FIELD),
    glsettlement: Yup.string().required(EMessage.REQUIRED_FIELD),
    transactionCode: Yup.string().required(EMessage.REQUIRED_FIELD),
    slipNumber: Yup.string().required(EMessage.REQUIRED_FIELD),
    issuingBank: Yup.string().required(EMessage.REQUIRED_FIELD),
    chequeAmont: Yup.string().required(EMessage.REQUIRED_FIELD),
    chequeNumber: Yup.string().required(EMessage.REQUIRED_FIELD),
  });
  const {values, errors, touched, setFieldValue, handleSubmit} = useFormik({
    initialValues: {
      pukalType: undefined,
      agCode: undefined,
      statementDate: '',
      transactionDate: undefined,
      glsettlement: '',
      transactionCode: '',
      slipNumber: '',
      issuingBank: '',
      chequeAmont: '',
      chequeNumber: undefined,
    },
    validationSchema,
    onSubmit: (value) => {
      console.log(value);
    },
  });

  const statementDateListing = (num) => {
    let result = [];
    const current = moment();
    if (current.diff(moment().endOf('month'), 'days') >= 0) {
      result.push(moment().endOf('month').format('DD/MM/yyyy'));
    }

    for (let i = 0; i < num; i++) {
      result.push(current.subtract(1, 'month').endOf('month').format('DD/MM/yyyy'));
    }
    return result;
  };

  return (
    <>
      <Modal
        isOpen={props.showEditModal}
        onDismiss={() => props.setShowEditModal(false)}
        header="Edit details">
        <Modal.Body>
          <FieldContainer
            status={errors.pukalType && touched.pukalType ? 'error' : undefined}
            helpText={errors.pukalType && touched.pukalType ? errors.pukalType : undefined}
            label="Pukal type"
            layout="horizontal-responsive">
            <DropdownSelect
              value={values.pukalType}
              options={Object.values(PUKAL_TYPE)}
              placeholder="Please select"
              className={'w-60'}
              onChangeValue={(value) => {
                setFieldValue('pukalType', value);
              }}
            />
          </FieldContainer>
          <FieldContainer
            status={errors.agCode && touched.agCode ? 'error' : undefined}
            helpText={errors.agCode && touched.agCode ? errors.agCode : undefined}
            label="Pukal code"
            layout="horizontal-responsive">
            <DropdownSelect
              value={values.agCode}
              options={
                Object.keys(PUKAL_TYPE).find((key) => PUKAL_TYPE[key] === values?.pukalType) == 'AG'
                  ? PUKAL_AG_CODE
                  : PUKAL_ST_CODE
              }
              placeholder="Please select"
              className={'w-60'}
              disabled={values.pukalType === undefined}
              onChangeValue={(value) => {
                setFieldValue('agCode', value);
              }}
            />
          </FieldContainer>
          <FieldContainer
            status={errors.statementDate && touched.statementDate ? 'error' : undefined}
            helpText={
              errors.statementDate && touched.statementDate ? errors.statementDate : undefined
            }
            label="Statement date"
            layout="horizontal-responsive">
            <DropdownSelect
              value={values.statementDate}
              options={statementDateListing(60)}
              placeholder="Please select"
              className={'w-60'}
              onChangeValue={(value) => {
                setFieldValue('statementDate', value);
              }}
            />
          </FieldContainer>
          <FieldContainer
            status={errors.transactionDate && touched.transactionDate ? 'error' : undefined}
            helpText={
              errors.transactionDate && touched.transactionDate ? errors.transactionDate : undefined
            }
            label="Transaction date"
            layout="horizontal-responsive">
            <DaySelector
              className="w-48"
              placeholder="Select date"
              value={values.transactionDate}
              onChangeValue={(value) => {
                setFieldValue('transactionDate', value);
              }}
            />
          </FieldContainer>
          <FieldContainer
            status={errors.glsettlement && touched.glsettlement ? 'error' : undefined}
            helpText={errors.glsettlement && touched.glsettlement ? errors.glsettlement : undefined}
            label="GL settlement"
            layout="horizontal-responsive">
            <DropdownSelect
              value={values.glsettlement}
              options={GL_SETTLEMENT}
              placeholder="Please select"
              className={'w-60'}
              onChangeValue={(value) => {
                setFieldValue('glsettlement', value);
              }}
            />
          </FieldContainer>
          <FieldContainer
            status={errors.transactionCode && touched.transactionCode ? 'error' : undefined}
            helpText={
              errors.transactionCode && touched.transactionCode ? errors.transactionCode : undefined
            }
            label="Transaction code"
            layout="horizontal-responsive">
            <DropdownSelect
              value={values.transactionCode}
              options={TRANSACTION_CODE}
              placeholder="Please select"
              className={'w-96'}
              onChangeValue={(value) => {
                setFieldValue('transactionCode', value);
              }}
            />
          </FieldContainer>
          <FieldContainer
            status={errors.slipNumber && touched.slipNumber ? 'error' : undefined}
            helpText={errors.slipNumber && touched.slipNumber ? errors.slipNumber : undefined}
            label="Slip number"
            layout="horizontal-responsive">
            <TextInput
              value={values.slipNumber}
              className={'w-60'}
              placeholder="Enter slip number"
              onChangeValue={(value) => {
                setFieldValue('slipNumber', value);
              }}
              maxLength={40}
            />
          </FieldContainer>
          <FieldContainer
            status={errors.issuingBank && touched.issuingBank ? 'error' : undefined}
            helpText={errors.issuingBank && touched.issuingBank ? errors.issuingBank : undefined}
            label="Issuing bank"
            layout="horizontal-responsive">
            <DropdownSelect
              value={values.issuingBank}
              options={ISSUING_BANK}
              placeholder="Please select"
              className={'w-60'}
              onChangeValue={(value) => {
                setFieldValue('issuingBank', value);
              }}
            />
          </FieldContainer>
          <FieldContainer
            status={errors.chequeAmont && touched.chequeAmont ? 'error' : undefined}
            helpText={errors.chequeAmont && touched.chequeAmont ? errors.chequeAmont : undefined}
            label="Cheque amount "
            layout="horizontal-responsive">
            <MoneyInput
              decimalPlaces={2}
              value={values.chequeAmont}
              className={'w-32'}
              onChangeValue={(value) => {
                setFieldValue('chequeAmont', value);
              }}
              onBlur={() => {}}
            />
          </FieldContainer>
          <FieldContainer
            status={errors.chequeNumber && touched.chequeNumber ? 'error' : undefined}
            helpText={errors.chequeNumber && touched.chequeNumber ? errors.chequeNumber : undefined}
            label="Cheque number"
            layout="horizontal-responsive">
            <TextInput
              placeholder="Enter cheque number"
              value={values.chequeNumber}
              className={'w-60'}
              onChangeValue={(value) => {
                setFieldValue('chequeNumber', value);
              }}
              maxLength={40}
            />
          </FieldContainer>
        </Modal.Body>
        <Modal.Footer className="text-right space-x-3">
          <Button onClick={() => props.setShowEditModal(false)} variant="outline">
            CANCEL
          </Button>
          <Button onClick={() => handleSubmit()} variant="primary">
            SAVE CHANGES
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
