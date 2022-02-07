import * as React from 'react';
import {Alert, AlertMessages, Button, Text, TextField} from '@setel/portal-ui';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {forgotPassword} from '../auth.service';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {AxiosError} from 'axios';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required('This field is required')
    .email('This field must be a valid email address'),
});

export const ForgotPasswordForm = () => {
  const [isEmailSent, setIsEmailSent] = React.useState(false);
  const [formError, setFormError] = React.useState('');
  const {
    values: forgotPasswordFormValues,
    status,
    handleSubmit,
    handleChange,
    errors: fieldErrors,
    setStatus,
  } = useFormik({
    initialValues: {
      email: '',
    },
    initialStatus: 'idle',
    validationSchema: validationSchema,
    onSubmit: (formValues) => {
      setStatus('loading');
      forgotPassword(
        formValues.email,
        `${document.location.origin}/reset-password`,
        CURRENT_ENTERPRISE.adminNamespace,
      )
        .then(() => {
          setIsEmailSent(true);
          setStatus('idle');
        })
        .catch((err: AxiosError) => {
          const errMsg = err.response && err.response.data && err.response.data.message;
          if (errMsg) {
            setFormError(errMsg);
          }
          setStatus('error');
        });
    },
  });
  const isLoading = status === 'loading';

  if (isEmailSent) {
    return (
      <ForgotPasswordEmailConfirmation
        email={forgotPasswordFormValues.email}
        onResent={() => setIsEmailSent(false)}
      />
    );
  }

  return (
    <div className="px-3 py-12 h-screen overflow-y-auto">
      <div className="bg-white shadow-lg max-w-lg mx-auto pt-12 pb-8 px-6 sm:px-10">
        <h1 className="my-4 text-mediumgrey text-2xl font-bold text-center">Forgot password</h1>
        {formError && (
          <Alert variant="error" description="There was 1 error with your submission.">
            <AlertMessages messages={[formError]} />
          </Alert>
        )}
        <Text color="mediumgrey" className="px-3 my-6 text-sm text-center">
          Please enter your email address and we will send you a link to your email address to reset
          your password.
        </Text>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email address"
            name="email"
            value={forgotPasswordFormValues.email}
            onChange={handleChange}
            status={fieldErrors.email ? 'error' : undefined}
            helpText={fieldErrors.email}
            disabled={isLoading}
          />
          <div>
            <Button variant="primary" type="submit" className="w-full" isLoading={isLoading}>
              SEND EMAIL
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ForgotPasswordEmailConfirmation = (props: {email: string; onResent: () => void}) => {
  return (
    <div className="px-3 py-12" data-testid="forgot-password-confirmation">
      <div className="bg-white shadow-lg max-w-lg mx-auto py-12 px-6 sm:px-10 relative">
        <button
          onClick={() => window.history.back()}
          type="button"
          className="text-brand-500 absolute top-0 left-0 px-4 py-2">
          Back
        </button>
        <img src="/assets/images/email-sent.svg" alt="" className="mx-auto w-16" />
        <h1 className="text-mediumgrey text-2xl font-bold text-center my-2">
          Reset password link sent
        </h1>
        <Text color="mediumgrey" className="px-3 mt-6 mb-10 text-center text-sm">
          We have sent email to <span className="font-bold">{props.email}</span> to reset password.
          After receiving the email, please follow the link provided to reset your password.
        </Text>
        <Text color="mediumgrey" className="px-3 text-center text-sm">
          Didn't receive any email?{' '}
          <button
            type="button"
            onClick={(ev) => {
              ev.preventDefault();
              props.onResent();
            }}
            className="text-brand-500 font-bold">
            Resend link
          </button>
          .
        </Text>
      </div>
    </div>
  );
};
