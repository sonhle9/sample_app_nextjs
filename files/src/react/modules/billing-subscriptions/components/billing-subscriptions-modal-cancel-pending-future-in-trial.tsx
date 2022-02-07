import * as React from 'react';
import * as Yup from 'yup';
import {
  Button,
  DATES,
  DaySelector,
  DropdownSelect,
  FieldContainer,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@setel/portal-ui';
import {
  BillingSubscription,
  CancelStatus,
  SubscriptionStatus,
} from '../billing-subscriptions.types';
import {useFormik} from 'formik';
import {
  cancelInTrialSubscriptionStatusOptions,
  cancelPendingFutureSubscriptionStatusOptions,
  subscriptionNotifications,
} from '../billing-subscriptions.constants';
import {
  useCancelBillingSubscription,
  useRevertCancelBillingSubscription,
} from '../billing-subscriptions.queries';
import {requiredOption} from 'src/shared/helpers/input-error-message-helper';
import {useNotification} from 'src/react/hooks/use-notification';

interface IModalCancelPendingFutureInTrialSubscriptionProps {
  billingSubscription: BillingSubscription;
  showModal: boolean;
  setShowModal: Function;
}

export const BillingSubscriptionsModalCancelPendingFutureInTrial = ({
  billingSubscription,
  showModal,
  setShowModal,
}: IModalCancelPendingFutureInTrialSubscriptionProps) => {
  const {mutateAsync: cancelSubscription, isLoading: isCancellingSubscription} =
    useCancelBillingSubscription();
  const {mutateAsync: revertCancelSubscription, isLoading: isRevertingCancelSubscription} =
    useRevertCancelBillingSubscription();
  const showMessage = useNotification();
  const billingSubscriptionEditGeneralSchema = Yup.object({
    cancelStatus: Yup.string().required(requiredOption('an option')),
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
        ? new Date(billingSubscription.cancelSpecificDate)
        : undefined,
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
  const isInTrialStatus = billingSubscription?.status === SubscriptionStatus.IN_TRIAL;

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
              options={
                isInTrialStatus
                  ? cancelInTrialSubscriptionStatusOptions
                  : cancelPendingFutureSubscriptionStatusOptions
              }
              className="w-1/3"
              placeholder="Please select"
              disabled={isScheduledToCancel}
            />
            <DaySelector
              emptyValue="-"
              value={values.cancelSpecificDate}
              onChangeValue={(value) => setFieldValue('cancelSpecificDate', value)}
              minDate={DATES.today}
              placeholder="Please select"
              className="w-1/4"
              disabled={!hasSpecificDay || isScheduledToCancel}
            />
          </div>
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
