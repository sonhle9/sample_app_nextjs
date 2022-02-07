import * as React from 'react';
import * as Yup from 'yup';
import {
  Button,
  DATES,
  DaySelector,
  DecimalInput,
  DropdownSelect,
  DropdownSelectField,
  FieldContainer,
  formatMoney,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MoneyInput,
} from '@setel/portal-ui';
import {
  BillingSubscription,
  PaymentTermStatus,
  SubscriptionStatus,
} from '../billing-subscriptions.types';
import {useFormik} from 'formik';
import {ValidationTextField} from 'src/react/components/formik-input';
import {
  startDateNote,
  StateOptions,
  subscriptionNotifications,
} from '../billing-subscriptions.constants';
import {useUpdateBillingSubscriptionsGeneral} from '../billing-subscriptions.queries';
import {requiredOption, requiredText} from 'src/shared/helpers/input-error-message-helper';
import {OptionalTitle} from 'src/react/components/title-input';
import {TrialPeriodUnit, TrialPeriodUnitOptions} from '../../billing-plans/billing-plan.types';
import {buildPeriodTime, useMalaysiaTime} from '../billing-subscriptions.helpers';
import {differenceInDays, addMonths} from 'date-fns/esm';
import {allowOnlyNumber} from 'src/shared/helpers/on-key-event';
import {useNotification} from 'src/react/hooks/use-notification';

interface IModalEditGeneralPendingFutureInTrialProps {
  billingSubscription: BillingSubscription;
  showModal: boolean;
  setShowModal: Function;
}

