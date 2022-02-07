import {Button, Dialog, Modal} from '@setel/portal-ui';
import * as React from 'react';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {IUserProfile} from '../../../../services/api-accounts.service';
import {FormikTextField} from '../../../../components/formik';
import {useUpdatePhoneNumber} from '../../customers.queries';
import {useNotification} from '../../../../hooks/use-notification';
import {getMessageFromApiError} from '../../../../../shared/helpers/errorHandling';

export interface IUpdatePhoneModalProps {
  onDismiss: () => void;
  data: IUserProfile;
  customerId: string;
}

export const UpdatePhoneModal = ({onDismiss, data, customerId}: IUpdatePhoneModalProps) => {
  const [isShowConfirmForm, showConfirmForm] = React.useState(false);
  const [newPhoneNum, setNewPhoneNum] = React.useState('');

  const cancelRef = React.useRef(null);
  const {mutate: updatePhoneNumber, isLoading: isUpdatingPhoneNumber} = useUpdatePhoneNumber();
  const notify = useNotification();

  const closeConfirmForm = () => showConfirmForm(false);

  const handleConfirmChangePhoneNumber = () => {
    updatePhoneNumber(
      {userId: customerId, phone: newPhoneNum},
      {
        onSuccess: () => {
          notify({
            title: 'Successful!',
            variant: 'success',
            description: 'Phone number is successfully updated.',
          });
          onDismiss();
        },
        onError: (error: any) => {
          notify({
            title: 'Error!',
            variant: 'error',
            description: getMessageFromApiError(error),
          });
        },
        onSettled: closeConfirmForm,
      },
    );
  };

  const triggerConfirmForm = (value: any): void => {
    if (!value.newPhoneNum) {
    } else {
      showConfirmForm(true);
      setNewPhoneNum(value.newPhoneNum);
    }
  };

  const validationSchema = Yup.object({
    newPhoneNum: Yup.string()
      .required('This field is required.')
      .matches(/\d+/, 'Should be valid phone number.')
      .matches(/^(60)\d+/, 'Must start with 60.')
      .min(11, 'Must be longer than or equal to 11 characters.')
      .max(12, 'Must be less than or equal to 12 characters.'),
  });

  return (
    <>
      <Formik
        initialValues={{
          currentPhoneNum: data.phone,
          newPhoneNum: undefined,
        }}
        validationSchema={validationSchema}
        onSubmit={triggerConfirmForm}
        validateOnChange={false}
        validateOnMount={false}>
        {(formikProps) => (
          <Modal
            header="Change phone number"
            isOpen
            data-testid="customer-update-phone-modal"
            onDismiss={onDismiss}>
            <form onSubmit={formikProps.handleSubmit}>
              <Modal.Body>
                <FormikTextField
                  fieldName="currentPhoneNum"
                  label="Current phone number"
                  data-testid="customer-current-phone-number"
                  disabled={true}
                />
                <FormikTextField
                  fieldName="newPhoneNum"
                  label="New phone number"
                  placeholder="Enter new phone number"
                  data-testid="customer-new-phone-num-input"
                />
              </Modal.Body>
              <Modal.Footer className="text-right">
                <Button variant="outline" className="mr-2" onClick={onDismiss}>
                  CANCEL
                </Button>
                <Button
                  variant="primary"
                  data-testid="submit-btn"
                  isLoading={isUpdatingPhoneNumber}
                  type="submit">
                  SAVE CHANGES
                </Button>
              </Modal.Footer>
            </form>
          </Modal>
        )}
      </Formik>
      {isShowConfirmForm && (
        <Dialog onDismiss={closeConfirmForm} leastDestructiveRef={cancelRef}>
          <Dialog.Content header="Are you sure want to change this phone number?">
            You are about to change this phone number from <b>{data.phone}</b> to{' '}
            <b>{newPhoneNum}</b>
          </Dialog.Content>
          <Dialog.Footer>
            <Button variant="outline" onClick={closeConfirmForm}>
              CANCEL
            </Button>
            <Button variant="primary" onClick={handleConfirmChangePhoneNumber}>
              CONFIRM
            </Button>
          </Dialog.Footer>
        </Dialog>
      )}
    </>
  );
};
