import {Button, FieldContainer, ModalBody, ModalFooter, MultiInput} from '@setel/portal-ui';
import {useFormik} from 'formik';
import * as React from 'react';
import {array, object, string} from 'yup';
import {useSendReport} from '../on-demand-reports.queries';

const formSchema = object().shape({
  emails: array()
    .min(1, 'Enter at least one email.')
    .of(string().email('Must be valid email address')),
});

export type SendReportModalProps = {
  reportName: string;
  filter: Record<string, any>;
  onSuccess: () => void;
  onDismiss: () => void;
};

export const SendReportForm = (props: SendReportModalProps) => {
  const {mutateAsync: sendReport, isLoading} = useSendReport(props.reportName, {
    onSuccess: props.onSuccess,
  });
  const {handleSubmit, errors, dirty, submitCount, setFieldValue, handleBlur, values} = useFormik({
    initialValues: {
      emails: [] as string[],
    },
    onSubmit: ({emails}) => sendReport({emails, filter: props.filter}),
    validationSchema: formSchema,
  });

  const showError = submitCount > 0 || dirty;

  return (
    <form onSubmit={handleSubmit}>
      <ModalBody>
        <FieldContainer
          status={showError && errors.emails ? 'error' : undefined}
          helpText={
            showError
              ? Array.isArray(errors.emails)
                ? errors.emails[0]
                : errors.emails
              : undefined
          }>
          <MultiInput
            name="emails"
            values={values.emails}
            onChangeValues={(emails) => setFieldValue('emails', emails)}
            onBlur={handleBlur}
            disabled={isLoading}
            includeDraft
            aria-label="Email Addresses"
            badgeColor="grey"
            variant="textarea"
            autoComplete="email"
          />
        </FieldContainer>
      </ModalBody>
      <ModalFooter className="text-right">
        <Button onClick={props.onDismiss} variant="outline" className="mr-2">
          CANCEL
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          CONFIRM
        </Button>
      </ModalFooter>
    </form>
  );
};
