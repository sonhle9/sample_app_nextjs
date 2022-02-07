import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
  isEmail,
  Alert,
  AlertMessages,
  MultiInput,
} from '@setel/portal-ui';
import _ from 'lodash';
import * as React from 'react';
import {useSendEmails} from '../card.queries';
import {Filters} from '../card.type';

interface ICardSendEmailModalProps {
  visible: boolean;
  onClose?: () => void;
  filters: Filters;
}

export const CardSendEmailModal: React.VFC<ICardSendEmailModalProps> = (props) => {
  const session = React.useMemo(() => {
    const sessionRaw: string = localStorage.getItem('session');
    if (sessionRaw) {
      return JSON.parse(sessionRaw);
    }
    return {};
  }, []);
  const initEmails = session?.email ? [session.email] : [];

  const [emails, setEmails] = React.useState<string[]>(initEmails);
  const [errorMsg, setErrorMsg] = React.useState([]);
  const {mutate: sendEmails} = useSendEmails();

  const close = () => {
    setErrorMsg([]);
    props.onClose();
  };

  const onUpdateCompany = () => {
    sendEmails(
      {
        filters: props.filters,
        emails: emails,
        reportName: 'Card listing report',
      },
      {
        onSuccess: () => {
          close();
        },
        onError: (err: any) => {
          const response = err.response && err.response.data;
          if (response && response.statusCode >= 400) {
            if (!Array.isArray(response.message)) {
              setErrorMsg([response.message]);
            } else if (Array.isArray(response.message) && !!response.message.length) {
              const messageErr = [];
              response.message.forEach((mess) => {
                messageErr.push(...Object.values(mess.constraints));
              });
              setErrorMsg(_.uniq(messageErr));
            }
            return;
          }
        },
      },
    );
  };

  return (
    <>
      <Modal isOpen={props.visible} onDismiss={close} aria-label="Send email">
        <ModalHeader>Send email</ModalHeader>
        <ModalBody>
          {errorMsg.length > 0 && (
            <Alert variant="error" description="Something is error">
              <AlertMessages messages={errorMsg} />
            </Alert>
          )}
          <Text className="leading-5 text-mediumgrey mb-1 text-sm pb-5">
            This CSV file will be sent to the email you enter down below. You may enter multiple
            email addresses separated by commas.
          </Text>
          <MultiInput
            badgeColor="grey"
            validateBeforeAdd={isEmail}
            autoComplete="off"
            values={emails}
            onChangeValues={setEmails}
            placeholder="Enter email address"
            variant="textarea"
          />
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-end">
            <div className="flex items-center">
              <Button variant="outline" onClick={close}>
                CANCEL
              </Button>
              <div style={{width: 12}} />
              <Button
                disabled={emails.length ? false : true}
                variant="primary"
                onClick={onUpdateCompany}>
                CONFIRM
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};
