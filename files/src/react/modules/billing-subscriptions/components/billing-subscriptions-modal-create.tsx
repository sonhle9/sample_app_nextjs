import * as React from 'react';
import {
  Button,
  FieldContainer,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  SearchableDropdown,
  TextField,
  TextareaField,
  DropdownSelect,
  DaySelector,
  MoneyInput,
  useDebounce,
  DecimalInput,
  DATES,
  TextInput,
  formatMoney,
  Stepper,
  Fieldset,
  MultiInput,
  isEmail,
} from '@setel/portal-ui';
import * as Yup from 'yup';
import {
  BillingIntervalUnit,
  PricingModel,
  TrialPeriodUnit,
  TrialPeriodUnitOptions,
  // getPricingModelName,
} from '../../billing-plans/billing-plan.types';
import {useFormik} from 'formik';
import {useBillingPlans} from '../../billing-plans/billing-plan.queries';
import {
  PaymentTermStatus,
  BillingAtStatus,
  SubscriptionPhysicals,
} from '../billing-subscriptions.types';
import {useMerchantsSmartPay} from '../merchants.queries';
import {useCreateBillingSubscription} from '../billing-subscriptions.queries';
import {RequiredTitle, OptionalTitle} from 'src/react/components/title-input';
import {
  billAtOptions,
  DayOptions,
  paymentTermOptions,
  physicalOptions,
  startDateNote,
  paymentTermDayOptions,
  paymentDueNoticePeriodOptions,
} from '../billing-subscriptions.constants';
import {requiredText, requiredOption} from 'src/shared/helpers/input-error-message-helper';
import {buildPeriodTime} from '../billing-subscriptions.helpers';
import {useNotification} from 'src/react/hooks/use-notification';
import {subscriptionNotifications} from '../billing-subscriptions.constants';
import {useRouter} from 'src/react/routing/routing.context';

interface IBillingSubscriptionsModalCreateProps {
  showModal: boolean;
  setShowModal: Function;
}

