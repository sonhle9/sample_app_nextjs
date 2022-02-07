import {Button, FieldContainer, Modal, ModalBody, ModalHeader, TextInput} from '@setel/portal-ui';
import {useFormik} from 'formik';
import React, {useState} from 'react';
import * as Yup from 'yup';
import {useVoidVoucher} from '../voucher.query';

interface IVoucherBatchVoidModalProps {
  close: () => void;
}
export const voidVoucherSchema = Yup.object({
  code: Yup.string().required('Code is required'),
});
export const VoucherBatchVoidModal = (props: IVoucherBatchVoidModalProps) => {
  const [errorMsg, setErrorMsg] = useState('');
  const {mutate: voidVoucher} = useVoidVoucher();

  const submitForm = () => {
    voidVoucher(values.code, {
      onSuccess: () => {
        props.close();
      },
      onError: (err: any) => {
        const response = err.response && err.response.data;
        setErrorMsg(response.message);
      },
    });
  };

  const {values, errors, setFieldValue, touched, handleBlur, handleSubmit} = useFormik({
    initialValues: {
      code: '',
    },
    validationSchema: voidVoucherSchema,
    onSubmit: submitForm,
  });

  return (
    <Modal
      isOpen={true}
      initialFocus="dismiss"
      onDismiss={() => props.close()}
      aria-label="Void voucher"
      data-testid="void-voucher"
      size="small">
      <ModalHeader>Void Voucher</ModalHeader>
      <ModalBody>
        {errorMsg && <span className="text-error-500">{errorMsg}</span>}
        <FieldContainer
          label="Code"
          status={touched.code && errors.code ? 'error' : null}
          helpText={touched.code && errors.code}
          layout="horizontal-responsive">
          <TextInput
            name="code"
            value={values.code}
            onBlur={handleBlur}
            onChangeValue={(value) => setFieldValue('code', value)}
            className="w-1/2"
            maxLength={40}
          />
        </FieldContainer>
        <Modal.Footer>
          <div className="flex items-center justify-end">
            <Button variant="outline" onClick={props.close}>
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
      </ModalBody>
    </Modal>
  );
};
