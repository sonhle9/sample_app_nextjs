import {Alert, Button, TextField} from '@setel/portal-ui';
import * as React from 'react';
import {Seo} from 'src/react/components/seo';
import {useMutation} from 'react-query';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {LoginLogo} from '../../../components/login-logo';
import {Link} from '../../../routing/link';
import {useRouter} from 'src/react/routing/routing.context';
import {
  I2FALoginInput,
  I2FALoginResponse,
  ILoginResponse,
} from 'src/shared/interfaces/auth.interface';
import {NavigationExtras} from '@angular/router';
import {PasswordFormReasonEnum} from '../auth.service';
import {validatePassword} from './password-field';
import {StorageSessionMessages} from 'src/shared/enums/session-storage.enum';

interface LoginFormProps {
  login: (data: {email: string; password: string}) => Promise<ILoginResponse | I2FALoginResponse>;
  login2FA: (input: I2FALoginInput) => Promise<ILoginResponse | I2FALoginResponse>;
  isConciergeAdmin: () => boolean;
  returnUrl?: string;
  messageCode?: string;
}

const randomId = Date.now();

export const LoginForm = ({
  login,
  login2FA,
  isConciergeAdmin,
  returnUrl,
  messageCode,
}: LoginFormProps) => {
  const router = useRouter();

  const [step, setStep] = React.useState<'credential' | 'otp'>('credential');
  // navigate to return url
  const navigateToReturnURL = () =>
    router
      .navigateByUrl(isConciergeAdmin() ? '/store-orders/concierge' : returnUrl)
      .then((_) => undefined);

  const navigateByResponse = (res: ILoginResponse | I2FALoginResponse) => {
    if (res?.resetPasswordToken) {
      const path = `/reset-password`;
      let reasonCode = PasswordFormReasonEnum.SETEL_ADMIN_RESET_PASSWORD;
      const passwordExpiresIn = res?.passwordExpiresIn;
      if (passwordExpiresIn <= 0) {
        reasonCode = PasswordFormReasonEnum.PASSWORD_EXPIRED;
      } else if (passwordExpiresIn > 0) {
        reasonCode = PasswordFormReasonEnum.PASSWORD_ALMOST_EXPIRED;
      } else if (!validatePassword(password)) {
        reasonCode = PasswordFormReasonEnum.POOR_PASSWORD;
      }

      const pathExtras: NavigationExtras = {
        queryParams: {
          rc: reasonCode,
          ei: passwordExpiresIn,
          token: res?.resetPasswordToken,
        },
      };
      return router.navigate([path], pathExtras).then((_) => undefined);
    } else {
      navigateToReturnURL();
    }
  };
  // passwordExpiresIn
  const {
    mutate: invokeLogin,
    isLoading,
    error: loginError,
    data: loginResult,
    isError: isLoginError,
  } = useMutation(login, {
    onSuccess: (res) => {
      if (res?.require2Fa) {
        return setStep('otp');
      }
      navigateByResponse(res);
    },
  });

  const {
    mutate: invokeLogin2FA,
    isLoading: isSubmitting2FA,
    error: login2FAError,
    isError: is2FALoginError,
  } = useMutation(login2FA, {
    onSuccess: navigateByResponse,
    onError: () => {
      setOtp('');
      if (otpInputRef.current) {
        otpInputRef.current.focus();
      }
    },
  });

  const isError = is2FALoginError || isLoginError;
  const error = login2FAError || loginError;

  const serverError = error === 'jwt expired' ? 'Incorrect email or password' : error;

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const otpInputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div className="px-3 py-12">
      <Seo title={`${CURRENT_ENTERPRISE.shortName} Admin Portal`} />
      <div className="bg-white shadow-lg max-w-lg mx-auto pt-12 pb-8 px-6 sm:px-10">
        <LoginLogo className="mx-auto" />
        {isError && <Alert variant="error" description={serverError} />}
        {messageCode === StorageSessionMessages.PASSWORD_CHANGED && !isError && (
          <Alert
            variant="success"
            description={
              <span className="font-normal text-sm leading-5 align-middle text-success-700">
                You have successfully reset your password.
                <br />
                Please re-login using your new password.
              </span>
            }></Alert>
        )}
        {step === 'credential' && (
          <>
            <form
              onSubmit={(ev) => {
                ev.preventDefault();
                invokeLogin({email, password});
              }}
              autoComplete="off"
              className="my-4">
              {/* adding a hidden password field make some browsers to disable password autofill */}
              <input type="email" tabIndex={-1} className="sr-only" />
              <input type="password" tabIndex={-1} className="sr-only" />
              <TextField
                label="Email address"
                value={email}
                type="email"
                name={`email-${randomId}`} // many browsers nowadays ignore autoComplete, so we have to use random name to enforce it
                id={`email-${randomId}`} // many browsers nowadays ignore autoComplete, so we have to use random name to enforce it
                onChangeValue={setEmail}
                required
                disabled={isLoading}
                wrapperClass="mb-6"
                autoComplete="off"
              />
              <TextField
                label="Password"
                value={password}
                onChangeValue={setPassword}
                name={`password-${randomId}`} // many browsers nowadays ignore autoComplete, so we have to use random name to enforce it
                id={`password-${randomId}`} // many browsers nowadays ignore autoComplete, so we have to use random name to enforce it
                type="password"
                disabled={isLoading}
                minLength={8}
                wrapperClass="mb-6"
                required
                autoComplete="off"
              />
              <div>
                <Button variant="primary" type="submit" className="w-full" isLoading={isLoading}>
                  LOGIN
                </Button>
              </div>
            </form>
            <div className="text-center my-4">
              <Link to="/forgot-password" className="text-brand-500 text-xs font-semibold">
                FORGOT PASSWORD
              </Link>
            </div>
          </>
        )}
        {step === 'otp' && (
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              invokeLogin2FA({
                authenticityToken: loginResult && loginResult.authenticityToken,
                otp,
                identifier: email,
              });
            }}
            className="my-4">
            <TextField
              label="Verification code"
              value={otp}
              onChangeValue={setOtp}
              autoFocus
              ref={otpInputRef}
            />
            <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting2FA}>
              VERIFY
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
