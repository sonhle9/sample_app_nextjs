import {Button, Modal} from '@setel/portal-ui';
import {Formik} from 'formik';
import * as React from 'react';
import {DevicesStatus} from 'src/app/devices/shared/enums';
import {
  FormikDropdownField,
  FormikMerchantMultiSelect,
  FormikTextField,
} from 'src/react/components/formik';
import {useNotification} from 'src/react/hooks/use-notification';
import {MerchantDevice} from 'src/react/services/api-merchants.service';
import * as Yup from 'yup';
import {deviceStatusOptions} from '../device.const';
import {useCreateDeviceMutation, useUpdateDeviceMutation} from '../device.queries';

export interface DeviceFormProps {
  onDismiss: () => void;
  current?: MerchantDevice;
}

export const DeviceForm = (props: DeviceFormProps) => {
  const {mutate: create, isLoading: isCreating} = useCreateDeviceMutation();
  const {mutate: update, isLoading: isUpdating} = useUpdateDeviceMutation(
    (props.current && props.current.id) || '',
  );
  const isLoading = isCreating || isUpdating;

  const showMsg = useNotification();

  return (
    <Formik
      initialValues={props.current || initialValues}
      onSubmit={(values) =>
        props.current
          ? update(values, {
              onSuccess: () => {
                showMsg({title: 'Device updated.'});
                props.onDismiss();
              },
            })
          : create(values, {
              onSuccess: () => {
                showMsg({title: 'Device added.'});
                props.onDismiss();
              },
            })
      }
      validationSchema={validationSchema}>
      {(formikBag) => (
        <form onSubmit={formikBag.handleSubmit}>
          <Modal.Body>
            <FormikTextField
              label="Serial number"
              fieldName="serialNo"
              layout="horizontal-responsive"
            />
            <FormikTextField fieldName="modelDevice" label="Model" layout="horizontal-responsive" />
            {props.current && (
              <FormikDropdownField
                fieldName="status"
                label="Status"
                options={deviceStatusOptions}
                layout="horizontal-responsive"
                data-testid="device-status-select"
              />
            )}
            <FormikMerchantMultiSelect
              fieldName="merchantMerchantIds"
              label="Merchants"
              currentValues={props.current && props.current.merchantMerchantIds}
              layout="horizontal-responsive"
            />
          </Modal.Body>
          <Modal.Footer className="text-right space-x-3">
            <Button onClick={props.onDismiss} variant="outline">
              CANCEL
            </Button>
            <Button type="submit" isLoading={isLoading} variant="primary">
              SAVE
            </Button>
          </Modal.Footer>
        </form>
      )}
    </Formik>
  );
};

interface DeviceFormValues {
  serialNo: string;
  modelDevice: string;
  status: string;
  merchantMerchantIds: Array<string>;
}

const initialValues: DeviceFormValues = {
  serialNo: '',
  modelDevice: '',
  status: DevicesStatus.OFFLINE,
  merchantMerchantIds: [],
};

const validationSchema = Yup.object({
  serialNo: Yup.string().required('Required'),
  modelDevice: Yup.string().required('Required'),
  status: Yup.string().required('Required'),
});
