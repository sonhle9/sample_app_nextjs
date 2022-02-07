import {Button, Checkbox, FieldContainer, Modal, TextField} from '@setel/portal-ui';
import {useFormik} from 'formik';
import * as React from 'react';
import * as Yup from 'yup';
import {useRouter} from '../../../../react/routing/routing.context';
import {QueryErrorAlert} from '../../../components/query-error-alert';
import {useNotification} from '../../../hooks/use-notification';
import {noPlusPhoneRegex} from '../../merchants/components/smartpay-account/smartpay-validation-schema';
import {emailRegex} from '../../merchants/merchant.const';
import {
  useCreateSmartpayCompanyContact,
  useDeleteSmartpayCompanyContact,
  useUpdateSmartpayCompanyContact,
} from '../companies.queries';
import {SmartpayCompanyContact} from '../companies.type';

type SmartpayCompanyContactModalProps = {
  onClose: () => void;
  onDone: () => void;
  contact?: SmartpayCompanyContact;
  companyId: string;
  contactId?: string;
};

export const SmartpayCompanyContactModal = (props: SmartpayCompanyContactModalProps) => {
  const {
    mutate: createContact,
    error: createError,
    isLoading: isCreateLoading,
  } = useCreateSmartpayCompanyContact(props.companyId);
  const {
    mutate: updateContact,
    error: updateError,
    isLoading: isUpdateLoading,
  } = useUpdateSmartpayCompanyContact(props.contactId || '');

  const error = createError || updateError;
  const isLoading = isCreateLoading || isUpdateLoading;

  const {values, touched, errors, handleSubmit, setFieldValue, handleBlur} = useFormik({
    initialValues: {
      contactPerson: props.contact?.contactPerson || '',
      isDefaultContact: props.contact?.isDefaultContact,
      email: props.contact?.email || '',
      mobilePhone: props.contact?.mobilePhone || '',
      homePhone: props.contact?.homePhone || '',
      workPhone: props.contact?.workPhone || '',
      faxNumber: props.contact?.faxNumber || '',
    },
    validationSchema: smartpayCompanyContactSchema,
    onSubmit: () => {
      if (props.contact) {
        updateContact(
          {
            contact: {
              ...(values as any),
              contactPerson: values.contactPerson || null,
              isDefaultContact: values.isDefaultContact || false,
              email: values.email || null,
              mobilePhone: values.mobilePhone || null,
              homePhone: values.homePhone || null,
              workPhone: values.workPhone || null,
              faxNumber: values.faxNumber || null,
            },
          },
          {
            onSuccess: props.onDone,
          },
        );
      } else {
        createContact(
          {
            contact: {
              ...(values as any),
              contactPerson: values.contactPerson || null,
              isDefaultContact: values.isDefaultContact || false,
              email: values.email || null,
              mobilePhone: values.mobilePhone || null,
              homePhone: values.homePhone || null,
              workPhone: values.workPhone || null,
              faxNumber: values.faxNumber || null,
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
    <Modal isOpen onDismiss={props.onClose} aria-label={'create-smartpay-company-contact-modal'}>
      <form onSubmit={handleSubmit}>
        <Modal.Header>{props.contact ? 'Edit contact' : 'Create new contact'}</Modal.Header>
        <Modal.Body>
          {!isLoading && error && (
            <div className={'mb-5'}>
              <QueryErrorAlert error={error as any} />
            </div>
          )}
          <TextField
            label={'Contact person'}
            name={'contactPerson'}
            value={values.contactPerson}
            onBlur={handleBlur}
            onChangeValue={(val) => setFieldValue('contactPerson', val)}
            status={touched.contactPerson && errors.contactPerson ? 'error' : undefined}
            helpText={touched.contactPerson ? errors.contactPerson : null}
            layout={'horizontal-responsive'}
            className={'w-72'}
            placeholder={`E.g. Muhammad Nizam`}
          />

          <FieldContainer layout={'horizontal-responsive'}>
            <Checkbox
              checked={values.isDefaultContact}
              onChangeValue={(val) => setFieldValue('isDefaultContact', val)}
              label={'Set as default contact'}
            />
          </FieldContainer>

          <TextField
            label={'Email address'}
            name={'email'}
            value={values.email}
            onBlur={handleBlur}
            onChangeValue={(val) => setFieldValue('email', val)}
            status={touched.email && errors.email ? 'error' : undefined}
            helpText={touched.email ? errors.email : null}
            layout={'horizontal-responsive'}
            placeholder={values.isDefaultContact ? 'E.g. name@email.com' : 'Optional'}
            className={'w-72'}
          />

          <TextField
            label={'Mobile number'}
            name={'mobilePhone'}
            value={values.mobilePhone}
            onBlur={handleBlur}
            onChangeValue={(val) => setFieldValue('mobilePhone', val)}
            status={touched.mobilePhone && errors.mobilePhone ? 'error' : undefined}
            helpText={touched.mobilePhone ? errors.mobilePhone : null}
            layout={'horizontal-responsive'}
            placeholder={values.isDefaultContact ? 'E.g. 60xxxxxxxxxxx' : 'Optional'}
            className={'w-72'}
          />

          <TextField
            label={'Home phone number'}
            name={'homePhone'}
            value={values.homePhone}
            onBlur={handleBlur}
            onChangeValue={(val) => setFieldValue('homePhone', val)}
            status={touched.homePhone && errors.homePhone ? 'error' : undefined}
            helpText={touched.homePhone ? errors.homePhone : null}
            layout={'horizontal-responsive'}
            placeholder={`Optional`}
            className={'w-72'}
          />

          <TextField
            label={'Work phone number'}
            name={'workPhone'}
            value={values.workPhone}
            onBlur={handleBlur}
            onChangeValue={(val) => setFieldValue('workPhone', val)}
            status={touched.workPhone && errors.workPhone ? 'error' : undefined}
            helpText={touched.workPhone ? errors.workPhone : null}
            layout={'horizontal-responsive'}
            placeholder={`Optional`}
            className={'w-72'}
          />

          <TextField
            label={'Fax number'}
            name={'faxNumber'}
            value={values.faxNumber}
            onBlur={handleBlur}
            onChangeValue={(val) => setFieldValue('faxNumber', val)}
            status={touched.faxNumber && errors.faxNumber ? 'error' : undefined}
            helpText={touched.faxNumber ? errors.faxNumber : null}
            layout={'horizontal-responsive'}
            placeholder={`Optional`}
            className={'w-72'}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex items-center justify-between">
            {showConfirmDeleteModal && (
              <ConfirmDeleteContactModal
                contact={props.contact}
                onDismiss={() => setShowConfirmDeleteModal(false)}
                onDone={() => {
                  router.navigateByUrl(`companies/${props.companyId}?tab=Contact list`);
                  showMessage({
                    title: 'Successful!',
                    description: 'Contact has been deleted.',
                  });
                }}
              />
            )}
            {props.contact ? (
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
                {props.contact ? 'SAVE CHANGES' : 'SAVE'}
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

const ConfirmDeleteContactModal = (props: {
  onDismiss: () => void;
  onDone: () => void;
  contact: SmartpayCompanyContact;
}) => {
  const {
    mutate: deleteContact,
    error,
    isLoading,
  } = useDeleteSmartpayCompanyContact(props.contact.id);

  const handleDelete = () => {
    deleteContact(null, {
      onSuccess: props.onDone,
    });
  };
  return (
    <Modal
      size={'small'}
      isOpen
      onDismiss={props.onDismiss}
      aria-label={'confirm-delete-file-modal'}>
      <Modal.Header>Are you sure to delete contact?</Modal.Header>
      <Modal.Body>
        {!isLoading && error && (
          <div className={'mb-5'}>
            <QueryErrorAlert error={error as any} />
          </div>
        )}
        This action cannot be undone. Once deleted, this contact cannot be viewed anymore.
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

const smartpayCompanyContactSchema = Yup.object({
  contactPerson: Yup.string().trim().required('This field is required'),
  isDefaultContact: Yup.boolean(),
  email: Yup.string()
    .matches(emailRegex, 'This is an invalid email')
    .when('isDefaultContact', {
      is: true,
      then: Yup.string().required('This field is required'),
    })
    .when('isDefaultContact', {
      is: false,
      then: Yup.string().nullable(),
    }),
  mobilePhone: Yup.string()
    .trim()
    .matches(noPlusPhoneRegex, 'This is an invalid phone number.')
    .when('isDefaultContact', {
      is: true,
      then: Yup.string().required('This field is required'),
    })
    .when('isDefaultContact', {
      is: false,
      then: Yup.string().nullable(),
    }),
  homePhone: Yup.string()
    .nullable()
    .trim()
    .matches(noPlusPhoneRegex, 'This is an invalid phone number.'),
  workPhone: Yup.string()
    .nullable()
    .trim()
    .matches(noPlusPhoneRegex, 'This is an invalid phone number.'),
  faxNumber: Yup.string()
    .nullable()
    .trim()
    .matches(noPlusPhoneRegex, 'This is an invalid phone number.'),
});
