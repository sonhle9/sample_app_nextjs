import * as React from 'react';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {requiredText} from '../../../../../shared/helpers/input-error-message-helper';
import {SmartpayAccountAddress} from '../../merchants.type';
import {
  useSetSmartpayAccountAddress,
  useDeleteSmartpayAccountAddress,
} from '../../merchants.queries';
import {useRouter} from '../../../../routing/routing.context';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DropdownSelectField,
  FieldContainer,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  TextField,
} from '@setel/portal-ui';
import {QueryErrorAlert} from '../../../../components/query-error-alert';
import {statesOfMalayOptions} from '../../merchant.const';
import {SmartpayAccountTabs} from '../../../../../shared/enums/merchant.enum';

interface ISpaAddressModalProps {
  merchantId?: string;
  appId: string;
  type?: string;
  address?: SmartpayAccountAddress;
  onClose?: (string, err?) => void;
}

export const SmartpayDetailsAddressModal = (props: ISpaAddressModalProps) => {
  const title = !!props.address ? 'Edit details' : 'Create new address';

  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const cancelRef = React.useRef(null);

  const {
    mutate: setAddress,
    error: submitError,
    isLoading: isSubmitting,
  } = useSetSmartpayAccountAddress(props.appId, props.address);
  const {
    mutate: deleteAddress,
    error: deleteError,
    isLoading: isDeleting,
  } = useDeleteSmartpayAccountAddress(props.address);
  const id = props.type === 'merchant' ? props.merchantId : props.appId;
  const router = useRouter();
  const onDeleteAddress = () => {
    deleteAddress(props.address.id, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        props.onClose('delete_success');
        router.navigateByUrl(
          `merchants/types/smartPayAccount/${props.type}/${id}?tab=${SmartpayAccountTabs.ADDRESS_LIST}`,
        );
      },
    });
  };

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
      mainMailingIndicator: props.address?.mainMailingIndicator,
    },
    validationSchema,
    onSubmit: () => {
      setAddress(
        {
          ...values,
          ...(!values.state && {
            state: null,
          }),
          ...(!values.country && {
            country: null,
          }),
        },
        {
          onSuccess: () => {
            props.onClose('success');
          },
        },
      );
    },
  });

  return (
    <>
      <Modal isOpen onDismiss={props.onClose} aria-label={title}>
        <ModalHeader>{title}</ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            {submitError && <QueryErrorAlert className="mb-2" error={submitError as any} />}
            <DropdownSelectField
              label={'Address type'}
              name={'addressType'}
              value={values.addressType}
              onChangeValue={(val) => setFieldValue('addressType', val)}
              options={addressTypeOptions}
              onBlur={handleBlur}
              status={touched.addressType && errors.addressType ? 'error' : undefined}
              helpText={touched.addressType ? errors.addressType : null}
              layout={'horizontal-responsive'}
              placeholder={'Choose address type'}
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
              label={
                <>
                  <span>Main mailing</span>
                  <br />
                  <span>indicator</span>
                </>
              }
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
          </ModalBody>
          <ModalFooter>
            <div className="flex items-center justify-between">
              {props.address && !props.address.mainMailingIndicator ? (
                <span
                  style={{color: 'red', cursor: 'pointer', fontWeight: 700, fontSize: '.75rem'}}
                  onClick={() => setShowDeleteConfirm(true)}>
                  DELETE
                </span>
              ) : (
                <div />
              )}
              <div className="flex items-center">
                <Button variant="outline" onClick={props.onClose}>
                  CANCEL
                </Button>
                <Button className="ml-4" type={'submit'} variant="primary" isLoading={isSubmitting}>
                  {props.address ? 'SAVE CHANGES' : 'SAVE'}
                </Button>
              </div>
            </div>
          </ModalFooter>
        </form>
      </Modal>
      {showDeleteConfirm && (
        <Dialog onDismiss={() => setShowDeleteConfirm(false)} leastDestructiveRef={cancelRef}>
          <DialogContent header="Are you sure to delete address?">
            {deleteError && <QueryErrorAlert className="mb-2" error={deleteError as any} />}
            This action cannot be undone. Once deleted, this address cannot be viewed anymore.
          </DialogContent>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} ref={cancelRef}>
              CANCEL
            </Button>
            <Button variant="error" onClick={onDeleteAddress} isLoading={isDeleting}>
              DELETE
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
};

const validationSchema = Yup.object({
  addressType: Yup.string().required(requiredText('address type')),
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

const addressTypeOptions = [
  {
    label: 'Home address',
    value: 'home_address',
  },
  {
    label: 'Work address',
    value: 'work_address',
  },
  {
    label: 'Office address',
    value: 'office_address',
  },
];
