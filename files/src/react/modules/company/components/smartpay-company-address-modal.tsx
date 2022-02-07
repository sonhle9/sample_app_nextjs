import {
  Button,
  DropdownSelectField,
  FieldContainer,
  Modal,
  Radio,
  RadioGroup,
  TextField,
} from '@setel/portal-ui';
import {useFormik} from 'formik';
import * as React from 'react';
import * as Yup from 'yup';
import {requiredText} from '../../../../shared/helpers/input-error-message-helper';
import {QueryErrorAlert} from '../../../components/query-error-alert';
import {useNotification} from '../../../hooks/use-notification';
import {useRouter} from '../../../routing/routing.context';
import {statesOfMalayOptions} from '../../merchants/merchant.const';
import {
  useCreateSmartpayCompanyAddress,
  useDeleteSmartpayCompanyAddress,
  useUpdateSmartpayCompanyAddress,
} from '../companies.queries';
import {SmartpayCompanyAddress, smartpayCompanyAddressTypeOptions} from '../companies.type';

type SmartpayCompanyAddressModalProps = {
  onClose: () => void;
  onDone: () => void;
  address?: SmartpayCompanyAddress;
  companyId: string;
  addressId?: string;
};

export const SmartpayCompanyAddressModal = (props: SmartpayCompanyAddressModalProps) => {
  const {
    mutate: createAddress,
    error: createError,
    isLoading: isCreateLoading,
  } = useCreateSmartpayCompanyAddress(props.companyId);
  const {
    mutate: updateAddress,
    error: updateError,
    isLoading: isUpdateLoading,
  } = useUpdateSmartpayCompanyAddress(props.addressId || '');

  const error = createError || updateError;
  const isLoading = isCreateLoading || isUpdateLoading;

  const {values, touched, errors, handleSubmit, setFieldValue, handleBlur} = useFormik({
    initialValues: {
      addressType: props.address?.addressType || '',
      addressLine1: props.address?.addressLine1 || '',
      addressLine2: props.address?.addressLine2 || '',
      addressLine3: props.address?.addressLine3 || '',
      addressLine4: props.address?.addressLine4 || '',
      addressLine5: props.address?.addressLine5 || '',
      city: props.address?.city || '',
      postcode: props.address?.postcode || '',
      state: props.address?.state || '',
      country: props.address?.country || '',
      mainMailingIndicator: props.address?.mainMailingIndicator || false,
    },
    validationSchema: smartpayCompanyAddressSchema,
    onSubmit: () => {
      if (props.address) {
        updateAddress(
          {
            address: {
              ...(values as any),
              postcode: values.postcode || null,
              state: values.state || null,
              country: values.country || null,
            },
          },
          {
            onSuccess: props.onDone,
          },
        );
      } else {
        createAddress(
          {
            address: {
              ...(values as any),
              postcode: values.postcode || null,
              state: values.state || null,
              country: values.country || null,
            },
          },
          {
            onSuccess: props.onDone,
          },
        );
      }
    },
  });

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = React.useState(false);

  const showMessage = useNotification();
  const router = useRouter();

  return (
    <Modal isOpen onDismiss={props.onClose} aria-label={'create-smartpay-company-address-modal'}>
      <form onSubmit={handleSubmit}>
        <Modal.Header>{props.address ? 'Edit address' : 'Create new address'}</Modal.Header>
        <Modal.Body>
          {!isLoading && error && (
            <div className={'mb-5'}>
              <QueryErrorAlert error={error as any} />
            </div>
          )}
          <DropdownSelectField
            label={'Address type'}
            name={'addressType'}
            value={values.addressType}
            onChangeValue={(val) => setFieldValue('addressType', val)}
            options={smartpayCompanyAddressTypeOptions}
            onBlur={handleBlur}
            status={touched.addressType && errors.addressType ? 'error' : undefined}
            helpText={touched.addressType && errors.addressType ? errors.addressType : null}
            layout={'horizontal-responsive'}
            placeholder={'Select address type'}
            wrapperClass={'w-3/5'}
          />
          <TextField
            label={'Address line 1'}
            name={'addressLine1'}
            value={values.addressLine1}
            onBlur={handleBlur}
            onChangeValue={(val) => setFieldValue('addressLine1', val)}
            status={touched.addressLine1 && errors.addressLine1 ? 'error' : undefined}
            helpText={touched.addressLine1 ? errors.addressLine1 : null}
            layout={'horizontal-responsive'}
            placeholder={`Enter address line 1`}
            wrapperClass={'w-3/5'}
          />
          <TextField
            label={'Address line 2'}
            name={'addressLine2'}
            value={values.addressLine2}
            onBlur={handleBlur}
            onChangeValue={(val) => setFieldValue('addressLine2', val)}
            layout={'horizontal-responsive'}
            placeholder={`Enter address line 2`}
            wrapperClass={'w-3/5'}
          />
          <TextField
            label={'Address line 3'}
            name={'addressLine3'}
            value={values.addressLine3}
            onBlur={handleBlur}
            onChangeValue={(val) => setFieldValue('addressLine3', val)}
            layout={'horizontal-responsive'}
            placeholder={`Enter address line 3`}
            wrapperClass={'w-3/5'}
          />
          <TextField
            label={'Address line 4'}
            name={'addressLine4'}
            value={values.addressLine4}
            onBlur={handleBlur}
            onChangeValue={(val) => setFieldValue('addressLine4', val)}
            layout={'horizontal-responsive'}
            placeholder={`Enter address line 4`}
            wrapperClass={'w-3/5'}
          />
          <TextField
            label={'Address line 5'}
            name={'addressLine5'}
            value={values.addressLine5}
            onBlur={handleBlur}
            onChangeValue={(val) => setFieldValue('addressLine5', val)}
            layout={'horizontal-responsive'}
            placeholder={`Enter address line 5`}
            wrapperClass={'w-3/5'}
          />
          <TextField
            label={'City'}
            name={'city'}
            value={values.city}
            onBlur={handleBlur}
            onChangeValue={(val) => setFieldValue('city', val)}
            layout={'horizontal-responsive'}
            placeholder={`Enter city`}
            wrapperClass={'w-3/5'}
          />
          <TextField
            label={'Postcode'}
            name={'postcode'}
            value={values.postcode}
            onBlur={handleBlur}
            onChangeValue={(val) => setFieldValue('postcode', val)}
            layout={'horizontal-responsive'}
            placeholder={`Enter postcode`}
            wrapperClass={'w-3/5'}
          />
          <DropdownSelectField
            label={'State'}
            name={'state'}
            value={values.state}
            options={statesOfMalayOptions}
            onChangeValue={(val) => setFieldValue('state', val)}
            onBlur={handleBlur}
            layout={'horizontal-responsive'}
            placeholder={`Choose state`}
            wrapperClass={'w-3/5'}
          />
          <DropdownSelectField
            label={'Country'}
            name={'country'}
            value={values.country}
            options={[{label: 'Malaysia', value: 'malaysia'}]}
            onChangeValue={(val) => setFieldValue('country', val)}
            onBlur={handleBlur}
            layout={'horizontal-responsive'}
            placeholder={'Choose country'}
            wrapperClass={'w-3/5'}
          />
          <FieldContainer
            label={'Main mailing indicator'}
            layout={'horizontal-responsive'}
            className={'w-3/5'}>
            <RadioGroup
              name={'mainMailingIndicator'}
              value={values.mainMailingIndicator ? 'yes' : 'no'}
              onChangeValue={(val) => {
                if (val === 'yes') {
                  setFieldValue('mainMailingIndicator', true);
                } else {
                  setFieldValue('mainMailingIndicator', false);
                }
              }}>
              <Radio key={'yes'} value={'yes'} checked={values.mainMailingIndicator === true}>
                Yes
              </Radio>
              <Radio key={'no'} value={'no'} checked={values.mainMailingIndicator === false}>
                No
              </Radio>
            </RadioGroup>
          </FieldContainer>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex items-center justify-between">
            {showConfirmDeleteModal && (
              <ConfirmDeleteAddressModal
                address={props.address}
                onDismiss={() => setShowConfirmDeleteModal(false)}
                onDone={() => {
                  router.navigateByUrl(`companies/${props.companyId}?tab=Address list`);
                  showMessage({
                    title: 'Successful!',
                    description: 'Address has been deleted.',
                  });
                }}
              />
            )}
            {props.address && !props.address.mainMailingIndicator ? (
              <span
                style={{color: 'red', cursor: 'pointer', fontWeight: 700, fontSize: '.75rem'}}
                onClick={() => setShowConfirmDeleteModal(true)}>
                DELETE
              </span>
            ) : (
              <div />
            )}
            <div className="flex items-center">
              <Button variant="outline" onClick={props.onClose}>
                CANCEL
              </Button>
              <Button className="ml-3" type={'submit'} variant="primary">
                {props.address ? 'SAVE CHANGES' : 'SAVE'}
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

const ConfirmDeleteAddressModal = (props: {
  onDismiss: () => void;
  onDone: () => void;
  address: SmartpayCompanyAddress;
}) => {
  const {
    mutate: deleteAddress,
    error,
    isLoading,
  } = useDeleteSmartpayCompanyAddress(props.address.id);

  const handleDelete = () => {
    deleteAddress(null, {
      onSuccess: props.onDone,
    });
  };
  return (
    <Modal isOpen onDismiss={props.onDismiss} aria-label={'confirm-delete-file-modal'}>
      <Modal.Header>Are you sure to delete address?</Modal.Header>
      <Modal.Body>
        {!isLoading && error && (
          <div className={'mb-5'}>
            <QueryErrorAlert error={error as any} />
          </div>
        )}
        This action cannot be undone. Once deleted, this address cannot be viewed anymore.
      </Modal.Body>
      <Modal.Footer className={'text-right space-x-3'}>
        <Button variant="outline" onClick={props.onDismiss}>
          CANCEL
        </Button>
        <Button variant="error" onClick={handleDelete} isLoading={isLoading}>
          DELETE
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const smartpayCompanyAddressSchema = Yup.object({
  addressType: Yup.string().required('Please select address type'),
  addressLine1: Yup.string().trim().required(requiredText('address line 1')),
  addressLine2: Yup.string().trim(),
  addressLine3: Yup.string().trim(),
  addressLine4: Yup.string().trim(),
  addressLine5: Yup.string().trim(),
  city: Yup.string().trim(),
  postcode: Yup.string().trim(),
  state: Yup.string().trim(),
  country: Yup.string().trim(),
  mainMailingIndicator: Yup.boolean(),
});
