import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  isEmail,
  Alert,
  FieldContainer,
  MultiInput,
} from '@setel/portal-ui';
import _ from 'lodash';
import * as React from 'react';
import {useCollectionSendEmails} from '../collections.queries';
import {ITransactionSendEmailModalProps} from '../collections.type';
import {getCurrentEmail} from '../../../lib/utils';

export const CollectionsSendEmailModal: React.VFC<ITransactionSendEmailModalProps> = (props) => {
  const currentEmail = getCurrentEmail();
  const initEmails = currentEmail ? [currentEmail] : [];
  const filter = props.filter;

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
  const {mutateAsync: sendEmails, isLoading} = useCollectionSendEmails();

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
      await sendEmails({emails, filter});
      props.onSuccessSendEmail();
      close();
    } catch (error) {
      const response = error.response && error.response.data;
      setErrorResponse(response);
    }
  };

  return (
    <>
      <Modal
        isOpen={props.visible}
        onDismiss={close}
        aria-label="Download CSV"
        header="Download CSV">
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
