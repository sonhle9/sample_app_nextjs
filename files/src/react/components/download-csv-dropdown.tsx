import {
  Alert,
  Button,
  DownloadIcon,
  DropdownItem,
  DropdownMenu,
  DropdownMenuItems,
  FieldContainer,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MultiInput,
  MultiInputProps,
} from '@setel/portal-ui';
import * as React from 'react';
import {extractErrorWithConstraints} from 'src/react/lib/utils';
import {string as YupString} from 'yup';

const emailSchema = YupString().email();

export type DownloadCsvEmailModalProps = {
  showDialog: boolean;
  setShowDialog: (showDialog: boolean) => void;
  onSendEmail?: (emails: string[]) => Promise<unknown>;
  simpleErrorMessage?: boolean;
  emailModalTitle?: string;
};

const findCurrentEmail = (): null | string => {
  const val = localStorage.getItem('session');

  try {
    return JSON.parse(val).email;
  } catch {
    return null;
  }
};
const initialEmails = (): string[] => {
  const email = findCurrentEmail();

  return email ? [email] : [];
};

const DownloadCsvEmailModalView = (props: DownloadCsvEmailModalProps) => {
  const [emails, setEmails] = React.useState(initialEmails());
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const invalidEmailValues = emails.filter((email) => !emailSchema.isValidSync(email));

  const duplicateEmailValues = emails.reduce(
    (acc: string[], current, i, arr) =>
      arr.indexOf(current) !== i && acc.indexOf(current) === -1 ? acc.concat(current) : acc,
    [],
  );

  const isConfirmBtnDisabled =
    emails.length === 0 || invalidEmailValues.length > 0 || duplicateEmailValues.length > 0;

  const isInvalidInput =
    isSubmitted && (invalidEmailValues.length > 0 || duplicateEmailValues.length > 0)
      ? true
      : false;

  const sendEmail = () => {
    setIsSubmitted(true);
    setErrors([]);
    setStatus('idle');
    if (emails.length === 0 || invalidEmailValues.length > 0 || duplicateEmailValues.length > 0) {
      return;
    }

    setStatus('loading');
    props
      .onSendEmail?.(emails)
      .then(() => {
        onClose();
        setStatus('idle');
      })
      .catch((err) => {
        setStatus('error');
        let extractedError = extractErrorWithConstraints(err);

        if (!extractedError) return;

        if (Array.isArray(extractedError)) {
          setErrors(extractedError);
        } else setErrors([extractedError]);
      });
  };

  const getInvalidInputMessage = () => {
    if (emails.length === 0) return 'This field is required.';
    let errorMessages = [];
    if (invalidEmailValues.length > 0)
      errorMessages.push(
        props.simpleErrorMessage
          ? 'Email address is invalid'
          : `Invalid emails: ${invalidEmailValues.join(', ')}`,
      );

    if (duplicateEmailValues.length > 0)
      errorMessages.push(
        props.simpleErrorMessage
          ? 'Email addresses are duplicated'
          : `Duplicate emails: ${duplicateEmailValues.join(', ')}`,
      );

    if (errorMessages.length > 0) {
      return errorMessages.map((message, i) => <p key={i}>{message}</p>);
    }
    return null;
  };

  const getSendEmailErrorMessages = () => {
    if (errors.length === 0) return 'Unknown Error Occured';

    return errors.map((error, i) => <p key={i}>{error}</p>);
  };

  const getEmails = () => {
    if (!isInvalidInput) {
      return emails;
    } else {
      let emailsWithErrors: MultiInputProps['values'] = emails.map((email) => {
        if (invalidEmailValues.includes(email) || duplicateEmailValues.includes(email))
          return {
            value: email,
            color: 'error',
          };
        else
          return {
            value: email,
          };
      });

      return emailsWithErrors;
    }
  };

  const onClose = () => {
    setIsSubmitted(false);
    setEmails(initialEmails());
    props.setShowDialog(false);
  };

  return (
    <Modal aria-label="Details for send CSV as email" isOpen={props.showDialog} onDismiss={onClose}>
      <ModalHeader>{props.emailModalTitle || 'Download CSV'}</ModalHeader>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          sendEmail();
        }}>
        {props.showDialog && (
          <>
            <ModalBody>
              <p className="mb-4 text-darkgrey">
                This CSV file will be sent to the email you enter down below. You may enter multiple
                email addresses separated by commas.
              </p>
              {status === 'error' && (
                <Alert variant="error" description={getSendEmailErrorMessages()} />
              )}
              {(isInvalidInput || isConfirmBtnDisabled) && (
                <Alert variant="error" description={getInvalidInputMessage()} />
              )}
              <FieldContainer
                className="mt-5"
                layout="vertical"
                status={isInvalidInput ? 'error' : undefined}>
                <MultiInput
                  values={getEmails()}
                  onChangeValues={(newEmails) => {
                    setEmails(newEmails);
                  }}
                  type="email"
                  includeDraft
                  disabled={status === 'loading'}
                  variant="textarea"
                  badgeColor="grey"
                  data-testid="email-input"
                />
              </FieldContainer>
            </ModalBody>
            <ModalFooter className="text-right rounded-lg">
              <Button onClick={onClose} className="mr-2" variant="outline">
                CANCEL
              </Button>
              <Button
                isLoading={status === 'loading'}
                type="submit"
                variant="primary"
                disabled={isConfirmBtnDisabled}>
                CONFIRM
              </Button>
            </ModalFooter>
          </>
        )}
      </form>
    </Modal>
  );
};

export type DownloadCsvDropdownProps = {
  variant?: 'primary' | 'outline' | 'carbon' | 'error';
  wrapperClasses?: string;
  isDownloading?: boolean;
  leftIcon?: boolean;
  disabled?: boolean;
  onDownload?: () => void;
  onSendEmail?: (emails: string[]) => Promise<unknown>;
  label?: React.ReactNode;
  simpleErrorMessage?: boolean;
  emailModalTitle?: string;
};

export const DownloadCsvDropdown = (props: DownloadCsvDropdownProps) => {
  const [showDialog, setShowDialog] = React.useState(false);

  return (
    <>
      {props.onDownload && props.onSendEmail ? (
        <DropdownMenu
          disabled={props.disabled}
          label={props.label || 'DOWNLOAD CSV'}
          variant={props.variant ? props.variant : 'primary'}
          isLoading={props.isDownloading}
          className={props.wrapperClasses}>
          <DropdownMenuItems className="w-40">
            <DropdownItem onSelect={props.onDownload}>Direct download</DropdownItem>
            <DropdownItem onSelect={() => setShowDialog(true)}>Send email</DropdownItem>
          </DropdownMenuItems>
        </DropdownMenu>
      ) : (
        <Button
          disabled={props.disabled}
          variant={props.variant}
          isLoading={props.isDownloading}
          className="w-48"
          leftIcon={props.leftIcon && <DownloadIcon />}
          onClick={() => (props.onSendEmail ? setShowDialog(true) : props.onDownload?.())}>
          {props.label || 'DOWNLOAD CSV'}
        </Button>
      )}
      <DownloadCsvEmailModal
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        onSendEmail={props.onSendEmail}
        simpleErrorMessage={props.simpleErrorMessage}
        emailModalTitle={props.emailModalTitle}
      />
    </>
  );
};

export const DownloadCsvEmailModal = DownloadCsvEmailModalView;