export const BillingSubscriptionsModalCreate = ({
  showModal,
  setShowModal,
}: IBillingSubscriptionsModalCreateProps) => {
  const {mutateAsync: createBillingSubscription, isLoading: isCreating} =
    useCreateBillingSubscription();
  const [selectedBillingPlan, setSelectedBillingPlan] = React.useState(null);
  const [billPlanOptions, setBillPlanOptions] = React.useState([]);
  const [billingDateOptions, setBillingDateOptions] = React.useState([]);
  const [searchMerchant, setSearchMerchant] = React.useState('');
  const [searchBillingPlans, setSearchBillingPlans] = React.useState('');
  const [merchantOptions, setMerchantOptions] = React.useState([]);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const search = useDebounce(searchMerchant, 500);
  const searchPlans = useDebounce(searchBillingPlans, 500);
  const router = useRouter();
  const showMessage = useNotification();

  const {data: merchants, isLoading: isLoadingMerchant} = useMerchantsSmartPay({
    page: 1,
    perPage: 20,
    name: search,
  });

  const {data: dataPlan, isLoading: isLoadingPlan} = useBillingPlans({
    page: 1,
    perPage: 20,
    searchName: searchPlans,
    pricingModel: PricingModel.METERED, // current only support create by plan pricingModel = METERED
  });

  React.useEffect(() => {
    if (search !== searchMerchant) {
      return setMerchantOptions(undefined);
    }

    if (isLoadingMerchant) {
      return setMerchantOptions(undefined);
    }

    if (merchants && merchants.length === 0) {
      return setMerchantOptions([]);
    }

    setMerchantOptions(
      merchants.map((merchant) => {
        return {
          label: merchant.name,
          value: merchant.merchantId,
        };
      }),
    );
  }, [isLoadingMerchant, search, searchMerchant, merchants]);

  React.useEffect(() => {
    if (searchBillingPlans !== searchPlans) {
      return setBillPlanOptions(undefined);
    }

    if (isLoadingPlan) {
      return setBillPlanOptions(undefined);
    }

    if (!dataPlan?.billingPlans || dataPlan?.billingPlans.length === 0) {
      return setBillPlanOptions([]);
    }

    setBillPlanOptions(
      dataPlan.billingPlans.map((billingPlanInfo) => {
        return {
          label: billingPlanInfo.name,
          value: billingPlanInfo.id,
        };
      }),
    );
  }, [isLoadingPlan, searchBillingPlans, searchPlans, dataPlan]);

  const validationSchema1 = Yup.object({
    merchantId: Yup.string().required(requiredOption('merchant')),
    billingPlanId: Yup.string().required(requiredOption('plan')),
    contactPerson: Yup.string().max(40),
    invoiceName: Yup.string().max(40),
    billingPlanDescription: Yup.string().max(100),
    trialPeriod: Yup.string(),
    trialPeriodUnit: Yup.string().required(requiredText('trial period unit')),
    startAt: Yup.date().required(requiredOption('a date')),
    pricingModel: Yup.string(),
    setupFee: Yup.string().required(requiredText('setup fee')),
  });

  const validationSchema2 = Yup.object({
    billingAt: Yup.string().required(requiredOption('interval')),
    hasCustomBillingDate: Yup.boolean(),
    billingDate: Yup.number().when('hasCustomBillingDate', {
      is: true,
      then: Yup.number()
        .typeError(requiredText('billing date'))
        .required(requiredText('billing date')),
    }),
    paymentTerm: Yup.string().required(requiredOption('credit term')),
    paymentTermDays: Yup.string().when('paymentTerm', {
      is: PaymentTermStatus.SOME_DAYS,
      then: Yup.string()
        .required(requiredOption('number of credit term days'))
        .test(
          'paymentTermDays',
          'Credit term days must be more than 0',
          (value) => Number(value) > 0,
        ),
    }),
    paymentDueNoticePeriod: Yup.string(),
    eStatements: Yup.array().of(Yup.string().email()).required(requiredText('E-statement')),
    physical: Yup.string(),
    // price: Yup.mixed().when('pricingModel', {
    //   is: PricingModel.METERED,
    //   then: Yup.string(),
    //   otherwise: Yup.string().required(requiredText('price')),
    // }),
    // quantity: Yup.string().when('pricingModel', {
    //   is: PricingModel.PER_UNIT,
    //   then: Yup.string()
    //     .required(requiredText('quantity'))
    //     .test('quantity', 'Quantity must be more than 0', (value) => Number(value) > 0),
    // }),
  });

  const validationSchema = React.useMemo(() => {
    return activeIndex === 0 ? validationSchema1 : validationSchema2;
  }, [activeIndex]);
  const isDoneGeneral = React.useMemo(() => {
    return activeIndex === 1;
  }, [activeIndex]);

  const {values, errors, setFieldValue, touched, handleSubmit} = useFormik({
    initialValues: {
      merchantId: '',
      billingPlanId: '',
      contactPerson: '',
      invoiceName: '',
      billingPlanDescription: '',

      billingAt: undefined,
      hasCustomBillingDate: false,
      billingDate: undefined,
      paymentTerm: undefined,
      paymentTermDays: '',
      paymentDueNoticePeriod: '3',

      trialPeriod: '',
      trialPeriodUnit: TrialPeriodUnit.DAY,
      startAt: undefined,

      // pricingModel: '',
      // price: '0.00',
      // quantity: '1',
      setupFee: '0.00',

      eStatements: [],
      physical: SubscriptionPhysicals.NONE,
    },
    validationSchema,
    onSubmit: (values, actions) => {
      if (isDoneGeneral) {
        createBillingSubscription(
          {
            ...values,
            setupFee: Number(values.setupFee),
            paymentTermDays: !hasPaymentTermDays ? null : Number(values.paymentTermDays),
            trialPeriod: !values.trialPeriod ? null : Number(values.trialPeriod),
            paymentDueNoticePeriod: Number(values.paymentDueNoticePeriod),
            billingDate:
              !values.hasCustomBillingDate || isDayIntervalUnit ? null : values.billingDate,
            // price: isMeteredPricingModel ? null : Number(values.price),
            // quantity: !isPerUnitPricingModel ? null : Number(values.quantity),
          },
          {
            onSuccess: ({id: billingSubscriptionId}) => {
              setShowModal(false);
              showMessage({
                title: 'Successful!',
                description: subscriptionNotifications.created,
              });
              router.navigateByUrl(`billing/billing-subscriptions/${billingSubscriptionId}?`);
            },
          },
        );
      } else {
        setActiveIndex((state) => state + 1);
        actions.setTouched({});
        actions.setSubmitting(false);
      }
    },
  });

  const changeBillingDateOptions = (billingIntervalUnit: string) => {
    let options = [];
    switch (billingIntervalUnit) {
      case 'week':
        options = DayOptions;
        break;
      case 'month':
      case 'year':
        for (let i = 1; i <= 31; i++) {
          options.push({
            label: i,
            value: i,
          });
        }
        break;
    }

    setBillingDateOptions(options);
  };

  const setBillingPlan = (value: string) => {
    setFieldValue('billingPlanId', value);
    const billingPlans = dataPlan?.billingPlans?.filter((billingPlan) => {
      return billingPlan.id === value;
    });

    if (billingPlans.length) {
      const billingPlan = billingPlans[0];
      setSelectedBillingPlan(billingPlan);
      changeBillingDateOptions(billingPlan.billingIntervalUnit);

      setFieldValue('invoiceName', billingPlan.invoiceName || '');
      setFieldValue('billingPlanDescription', billingPlan.description || '');
      setFieldValue('pricingModel', billingPlan.pricingModel || '');
      setFieldValue('trialPeriod', billingPlan.trialPeriod?.toString() || '');
      setFieldValue('trialPeriodUnit', billingPlan.trialPeriodUnit || TrialPeriodUnit.DAY);
      // setFieldValue('price', formatMoney(billingPlan.price).toString() || '0.00');
      setFieldValue('setupFee', formatMoney(billingPlan.setupFee).toString() || '0.00');

      if (billingPlan.pricingModel === PricingModel.METERED) {
        setFieldValue('billingAt', BillingAtStatus.END);
      }
    }
  };

  const isDayIntervalUnit = selectedBillingPlan?.billingIntervalUnit === BillingIntervalUnit.DAY;
  // const isPerUnitPricingModel = selectedBillingPlan?.pricingModel === PricingModel.PER_UNIT;
  const isMeteredPricingModel = selectedBillingPlan?.pricingModel === PricingModel.METERED;
  const hasPaymentTermDays = values.paymentTerm === PaymentTermStatus.SOME_DAYS;

  return (
    <>
      <Modal
        isOpen={showModal}
        initialFocus="dismiss"
        onDismiss={() => setShowModal(false)}
        aria-label="Create new subscription"
        data-testid="variable-editor">
        <ModalHeader>Create new subscription</ModalHeader>
        <Stepper activeIndex={activeIndex} onChange={setActiveIndex} className="px-5">
          <Stepper.Step label="General" status={isDoneGeneral ? 'done' : null} />
          <Stepper.Step label="Subscription details" disabled={!isDoneGeneral} />
        </Stepper>
        {activeIndex === 0 && (
          <ModalBody className="px-7 pt-8">
            <FieldContainer
              label={RequiredTitle('Merchant name')}
              status={touched.merchantId && errors.merchantId ? 'error' : undefined}
              helpText={touched.merchantId && errors.merchantId}
              layout="horizontal-responsive">
              <div className="w-3/5">
                <SearchableDropdown
                  value={values.merchantId}
                  onChangeValue={(value) => setFieldValue('merchantId', value)}
                  options={merchantOptions}
                  onInputValueChange={setSearchMerchant}
                  placeholder="Enter merchant name"
                />
              </div>
            </FieldContainer>
            <FieldContainer
              label={RequiredTitle('Plan name')}
              status={touched.billingPlanId && errors.billingPlanId ? 'error' : undefined}
              helpText={touched.billingPlanId && errors.billingPlanId}
              layout="horizontal-responsive">
              <div className="w-3/5">
                <SearchableDropdown
                  value={values.billingPlanId}
                  onChangeValue={setBillingPlan}
                  options={billPlanOptions}
                  placeholder="Enter plan name"
                  onInputValueChange={setSearchBillingPlans}
                />
              </div>
            </FieldContainer>
            <TextField
              value={values.contactPerson}
              onChangeValue={(value) => setFieldValue('contactPerson', value)}
              label="Contact person"
              layout="horizontal-responsive"
              className="w-3/5"
              maxLength={40}
            />
            <TextField
              value={values.invoiceName}
              onChangeValue={(value) => setFieldValue('invoiceName', value)}
              label={OptionalTitle('Invoice name')}
              layout="horizontal-responsive"
              className="w-3/5"
              maxLength={40}
            />
            <TextareaField
              layout="horizontal"
              value={values.billingPlanDescription}
              onChangeValue={(value) => setFieldValue('billingPlanDescription', value)}
              label={OptionalTitle('Plan description')}
              maxLength={100}
            />
            <FieldContainer label={OptionalTitle('Trial period')} layout="horizontal-responsive">
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
            <FieldContainer
              label={RequiredTitle('Start date')}
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
            {/* <TextField
            value={getPricingModelName(selectedBillingPlan?.pricingModel) || '-'}
            label="Pricing model"
            layout="horizontal-responsive"
            className="w-1/4"
            disabled={true}
          />
          <FieldContainer
            label={RequiredTitle('Price')}
            status={touched.price && errors.price ? 'error' : undefined}
            helpText={touched.price && errors.price}
            layout="horizontal-responsive">
            <MoneyInput
              value={values.price}
              onChangeValue={(value) => setFieldValue('price', value)}
              disabled={isMeteredPricingModel}
              widthClass="w-1/4"
            />
          </FieldContainer> */}

            {/* {isPerUnitPricingModel ? (
            <FieldContainer
              label={RequiredTitle('Quantity')}
              status={touched.quantity && errors.quantity ? 'error' : undefined}
              helpText={touched.quantity && errors.quantity}
              layout="horizontal-responsive">
              <DecimalInput
                value={values.quantity?.toString()}
                onChangeValue={(value) => setFieldValue('quantity', value)}
                decimalPlaces={0}
                minLength={1}
                maxLength={6}
                disabled={!isPerUnitPricingModel}
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
          )} */}
            <FieldContainer
              label={RequiredTitle('Setup fee')}
              status={touched.setupFee && errors.setupFee ? 'error' : undefined}
              helpText={touched.setupFee && errors.setupFee}
              layout="horizontal-responsive">
              <MoneyInput
                value={values.setupFee}
                onChangeValue={(value) => setFieldValue('setupFee', value)}
                widthClass="w-1/4"
              />
            </FieldContainer>
            <label>
              <sup className="text-red-600">* </sup>
              <sup className="text-gray-600">Required fields</sup>
            </label>
          </ModalBody>
        )}
        {activeIndex === 1 && (
          <ModalBody className="px-7 pt-8">
            <Fieldset legend="BILLING">
              <TextField
                value={
                  buildPeriodTime(
                    selectedBillingPlan?.billingInterval,
                    selectedBillingPlan?.billingIntervalUnit,
                  ) || '-'
                }
                label="Bill every"
                layout="horizontal-responsive"
                className="w-1/2"
                disabled={true}
              />

              <FieldContainer
                label={RequiredTitle('Bill at')}
                layout="horizontal-responsive"
                status={touched.billingAt && errors.billingAt ? 'error' : undefined}
                helpText={touched.billingAt && errors.billingAt}>
                <div className="w-1/2">
                  <DropdownSelect
                    value={values.billingAt}
                    onChangeValue={(value) => setFieldValue('billingAt', value)}
                    options={billAtOptions}
                    placeholder="Please select"
                    disabled={isMeteredPricingModel}
                  />
                </div>
              </FieldContainer>

              <FieldContainer
                label="Custom billing date"
                layout="horizontal-responsive"
                status={touched.billingDate && errors.billingDate ? 'error' : undefined}
                helpText={touched.billingDate && errors.billingDate}>
                <div className="flex w-1/2 space-x-2">
                  <DropdownSelect
                    value={values.hasCustomBillingDate?.toString()}
                    onChangeValue={(value) =>
                      setFieldValue('hasCustomBillingDate', value === 'false' ? false : true)
                    }
                    options={[
                      {
                        label: 'No',
                        value: 'false',
                      },
                      {
                        label: 'Yes',
                        value: 'true',
                      },
                    ]}
                    placeholder="Please select"
                    disabled={!selectedBillingPlan || isDayIntervalUnit}
                  />
                  <DropdownSelect
                    value={values.hasCustomBillingDate ? values.billingDate : undefined}
                    onChangeValue={(value) => setFieldValue('billingDate', value)}
                    options={billingDateOptions}
                    disabled={
                      !selectedBillingPlan || !values.hasCustomBillingDate || isDayIntervalUnit
                    }
                    placeholder={
                      !selectedBillingPlan || !values.hasCustomBillingDate || isDayIntervalUnit
                        ? '-'
                        : 'Please select'
                    }
                  />
                </div>
              </FieldContainer>

              <FieldContainer
                label={RequiredTitle('Credit term')}
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
                    onChangeValue={(value) => {
                      setFieldValue('paymentTerm', value);
                      if (value === PaymentTermStatus.SOME_DAYS) {
                        setFieldValue('paymentTermDays', '30');
                      } else {
                        setFieldValue('paymentTermDays', '');
                      }
                    }}
                    options={paymentTermOptions}
                    placeholder="Please select"
                    className="w-1/2"
                  />
                  {hasPaymentTermDays ? (
                    <DropdownSelect
                      value={values.paymentTermDays}
                      onChangeValue={(value) => setFieldValue('paymentTermDays', value)}
                      options={paymentTermDayOptions}
                      className="w-1/3 text-left"
                      placeholder="Please select"
                    />
                  ) : (
                    <TextInput value="-" disabled={true} className="w-1/3" />
                  )}
                </div>
              </FieldContainer>

              <FieldContainer
                label="Payment due notice period"
                layout="horizontal-responsive"
                status={
                  touched.paymentDueNoticePeriod && errors.paymentDueNoticePeriod
                    ? 'error'
                    : undefined
                }
                helpText={touched.paymentDueNoticePeriod && errors.paymentDueNoticePeriod}>
                <DropdownSelect
                  value={values.paymentDueNoticePeriod}
                  onChangeValue={(value) => setFieldValue('paymentDueNoticePeriod', value)}
                  options={paymentDueNoticePeriodOptions}
                  placeholder="Please select"
                  className="w-1/2"
                />
              </FieldContainer>
            </Fieldset>

            <Fieldset legend="STATEMENT PREFERENCE" borderTop>
              <FieldContainer
                label={RequiredTitle('E-statement')}
                status={touched.eStatements && errors.eStatements ? 'error' : undefined}
                helpText={
                  (touched.eStatements && errors.eStatements) ||
                  'E-statement will be sent to email provided'
                }
                layout="horizontal-responsive">
                <MultiInput
                  values={values.eStatements}
                  onChangeValues={(value) => setFieldValue('eStatements', value)}
                  validateBeforeAdd={isEmail}
                  autoComplete="email"
                  className={values.eStatements.length ? '' : 'w-1/2'}
                />
              </FieldContainer>

              <FieldContainer label={OptionalTitle('Physical')} layout="horizontal-responsive">
                <DropdownSelect
                  value={values.physical}
                  onChangeValue={(value) => setFieldValue('physical', value)}
                  options={physicalOptions}
                  placeholder="Please select"
                  className="w-1/2"
                />
              </FieldContainer>
            </Fieldset>

            <label>
              <sup className="text-red-600">* </sup>
              <sup className="text-gray-600">Required fields</sup>
            </label>
          </ModalBody>
        )}
        <ModalFooter className="text-right space-x-2">
          <Button onClick={() => setShowModal(false)} variant="outline">
            CANCEL
          </Button>
          <Button onClick={() => handleSubmit()} variant="primary" isLoading={isCreating}>
            {isDoneGeneral ? 'SAVE' : 'NEXT'}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};
