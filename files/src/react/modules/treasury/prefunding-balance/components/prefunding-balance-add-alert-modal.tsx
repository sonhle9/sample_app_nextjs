import React from 'react';
import {
  Button,
  DecimalInput,
  DropdownSelect,
  FieldContainer,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextareaField,
} from '@setel/portal-ui';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {PrefundingBalanceAlertOptions} from '../shared/prefunding-balance.type';
import {useAddPrefundingBalanceAlert} from '../prefunding-balance.query';

interface IPrefundingBalanceAddAlertModalProps {
  visible: boolean;
  onClose?: () => void;
}

export const prefundingBalanceAlertSchema = Yup.object({
  message: Yup.string().required('This field is required'),
  limit: Yup.number()
    .integer('Must be an integer')
    .required('This field is required')
    .test('Is positive', 'This is field must be more than 0', (value) => value > 0),
});

export const PrefundingBalanceAddAlertModal = (props: IPrefundingBalanceAddAlertModalProps) => {
  const {mutate: addPrefundingBalanceAlert} = useAddPrefundingBalanceAlert();

  const submitForm = () => {
    addPrefundingBalanceAlert(
      {
        type: values.type,
        text: values.message,
        limit: values.limit,
      },
      {
        onSuccess: () => {
          close();
        },
      },
    );
  };

  const options = Object.keys(PrefundingBalanceAlertOptions).map((key: string) => ({
    label: key,
    value: PrefundingBalanceAlertOptions[key],
  }));

  const close = () => {
    props.onClose();
  };

  const {values, errors, touched, handleBlur, handleSubmit, setFieldValue} = useFormik({
    initialValues: {
      type: 'slack',
      message: '',
      limit: '',
    },
    validationSchema: prefundingBalanceAlertSchema,
    onSubmit: submitForm,
  });

  return (
    <Modal isOpen={true} onDismiss={close} aria-label={'Edit details'}>
      <ModalHeader>Add alert</ModalHeader>
      <ModalBody className="space-y-4">
        <FieldContainer className="mt-4" label="Type" layout="horizontal">
          <DropdownSelect
            className="w-72"
            value={values.type}
            onChangeValue={(value) => {
              setFieldValue('type', value);
            }}
            options={options}
          />
        </FieldContainer>
        <TextareaField
          label="Message"
          layout="horizontal"
          className="h-11 mb-0"
          data-testid="message"
          status={touched.message && errors.message ? 'error' : null}
          onBlur={handleBlur}
          name="message"
          helpText={touched.message && errors.message}
          value={values.message}
          onChangeValue={(value) => {
            setFieldValue('message', value);
          }}
        />
        <FieldContainer
          label="Limit"
          layout="horizontal"
          status={touched.limit && errors.limit ? 'error' : null}
          helpText={touched.limit && errors.limit}>
          <DecimalInput
            data-testid="limit"
            onBlur={handleBlur}
            name="limit"
            className="h-11 w-72"
            value={values.limit}
            onChangeValue={(value) => {
              setFieldValue('limit', value);
            }}
          />{' '}
        </FieldContainer>
      </ModalBody>
      <ModalFooter>
        <div className="flex items-center justify-end">
          <Button variant="outline" onClick={close}>
            CANCEL
          </Button>
          <div style={{width: 12}} />
          <Button variant="primary" onClick={() => handleSubmit()}>
            SAVE CHANGES
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};
