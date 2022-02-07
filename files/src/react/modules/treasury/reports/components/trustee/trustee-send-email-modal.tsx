import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  isEmail,
  Alert,
  AlertMessages,
  TextField,
  MultiInput,
  FieldContainer,
  TextareaField,
} from '@setel/portal-ui';
import _ from 'lodash';
import * as React from 'react';
import {useEmailTrusteeReport} from '../../treasury-reports.queries';

interface ITrusteeSendEmailModalProps {
  visible: boolean;
  onClose?: () => void;
  reportDate: string;
  reportId: string;
}

export const TrusteeSendEmailModal: React.VFC<ITrusteeSendEmailModalProps> = (props) => {
  const [fromEmail, setFromEmail] = React.useState('noreply@setel.my');
  const [toEmails, setToEmails] = React.useState<string[]>(['mtb.ct@maybank.com.my']);
  const [emailBody, setEmailBody] = React.useState(
    `Attached herewith Daily Summary Report as at ${props.reportDate}. This is a system-generated email. Do not reply.`,
  );
  const [errorMsg, setErrorMsg] = React.useState([]);
  const {mutate: sendEmail, isLoading} = useEmailTrusteeReport();

  const close = () => {
    setErrorMsg([]);
    props.onClose();
  };

  const onSendMail = () => {
    sendEmail(
      {
        reportId: props.reportId,
        emailBody,
        fromEmail,
        toEmails,
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
      <Modal size="standard" isOpen={props.visible} onDismiss={close} aria-label="Email Report">
        <ModalHeader className="text-sm">Email Report</ModalHeader>
        <ModalBody>
          {errorMsg.length > 0 && (
            <Alert variant="error" description="Something went wrong">
              <AlertMessages messages={errorMsg} />
            </Alert>
          )}
          <TextField
            className="text-sm"
            required
            label="From"
            value={fromEmail}
            onChangeValue={setFromEmail}
            layout="horizontal-responsive"
          />
          <FieldContainer label="To" layout="horizontal-responsive">
            <MultiInput
              className="text-sm"
              badgeColor="grey"
              name="toEmails"
              validateBeforeAdd={isEmail}
              autoComplete="off"
              values={toEmails}
              onChangeValues={(values) => {
                setToEmails(values);
              }}
              placeholder="Enter email address"
            />
          </FieldContainer>
          <TextField
            className="text-sm"
            required
            label="Subject"
            value={`Setel Ventures Sdn Bhd - Daily Summary Report ${props.reportDate}`}
            disabled={true}
            layout="horizontal-responsive"
          />
          <TextareaField
            className="text-sm"
            label="Message"
            required
            name="message"
            value={emailBody}
            onChangeValue={setEmailBody}
            layout="horizontal-responsive"
          />
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-end">
            <div className="flex items-center">
              <Button variant="outline" onClick={close}>
                CANCEL
              </Button>
              <div style={{width: '12px'}} />
              <Button variant="primary" isLoading={isLoading} onClick={onSendMail}>
                SEND
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};
