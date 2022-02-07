import * as React from 'react';
import {
  Button,
  Checkbox,
  FieldContainer,
  Modal,
  ModalBody,
  ModalFooter,
  TextField,
  titleCase,
} from '@setel/portal-ui';
import {
  useCreateBnplPlan,
  useGetPlanOverlaping,
} from 'src/react/modules/bnpl-plan-config/bnpl-plan.queries';
import {Formik} from 'formik';
import {IPlan} from 'src/react/modules/bnpl-plan-config/bnpl.interface';
import {
  countryOptions,
  currencyOptions,
  INSTRUCTION_QUANTITES_OPTIONS,
  planStructureOptionsDetailModal,
  planTypeOptions,
} from 'src/react/modules/bnpl-plan-config/bnpl-plan.constant';
import {
  FormikDaySelector,
  FormikDropdownField,
  FormikMoneyInput,
  FormikTextareaField,
  FormikMultiSelectField,
  FormikRadioGroup,
} from 'src/react/components/formik';
import {
  Country,
  Currency,
  PlanStatus,
  PlanType,
  PlanStructure,
} from 'src/react/modules/bnpl-plan-config/bnpl.enum';
import {startOfToday} from 'date-fns';
import * as Yup from 'yup';
import {useRouter} from 'src/react/routing/routing.context';
import {useVeryfiCreateBnplPlanModal} from './verify-create-plan-modal';

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  instructionInterval: Yup.string().required('Required'),
  country: Yup.string().required('Required'),
  currencyCode: Yup.string().required('Required'),
  instructionQuantities: Yup.array()
    .min(1, 'Instruction quantities should have at least one')
    .required('Required')
    .of(Yup.string().required('Required')),
  status: Yup.string().required('Required'),
  minAmount: Yup.number().typeError('Required').required('Required').min(0).max(4999),
  maxAmount: Yup.number()
    .required('Required')
    .typeError('Required')
    .min(0)
    .max(5000)
    .moreThan(Yup.ref('minAmount'), 'Max amount must be greater than Min amount'),
  expiredDate: Yup.date().typeError('Required').required('Required').min(new Date()),
  effectiveDate: Yup.date().typeError('Required').required('Required').min(new Date()),
  interestFee: Yup.number().required('Required').min(0),
  latePaymentFee: Yup.number().required('Required').min(0),
  planStructure: Yup.string().required('Required'),
});