export const BillingSubscriptionsModalEditGeneralPendingFutureInTrial = ({
  billingSubscription,
  showModal,
  setShowModal,
}: IModalEditGeneralPendingFutureInTrialProps) => {
  const {mutateAsync: updateSubscriptionsGeneral, isLoading: isUpdatingSubscriptionsGeneral} =
    useUpdateBillingSubscriptionsGeneral();
  const showMessage = useNotification();

  const billingSubscriptionEditGeneralSchema = Yup.object({
    addressLine1: Yup.string().required(requiredText('address')),
    addressLine2: Yup.string(),
    postcode: Yup.string().required(requiredText('postcode')),
    city: Yup.string().required(requiredText('city')),
    state: Yup.string().required(requiredOption('state')),
    contactPerson: Yup.string().required(requiredText('contact person')),
    // email: Yup.string().email().required(requiredText('valid email address')),
    // paymentTerm: Yup.string().required(requiredOption('credit term')),
    // paymentTermDays: Yup.string().when('paymentTerm', {
    //   is: PaymentTermStatus.SOME_DAYS,
    //   then: Yup.string()
    //     .required(requiredText('number of credit term days'))
    //     .test(
    //       'paymentTermDays',
    //       'Credit term days must be more than 0',
    //       (value) => Number(value) > 0,
    //     ),
    // }),
    status: Yup.string(),
    trialPeriod: Yup.string(),
    trialPeriodUnit: Yup.string().required(requiredOption('trial period unit')),
    startAt: Yup.date().required(requiredOption('start date')),
    setupFee: Yup.string().required(requiredText('setup fee')),
  });

  async function submitForm() {
    if (isInTrialStatus) {
      delete values.startAt;
    }

    await updateSubscriptionsGeneral({
      ...values,
      trialPeriod: !values.trialPeriod ? null : Number(values.trialPeriod),
      paymentTermDays: !hasPaymentTermDays ? null : Number(values.paymentTermDays),
      setupFee: !values.setupFee ? null : Number(values.setupFee),
    });

    showMessage({
      title: 'Successful!',
      description: subscriptionNotifications.updated,
    });

    setShowModal(false);
  }

  const {values, errors, touched, setFieldValue, handleSubmit} = useFormik({
    initialValues: {
      ...billingSubscription,
      addressLine1: billingSubscription.addressLine1 || '',
      addressLine2: billingSubscription.addressLine2 || '',
      postcode: billingSubscription.postcode || '',
      city: billingSubscription.city || '',
      state: billingSubscription.state || '',
      contactPerson: billingSubscription.contactPerson || '',
      email: billingSubscription.email || '',
      startAt: billingSubscription.startAt
        ? new Date(useMalaysiaTime(billingSubscription.startAt))
        : undefined,
      trialPeriod: billingSubscription.trialPeriod?.toString() || '',
      trialPeriodUnit: billingSubscription.trialPeriodUnit || TrialPeriodUnit.DAY,
      // paymentTerm: billingSubscription.paymentTerm || undefined,
      // paymentTermDays: billingSubscription.paymentTermDays?.toString() || '',
      setupFee: formatMoney(billingSubscription.setupFee).toString() || '0.00',
    },
    validationSchema: billingSubscriptionEditGeneralSchema,
    onSubmit: submitForm,
  });

  const hasPaymentTermDays = values.paymentTerm === PaymentTermStatus.SOME_DAYS;
  const isInTrialStatus = billingSubscription?.status === SubscriptionStatus.IN_TRIAL;

  function checkUsedTrialPeriodDays() {
    if (!isInTrialStatus) return;

    const usedTrialPeriodDays =
      differenceInDays(DATES.today, new Date(useMalaysiaTime(billingSubscription.trialStartDate))) +
      1;

    const trialPeriodDays =
      values.trialPeriodUnit === TrialPeriodUnit.DAY
        ? Number(values.trialPeriod)
        : differenceInDays(
            addMonths(DATES.today, Number(values.trialPeriod)),
            new Date(useMalaysiaTime(billingSubscription.trialStartDate)),
          );

    if (usedTrialPeriodDays > trialPeriodDays) {
      errors.trialPeriod = `Trial period must not be less than ${buildPeriodTime(
        usedTrialPeriodDays,
        TrialPeriodUnit.DAY,
      )} `;
    } else {
      delete errors.trialPeriod;
    }
  }

  checkUsedTrialPeriodDays();

  return (
    <Modal aria-label="Edit Details Form" isOpen={showModal} onDismiss={() => setShowModal(false)}>
      <ModalHeader>Edit details</ModalHeader>
      <ModalBody>
        <ValidationTextField
          label="Address line 1"
          value={values.addressLine1}
          error={touched.addressLine1 && errors.addressLine1}
          name="addressLine1"
          onChangeValue={(value) => setFieldValue('addressLine1', value)}
          placeholder="Enter line 1"
          layout="horizontal-responsive"
          className="w-1/2"
          maxLength={50}
        />
        <ValidationTextField
          label={OptionalTitle('Address line 2')}
          value={values.addressLine2}
          error={touched.addressLine2 && errors.addressLine2}
          name="addressLine2"
          onChangeValue={(value) => setFieldValue('addressLine2', value)}
          placeholder="Enter line 2"
          layout="horizontal-responsive"
          className="w-1/2"
          maxLength={50}
        />
        <ValidationTextField
          label="Postcode"
          value={values.postcode}
          error={touched.postcode && errors.postcode}
          name="postcode"
          onChangeValue={(value) => setFieldValue('postcode', value)}
          placeholder="Enter postcode"
          layout="horizontal-responsive"
          className="w-1/2"
          maxLength={10}
          onKeyDown={allowOnlyNumber}
        />
        <ValidationTextField
          label="City"
          value={values.city}
          error={touched.city && touched.city && errors.city}
          name="city"
          onChangeValue={(value) => setFieldValue('city', value)}
          placeholder="Enter city"
          layout="horizontal-responsive"
          className="w-1/2"
          maxLength={20}
        />
        <DropdownSelectField
          label="State"
          value={values.state}
          options={StateOptions}
          name="state"
          onChangeValue={(value) => setFieldValue('state', value)}
          status={touched.state && errors.state ? 'error' : undefined}
          helpText={touched.state && errors.state}
          placeholder="Please select"
          layout="horizontal-responsive"
          className="w-1/2"
        />
        <ValidationTextField
          label="Contact person"
          value={values.contactPerson}
          error={touched.contactPerson && touched.contactPerson && errors.contactPerson}
          name="contactPerson"
          onChangeValue={(value) => setFieldValue('contactPerson', value)}
          placeholder="Enter contact person"
          layout="horizontal-responsive"
          className="w-1/2"
        />
        <ValidationTextField
          label="Email"
          value={values.email}
          error={touched.email && errors.email}
          name="email"
          onChangeValue={(value) => setFieldValue('email', value)}
          placeholder="Enter email"
          layout="horizontal-responsive"
          className="w-1/2"
        />
        <FieldContainer
          label={isInTrialStatus ? 'Trial period' : OptionalTitle('Trial period')}
          layout="horizontal-responsive"
          status={touched.trialPeriod && errors.trialPeriod ? 'error' : undefined}
          helpText={touched.trialPeriod && errors.trialPeriod}>
          <div className="flex space-x-2">
            <DecimalInput
              value={values.trialPeriod}
              onChangeValue={(value) => setFieldValue('trialPeriod', value)}
              decimalPlaces={0}
              maxLength={2}
              className="w-1/4 text-left"
              placeholder="Enter period"
            />
            <DropdownSelect
              value={values.trialPeriodUnit}
              onChangeValue={(value) => setFieldValue('trialPeriodUnit', value)}
              options={TrialPeriodUnitOptions}
              placeholder="Please select"
              className="w-1/4"
            />
          </div>
        </FieldContainer>
        {!isInTrialStatus && (
          <FieldContainer
            label="Start date"
            status={touched.startAt && errors.startAt ? 'error' : undefined}
            helpText={(touched.startAt && errors.startAt) || startDateNote}
            layout="horizontal-responsive">
            <DaySelector
              value={values.startAt}
              onChangeValue={(value) => setFieldValue('startAt', value)}
              minDate={DATES.today}
              placeholder="Please select"
              className="w-1/2"
            />
          </FieldContainer>
        )}
        <FieldContainer
          label="Setup fee"
          status={touched.setupFee && errors.setupFee ? 'error' : undefined}
          helpText={touched.setupFee && errors.setupFee}
          layout="horizontal-responsive">
          <MoneyInput
            value={values.setupFee}
            onChangeValue={(value) => setFieldValue('setupFee', value)}
            widthClass="w-1/4"
          />
        </FieldContainer>
        {/* <FieldContainer
          label="Payment term"
          layout="horizontal-responsive"
          status={
            (touched.paymentTerm && errors.paymentTerm) ||
            (touched.paymentTermDays && errors.paymentTermDays)
              ? 'error'
              : undefined
          }
          helpText={
            (touched.paymentTerm && errors.paymentTerm) ||
            (touched.paymentTermDays && errors.paymentTermDays)
          }>
          <div className="flex space-x-2">
            <DropdownSelect
              value={values.paymentTerm}
              onChangeValue={(value) => setFieldValue('paymentTerm', value)}
              options={paymentTermOptions}
              placeholder="Please select"
              className="w-1/2"
            />
            {hasPaymentTermDays ? (
              <DecimalInput
                value={values.paymentTermDays}
                onChangeValue={(value) => setFieldValue('paymentTermDays', value)}
                decimalPlaces={0}
                minLength={1}
                maxLength={2}
                className="w-1/4 text-left"
                placeholder="Enter days"
              />
            ) : (
              <TextInput value="-" disabled={true} className="w-1/4" />
            )}
          </div>
        </FieldContainer> */}
      </ModalBody>
      <ModalFooter className="flex space-x-2 justify-end">
        <Button onClick={() => setShowModal(false)} variant="outline">
          CANCEL
        </Button>
        <Button
          isLoading={isUpdatingSubscriptionsGeneral}
          variant="primary"
          onClick={() => handleSubmit()}>
          SAVE CHANGES
        </Button>
      </ModalFooter>
    </Modal>
  );
};
