import {Button, Modal, pick} from '@setel/portal-ui';
import {Formik} from 'formik';
import * as React from 'react';
import {
  FormikDateTimeField,
  FormikDropdownField,
  FormikTextField,
} from 'src/react/components/formik';
import {useNotification} from 'src/react/hooks/use-notification';
import {IMobileVersion, IMobileVersionPayload} from 'src/shared/interfaces/version.interface';
import * as Yup from 'yup';
import {platformOptions, statusOptions} from '../app-version.const';
import {useCreateAppVersion, useUpdateAppVersion} from '../app-version.queries';

export interface AppVersionFormProps {
  onDismiss: () => void;
  current?: IMobileVersion;
}

export const AppVersionForm = (props: AppVersionFormProps) => {
  const {mutate: create, isLoading: isCreating} = useCreateAppVersion();
  const {mutate: update, isLoading: isUpdating} = useUpdateAppVersion(
    props.current ? props.current.id : '',
  );

  const showMsg = useNotification();

  const isLoading = isCreating || isUpdating;

  const initialValues = React.useMemo(
    () =>
      props.current
        ? pick(props.current, ['platform', 'releaseDate', 'status', 'version'])
        : defaultValues,
    [props.current],
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        if (props.current) {
          update(values as IMobileVersionPayload, {
            onSuccess: () => {
              props.onDismiss();
              showMsg({
                title: `${values.platform} ${values.version} updated.`,
              });
            },
          });
        } else {
          create(values as IMobileVersionPayload, {
            onSuccess: () => {
              props.onDismiss();
              showMsg({
                title: `${values.platform} ${values.version} created.`,
              });
            },
          });
        }
      }}>
      {(formikBag) => (
        <form onSubmit={formikBag.handleSubmit}>
          <Modal.Body>
            <FormikTextField
              label="Version"
              fieldName="version"
              placeholder="e.g. 1.1.0"
              className="w-40"
            />
            <FormikDateTimeField label="Release date" fieldName="releaseDate" />
            <FormikDropdownField
              label="Platform"
              fieldName="platform"
              options={platformOptions}
              data-testid="platform"
              className="w-40"
            />
            <FormikDropdownField
              label="Status"
              fieldName="status"
              options={statusOptions}
              data-testid="status"
              className="w-40"
            />
          </Modal.Body>
          <Modal.Footer className="text-right space-x-3">
            <Button onClick={props.onDismiss} variant="outline">
              CANCEL
            </Button>
            <Button isLoading={isLoading} variant="primary" type="submit">
              SAVE
            </Button>
          </Modal.Footer>
        </form>
      )}
    </Formik>
  );
};

const defaultValues = {
  releaseDate: '',
  version: '',
  status: '',
  platform: '',
};

const validationSchema = Yup.object({
  releaseDate: Yup.string().required('Required'),
  version: Yup.string()
    .required('Required')
    .matches(/^(\d{1,3}\.){2}(\d{1,3})$/, 'Must be a valid version number, e.g. 1.1.0'),
  status: Yup.string().required('Required'),
  platform: Yup.string().required('Required'),
});