export const useBnplPlanConfigDetailModal = (plan?: IPlan) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);

  const [submitValues, setSubmitValues] = React.useState<IPlan>(plan ?? null);
  const [overLappingData, setOverLappingData] = React.useState<IPlan[]>();

  const createBnplPlanMutation = useCreateBnplPlan();
  const isLoading = createBnplPlanMutation.isLoading;

  const initialValues = React.useMemo(
    () => ({
      name: plan?.name ?? '',
      country: plan?.country ?? Country.MALAYSIA,
      currencyCode: plan?.currencyCode ?? Currency.MYR,
      instructionInterval: plan?.instructionInterval ?? PlanType.MONTHLY,
      instructionQuantities:
        plan?.instructionQuantities.map((i: string | number) => i.toString()) ?? [],
      status: plan?.status ?? PlanStatus.ACTIVE,
      effectiveDate: plan?.effectiveDate ?? null,
      interestFee: plan?.interestFee ?? 0,
      minAmount: plan?.minAmount ?? null,
      maxAmount: plan?.maxAmount ?? null,
      planStructure: plan?.planStructure ?? PlanStructure.INSTRUCTION,
      latePaymentFee: plan?.latePaymentFee ?? 0,
      expiredDate: plan?.expiredDate ?? null,
    }),
    [plan],
  );

  const createWithoutOverlap = (submitValues: IPlan) => {
    createBnplPlanMutation.mutate(
      {plan: submitValues},
      {
        onSuccess: (plan: IPlan) => {
          setIsOpen(false);
          router.navigateByUrl(`bnpl-plan-config/plans/details/${plan.id}`);
        },
      },
    );
  };

  const createPlanOverlap = () => {
    createBnplPlanMutation.mutate(
      {plan: submitValues, approvedOverlap: true},
      {
        onSuccess: (plan: IPlan) => {
          setIsOpen(false);
          router.navigateByUrl(`bnpl-plan-config/plans/details/${plan.id}`);
        },
      },
    );
  };

  const veryfiCreateBnplPlanModal = useVeryfiCreateBnplPlanModal({
    overLappingData,
    submitMethod: createPlanOverlap,
  });

  const getOverlapingMutation = useGetPlanOverlaping();

  const submiHanler = (values: IPlan) => {
    const submitValues = {
      ...values,
      maxAmount: parseFloat(values.maxAmount as unknown as string),
      minAmount: parseFloat(values.minAmount as unknown as string),
      latePaymentFee: parseFloat(values.latePaymentFee as unknown as string),
      instructionQuantities: values.instructionQuantities.map((item: string | number) =>
        parseInt(item as unknown as string),
      ),
    };

    setSubmitValues(submitValues);

    if (values.status === PlanStatus.ACTIVE) {
      getOverlapingMutation.mutate(
        {
          minAmount: Number(values.minAmount),
          maxAmount: Number(values.maxAmount),
          effectiveDate: values.effectiveDate,
          expiredDate: values.expiredDate,
        },
        {
          onSuccess: (res) => {
            if (res.items.length > 0) {
              setOverLappingData(res.items);
              veryfiCreateBnplPlanModal.open();
            } else {
              createWithoutOverlap(submitValues);
            }
          },
        },
      );
    } else {
      createWithoutOverlap(submitValues);
    }
  };

  return {
    open: () => setIsOpen(true),
    component: (
      <Modal
        header="Create new BNPL plan"
        isOpen={isOpen}
        onDismiss={onClose}
        aria-label="Create new plan"
        data-testid="create-new-plan">
        <Formik<IPlan>
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={submiHanler}>
          {({values, errors, touched, handleSubmit, setFieldValue}) => (
            <>
              {veryfiCreateBnplPlanModal.component}
              <ModalBody>
                <FormikTextareaField
                  label="Plan name"
                  layout="horizontal"
                  placeholder="Enter plan name"
                  fieldName="name"
                />

                <FieldContainer label="Status" layout="horizontal" labelAlign="start">
                  <Checkbox
                    wrapperClass="pu-pt-2.5"
                    label={titleCase(PlanStatus.ACTIVE)}
                    key={values.status}
                    checked={values.status === PlanStatus.ACTIVE}
                    onChangeValue={(checked) =>
                      checked
                        ? setFieldValue('status', PlanStatus.ACTIVE)
                        : setFieldValue('status', PlanStatus.INACTIVE)
                    }
                  />
                </FieldContainer>

                <FormikDropdownField
                  aria-label="planType"
                  fieldName="instructionInterval"
                  label="Plan type"
                  options={planTypeOptions}
                  className="w-56"
                  disabled
                />

                <FormikDropdownField
                  aria-label="currencyCode"
                  fieldName="currencyCode"
                  label="Currency"
                  options={currencyOptions}
                  className="w-56"
                  disabled
                />

                <FormikDropdownField
                  aria-label="country"
                  fieldName="country"
                  label="Country"
                  options={countryOptions}
                  className="w-56"
                  disabled
                />

                <FormikMoneyInput
                  fieldName="minAmount"
                  label="Min. amount"
                  data-testid="minAmount"
                  allowDecimalPlaces
                />

                <FormikMoneyInput
                  fieldName="maxAmount"
                  label="Max. amount"
                  data-testid="maxAmount"
                  allowDecimalPlaces
                />

                <FormikDaySelector
                  fieldName="effectiveDate"
                  label="Effective date"
                  placeholder="Select date"
                  minDate={startOfToday()}
                />

                <FormikDaySelector
                  fieldName="expiredDate"
                  label="Expired date"
                  placeholder="Select date"
                  minDate={startOfToday()}
                />

                <FieldContainer
                  label="Interest fee"
                  layout="horizontal-responsive"
                  className="pu-mb-0"
                  labelAlign="start">
                  <div className="relative pu-w-32">
                    <TextField
                      name="interestFee"
                      disabled
                      status={errors.interestFee && touched.interestFee ? 'error' : undefined}
                      helpText={errors.interestFee}
                      value={values.interestFee?.toFixed(2) || '0.00'}
                      onChangeValue={(value) => setFieldValue('interestFee', parseFloat(value))}
                      onBlur={() => setFieldValue('interestFee', values.interestFee)}
                    />
                    <div className="absolute inset-y-0 right-0 px-2 my-1 ml-1 rounded-full flex items-center pointer-events-none pu-text-lightgrey">
                      %
                    </div>
                  </div>
                </FieldContainer>

                <FormikMoneyInput
                  fieldName="latePaymentFee"
                  label="Late payment fee"
                  data-testid="latePaymentFee"
                  allowDecimalPlaces
                  disabled
                />

                <FormikRadioGroup
                  fieldName="planStructure"
                  label="Plan structure"
                  options={planStructureOptionsDetailModal}
                />

                {values.planStructure === PlanStructure.INSTRUCTION && (
                  <FormikMultiSelectField
                    fieldName="instructionQuantities"
                    label="Instruction quantities"
                    options={INSTRUCTION_QUANTITES_OPTIONS}
                  />
                )}
              </ModalBody>
              <ModalFooter className="flex justify-end">
                <Button onClick={onClose} variant="outline" className="mr-2" disabled={isLoading}>
                  CANCEL
                </Button>
                <Button
                  onClick={() => handleSubmit()}
                  variant="primary"
                  isLoading={isLoading}
                  disabled={isLoading}>
                  CREATE PLAN
                </Button>
              </ModalFooter>
            </>
          )}
        </Formik>
      </Modal>
    ),
  };
};
