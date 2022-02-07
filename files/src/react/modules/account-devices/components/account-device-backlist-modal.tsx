import {Button, FieldContainer, Modal, ModalBody, ModalHeader, TextInput} from '@setel/portal-ui';
import {useFormik} from 'formik';
import React, {useState} from 'react';
import * as Yup from 'yup';
import {useAuth} from '../../auth';
import {useUpdateDevice} from '../account-device.query';

interface IAccountDeviceBlacklistModalProps {
  close: () => void;
  deviceId: string;
}
export const accountDeviceBlacklistSchema = Yup.object({
  remark: Yup.string().required('Remark is required'),
});
export const AccountDeviceBlacklistModal = (props: IAccountDeviceBlacklistModalProps) => {
  const [errorMsg, setErrorMsg] = useState('');
  const {session} = useAuth();

  const {mutate: remarkDevice} = useUpdateDevice();

  const submitForm = () => {
    remarkDevice(
      {
        deviceId: props.deviceId,
        deviceRemark: {adminUsername: session?.sub, isBlocked: true, remark: values.remark},
      },
      {
        onSuccess: () => {
          props.close();
        },
        onError: (err: any) => {
          const response = err.response && err.response.data;
          setErrorMsg(response.message);
        },
      },
    );
  };

  const {values, errors, setFieldValue, touched, handleBlur, handleSubmit} = useFormik({
    initialValues: {
      remark: '',
    },
    validationSchema: accountDeviceBlacklistSchema,
    onSubmit: submitForm,
  });

  return (
    <Modal
      isOpen={true}
      initialFocus="dismiss"
      onDismiss={() => props.close()}
      aria-label="Are you sure you want to blacklist this device?"
      size="small">
      <ModalHeader>Are you sure you want to blacklist this device?</ModalHeader>
      <ModalBody>
        <p className="mb-8">{props.deviceId}</p>
        {errorMsg && <span className="text-error-500">{errorMsg}</span>}
        <FieldContainer
          label="Remark"
          status={touched.remark && errors.remark ? 'error' : null}
          helpText={touched.remark && errors.remark}
          layout="horizontal-responsive">
          <TextInput
            name="remark"
            value={values.remark}
            onBlur={handleBlur}
            onChangeValue={(value) => setFieldValue('remark', value)}
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
