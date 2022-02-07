import * as React from 'react';
import {
  Button,
  DropdownSelect,
  Field,
  HelpText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MoneyInput,
  Text,
  TextareaField,
  TextInput,
} from '@setel/portal-ui';
import {useFormik} from 'formik';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import * as Yup from 'yup';
import {useCreateBillingPlan} from '../billing-plan.queries';
import {
  BillingIntervalUnit,
  BillingIntervalUnitOptions,
  PricingModel,
  PricingModelOptions,
  TrialPeriodUnit,
  TrialPeriodUnitOptions,
} from '../billing-plan.types';
import {useState} from 'react';
import {useRouter} from '../../../routing/routing.context';

const fieldClasses = 'p-2 sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start';
const labelClasses = 'mt-2 mr-15';

type BillingPlanModalProps = {
  onClose(): void;
};

const billingPlanSchema = Yup.object({
  name: Yup.string().required('Please enter plan name').max(40),
  invoiceName: Yup.string().max(40),
  description: Yup.string().max(100),
  billingInterval: Yup.number()
    .required('Please enter billing period')
    .min(1)
    .max(99)
    .integer('Bill every must be an integer'),
  billingIntervalUnit: Yup.mixed<BillingIntervalUnit>()
    .oneOf(Object.values(BillingIntervalUnit))
    .required('Please enter billing period unit'),
  trialPeriod: Yup.number().integer('Trial period must be an integer').min(0).max(99),
  trialPeriodUnit: Yup.mixed<TrialPeriodUnit>().oneOf(Object.values(TrialPeriodUnit)),
  pricingModel: Yup.mixed<PricingModel>()
    .oneOf(Object.values(PricingModel))
    .required('Please enter pricing model'),
  price: Yup.number().when('pricingModel', {
    is: PricingModel.METERED,
    then: Yup.number(),
    otherwise: Yup.number().required('Please enter price'),
  }),
  setupFee: Yup.number().required('Please enter setup fee'),
});

