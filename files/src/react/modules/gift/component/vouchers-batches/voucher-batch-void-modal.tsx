import {
  Alert,
  Button,
  FieldContainer,
  Modal,
  ModalBody,
  ModalHeader,
  Textarea,
} from '@setel/portal-ui';
import {useFormik} from 'formik';
import React, {useState} from 'react';
import {UseMutateFunction} from 'react-query';
import * as Yup from 'yup';
import {IVoidVouchers} from '../../shared/gift-voucher.constant';

interface IVoucherBatchVoidModalProps {
  voidVouchers: UseMutateFunction<IVoidVouchers[], unknown, string[], unknown>;
  close: () => void;
}

export const voidVoucherSchema = Yup.object({
  codes: Yup.string().required('Code is required'),
});

export const VoucherBatchVoidModal = (props: IVoucherBatchVoidModalProps) => {
  const [errorMsg, setErrorMsg] = useState('');

  const submitForm = () => {
    const codesArray = values.codes.split(/[\n,]/);
    props.voidVouchers(codesArray, {
      onSuccess: (data) => {
        const voidedCodes = data.filter((code) => code.status === 'Voided');
        if (voidedCodes.length) {
          return props.close();
        }
        throw new Error();
      },
      onError: () => {
        setErrorMsg('Invalid voucher code');
      },
    });
  };

  const {values, handleSubmit, setFieldValue} = useFormik({
    initialValues: {
      codes: '',
    },
    validationSchema: voidVoucherSchema,
    onSubmit: submitForm,
  });

  // const multiInputValues = () => {
  //   return values.codes.map((code) => ({
  //     value: code,
  //   }));
  // };
  return (
    <Modal
      isOpen={true}
      initialFocus="dismiss"
      onDismiss={() => props.close()}
      aria-label="Void voucher"
      data-testid="void-voucher"
      size="standard">
      <ModalHeader>Void Voucher</ModalHeader>
      <ModalBody>
        <FieldContainer
          label="This voucher contains more than 1 voucher. Once voucher is void, it cannot be undone and you will no longer be
          able to recover it.">
          {errorMsg && (
            <Alert
              className="mt-5"
              variant="error"
              description={errorMsg}
              data-testid="invalid-codes"
            />
          )}
          <Textarea
            className="mt-5"
            placeholder="Voucher code"
            onChangeValue={(input) => setFieldValue('codes', input)}
          />
          {/* <MultiInput
            values={multiInputValues()}
            onChangeValues={(codes) => setFieldValue('codes', codes)}
            validateBeforeAdd={(code) => code.length >= 10 && !code.includes(' ')}
            placeholder="Voucher code"
            disabled={status === 'loading'}
            variant="textarea"
            badgeColor="grey"
          /> */}
        </FieldContainer>
      </ModalBody>
      <Modal.Footer>
        <div className="flex items-center justify-end">
          <Button variant="outline" onClick={props.close}>
            CANCEL
          </Button>
          <div style={{width: 12}} />
          <Button
            variant="error"
            onClick={() => handleSubmit()}
            data-testid="submit-adjust-collection">
            VOID
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
