import {
  DataTable,
  DropdownSelect,
  FieldContainer,
  Fieldset,
  ModalBody,
  Radio,
  RadioGroup,
  titleCase,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  Button,
  DaySelector,
  ModalFooter,
  Field,
  TrashIcon,
  PlusIcon,
  DecimalInput,
  MoneyInput,
  Alert,
} from '@setel/portal-ui';
import * as Yup from 'yup';
import React from 'react';
import {IFeeSettings, TieringDurations, TieringTypes} from 'src/react/services/api-ledger.type';
import {FeeSettingTransactionTypes} from '../../ledger-transactions/ledger-transactions.enums';
import {convertToOptions} from '../fee-settings.const';
import {CardSchemes, FeeTypes, PaymentOptions, TransactionPGVendors} from '../fee-settings.enum';
import {useCreateOrUpdateProcessorFee} from '../fee-settings.queries';
import cx from 'classnames';
import {AxiosError} from 'axios';
import {FormikErrors, useFormik} from 'formik';

const FeeSettingsForm = ({
  onCancel,
  onSuccess,
  existingData,
}: {
  onCancel: () => void;
  onSuccess: () => void;
  existingData?: IFeeSettings;
}) => {
  const initialValues = React.useMemo(
    () => ({
      cardScheme: existingData?.cardScheme || undefined,
      fee: Number(existingData?.fee.toFixed(2)) || Number((0).toFixed(2)),
      feeType: existingData?.feeType || 'FLAT',
      isDeleted: existingData?.isDeleted || false,
      isTiered: existingData?.isTiered || false,
      paymentGatewayVendor: existingData?.paymentGatewayVendor || undefined,
      paymentOption: existingData?.paymentOption || undefined,
      transactionType: existingData?.transactionType || undefined,
      tiering: existingData?.tiering || {
        tieringType: TIERING_TYPES_OPTIONS[0].value,
        duration: TIERING_DURATION_OPTIONS[0].value,
        tiers: [
          {
            lowerLimit: 0,
            upperLimit: 0,
            fee: Number((0).toFixed(2)),
          },
        ],
      },
      validFrom:
        existingData && existingData.validFrom ? new Date(existingData.validFrom) : new Date(),
      validTo: existingData && existingData.validTo ? new Date(existingData.validTo) : undefined,
    }),
    [existingData],
  );

  const {mutate: create, isLoading: isCreating} = useCreateOrUpdateProcessorFee();
  const [serverError, setServerError] = React.useState('');

  const isLoading = isCreating;

  const {values, handleSubmit, setFieldValue, errors} = useFormik({
    initialValues,
    onSubmit: (data) => {
      create(data, {
        onSuccess,
        onError: (err: AxiosError) => {
          setServerError(err.response.data.message);
        },
      });
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: false,
  });

  React.useEffect(() => {
    if (
      !existingData &&
      values.paymentGatewayVendor &&
      FEE_SETTING_VENDOR_OPTIONS[values.paymentGatewayVendor]
    ) {
      setFieldValue(
        'paymentOption',
        FEE_SETTING_VENDOR_OPTIONS[values.paymentGatewayVendor].paymentOptions[0].value,
      );
      setFieldValue(
        'transactionType',
        FEE_SETTING_VENDOR_OPTIONS[values.paymentGatewayVendor].transactionTypes[0].value,
      );
    }
  }, [values.paymentGatewayVendor]);

  React.useEffect(() => {
    if (values.paymentOption === 'FPX' || values.paymentOption === 'BOOST') {
      setFieldValue('cardScheme', undefined);
    }
  }, [values.paymentOption]);

  return (
    <form onSubmit={handleSubmit}>
      <ModalBody className="py-7">
        <Fieldset legend="GENERAL">
          <FieldContainer
            label="Payment processor"
            layout="horizontal-responsive"
            className="mb-4"
            status={errors.paymentGatewayVendor ? 'error' : undefined}
            helpText={errors.paymentGatewayVendor}>
            {existingData ? (
              titleCase(values.paymentGatewayVendor, {hasUnderscore: true})
            ) : (
              <DropdownSelect
                data-testid="payment-gateway-vendor-select"
                value={values.paymentGatewayVendor}
                onChangeValue={(value) => setFieldValue('paymentGatewayVendor', value)}
                options={PAYMENT_PROCESSOR_OPTIONS}
                placeholder="Please select"
                className="w-48"
              />
            )}
          </FieldContainer>
          <FieldContainer
            label="Transaction type"
            layout="horizontal-responsive"
            className="mb-4"
            status={errors.transactionType ? 'error' : undefined}
            helpText={errors.transactionType}>
            {existingData ? (
              titleCase(values.transactionType, {hasUnderscore: true})
            ) : (
              <DropdownSelect
                value={values.transactionType}
                onChangeValue={(value) => setFieldValue('transactionType', value)}
                placeholder="Please select"
                options={
                  FEE_SETTING_VENDOR_OPTIONS[values.paymentGatewayVendor || 'ALL'].transactionTypes
                }
                className="w-48"
              />
            )}
          </FieldContainer>
          <FieldContainer
            label="Payment option"
            layout="horizontal-responsive"
            className="mb-4"
            status={errors.paymentOption ? 'error' : undefined}
            helpText={errors.paymentOption}>
            {existingData ? (
              titleCase(values.paymentOption, {hasUnderscore: true})
            ) : (
              <DropdownSelect
                data-testid="payment-options-select"
                value={values.paymentOption}
                onChangeValue={(value) => setFieldValue('paymentOption', value)}
                placeholder="Please select"
                options={
                  FEE_SETTING_VENDOR_OPTIONS[values.paymentGatewayVendor || 'ALL'].paymentOptions
                }
                className="w-48"
              />
            )}
          </FieldContainer>
          <FieldContainer
            label="Card scheme"
            layout="horizontal-responsive"
            className="mb-4"
            status={errors.cardScheme ? 'error' : undefined}
            helpText={errors.cardScheme}>
            {existingData ? (
              titleCase(values.cardScheme, {hasUnderscore: true})
            ) : (
              <DropdownSelect
                data-testid="card-scheme-select"
                value={values.cardScheme}
                onChangeValue={(value) => setFieldValue('cardScheme', value)}
                disabled={
                  values.paymentOption === 'FPX' ||
                  !FEE_SETTING_VENDOR_OPTIONS[values.paymentGatewayVendor]?.cardScheme
                }
                options={CARD_SCHEME_OPTIONS}
                placeholder="Please select"
                className="w-48"
              />
            )}
          </FieldContainer>
        </Fieldset>
        <div className="border border-b border-gray-200 mb-3 mt-2" />
        <Fieldset legend="FEE SETTINGS">
          <FieldContainer
            label="Fee method"
            layout="horizontal-responsive"
            labelAlign="start"
            className="mb-1.5"
            status={errors.isTiered ? 'error' : undefined}
            helpText={errors.isTiered}>
            <RadioGroup
              value={values.isTiered as any}
              onChangeValue={(value) => setFieldValue('isTiered', value)}
              name="isTiered">
              <Radio value={false as any}>Fixed</Radio>
              <Radio value={true as any}>Tiered by volume</Radio>
            </RadioGroup>
          </FieldContainer>
          <FieldContainer
            label="Fee type"
            layout="horizontal-responsive"
            labelAlign="start"
            className="mb-4"
            status={errors.feeType ? 'error' : undefined}
            helpText={errors.feeType}>
            <RadioGroup
              value={values.feeType}
              onChangeValue={(value) => setFieldValue('feeType', value)}
              name="feeType">
              {Object.values(FeeTypes).map((val) => (
                <Radio key={val} value={val} data-testid={`fee-type-radio`}>
                  {titleCase(val)}
                </Radio>
              ))}
            </RadioGroup>
          </FieldContainer>
          {!values.isTiered ? (
            <FieldContainer
              label="Fee amount"
              layout="horizontal-responsive"
              className="mb-4"
              status={errors.fee ? 'error' : undefined}
              helpText={errors.fee}>
              <Field className="max-w-xs w-32">
                <div className="relative">
                  <div
                    className={cx(
                      'absolute inset-y-0 px-2 my-1 ml-1 rounded-full bg-white flex items-center pointer-events-none text-mediumgrey',
                      values.feeType === FeeTypes.FLAT ? 'left-0' : 'right-0',
                    )}>
                    {values.feeType === FeeTypes.FLAT ? 'RM' : '%'}
                  </div>
                  <MoneyInput
                    id="feeAmountInput"
                    value={values.fee?.toFixed(2) || '0.00'}
                    onChangeValue={(val) => setFieldValue('fee', DecimalInput.getNumberValue(val))}
                  />
                </div>
              </Field>
            </FieldContainer>
          ) : (
            <>
              <FieldContainer
                label="Tier duration"
                layout="horizontal-responsive"
                className="mb-4"
                status={errors.tiering?.duration ? 'error' : undefined}
                helpText={errors.tiering?.duration}>
                <DropdownSelect
                  className="mb-3 w-48"
                  value={values.tiering.duration}
                  onChangeValue={(value) => setFieldValue('tiering.duration', value)}
                  options={TIERING_DURATION_OPTIONS}
                />
              </FieldContainer>
              <FieldContainer layout="horizontal-responsive">
                <div className="max-w-2xl">
                  <DataTable native>
                    <DataTableRowGroup groupType="thead">
                      <Tr>
                        <Td>Tier</Td>
                        <Td className="text-right tracking-1">
                          Fee ({values.feeType === FeeTypes.FLAT ? 'RM' : '%'})
                        </Td>
                        <Td className="text-right tracking-1">Min. volume</Td>
                        <Td className="text-right tracking-1">Max. volume</Td>
                        <Td></Td>
                      </Tr>
                    </DataTableRowGroup>
                    <DataTableRowGroup>
                      {values.tiering.tiers.map((tier, i) => (
                        <Tr key={`tiering-tiers-${i + 1}`}>
                          <Td>{i + 1}</Td>
                          <Td>
                            <FieldContainer
                              status={
                                (
                                  errors.tiering?.tiers[i] as FormikErrors<{
                                    lowerLimit: number;
                                    upperLimit: number;
                                    fee: number;
                                  }>
                                )?.fee
                                  ? 'error'
                                  : undefined
                              }
                              helpText={
                                (
                                  errors.tiering?.tiers[i] as FormikErrors<{
                                    lowerLimit: number;
                                    upperLimit: number;
                                    fee: number;
                                  }>
                                )?.fee
                              }
                              layout="horizontal-responsive">
                              <DecimalInput
                                value={values.tiering.tiers[i].fee?.toFixed(2) || '0.00'}
                                allowTrailingZero
                                decimalPlaces={2}
                                onChangeValue={(val) =>
                                  setFieldValue(`tiering.tiers[${i}]`, {
                                    ...tier,
                                    fee: DecimalInput.getNumberValue(val),
                                  })
                                }
                                className="text-right"
                              />
                            </FieldContainer>
                          </Td>
                          <Td>
                            <FieldContainer
                              status={
                                (
                                  errors.tiering?.tiers[i] as FormikErrors<{
                                    lowerLimit: number;
                                    upperLimit: number;
                                    fee: number;
                                  }>
                                )?.lowerLimit
                                  ? 'error'
                                  : undefined
                              }
                              helpText={
                                (
                                  errors.tiering?.tiers[i] as FormikErrors<{
                                    lowerLimit: number;
                                    upperLimit: number;
                                    fee: number;
                                  }>
                                )?.lowerLimit
                              }
                              layout="horizontal-responsive">
                              <DecimalInput
                                value={values.tiering.tiers[i].lowerLimit.toString()}
                                onChangeValue={(val) =>
                                  setFieldValue(`tiering.tiers[${i}]`, {
                                    ...tier,
                                    lowerLimit: val,
                                  })
                                }
                                className="text-right"
                              />
                            </FieldContainer>
                          </Td>
                          <Td>
                            <FieldContainer
                              status={
                                (
                                  errors.tiering?.tiers[i] as FormikErrors<{
                                    lowerLimit: number;
                                    upperLimit: number;
                                    fee: number;
                                  }>
                                )?.upperLimit
                                  ? 'error'
                                  : undefined
                              }
                              helpText={
                                (
                                  errors.tiering?.tiers[i] as FormikErrors<{
                                    lowerLimit: number;
                                    upperLimit: number;
                                    fee: number;
                                  }>
                                )?.upperLimit
                              }
                              layout="horizontal-responsive">
                              <DecimalInput
                                value={values.tiering.tiers[i].upperLimit.toString()}
                                onChangeValue={(val) =>
                                  setFieldValue(`tiering.tiers[${i}]`, {
                                    ...tier,
                                    upperLimit: val,
                                  })
                                }
                                className="text-right"
                              />
                            </FieldContainer>
                          </Td>
                          <Td>
                            {i !== 0 && (
                              <TrashIcon
                                className="w-5 h-5 text-red-500 cursor-pointer inline-block"
                                onClick={() =>
                                  setFieldValue(
                                    'tiering.tiers',
                                    values.tiering.tiers.filter((_v, ind) => i !== ind),
                                  )
                                }
                              />
                            )}
                          </Td>
                        </Tr>
                      ))}
                      <Tr>
                        <Td colSpan={5}>
                          <p
                            className="flex items-center text text-brand-500 cursor-pointer"
                            onClick={() =>
                              setFieldValue('tiering.tiers', [
                                ...values.tiering.tiers,
                                {fee: 0, lowerLimit: 0, upperLimit: 0},
                              ])
                            }>
                            <PlusIcon className="inline-block mr-1 w-4 h-4" />{' '}
                            <span className="tracking-1 font-semibold text-xs">ADD NEW TIER</span>
                          </p>
                        </Td>
                      </Tr>
                    </DataTableRowGroup>
                  </DataTable>
                </div>
              </FieldContainer>
            </>
          )}
        </Fieldset>
        <div className="border border-b border-gray-200 mb-6 mt-2" />
        <Fieldset legend="VALIDITY">
          <FieldContainer
            label="Valid from"
            layout="horizontal-responsive"
            className="mb-4"
            helpText={errors?.validFrom}
            status={errors?.validFrom ? 'error' : 'success'}>
            <DaySelector
              disabled
              value={values.validFrom}
              onChangeValue={(val) => setFieldValue('validFrom', val)}
              placeholder="Select date"
              className="w-48 text-lightgrey"
            />
          </FieldContainer>
          <FieldContainer
            label="Valid to"
            layout="horizontal-responsive"
            className="mb-0"
            helpText={errors?.validTo}
            status={errors?.validTo ? 'error' : 'success'}>
            <DaySelector
              value={values.validTo}
              onChangeValue={(val) => setFieldValue('validTo', val)}
              placeholder="Select date"
              className="w-48"
              minDate={new Date()}
            />
          </FieldContainer>
        </Fieldset>
        {serverError && <Alert className="my-4" variant="error" description={serverError}></Alert>}
      </ModalBody>
      <ModalFooter className="text-right space-x-2">
        <Button onClick={onCancel} variant="outline">
          CANCEL
        </Button>
        <Button isLoading={isLoading} type="submit" variant="primary">
          {existingData ? 'SAVE CHANGES' : 'SAVE'}
        </Button>
      </ModalFooter>
    </form>
  );
};

export default FeeSettingsForm;

const TIERING_TYPES_OPTIONS = Object.keys(TieringTypes).map((key) => ({
  label: titleCase(TieringTypes[key], {hasUnderscore: true}),
  value: TieringTypes[key],
}));

const TIERING_DURATION_OPTIONS = Object.keys(TieringDurations).map((key) => ({
  label: titleCase(TieringDurations[key], {hasUnderscore: true}),
  value: TieringDurations[key],
}));

const CARD_SCHEME_OPTIONS = convertToOptions(CardSchemes, {hideOptionAll: true});

const PAYMENT_PROCESSOR_OPTIONS = convertToOptions(TransactionPGVendors, {hideOptionAll: true});

const FEE_SETTING_VENDOR_OPTIONS = {
  ALL: {
    transactionTypes: convertToOptions(FeeSettingTransactionTypes, {hideOptionAll: true}),
    paymentOptions: convertToOptions(PaymentOptions, {hideOptionAll: true}),
  },
  [TransactionPGVendors.IPAY88 as string]: {
    transactionTypes: convertToOptions(
      {
        TOPUP: 'TOPUP',
        TOPUP_REFUND: 'TOPUP_REFUND',
        PASSTHROUGH_FUEL: 'PASSTHROUGH_FUEL',
        PASSTHROUGH_FUEL_REFUND: 'PASSTHROUGH_FUEL_REFUND',
        PASSTHROUGH_STORE: 'PASSTHROUGH_STORE',
        PASSTHROUGH_STORE_REFUND: 'PASSTHROUGH_STORE_REFUND',
      },
      {hideOptionAll: true},
    ),
    paymentOptions: convertToOptions(
      {
        FPX: 'FPX',
        CREDIT_CARD: 'CREDIT_CARD',
        DEBIT_CARD: 'DEBIT_CARD',
      },
      {hideOptionAll: true},
    ),
    cardScheme: true,
  },
  [TransactionPGVendors.BOOST as string]: {
    transactionTypes: convertToOptions(
      {
        CHARGE_BOOST: 'CHARGE_BOOST',
        REFUND_BOOST: 'REFUND_BOOST',
        TOPUP_BOOST: 'TOPUP_BOOST',
        TOPUP_REFUND_BOOST: 'TOPUP_REFUND_BOOST',
      },
      {hideOptionAll: true},
    ),
    paymentOptions: convertToOptions(
      {
        BOOST: 'BOOST',
      },
      {hideOptionAll: true},
    ),
    cardScheme: false,
  },
  [TransactionPGVendors.TNG as string]: {
    transactionTypes: convertToOptions(
      {
        CHARGE_TNG: 'CHARGE_TNG',
        REFUND_TNG: 'REFUND_TNG',
      },
      {hideOptionAll: true},
    ),
    paymentOptions: convertToOptions(
      {
        TNG: 'TNG',
      },
      {hideOptionAll: true},
    ),
    cardScheme: false,
  },
};

const validationSchema = Yup.object({
  cardScheme: Yup.string().when('paymentOption', {
    is: PaymentOptions.CREDIT_CARD || PaymentOptions.DEBIT_CARD,
    then: Yup.string().required('Card scheme is required'),
  }),
  fee: Yup.number().when('isTiered', {
    is: false,
    then: Yup.number().required('Fee amount is required'),
  }),
  feeType: Yup.string().required('Fee type is required'),
  isTiered: Yup.boolean().required(),
  paymentGatewayVendor: Yup.string().required('Payment processor is required'),
  paymentOption: Yup.string().required('Payment option is required'),
  transactionType: Yup.string().required('Transaction type is required'),
  tiering: Yup.object().when('isTiered', {
    is: true,
    then: Yup.object({
      tieringType: Yup.string().required(),
      duration: Yup.string().required(),
      tiers: Yup.array()
        .of(
          Yup.object().shape(
            {
              lowerLimit: Yup.number().when(
                ['upperLimit'],
                (upperLimit: number, schema: Yup.NumberSchema) => {
                  return schema.lessThan(upperLimit, 'Value must be lower than upper limit value');
                },
              ),
              upperLimit: Yup.number().when(
                ['lowerLimit'],
                (lowerLimit: number, schema: Yup.NumberSchema) => {
                  return schema.moreThan(lowerLimit, 'Value must be higher than lower limit value');
                },
              ),
              fee: Yup.number().required(),
            },
            [['lowerLimit', 'upperLimit']],
          ),
        )
        .test('compareAllLimits', 'Limits are not correct', function (list) {
          const isValid = list.map((_, i) => {
            if (list[i - 1]?.upperLimit > list[i].lowerLimit) {
              return false;
            }
            return true;
          });

          const idx = isValid.findIndex((d) => !d);

          if (idx < 0) {
            return true;
          }

          return this.createError({
            path: `tiering.tiers[${idx}].lowerLimit`,
            message: 'Value is lower than previous max volume',
          });
        }),
    }),
  }),
  validFrom: Yup.date().required(),
  validTo: Yup.date().notRequired(),
});
