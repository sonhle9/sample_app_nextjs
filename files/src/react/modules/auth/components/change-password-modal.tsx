import * as React from 'react';

import {FieldContainer, Modal, ModalBody, ModalHeader, ModalFooter, Button} from '@setel/portal-ui';

import {PasswordField, PasswordValidation, validatePassword} from './password-field';
import {useUpdateUserPassword} from './change-password.queries';
import {useNotification} from 'src/react/hooks/use-notification';
import {useAuth} from '..';
import {
  StorageSessionMessages,
  STORAGE_SESSION_MESSAGE_KEY,
} from 'src/shared/enums/session-storage.enum';

interface IChangePasswordModalProps {
  isOpen: boolean;
  dismissModal: (isSuccess?: boolean) => void;
}

export const ChangePasswordModal: React.VFC<IChangePasswordModalProps> = (props) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [oldPassword, setOldPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isSubmitted, setSubmitted] = React.useState(false);
  const showMessage = useNotification();
  const {session} = useAuth();
  const userId = session?.sub;

  const onUpdatePasswordSuccess = () => {
    showMessage({
      title: 'Success!',
      description: 'Update password success',
    });
    props.dismissModal(true);
  };
  const {mutateAsync: putUpdatePassword, error} = useUpdateUserPassword(onUpdatePasswordSuccess);

  const isValidNewPassword = () => {
    return validatePassword(password) && password !== oldPassword;
  };
  const updatePassword = (payload) => {
    setSubmitted(true);
    if (isValidNewPassword() && password === confirmPassword) {
      putUpdatePassword(payload, {
        onSuccess: () => {
          window.sessionStorage.setItem(
            STORAGE_SESSION_MESSAGE_KEY,
            StorageSessionMessages.PASSWORD_CHANGED,
          );
        },
        onError: () => {
          window.sessionStorage.removeItem(STORAGE_SESSION_MESSAGE_KEY);
        },
      });
    }
  };
  const onCancel = () => {
    setSubmitted(false);
    props.dismissModal();
  };
  return (
    <>
      <Modal
        aria-label="Change password Modal"
        data-testid="change-password-modal"
        isOpen={props.isOpen}
        onDismiss={() => onCancel()}>
        <ModalHeader>Change password</ModalHeader>
        <ModalBody className="text-xs">
          <FieldContainer
            labelAlign="start"
            label="Current password"
            layout="horizontal-responsive">
            <PasswordField
              value={oldPassword}
              onChangeValue={setOldPassword}
              showPassword={showPassword}
              onToggleShowPassword={() => setShowPassword((o) => !o)}
              autoComplete="new-password"
              name="new-password"
              status={error ? 'error' : undefined}
              errormessage={error && (error as Error).message}
            />
          </FieldContainer>
          <FieldContainer labelAlign="start" label="New password" layout="horizontal-responsive">
            <PasswordField
              value={password}
              onChangeValue={setPassword}
              showPassword={showPassword}
              onToggleShowPassword={() => setShowPassword((o) => !o)}
              status={isSubmitted && !isValidNewPassword() ? 'error' : undefined}
              errormessage={
                password === oldPassword
                  ? 'New password cannot be the same as your previous password'
                  : 'New passwords do not match requirements.'
              }
              autoComplete="new-password"
              name="new-password"
            />
            <PasswordValidation
              title="Password must contain:"
              titleClassName="text-lightgrey text-xs font-normal widest"
              rulesClassName="text-lightgrey"
              value={password}
            />
          </FieldContainer>
          <FieldContainer
            labelAlign="start"
            label="Confirm new password"
            layout="horizontal-responsive">
            <PasswordField
              value={confirmPassword}
              onChangeValue={setConfirmPassword}
              showPassword={showPassword}
              onToggleShowPassword={() => setShowPassword((o) => !o)}
              status={isSubmitted && confirmPassword !== password ? 'error' : undefined}
              errormessage={'Passwords do not match.'}
              autoComplete="new-password"
              name="new-password"
            />
          </FieldContainer>
        </ModalBody>
        <ModalFooter className="text-right">
          <Button
            data-testid="change-password-modal_cancel-button"
            variant="outline"
            className="space-x-3 mr-2"
            onClick={() => onCancel()}>
            CANCEL
          </Button>
          <Button
            data-testid="change-password-modal_change-password-button"
            variant="primary"
            className="space-x-3"
            onClick={() => {
              updatePassword({userId, oldPassword, newPassword: password});
            }}>
            CHANGE PASSWORD
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
