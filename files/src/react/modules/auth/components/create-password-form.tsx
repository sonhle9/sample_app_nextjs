import {Alert} from '@setel/portal-ui';
import * as React from 'react';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {resetPassword, PasswordFormReasonEnum} from '../auth.service';

import {Button, BareButton} from '@setel/portal-ui';
import {PasswordField, PasswordValidation, validatePassword} from './password-field';
import {
  StorageSessionMessages,
  STORAGE_SESSION_MESSAGE_KEY,
} from 'src/shared/enums/session-storage.enum';

type CreatePasswordFormProps = {
  resetToken: string;
  reasonCode: string;
  passwordExpiresIn?: number;
  navigateAfterChangePassword: (path: string[]) => void;
};

export const CreatePasswordForm = (props: CreatePasswordFormProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [passwordRepeat, setPasswordRepeat] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  let formTitle = 'Change password';

  if (props.reasonCode === PasswordFormReasonEnum.SETEL_ADMIN_RESET_PASSWORD) {
    formTitle = 'Set up new password';
  }

  const isValidPassword = validatePassword(password);
  const handleSubmit = () => {
    setSubmitted(true);
    if (isValidPassword && password === passwordRepeat) {
      setIsLoading(true);
      resetPassword(props.resetToken, password, CURRENT_ENTERPRISE.adminNamespace)
        .then(() => {
          window.sessionStorage.setItem(
            STORAGE_SESSION_MESSAGE_KEY,
            StorageSessionMessages.PASSWORD_CHANGED,
          );
          props.navigateAfterChangePassword(['/']);
        })
        .catch((err) => setError(err.response?.data?.message || err.message))
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="px-3 py-12 h-screen overflow-y-auto">
      <div className="bg-white shadow-lg max-w-lg mx-auto pt-8 pb-8 px-6 sm:px-10 rounded-lg">
        <h1 className="font-normal text-darkgrey text-2xl text-center mb-4">{formTitle}</h1>
        {props.reasonCode === PasswordFormReasonEnum.SETEL_ADMIN_RESET_PASSWORD && (
          <h4 className="text-mediumgrey text-sm text-center mb-8">
            For security purpose, you are required to change the default password to a new password.
          </h4>
        )}
        {props.reasonCode === PasswordFormReasonEnum.PASSWORD_ALMOST_EXPIRED && (
          <Alert
            variant="warning"
            description={
              <h3 className="font-normal text-sm leading-5 align-middle text-warning-700">
                For security purpose, you are required to change the default password to a new
                password. Your password will be expired in {props.passwordExpiresIn} days.
              </h3>
            }
          />
        )}
        {props.reasonCode === PasswordFormReasonEnum.PASSWORD_EXPIRED && (
          <Alert
            variant="warning"
            description="For security purpose, you are required to change the default password to a new password. Your password already expired."
          />
        )}
        {props.reasonCode === PasswordFormReasonEnum.POOR_PASSWORD && (
          <Alert
            variant="warning"
            description="For security purpose, you are required to change your current password to a new password. Your password does not meet the new requirements."
          />
        )}

        <div className="my-6">
          <PasswordField
            label="New password"
            value={password}
            onChangeValue={setPassword}
            showPassword={showPassword}
            onToggleShowPassword={() => setShowPassword((o) => !o)}
            status={submitted && (!isValidPassword || error) ? 'error' : undefined}
            errormessage={error || 'New passwords do not match requirements.'}
            autoComplete="new-password"
            name="new-password"
          />
        </div>
        <div className="my-6">
          <PasswordField
            label="Confirm password"
            value={passwordRepeat}
            onChangeValue={setPasswordRepeat}
            showPassword={showPassword}
            onToggleShowPassword={() => setShowPassword((o) => !o)}
            status={submitted && password !== passwordRepeat ? 'error' : undefined}
            errormessage={'Passwords do not match.'}
            autoComplete="new-password"
            name="new-password"
          />
        </div>
        <div className="my-6">
          <PasswordValidation
            title={'PASSWORD MUST CONTAIN'}
            titleClassName={'text-mediumgrey text-xs font-semibold widest'}
            rulesClassName="text-mediumgrey"
            value={password}
          />
        </div>
        <div className="mt-6">
          <Button
            onClick={handleSubmit}
            variant="primary"
            type="submit"
            className="w-full h-12"
            isLoading={isLoading}>
            CREATE PASSWORD
          </Button>
        </div>
        {props.reasonCode === PasswordFormReasonEnum.PASSWORD_ALMOST_EXPIRED && (
          <div className="mt-6 text-xs grid">
            <BareButton
              onClick={() => props.navigateAfterChangePassword(['/'])}
              className="justify-self-center font-medium text-brand-500">
              SKIP
            </BareButton>
          </div>
        )}
      </div>
    </div>
  );
};
