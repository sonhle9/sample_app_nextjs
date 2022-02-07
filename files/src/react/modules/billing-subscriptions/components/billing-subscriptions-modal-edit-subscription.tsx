import * as React from 'react';
import * as Yup from 'yup';
import {
  Button,
  DATES,
  DaySelector,
  DecimalInput,
  DropdownSelect,
  FieldContainer,
  formatMoney,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MoneyInput,
  TextField,
} from '@setel/portal-ui';
import {BillingSubscription, ApplyChangeEditStatus} from '../billing-subscriptions.types';
import {useFormik} from 'formik';
import {
  applyChangeEditStatusOptions,
  subscriptionNotifications,
} from '../billing-subscriptions.constants';
import {
  useEditBillingSubscription,
  useRevertEditBillingSubscription,
} from '../billing-subscriptions.queries';
import {PricingModel} from '../../billing-plans/billing-plan.types';
import {requiredOption, requiredText} from 'src/shared/helpers/input-error-message-helper';
import {useMalaysiaTime} from '../billing-subscriptions.helpers';
import {useNotification} from 'src/react/hooks/use-notification';

interface IModalEditGeneralProps {
  billingSubscription: BillingSubscription;
  showModal: boolean;
  setShowModal: Function;
}

export const BillingSubscriptionsModalEditSubscription = ({
  billingSubscription,
  showModal,
  setShowModal,
}: IModalEditGeneralProps) => {
  const {mutateAsync: editSubscription, isLoading: isUpdatingSubscription} =
    useEditBillingSubscription();
  const {mutateAsync: revertSubscriptionsSubscription, isLoading: isRevertingSubscription} =
    useRevertEditBillingSubscription();
  const showMessage = useNotification();

  const isPerUnitPricingModel = billingSubscription?.pricingModel === PricingModel.PER_UNIT;
  const isMeteredPricingModel = billingSubscription?.pricingModel === PricingModel.METERED;
  const isScheduledToEdit = [
    ApplyChangeEditStatus.ON_NEXT_RENEWAL,
    ApplyChangeEditStatus.ON_SPECIFIC_DATE,
  ].includes(billingSubscription?.applyChangeEditStatus);

  const billingSubscriptionEditGeneralSchema = Yup.object({
    editPrice: Yup.string().required(requiredText('price')),
    editQuantity: Yup.string().when('pricingModel', {
      is: PricingModel.PER_UNIT,
      then: Yup.string()
        .required(requiredText('quantity'))
        .test('editQuantity', 'Quantity must be more than 0', (value) => Number(value) > 0),
    }),
    applyChangeEditStatus: Yup.string().required(requiredOption('an option')),
    applyChangeDate: Yup.mixed().when('applyChangeEditStatus', {
      is: ApplyChangeEditStatus.ON_SPECIFIC_DATE,
      then: Yup.date().required(requiredText('apply changes date')),
    }),
  });

  async function submitForm() {
    let editedDescription;

    if (isScheduledToEdit) {
      await revertSubscriptionsSubscription(billingSubscription.id);
      editedDescription = subscriptionNotifications.revertedUpdate;
    } else {
      await editSubscription({
        ...values,
        applyChangeDate: !hasSpecificDate ? null : values.applyChangeDate,
        editPrice: !values.editPrice ? null : Number(values.editPrice),
        editQuantity: !values.editQuantity ? null : Number(values.editQuantity),
      });

      editedDescription = [
        ApplyChangeEditStatus.ON_NEXT_RENEWAL,
        ApplyChangeEditStatus.ON_SPECIFIC_DATE,
      ].includes(values.applyChangeEditStatus)
        ? subscriptionNotifications.scheduledUpdate
        : subscriptionNotifications.updated;
    }

    showMessage({
      title: 'Successful!',
      description: editedDescription,
    });

    setShowModal(false);
  }

  const {values, errors, touched, setFieldValue, handleSubmit} = useFormik({
    initialValues: {
      ...billingSubscription,
      editPrice:
        formatMoney(
          isScheduledToEdit ? billingSubscription.editPrice : billingSubscription.price,
        ).toString() || '0.00',
      editQuantity: isScheduledToEdit
        ? billingSubscription.editQuantity
        : billingSubscription.quantity?.toString() || '1',
      applyChangeEditStatus: billingSubscription.applyChangeEditStatus || undefined,
      applyChangeDate: billingSubscription.applyChangeDate
        ? new Date(useMalaysiaTime(billingSubscription.applyChangeDate))
        : undefined,
    },
    validationSchema: billingSubscriptionEditGeneralSchema,
    onSubmit: submitForm,
  });

  const hasSpecificDate = values.applyChangeEditStatus === ApplyChangeEditStatus.ON_SPECIFIC_DATE;

  return (
    <Modal
      aria-label="Edit Subscription Details Form"
      isOpen={showModal}
      onDismiss={() => setShowModal(false)}>
      <ModalHeader>Edit subscription details</ModalHeader>
      <ModalBody>
        <FieldContainer
          label="Price"
          status={touched.editPrice && errors.editPrice ? 'error' : undefined}
          helpText={touched.editPrice && errors.editPrice}
          layout="horizontal-responsive">
          <MoneyInput
            value={values.editPrice}
            onChangeValue={(value) => setFieldValue('editPrice', value)}
            widthClass="w-1/4"
            disabled={isScheduledToEdit || isMeteredPricingModel}
          />
        </FieldContainer>
        {isPerUnitPricingModel ? (
          <FieldContainer
            label="Quantity"
            status={touched.editQuantity && errors.editQuantity ? 'error' : undefined}
            helpText={touched.editQuantity && errors.editQuantity}
            layout="horizontal-responsive">
            <DecimalInput
              value={values.editQuantity?.toString()}
              onChangeValue={(value) => setFieldValue('editQuantity', value)}
              decimalPlaces={0}
              minLength={1}
              maxLength={6}
              disabled={isScheduledToEdit || !isPerUnitPricingModel}
              className="w-1/4 text-left"
              placeholder="Enter quantity"
            />
          </FieldContainer>
        ) : (
          <TextField
            value="-"
            label="Quantity"
            layout="horizontal-responsive"
            className="w-1/4"
            disabled={true}
          />
        )}
        <FieldContainer
          label="Apply changes"
          layout="horizontal-responsive"
          status={
            (touched.applyChangeEditStatus && errors.applyChangeEditStatus) ||
            (touched.applyChangeDate && errors.applyChangeDate)
              ? 'error'
              : undefined
          }
          helpText={
            (touched.applyChangeEditStatus && errors.applyChangeEditStatus) ||
            (touched.applyChangeDate && errors.applyChangeDate)
          }>
          <div className="flex space-x-2">
            <DropdownSelect
              name="applyChangeEditStatus"
              value={values.applyChangeEditStatus}
              onChangeValue={(value) => setFieldValue('applyChangeEditStatus', value)}
              options={applyChangeEditStatusOptions}
              className="w-1/2"
              disabled={isScheduledToEdit || isMeteredPricingModel}
              placeholder="Please select"
            />
            <DaySelector
              emptyValue={hasSpecificDate ? undefined : '-'}
              value={hasSpecificDate ? values.applyChangeDate : undefined}
              onChangeValue={(value) => setFieldValue('applyChangeDate', value)}
              minDate={DATES.today}
              placeholder="Please select"
              className="w-1/4"
              disabled={isScheduledToEdit || isMeteredPricingModel || !hasSpecificDate}
            />
          </div>
        </FieldContainer>
      </ModalBody>
      <ModalFooter className="flex space-x-2 justify-end">
        <Button onClick={() => setShowModal(false)} variant="outline">
          CANCEL
        </Button>
        <Button
          isLoading={isUpdatingSubscription || isRevertingSubscription}
          variant={isScheduledToEdit ? 'error' : 'primary'}
          onClick={() => handleSubmit()}>
          {isScheduledToEdit ? 'REMOVE CHANGES' : 'CONFIRM'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
