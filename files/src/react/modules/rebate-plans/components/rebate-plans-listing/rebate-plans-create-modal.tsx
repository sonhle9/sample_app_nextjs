import * as React from 'react';
import {
  Alert,
  Button,
  DataTable as Table,
  DecimalInput,
  FieldContainer,
  Modal,
  MultiInputWithSuggestions,
  PaginationNavigation,
  PlusIcon,
  Radio,
  RadioGroup,
  Stepper,
  TextareaField,
  TextField,
  TextInput,
  TrashIcon,
  usePaginationState,
} from '@setel/portal-ui';
import {useRouter} from 'src/react/routing/routing.context';
import {useNotification} from 'src/react/hooks/use-notification';
import {useCreateRebatePlan, useLoyaltyCategoryCodes} from '../../rebate-plans.queries';
import {FormikErrors, useFormik} from 'formik';
import * as Yup from 'yup';
import {
  ALL_CATEGORIES,
  BilledValueNumber,
  fieldRequiredMessageError,
  MaximumGreaterThanMinimum,
  MaximumValueNumber,
  RebatePlansNotificationMessages,
} from '../../rebate-plans.constant';
import {buildServerError, fillMinimumValueOfTiers} from '../../rebate-plans.helper';
import {ITierBase, rebatePlanTypes} from '../../../../services/api-rebates.type';

