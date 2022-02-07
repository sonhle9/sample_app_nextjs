import * as React from 'react';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {SmartpayAccountContact} from '../../merchants.type';
import {
  useDeleteSmartpayAccountContact,
  useSetSmartpayAccountContact,
} from '../../merchants.queries';
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  FieldContainer,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextField,
} from '@setel/portal-ui';
import {QueryErrorAlert} from '../../../../components/query-error-alert';
import {useRouter} from '../../../../routing/routing.context';
import {SmartpayAccountTabs} from '../../../../../shared/enums/merchant.enum';
import {emailRegex} from '../../merchant.const';
import {noPlusPhoneRegex} from './smartpay-validation-schema';

interface ISpaContactModalProps {
  merchantId?: string;
  appId: string;
  contact?: SmartpayAccountContact;
  onClose?: (string, err?) => void;
  type?: string;
}

export const SmartpayDetailsContactModal = (props: ISpaContactModalProps) => {
  const title = !!props.contact ? 'Edit details' : 'Create new contact';

  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const cancelRef = React.useRef(null);

  const {
    mutate: setContact,
    error: submitError,
    isLoading: isSubmitting,
  } = useSetSmartpayAccountContact(props.appId, props.contact);
  const {
    mutate: deleteContact,
    error: deleteError,
    isLoading: isDeleting,
  } = useDeleteSmartpayAccountContact(props.contact);

  const id = props.type === 'merchant' ? props.merchantId : props.appId;
  const router = useRouter();
  const onDeleteContact = () => {
    deleteContact(props.contact.id, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        props.onClose('delete_success');
        router.navigateByUrl(
          `merchants/types/smartPayAccount/${props.type}/${id}?tab=${SmartpayAccountTabs.CONTACT_LIST}`,
        );
      },
    });
  };

  const {values, touched, errors, handleSubmit, setFieldValue, handleBlur} = useFormik({
    initialValues: {
      contactPerson: props.contact?.contactPerson || '',
      default: props.contact?.default || false,
      email: props.contact?.email || '',
      mobilePhone: props.contact?.mobilePhone || '',
      homePhone: props.contact?.homePhone || '',
      workPhone: props.contact?.workPhone || '',
      fax: props.contact?.fax || '',
    },
    validationSchema,
    onSubmit: () => {
      Object.keys(values).forEach((key: any) => {
        if (typeof values[key] === 'string' && values[key].length === 0) {
          values[key] = null;
        }
      });
      setContact(values, {
        onSuccess: () => {
          props.onClose('success');
        },
      });
    },
  });

  return (
    <>
      <Modal isOpen onDismiss={props.onClose} aria-label={title}>
        <ModalHeader>{title}</ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            {submitError && <QueryErrorAlert className="mb-4" error={submitError as any} />}

            <TextField
              label={'Contact person'}
              name={'contactPerson'}
              value={values.contactPerson}
              onBlur={handleBlur}
              onChangeValue={(val) => setFieldValue('contactPerson', val)}
              status={touched.contactPerson && errors.contactPerson ? 'error' : undefined}
              helpText={touched.contactPerson ? errors.contactPerson : null}
              layout={'horizontal-responsive'}
              placeholder={'E.g. Muhammad Nizam'}
              wrapperClass={'w-11/12 mb-3'}
              className="w-60"
            />

            <FieldContainer layout="horizontal-responsive" className={'w-11/12'}>
              <Checkbox
                name="default"
                label="Set as default contact"
                checked={values.default}
                onBlur={handleBlur}
                onChangeValue={(val) => {
                  setFieldValue('default', val);
                  if (values.mobilePhone === null) {
                    setFieldValue('mobilePhone', '');
                  }
                }}
                disabled={props.contact?.default}
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
              placeholder={values.default ? 'E.g. name@email.com' : 'Optional'}
              wrapperClass={'w-11/12'}
              className="w-60"
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
              placeholder={values.default ? 'E.g. 01xxxxxxxx' : 'Optional'}
              wrapperClass={'w-11/12'}
              className="w-60"
            />

            <TextField
              label={
                <>
                  <span>Home phone</span>
                  <br />
                  <span>number</span>
                </>
              }
              name={'homePhone'}
              value={values.homePhone}
              onBlur={handleBlur}
              onChangeValue={(val) => setFieldValue('homePhone', val)}
              status={touched.homePhone && errors.homePhone ? 'error' : undefined}
              helpText={touched.homePhone ? errors.homePhone : null}
              layout={'horizontal-responsive'}
              placeholder={'Optional'}
              wrapperClass={'w-11/12'}
              className="w-60"
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
              placeholder={'Optional'}
              wrapperClass={'w-11/12'}
              className="w-60"
            />

            <TextField
              label={'Fax number'}
              name={'fax'}
              value={values.fax}
              onBlur={handleBlur}
              onChangeValue={(val) => setFieldValue('fax', val)}
              status={touched.fax && errors.fax ? 'error' : undefined}
              helpText={touched.fax ? errors.fax : null}
              layout={'horizontal-responsive'}
              placeholder={'Optional'}
              wrapperClass={'w-11/12'}
              className="w-60"
            />
          </ModalBody>
          <ModalFooter>
            <div className="flex items-center justify-between">
              {props.contact ? (
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
                  {props.contact ? 'SAVE CHANGES' : 'SAVE'}
                </Button>
              </div>
            </div>
          </ModalFooter>
        </form>
      </Modal>
      {showDeleteConfirm && (
        <Dialog onDismiss={() => setShowDeleteConfirm(false)} leastDestructiveRef={cancelRef}>
          <DialogContent header="Are you sure to delete contact?">
            {deleteError && <QueryErrorAlert className="mb-2" error={deleteError as any} />}
            This action cannot be undone. Once deleted, this contact cannot be viewed anymore.
          </DialogContent>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} ref={cancelRef}>
              CANCEL
            </Button>
            <Button variant="error" onClick={onDeleteContact} isLoading={isDeleting}>
              DELETE
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  );
};

const validationSchema = Yup.object({
  contactPerson: Yup.string().trim().required('This field is required'),
  default: Yup.boolean(),
  email: Yup.string()
    .matches(emailRegex, 'This is an invalid email')
    .when('default', {
      is: true,
      then: Yup.string().required('This field is required'),
    })
    .when('default', {
      is: false,
      then: Yup.string().nullable(),
    }),
  mobilePhone: Yup.string()
    .trim()
    .matches(noPlusPhoneRegex, 'This is an invalid phone number.')
    .when('default', {
      is: true,
      then: Yup.string().required('This field is required'),
    })
    .when('default', {
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
  fax: Yup.string().nullable().trim().matches(noPlusPhoneRegex, 'This is an invalid phone number.'),
});