export const BillingPlanModal = ({onClose}: BillingPlanModalProps) => {
  const [isDisablePrice, setDisablePrice] = useState(false);
  const router = useRouter();

  const {mutateAsync: createBillingPlan, isLoading: isCreating, error} = useCreateBillingPlan();

  const submitForm = (billingPlanValues: any) => {
    createBillingPlan({
      ...billingPlanValues,
      billingInterval: Number(billingPlanValues.billingInterval),
      ...{
        trialPeriod: billingPlanValues.trialPeriod ? Number(billingPlanValues.trialPeriod) : null,
      },
      ...{price: billingPlanValues.price ? Number(billingPlanValues.price) : null},
      ...{setupFee: billingPlanValues.setupFee ? Number(billingPlanValues.setupFee) : null},
    }).then((billingPlan) => {
      onClose();
      router.navigateByUrl(`/billing/billing-plans/${billingPlan.id}`);
    });
  };

  const checkPricingModel = (pricingValue) => {
    if (pricingValue === PricingModel.METERED) {
      setFieldValue('price', '');
      setDisablePrice(true);
    } else {
      setDisablePrice(false);
    }
  };

  const {values, errors, touched, setFieldValue, handleSubmit} = useFormik({
    initialValues: {
      name: undefined,
      invoiceName: undefined,
      description: undefined,
      billingInterval: undefined,
      trialPeriod: undefined,
      pricingModel: undefined,
      price: '0.00',
      setupFee: '0.00',
      billingIntervalUnit: BillingIntervalUnit.DAY,
      trialPeriodUnit: TrialPeriodUnit.DAY,
    },
    validationSchema: billingPlanSchema,
    onSubmit: submitForm,
  });

  const isBillingIntervalError =
    (errors.billingInterval && touched.billingInterval) ||
    (errors.billingIntervalUnit && touched.billingIntervalUnit);
  const isTrialPeriodError =
    (errors.trialPeriod && touched.trialPeriod) ||
    (errors.trialPeriodUnit && touched.trialPeriodUnit);

  return (
    <>
      <Modal
        isOpen
        onDismiss={onClose}
        aria-label="Create billing plan"
        data-testid="add-custom-field-modal">
        {error && <QueryErrorAlert error={error as any} />}
        <div aria-label="Create billing plan form">
          <ModalHeader>Create billing plan</ModalHeader>
          <ModalBody>
            <Field
              className={fieldClasses}
              status={errors.name && touched.name ? 'error' : undefined}>
              <Label className={labelClasses}>
                <Text color="lightgrey">Plan name</Text>
              </Label>
              <div className="sm:col-span-2">
                <TextInput
                  value={values.name}
                  name="name"
                  maxLength={40}
                  onChangeValue={(value) => setFieldValue('name', value)}
                  onBlur={() => setFieldValue('name', values.name)}
                  placeholder="Enter plan name"
                />
                {touched.name && errors.name && <HelpText>{errors.name}</HelpText>}
              </div>
            </Field>
            <Field
              className={fieldClasses}
              status={errors.invoiceName && touched.invoiceName ? 'error' : undefined}>
              <Label className={labelClasses}>
                <Text color="lightgrey">Invoice name (optional)</Text>
              </Label>
              <div className="sm:col-span-2">
                <TextInput
                  value={values.invoiceName}
                  name="invoiceName"
                  maxLength={40}
                  onChangeValue={(value) => setFieldValue('invoiceName', value)}
                  onBlur={() => setFieldValue('invoiceName', values.invoiceName)}
                  placeholder="Enter invoice name"
                />
                {touched.invoiceName && errors.invoiceName && (
                  <HelpText>{errors.invoiceName}</HelpText>
                )}
              </div>
            </Field>
            <Field
              className={fieldClasses}
              status={errors.description && touched.description ? 'error' : undefined}>
              <Label className={labelClasses}>
                <Text color="lightgrey">Plan description (optional)</Text>
              </Label>
              <div className="sm:col-span-3">
                <TextareaField
                  value={values.description}
                  name="description"
                  maxLength={100}
                  onChangeValue={(value) => setFieldValue('description', value)}
                  onBlur={() => setFieldValue('description', values.description)}
                  placeholder="Enter plan description"
                />
                {touched.description && errors.description && (
                  <HelpText>{errors.description}</HelpText>
                )}
              </div>
            </Field>
            <Field className={fieldClasses} status={isBillingIntervalError ? 'error' : undefined}>
              <Label className={labelClasses}>
                <Text color="lightgrey">Bill every</Text>
              </Label>
              <div className="sm:col-span-2">
                <div className="flex flex-row">
                  <TextInput
                    value={values.billingInterval}
                    name="billingInterval"
                    type="number"
                    onChangeValue={(value) => setFieldValue('billingInterval', value)}
                    onBlur={() => setFieldValue('billingInterval', values.billingInterval)}
                    placeholder="Enter period"
                  />
                  <div className={'w-6'} />
                  <DropdownSelect
                    name={'billingIntervalUnit'}
                    value={values.billingIntervalUnit}
                    onChangeValue={(value) => setFieldValue('billingIntervalUnit', value)}
                    onBlur={() => setFieldValue('billingIntervalUnit', values.billingIntervalUnit)}
                    options={BillingIntervalUnitOptions}
                  />
                  <div className={'w-6'} />
                </div>
                {isBillingIntervalError && (
                  <HelpText>{errors.billingInterval || errors.billingIntervalUnit}</HelpText>
                )}
              </div>
            </Field>
            <Field className={fieldClasses} status={isTrialPeriodError ? 'error' : undefined}>
              <Label className={labelClasses}>
                <Text color="lightgrey">Trial period</Text>
              </Label>
              <div className="sm:col-span-2">
                <div className="flex flex-row">
                  <TextInput
                    value={values.trialPeriod}
                    name="trialPeriod"
                    type="number"
                    onChangeValue={(value) => setFieldValue('trialPeriod', value)}
                    onBlur={() => setFieldValue('trialPeriod', values.trialPeriod)}
                    placeholder="Enter period"
                  />
                  <div className={'w-6'} />
                  <DropdownSelect
                    name={'trialPeriodUnit'}
                    value={values.trialPeriodUnit}
                    onChangeValue={(value) => setFieldValue('trialPeriodUnit', value)}
                    onBlur={() => setFieldValue('trialPeriodUnit', values.trialPeriodUnit)}
                    options={TrialPeriodUnitOptions}
                  />
                  <div className={'w-6'} />
                </div>
                {isTrialPeriodError && (
                  <HelpText>{errors.trialPeriod || errors.trialPeriodUnit}</HelpText>
                )}
              </div>
            </Field>
            <Field
              className={fieldClasses}
              status={errors.pricingModel && touched.pricingModel ? 'error' : undefined}>
              <Label className={labelClasses}>
                <Text color="lightgrey">Pricing model</Text>
              </Label>
              <div className="sm:col-span-2">
                <div className="flex flex-row">
                  <DropdownSelect
                    name={'pricingModel'}
                    value={values.pricingModel}
                    onChangeValue={(value) => {
                      setFieldValue('pricingModel', value);
                      checkPricingModel(value);
                    }}
                    onBlur={() => {
                      setFieldValue('pricingModel', values.pricingModel);
                      checkPricingModel(values.pricingModel);
                    }}
                    options={PricingModelOptions}
                    placeholder={'Select model'}
                  />
                  <div className={'w-36'} />
                </div>
                {touched.pricingModel && errors.pricingModel && (
                  <HelpText>{errors.pricingModel}</HelpText>
                )}
              </div>
            </Field>
            <Field
              className={fieldClasses}
              status={errors.price && touched.price ? 'error' : undefined}>
              <Label className={labelClasses}>
                <Text color="lightgrey">Price</Text>
              </Label>
              <div className="sm:col-span-2">
                <MoneyInput
                  decimalPlaces={2}
                  value={values.price}
                  disabled={isDisablePrice}
                  onChangeValue={(value) => setFieldValue('price', value)}
                  onBlur={() => setFieldValue('price', values.price)}
                />
                {touched.price && errors.price && <HelpText>{errors.price}</HelpText>}
              </div>
            </Field>
            <Field
              className={fieldClasses}
              status={errors.setupFee && touched.setupFee ? 'error' : undefined}>
              <Label className={labelClasses}>
                <Text color="lightgrey">Setup fee</Text>
              </Label>
              <div className="sm:col-span-2">
                <MoneyInput
                  decimalPlaces={2}
                  value={values.setupFee}
                  onChangeValue={(value) => setFieldValue('setupFee', value)}
                  onBlur={() => setFieldValue('setupFee', values.setupFee)}
                />
                {touched.setupFee && errors.setupFee && <HelpText>{errors.setupFee}</HelpText>}
              </div>
            </Field>
          </ModalBody>
          <ModalFooter>
            <div className="flex justify-end">
              <div className="flex-grow text-right">
                <Button variant="outline" type="button" disabled={isCreating} onClick={onClose}>
                  CANCEL
                </Button>
                <Button
                  variant="primary"
                  className="ml-3"
                  isLoading={isCreating}
                  onClick={() => handleSubmit()}>
                  SAVE
                </Button>
              </div>
            </div>
          </ModalFooter>
        </div>
      </Modal>
    </>
  );
};