export const RebatePlansCreateModal = ({setShowModal}: {setShowModal: Function}) => {
  const showMessage = useNotification();
  const {page, setPage, perPage, setPerPage} = usePaginationState();
  const [step, setStep] = React.useState(0);
  const [options, setOptions] = React.useState([]);
  const [searchString, setSearchString] = React.useState('');
  const {mutateAsync: createRebatePlan, isLoading, isError, error} = useCreateRebatePlan();
  const router = useRouter();
  const {data: loyaltyCategoryCodes} = useLoyaltyCategoryCodes(searchString);
  const serverErrorMessage: any = buildServerError(error);
  const generalSchema = Yup.object({
    planName: Yup.string().max(100).required(fieldRequiredMessageError),
    type: Yup.string().max(40),
    isAllLoyaltyCategoryIds: Yup.boolean(),
    loyaltyCategoryIds: Yup.array().when(['type', 'isAllLoyaltyCategoryIds'], {
      is: (type, isAllLoyaltyCategoryIds) => type && !isAllLoyaltyCategoryIds,
      then: Yup.array().required(fieldRequiredMessageError),
    }),
  });

  const tierSchema = Yup.object({
    tiers: Yup.array(
      Yup.object({
        minimumValue: Yup.number().required(fieldRequiredMessageError),
        maximumValue: Yup.number()
          .max(MaximumValueNumber)
          .min(0.001)
          .moreThan(Yup.ref('minimumValue'), MaximumGreaterThanMinimum)
          .required(fieldRequiredMessageError),
        basicValue: Yup.number()
          .max(BilledValueNumber)
          .min(0.001, 'Must be greater than 0.000')
          .required(fieldRequiredMessageError),
        billedValue: Yup.number().max(BilledValueNumber).min(0).required(fieldRequiredMessageError),
      }),
    ),
  });
  const validationSchema = React.useMemo(() => {
    return step === 0 ? generalSchema : tierSchema;
  }, [step]);
  const isDoneGeneral = React.useMemo(() => {
    return step === 1;
  }, [step]);

  const {values, errors, setFieldValue, touched, handleSubmit} = useFormik({
    initialValues: {
      planName: '',
      type: rebatePlanTypes.VOLUME,
      loyaltyCategoryIds: [],
      tiers: [
        {
          maximumValue: '',
          minimumValue: '0.000',
          basicValue: '1.000',
          billedValue: '1.000',
        },
      ],
      remarks: '',
      isAllLoyaltyCategoryIds: false,
    },
    validationSchema,
    validateOnMount: false,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values, actions) => {
      if (isDoneGeneral) {
        const rebatePlanCreated = await createRebatePlan(values);
        showMessage({
          title: RebatePlansNotificationMessages.successTitle,
          description: RebatePlansNotificationMessages.createdRebatePlan,
        });
        router.navigateByUrl(`pricing/rebate-plans/${rebatePlanCreated.planId}`);
      } else {
        setStep((state) => state + 1);
        actions.setTouched({});
        actions.setErrors({});
        actions.setSubmitting(false);
      }
    },
  });

  React.useEffect(() => {
    if (loyaltyCategoryCodes) {
      setOptions([
        ALL_CATEGORIES,
        ...loyaltyCategoryCodes.items
          .filter((category) => !values.loyaltyCategoryIds.includes(category.categoryName))
          .map((category) => category.categoryName),
      ]);
    } else {
      setOptions([]);
    }
  }, [loyaltyCategoryCodes]);

  return (
    <Modal
      header="Create new plan"
      isOpen={true}
      onDismiss={() => setShowModal(false)}
      aria-label="Create new plan"
      data-testid="create-new-plan"
      className={'w-full'}>
      {isError && <Alert variant="error" description={serverErrorMessage?.message} />}
      <Modal.Body className={'px-0'}>
        <Stepper activeIndex={step} onChange={setStep} className="mx-6 -mt-4">
          <Stepper.Step
            label="General"
            status={
              isDoneGeneral
                ? serverErrorMessage?.message
                  ? 'error'
                  : 'done'
                : (errors?.planName && touched?.planName) ||
                  (errors?.loyaltyCategoryIds && touched?.loyaltyCategoryIds)
                ? 'error'
                : null
            }
          />
          <Stepper.Step
            label="Tier"
            status={errors?.tiers || serverErrorMessage?.message ? 'error' : null}
            disabled={!isDoneGeneral}
          />
        </Stepper>
        {step === 0 && (
          <div className={'mx-8'}>
            <TextField
              label="Plan name"
              status={touched?.planName && errors?.planName ? 'error' : undefined}
              helpText={touched?.planName && errors?.planName}
              value={values.planName}
              onChangeValue={(value) => setFieldValue('planName', value)}
              layout="horizontal-responsive"
              maxLength={100}
              placeholder="Enter plan name"
              className="w-9/12"
            />
            <FieldContainer
              label={'Rebate plan type'}
              status={touched?.type && errors?.type ? 'error' : undefined}
              helpText={touched?.type && errors?.type}
              layout="horizontal-responsive">
              <RadioGroup
                value={values.type}
                onChangeValue={(value) => setFieldValue('type', value)}
                name="rebatePlanType">
                <Radio value="Volume">Volume</Radio>
                <Radio value="Amount">Amount</Radio>
              </RadioGroup>
            </FieldContainer>
            <FieldContainer
              label={'Loyalty category'}
              status={
                touched?.loyaltyCategoryIds && errors?.loyaltyCategoryIds ? 'error' : undefined
              }
              helpText={touched?.loyaltyCategoryIds && errors?.loyaltyCategoryIds}
              layout="horizontal-responsive">
              {!values.isAllLoyaltyCategoryIds && (
                <MultiInputWithSuggestions
                  values={values.loyaltyCategoryIds}
                  onChangeValues={(value) => {
                    if (value[value.length - 1] === ALL_CATEGORIES) {
                      setFieldValue('isAllLoyaltyCategoryIds', true);
                      setFieldValue('loyaltyCategoryIds', []);
                      return;
                    }
                    setFieldValue('loyaltyCategoryIds', value);
                    setOptions([
                      ALL_CATEGORIES,
                      ...loyaltyCategoryCodes.items
                        .filter((option) => !value.includes(option.categoryName))
                        .map((category) => category.categoryName),
                    ]);
                  }}
                  suggestions={options}
                  autoComplete="off"
                  onInputValueChange={setSearchString}
                  className="w-9/12 max-h-44 portal-ui-scrollbar"
                />
              )}
              {values.isAllLoyaltyCategoryIds && (
                <TextInput
                  value={ALL_CATEGORIES}
                  onChangeValue={() => {
                    setFieldValue('loyaltyCategoryIds', []);
                    setFieldValue('isAllLoyaltyCategoryIds', false);
                    setOptions([
                      ALL_CATEGORIES,
                      ...loyaltyCategoryCodes.items.map((category) => category.categoryName),
                    ]);
                  }}
                  className="w-9/12"
                />
              )}
            </FieldContainer>
            <TextareaField
              label="Remarks (Optional)"
              layout="horizontal-responsive"
              status={touched?.remarks && errors?.remarks ? 'error' : undefined}
              helpText={touched?.remarks && errors?.remarks}
              onChangeValue={(value) => setFieldValue('remarks', value)}
              className="w-11/12"
              maxLength={100}
            />
          </div>
        )}
        {step === 1 && (
          <div>
            <Table
              pagination={
                <PaginationNavigation
                  total={values.tiers.length}
                  currentPage={page}
                  perPage={perPage}
                  onChangePage={setPage}
                  onChangePageSize={setPerPage}
                />
              }>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="w-1/12 pl-8">TIER</Table.Th>
                  <Table.Th className="w-1/5 text-right">{`MIN. VALUE ${
                    values.type === rebatePlanTypes.VOLUME ? '(L)' : '(RM)'
                  }`}</Table.Th>
                  <Table.Th className="w-1/5 text-right">{`MAX. VALUE ${
                    values.type === rebatePlanTypes.VOLUME ? '(L)' : '(RM)'
                  }`}</Table.Th>
                  <Table.Th className="w-1/5 text-right">{`BASIC VALUE ${
                    values.type === rebatePlanTypes.VOLUME ? '(L)' : '(RM)'
                  }`}</Table.Th>
                  <Table.Th className="w-1/5 text-right">BILLED VALUE (RM)</Table.Th>
                  <Table.Th className="w-1/12 text-right" />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {values.tiers.map((tier: ITierBase, index) => (
                  <Table.Tr key={index}>
                    <Table.Td className="pl-8">{index + 1}</Table.Td>
                    <Table.Td>
                      <FieldContainer
                        status={
                          errors?.tiers &&
                          errors?.tiers.length > index &&
                          (errors?.tiers[index] as FormikErrors<ITierBase>)?.minimumValue
                            ? 'error'
                            : undefined
                        }
                        helpText={
                          errors?.tiers &&
                          errors?.tiers.length > index &&
                          (errors?.tiers[index] as FormikErrors<ITierBase>)?.minimumValue
                        }>
                        <DecimalInput
                          disabled={true}
                          className="pu-w-full m-0 pu-text-right"
                          value={tier.minimumValue}
                          allowTrailingZero
                          decimalPlaces={3}
                        />
                      </FieldContainer>
                    </Table.Td>
                    <Table.Td>
                      <FieldContainer
                        status={
                          errors?.tiers &&
                          errors?.tiers.length > index &&
                          (errors?.tiers[index] as FormikErrors<ITierBase>)?.maximumValue
                            ? 'error'
                            : undefined
                        }
                        helpText={
                          errors?.tiers &&
                          errors?.tiers.length > index &&
                          (errors?.tiers[index] as FormikErrors<ITierBase>)?.maximumValue
                        }>
                        <DecimalInput
                          className="pu-w-full m-0 pu-text-right"
                          value={tier.maximumValue}
                          decimalPlaces={3}
                          placeholder={'E.g 100.000'}
                          allowTrailingZero
                          max={MaximumValueNumber}
                          min={0.001}
                          onChangeValue={(value) => {
                            values.tiers[index].maximumValue = value;
                            setFieldValue('tiers', fillMinimumValueOfTiers(values.tiers));
                          }}
                        />
                      </FieldContainer>
                    </Table.Td>
                    <Table.Td>
                      <FieldContainer
                        status={
                          errors?.tiers &&
                          errors?.tiers.length > index &&
                          (errors?.tiers[index] as FormikErrors<ITierBase>)?.basicValue
                            ? 'error'
                            : undefined
                        }
                        helpText={
                          errors?.tiers &&
                          errors?.tiers.length > index &&
                          (errors?.tiers[index] as FormikErrors<ITierBase>)?.basicValue
                        }>
                        <DecimalInput
                          className="pu-w-full m-0 pu-text-right"
                          value={tier.basicValue}
                          decimalPlaces={3}
                          allowTrailingZero
                          max={BilledValueNumber}
                          min={1}
                          onChangeValue={(value) => {
                            values.tiers[index].basicValue = value;
                            setFieldValue('tiers', values.tiers);
                          }}
                        />
                      </FieldContainer>
                    </Table.Td>
                    <Table.Td>
                      <FieldContainer
                        status={
                          errors?.tiers &&
                          errors?.tiers.length > index &&
                          (errors?.tiers[index] as FormikErrors<ITierBase>)?.billedValue
                            ? 'error'
                            : undefined
                        }
                        helpText={
                          errors?.tiers &&
                          errors?.tiers.length > index &&
                          (errors?.tiers[index] as FormikErrors<ITierBase>)?.billedValue
                        }>
                        <DecimalInput
                          className="pu-w-full m-0 pu-text-right"
                          value={tier.billedValue}
                          decimalPlaces={3}
                          allowTrailingZero
                          max={BilledValueNumber}
                          min={0}
                          onChangeValue={(value) => {
                            values.tiers[index].billedValue = value;
                            setFieldValue('tiers', values.tiers);
                          }}
                        />
                      </FieldContainer>
                    </Table.Td>
                    <Table.Td>
                      {index === values.tiers.length - 1 && index !== 0 && (
                        <TrashIcon
                          onClick={() => {
                            values.tiers.splice(index, 1);
                            setFieldValue('tiers', values.tiers);
                          }}
                          className="pu-mt-2 w-5 h-5 text-red-500 cursor-pointer"
                        />
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
            <p
              className={`ml-8 flex items-center text w-40 mt-3 text-brand-500 cursor-pointer`}
              onClick={() =>
                setFieldValue('tiers', [
                  ...values.tiers,
                  {
                    maximumValue: '',
                    minimumValue: values.tiers[values.tiers.length - 1].maximumValue
                      ? +values.tiers[values.tiers.length - 1].maximumValue + 0.001 + ''
                      : '',
                    basicValue: '1.000',
                    billedValue: '1.000',
                  },
                ])
              }>
              <PlusIcon className="inline-block mr-1 w-4 h-4" />{' '}
              <span className="tracking-1 font-semibold text-xs">ADD NEW TIER</span>
            </p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button
          className="mr-2"
          onClick={() => (step === 0 ? setShowModal(false) : setStep((s) => s - 1))}
          variant="outline">
          {step === 0 ? 'CANCEL' : 'PREVIOUS'}
        </Button>
        <Button onClick={() => handleSubmit()} variant="primary" isLoading={isLoading}>
          {step === 1 ? 'SAVE' : 'NEXT'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
