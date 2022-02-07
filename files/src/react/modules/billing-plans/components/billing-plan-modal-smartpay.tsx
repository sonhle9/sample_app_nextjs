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
  Text,
  TextareaField,
  TextInput,
} from '@setel/portal-ui';
import {useFormik} from 'formik';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import * as Yup from 'yup';
import {useCreateBillingPlan} from '../billing-plan.queries';
import {
  BillingDate,
  BillingDateOption,
  BillingIntervalUnit,
  PricingModel,
} from '../billing-plan.types';
import {useRouter} from '../../../routing/routing.context';

const fieldClasses = 'p-2 sm:grid sm:grid-cols-4 sm:grap-4 sm:items-start';
const labelClasses = 'mt-2 mr-15';

type BillingPlanModalProps = {
  onClose(): void;
};

const billingPlanSchema = Yup.object({
  name: Yup.string().required('Please enter plan name').max(40).trim(),
  description: Yup.string().max(100),
  billingInterval: Yup.number()
    .required('Please enter billing period')
    .min(1)
    .max(99)
    .integer('Bill every must be an integer'),
  billingIntervalUnit: Yup.mixed<BillingIntervalUnit>()
    .oneOf(Object.values(BillingIntervalUnit))
    .required('Please enter billing period unit'),
  billingDate: Yup.mixed<BillingDate>().required('Please select billing date'),
});

export const BillingPlanCreateModal = ({onClose}: BillingPlanModalProps) => {
  const router = useRouter();

  const {mutateAsync: createBillingPlan, isLoading: isCreating, error} = useCreateBillingPlan();

  const submitForm = (billingPlanValues: any) => {
    createBillingPlan({
      ...billingPlanValues,
      billingInterval: 1,
    }).then((billingPlan) => {
      onClose();
      router.navigateByUrl(`/billing/billing-plans/${billingPlan.id}`);
    });
  };

  const {values, errors, touched, setFieldValue, handleSubmit} = useFormik({
    initialValues: {
      name: undefined,
      description: undefined,
      billingInterval: 1,
      billingIntervalUnit: BillingIntervalUnit.MONTH,
      pricingModel: PricingModel.METERED,
      billingDate: undefined,
    },
    validationSchema: billingPlanSchema,
    onSubmit: submitForm,
  });

  const isBillingDateError = errors.billingDate && touched.billingDate;

  return (
    <>
      <Modal
        isOpen
        onDismiss={onClose}
        aria-label="Create new plan"
        data-testid="add-custom-field-modal">
        {error && <QueryErrorAlert error={error as any} />}
        <div aria-label="Create billing plan form">
          <ModalHeader color="black">Create new plan</ModalHeader>
          <ModalBody>
            <Field
              className={fieldClasses}
              status={errors.name && touched.name ? 'error' : undefined}>
              <Label className={labelClasses}>
                <Text color="mediumgrey">Plan name</Text>
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
              status={errors.description && touched.description ? 'error' : undefined}>
              <Label className={labelClasses}>
                <Text color="mediumgrey">Plan description</Text>
                <Text color="mediumgrey">(optional)</Text>
              </Label>
              <div className="sm:col-span-3">
                <TextareaField
                  value={values.description}
                  name="description"
                  maxLength={100}
                  onChangeValue={(value) => setFieldValue('description', value)}
                  onBlur={() => setFieldValue('description', values.description)}
                  placeholder="Enter plan description"
                  wrapperClass="m-0"
                />
                {touched.description && errors.description && (
                  <HelpText>{errors.description}</HelpText>
                )}
              </div>
            </Field>
            <Field className={fieldClasses}>
              <Label className={labelClasses}>
                <Text color="mediumgrey">Bill every</Text>
              </Label>
              <div className="sm:col-span-2">
                <div className="sm:col-span-2">
                  <TextInput
                    disabled={true}
                    value="1 month"
                    name="billingInterval"
                    maxLength={40}
                    onChangeValue={(value) => setFieldValue('billingInterval', value)}
                    onBlur={() => setFieldValue('billingInterval', values.billingInterval)}
                    placeholder="Enter plan billingInterval"
                  />
                </div>
              </div>
            </Field>
            <Field className={fieldClasses} status={isBillingDateError ? 'error' : undefined}>
              <Label className={labelClasses}>
                <Text color="mediumgrey">Billing date</Text>
              </Label>
              <div className="sm:col-span-2">
                <div className="flex flex-row">
                  <DropdownSelect
                    className={'w-64'}
                    name={'billingDate'}
                    value={values.billingDate}
                    onChangeValue={(value) => setFieldValue('billingDate', value)}
                    onBlur={() => setFieldValue('billingDate', values.billingDate)}
                    options={BillingDateOption}
                    placeholder="Select date"
                  />
                </div>
                {isBillingDateError && (
                  <HelpText>{errors.billingDate || errors.billingDate}</HelpText>
                )}
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
