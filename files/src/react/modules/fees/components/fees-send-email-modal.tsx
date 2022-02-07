import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  isEmail,
  Alert,
  FieldContainer,
  MultiInput,
} from '@setel/portal-ui';
import * as React from 'react';
import {useNotification} from 'src/react/hooks/use-notification';
import {useFeeSendEmails} from '../fees.queries';
import {IFeesSendEmailModalProps} from '../fees.type';
import {getCurrentEmail} from '../../../lib/utils';

export const FeesSendEmailModal = (props: IFeesSendEmailModalProps) => {
  const currentEmail = getCurrentEmail();
  const initEmails = currentEmail ? [currentEmail] : [];
  const showMessage = useNotification();

  const getColorEmails = (listEmails: string[]) => {
    return listEmails.map((email) => {
      const isValid = isEmail(email);
      return {
        value: email,
        isValid,
        color: isValid ? 'grey' : 'error',
      };
    });
  };

  const [emails, setEmails] = React.useState<string[]>(initEmails);
  const [showError, setShowError] = React.useState<boolean>(false);
  const [options, setOptions] = React.useState<any>(getColorEmails(initEmails));
  const [errorResponse, setErrorResponse] = React.useState<string>('');
  const {mutateAsync: sendEmails, isLoading} = useFeeSendEmails();

  React.useEffect(() => {
    setOptions(getColorEmails(emails));
  }, [emails]);

  React.useEffect(() => {
    setShowError(!options.every((option) => option.isValid));
  }, [options]);

  const close = () => {
    props.onClose();
  };

  const onSendEmail = async () => {
    try {
      await sendEmails({
        emails,
        filter: {
          status: props.filter.status,
          type: props.filter.type,
          filterByTime: 'createdAt',
          timeFrom: props.filter.range[0],
          timeTo: props.filter.range[1],
        },
      });
      showMessage({
        title: 'Success',
        description: 'You have successfully requested for the CSV file to be sent via email.',
      });
      close();
    } catch (error) {
      const response = error.response && error.response.data;
      setErrorResponse(response);
    }
  };

  return (
    <>
      <Modal isOpen={props.visible} onDismiss={close} aria-label="Download CSV">
        <ModalHeader>Download CSV</ModalHeader>
        <ModalBody>
          <p className="mb-4 text-darkgrey">
            This CSV file will be sent to the email you enter down below. You may enter multiple
            email addresses separated by commas.
          </p>

          {showError && (
            <Alert
              className="pb-4 mb-4"
              variant="error"
              description="Email address is invalid."></Alert>
          )}

          {errorResponse && (
            <Alert className="pb-4 mb-4" variant="error" description={errorResponse}></Alert>
          )}

          <FieldContainer status={showError ? 'error' : undefined} layout="vertical">
            <MultiInput
              values={options}
              onChangeValues={setEmails}
              disabled={isLoading}
              variant="textarea"
              autoComplete="email"
              placeholder="Enter an email"
              aria-label="Email Addresses"
              badgeColor="grey"
            />
          </FieldContainer>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-end">
            <div className="flex items-center">
              <Button variant="outline" onClick={close}>
                CANCEL
              </Button>
              <Button
                className="ml-3"
                variant="primary"
                isLoading={isLoading}
                onClick={onSendEmail}
                disabled={showError || options.length === 0}>
                CONFIRM
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};
