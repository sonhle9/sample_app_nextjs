import {
  Button,
  DateRangeSelector,
  FieldContainer,
  formatDate,
  Modal,
  TextField,
  titleCase,
} from '@setel/portal-ui';
import * as React from 'react';
import {CreditPeriodOverrun} from '../../../merchants.type';
import {useFormik} from 'formik';
import {SPPeriodOverrunSchema} from '../smartpay-validation-schema';
import {useCreateSPCreditPeriodOverrun} from '../../../merchants.queries';
import {QueryErrorAlert} from '../../../../../components/query-error-alert';
import {useAuth} from '../../../../auth';
import {endOfYesterday} from 'date-fns';

export const CreditPeriodOverrunModal = (props: {
  merchantId: string;
  merchantStatus: string;
  details?: CreditPeriodOverrun;
  onDone: (overrunId: string) => void;
  onCancel: () => void;
}) => {
  const {sessionPayload} = useAuth();
  const {
    mutate: createPeriodOverrun,
    error,
    isLoading,
  } = useCreateSPCreditPeriodOverrun(props.merchantId);
  const {setFieldValue, handleSubmit, errors, values, submitCount} = useFormik({
    initialValues: {
      periodStart: undefined,
      periodEnd: undefined,
      remarks: '',
    },
    onSubmit: (values) => {
      createPeriodOverrun(
        {
          startDate: formatDate(values.periodStart, {format: 'yyyy-MM-dd'}),
          endDate: formatDate(values.periodEnd, {format: 'yyyy-MM-dd'}),
          remark: values.remarks,
          createdBy: sessionPayload.email,
        },
        {
          onSuccess: (data) => {
            props.onDone(data.id);
          },
        },
      );
    },
    validationSchema: SPPeriodOverrunSchema,
  });
  const showError = submitCount > 0;
  return (
    <Modal isOpen onDismiss={props.onCancel} aria-label={'create-credit-period-overrun'}>
      <Modal.Header>Create new credit period overrun</Modal.Header>
      <Modal.Body>
        {!isLoading && error && <QueryErrorAlert error={error as any} />}
        <TextField
          layout={'horizontal-responsive'}
          label={'Merchant status'}
          className={'w-48'}
          disabled
          value={titleCase(props.merchantStatus)}
        />
        <FieldContainer
          layout={'horizontal-responsive'}
          label={<LabelWithAsterisk label={'Period'} />}
          status={showError && errors.periodStart ? 'error' : null}
          helpText={showError && errors.periodStart ? errors.periodStart : undefined}>
          <DateRangeSelector
            from={values.periodStart}
            to={values.periodEnd}
            placeholder={'Start date — End date'}
            onChangeValue={(nFrom, nTo) => {
              setFieldValue('periodStart', nFrom);
              setFieldValue('periodEnd', nTo);
            }}
            dayOnly
            minDate={endOfYesterday()}
          />
        </FieldContainer>
        <TextField
          label={<LabelWithAsterisk label={'Remarks'} />}
          layout={'horizontal-responsive'}
          value={values.remarks}
          onChangeValue={(v) => {
            setFieldValue('remarks', v);
          }}
          status={showError && errors.remarks ? 'error' : null}
          helpText={showError && errors.remarks ? errors.remarks : undefined}
          className={'w-72'}
        />
        <span className={'text-mediumgrey text-xs'}>
          <span className={'text-error'}>*</span> Required fields
        </span>
      </Modal.Body>
      <Modal.Footer className={'text-right'}>
        <Button onClick={props.onCancel} variant="outline" className="mr-4">
          CANCEL
        </Button>
        <Button
          isLoading={isLoading}
          variant="primary"
          onClick={() => {
            handleSubmit();
          }}>
          SUBMIT
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const LabelWithAsterisk = (props: {label: string}) => {
  return (
    <span>
      {props.label}
      <span className={'text-error'}> *</span>
    </span>
  );
};
