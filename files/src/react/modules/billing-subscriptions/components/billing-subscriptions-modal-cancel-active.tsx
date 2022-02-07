import * as React from 'react';
import * as Yup from 'yup';
import {
  Button,
  DATES,
  DaySelector,
  DropdownSelect,
  DropdownSelectField,
  FieldContainer,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
} from '@setel/portal-ui';
import {
  BillingSubscription,
  CancelMidTermIssuingStatus,
  CancelStatus,
} from '../billing-subscriptions.types';
import {useFormik} from 'formik';
import {
  CancelMidTermIssuingStatusOptions,
  cancelActiveSubscriptionStatusOptions,
  ExistingUnpaidCancellationStatusOptions,
  subscriptionNotifications,
} from '../billing-subscriptions.constants';
import {
  useCancelBillingSubscription,
  useRevertCancelBillingSubscription,
} from '../billing-subscriptions.queries';
import {useMalaysiaTime} from '../billing-subscriptions.helpers';
import {requiredOption, requiredText} from 'src/shared/helpers/input-error-message-helper';
import {useNotification} from 'src/react/hooks/use-notification';

interface IModalCancelActiveSubscriptionProps {
  billingSubscription: BillingSubscription;
  showModal: boolean;
  setShowModal: Function;
}

export const BillingSubscriptionsModalCancelActive = ({
  billingSubscription,
  showModal,
  setShowModal,
}: IModalCancelActiveSubscriptionProps) => {
  const {mutateAsync: cancelSubscription, isLoading: isCancellingSubscription} =
    useCancelBillingSubscription();

  const {mutateAsync: revertCancelSubscription, isLoading: isRevertingCancelSubscription} =
    useRevertCancelBillingSubscription();
  const showMessage = useNotification();

  const billingSubscriptionEditGeneralSchema = Yup.object({
    cancelStatus: Yup.string().required(requiredOption('an option')),
    cancelSpecificDate: Yup.mixed().when('cancelStatus', {
      is: CancelStatus.SPECIFIC_DATE,
      then: Yup.date().required(requiredText('cancel specific date')),
    }),
    cancelMidTermIssuingStatus: Yup.string().required(requiredOption('an option')),
    isIncludeCancellationDate: Yup.mixed().when('cancelStatus', {
      is: !CancelStatus.END_OF_INTERVAL,
      then: Yup.boolean().required(requiredOption('an option')),
    }),
    existingUnpaidCancellationStatus: Yup.string().required(requiredOption('an option')),
  });

  async function submitForm() {
    let cancellationDescription;

    if (isScheduledToCancel) {
      await revertCancelSubscription(billingSubscription.id);
      cancellationDescription = subscriptionNotifications.revertedCancel;
    } else {
      await cancelSubscription(values);

      cancellationDescription = [
        CancelStatus.SPECIFIC_DATE,
        CancelStatus.END_OF_INTERVAL,
        CancelStatus.END_OF_TRIAL,
      ].includes(values.cancelStatus)
        ? subscriptionNotifications.scheduledCancel
        : subscriptionNotifications.cancelled;
    }

    showMessage({
      title: 'Successful!',
      description: cancellationDescription,
    });

    setShowModal(false);
  }

  const {values, errors, touched, setFieldValue, handleSubmit} = useFormik({
    initialValues: {
      ...billingSubscription,
      cancelStatus: billingSubscription.cancelStatus || undefined,
      cancelSpecificDate: billingSubscription.cancelSpecificDate
        ? new Date(useMalaysiaTime(billingSubscription.cancelSpecificDate))
        : undefined,
      cancelMidTermIssuingStatus: billingSubscription.cancelMidTermIssuingStatus || undefined,
      isIncludeCancellationDate: billingSubscription.isIncludeCancellationDate,
      existingUnpaidCancellationStatus:
        billingSubscription.existingUnpaidCancellationStatus || undefined,
    },
    validationSchema: billingSubscriptionEditGeneralSchema,
    onSubmit: submitForm,
  });

  const hasSpecificDay = values.cancelStatus === CancelStatus.SPECIFIC_DATE;
  const isScheduledToCancel = [
    CancelStatus.SPECIFIC_DATE,
    CancelStatus.END_OF_INTERVAL,
    CancelStatus.END_OF_TRIAL,
  ].includes(billingSubscription?.cancelStatus);
  const isEndOfIntervalCancelStatus = values.cancelStatus === CancelStatus.END_OF_INTERVAL;

  checkEndOfIntervalOptions(isEndOfIntervalCancelStatus, values);

  return (
    <Modal aria-label="Cancel Form" isOpen={showModal} onDismiss={() => setShowModal(false)}>
      <ModalHeader>Cancel subscription</ModalHeader>
      <ModalBody className="space-y-10">
        <FieldContainer
          label="1. When a subscription has to be cancelled"
          status={
            (touched.cancelStatus && errors.cancelStatus) ||
            (touched.cancelSpecificDate && errors.cancelSpecificDate)
              ? 'error'
              : undefined
          }
          helpText={
            (touched.cancelStatus && errors.cancelStatus) ||
            (touched.cancelSpecificDate && errors.cancelSpecificDate)
          }>
          <div className="flex space-x-2">
            <DropdownSelect
              name="cancelStatus"
              value={values.cancelStatus}
              onChangeValue={(value) => setFieldValue('cancelStatus', value)}
              options={cancelActiveSubscriptionStatusOptions}
              className="w-1/3"
              placeholder="Please select"
              disabled={isScheduledToCancel}
            />
            <DaySelector
              emptyValue={hasSpecificDay ? undefined : '-'}
              value={values.cancelSpecificDate}
              onChangeValue={(value) => setFieldValue('cancelSpecificDate', value)}
              minDate={DATES.today}
              placeholder="Please select"
              className="w-1/4"
              disabled={!hasSpecificDay || isScheduledToCancel}
            />
          </div>
        </FieldContainer>
        <DropdownSelectField
          label="2. When a subscription is cancelled mid-term, how handle credit for unused period?"
          status={
            touched.cancelMidTermIssuingStatus && errors.cancelMidTermIssuingStatus
              ? 'error'
              : undefined
          }
          helpText={touched.cancelMidTermIssuingStatus && errors.cancelMidTermIssuingStatus}
          value={values.cancelMidTermIssuingStatus}
          options={CancelMidTermIssuingStatusOptions}
          name="cancelMidTermIssuingStatus"
          onChangeValue={(value) => setFieldValue('cancelMidTermIssuingStatus', value)}
          placeholder="Please select"
          className="w-1/3"
          disabled={isScheduledToCancel}
        />
        <FieldContainer
          label="3. When subscription is cancelled, include the cancellation date in the billing period?"
          status={
            touched.isIncludeCancellationDate && errors.isIncludeCancellationDate
              ? 'error'
              : undefined
          }
          helpText={touched.isIncludeCancellationDate && errors.isIncludeCancellationDate}
          labelAlign="start">
          <RadioGroup
            value={values.isIncludeCancellationDate?.toString()}
            onChangeValue={(value) => {
              const convertedBoolean = value === 'false' ? false : true;

              setFieldValue('isIncludeCancellationDate', convertedBoolean);
            }}
            name="isIncludeCancellationDate">
            <Radio value="true" disabled={isScheduledToCancel || isEndOfIntervalCancelStatus}>
              Yes
            </Radio>
            <Radio value="false" disabled={isScheduledToCancel || isEndOfIntervalCancelStatus}>
              No
            </Radio>
          </RadioGroup>
        </FieldContainer>
        <FieldContainer
          label="4. If there are existing unpaid invoices for the cancelled subscription"
          status={
            touched.existingUnpaidCancellationStatus && errors.existingUnpaidCancellationStatus
              ? 'error'
              : undefined
          }
          helpText={
            touched.existingUnpaidCancellationStatus && errors.existingUnpaidCancellationStatus
          }
          labelAlign="start">
          <RadioGroup
            value={values.existingUnpaidCancellationStatus?.toString()}
            onChangeValue={(value) => setFieldValue('existingUnpaidCancellationStatus', value)}
            name="existingUnpaidCancellationStatus">
            {ExistingUnpaidCancellationStatusOptions.map((option, index) => (
              <Radio key={index} value={option.value} disabled={isScheduledToCancel}>
                {option.label}
              </Radio>
            ))}
          </RadioGroup>
        </FieldContainer>
      </ModalBody>
      <ModalFooter className="flex space-x-2 justify-end">
        <Button onClick={() => setShowModal(false)} variant="outline">
          CANCEL
        </Button>
        <Button
          isLoading={isCancellingSubscription || isRevertingCancelSubscription}
          variant="error"
          onClick={() => handleSubmit()}>
          {isScheduledToCancel ? 'REMOVE CHANGES' : 'CONFIRM'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

function checkEndOfIntervalOptions(isEndOfIntervalCancelStatus, values) {
  const cancelEndOfIntervalOption = CancelMidTermIssuingStatusOptions.find(
    (option) => option.value === CancelMidTermIssuingStatus.PRORATED_CREDIT.toString(),
  );
  const isProratedCreditCancelMidTermIssuingStatus =
    values.cancelMidTermIssuingStatus === CancelMidTermIssuingStatus.PRORATED_CREDIT;

  if (isEndOfIntervalCancelStatus && isProratedCreditCancelMidTermIssuingStatus) {
    values.cancelMidTermIssuingStatus = undefined;
  }

  cancelEndOfIntervalOption.disabled = isEndOfIntervalCancelStatus;

  if (isEndOfIntervalCancelStatus) {
    values.isIncludeCancellationDate = undefined;
  }
}
