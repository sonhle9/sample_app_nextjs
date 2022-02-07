import * as React from 'react';
import {
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MoneyInput,
  DropdownSelect,
  TextInput,
  Modal,
  DecimalInput,
  TextField,
  FieldContainer,
  formatMoney,
} from '@setel/portal-ui';
import {FeePlansPaymentMethod} from '../../fee-plans.type';
import {
  FeePlansPaymentMethodRateTypes,
  RateTypeOptions,
  FeePlanTypes,
  mappingPaymentMethodBrands,
  mappingPaymentMethodTypes,
  mappingPaymentMethodFamilies,
  FeePlansNotificationMessages,
  ceilingNumber,
  ceilingPercentage,
} from '../../fee-plans.constant';
import {useFormik} from 'formik';
import {useEditFeePlansPaymentMethod} from '../../fee-plans.queries';
import {OptionalTitle} from 'src/react/components/title-input';
import {positiveMessage, requiredText} from 'src/shared/helpers/input-error-message-helper';
import {useNotification} from 'src/react/hooks/use-notification';
import {isEmpty, isNull} from 'lodash';
import {removeCommasInBigNumber} from '../../fee-plans.helper';

export const FeePlansPaymentMethodModalEdit = ({
  feePlanId,
  paymentMethod,
  feePlanType,
  merchantId,
  setShowModal,
}: {
  feePlanId: string;
  paymentMethod: FeePlansPaymentMethod;
  feePlanType: FeePlanTypes;
  merchantId?: string;
  setShowModal: Function;
}) => {
  const showMessage = useNotification();
  const {mutateAsync: editFeePlansPaymentMethod, isLoading: isLoading} =
    useEditFeePlansPaymentMethod();

  const [errors, setErrors] = React.useState<FormErrors>({});

  const onSubmit = async () => {
    if (!isEmpty(errors)) {
      return null;
    }

    const data = {
      feePlanType,
      merchantId,
      feePlanId,
      paymentMethodId: paymentMethod.id,
      body: {
        rateType: values.rateType,
        rate: isEmpty(values.rate)
          ? ''
          : DecimalInput.getNumberValue(removeCommasInBigNumber(values.rate)),
        minimum: isEmpty(values.minimum)
          ? ''
          : DecimalInput.getNumberValue(removeCommasInBigNumber(values.minimum)),
        maximum: isEmpty(values.maximum)
          ? ''
          : DecimalInput.getNumberValue(removeCommasInBigNumber(values.maximum)),
      },
    };

    await editFeePlansPaymentMethod(data);

    showMessage({
      title: FeePlansNotificationMessages.successTitle,
      description: FeePlansNotificationMessages.updatedFeePlanPaymentMethod,
    });
    setShowModal(false);
  };

  const {values, touched, setFieldValue, handleSubmit, resetForm} = useFormik({
    initialValues: {
      family: paymentMethod.family,
      paymentMethodType: paymentMethod.type,
      brand: paymentMethod.brand,
      rateType: paymentMethod.rateType,
      rate: isNull(paymentMethod.rate) ? '' : formatMoney(paymentMethod.rate),
      minimum: isNull(paymentMethod.minimum) ? '' : formatMoney(paymentMethod.minimum),
      maximum: isNull(paymentMethod.maximum) ? '' : formatMoney(paymentMethod.maximum),
    },
    onSubmit,
  });

  React.useEffect(() => {
    setErrors(getErrors(values));
  }, [values]);

  const isPercentageRateType = values.rateType === FeePlansPaymentMethodRateTypes.PERCENTAGE;
  const isFlatRateType = values.rateType === FeePlansPaymentMethodRateTypes.FLAT_RATE;
  const isNoneRateType = values.rateType === FeePlansPaymentMethodRateTypes.NONE;

  return (
    <>
      <Modal
        isOpen={true}
        onDismiss={() => setShowModal(false)}
        aria-label="Edit fee"
        data-testid="edit-fee">
        <ModalHeader>Edit fee</ModalHeader>
        <ModalBody>
          <TextField
            label="Family"
            value={mappingPaymentMethodFamilies[values.family]}
            layout="horizontal-responsive"
            disabled={true}
            className="w-full sm:w-64"
          />
          <TextField
            label="Payment method"
            value={mappingPaymentMethodTypes[values.paymentMethodType]}
            layout="horizontal-responsive"
            disabled={true}
            className="w-full sm:w-64"
          />
          <TextField
            label="Brand"
            value={mappingPaymentMethodBrands[values.brand]}
            layout="horizontal-responsive"
            disabled={true}
            className="w-full sm:w-64"
          />
          <FieldContainer label="Rate type" layout="horizontal-responsive">
            <DropdownSelect
              placeholder="Please select"
              value={values.rateType}
              onChangeValue={(value) => {
                resetForm({
                  values: {...values, rate: '', minimum: '', maximum: ''},
                });
                setFieldValue('rateType', value);
              }}
              options={RateTypeOptions}
              className="w-full sm:w-64"
            />
          </FieldContainer>
          <FieldContainer
            label="Rate"
            status={touched.rate && errors?.rate ? 'error' : undefined}
            helpText={touched.rate && errors?.rate}
            layout="horizontal-responsive">
            {isPercentageRateType && (
              <div className="relative w-full sm:w-48">
                <DecimalInput
                  max={ceilingPercentage}
                  allowTrailingZero
                  decimalPlaces={2}
                  className="text-left"
                  value={values.rate}
                  onChangeValue={(value) => setFieldValue('rate', value)}
                />
                <div className="absolute inset-y-0 right-0 text-mediumgrey inline-flex items-center pr-3">
                  %
                </div>
              </div>
            )}
            {isFlatRateType && (
              <MoneyInput
                max={ceilingNumber}
                allowTrailingZero
                className="w-full sm:w-48"
                decimalPlaces={2}
                value={values.rate}
                onChangeValue={(value) => setFieldValue('rate', value)}
              />
            )}
            {isNoneRateType && <TextInput value="-" className="w-full sm:w-48" disabled={true} />}
          </FieldContainer>
          <FieldContainer
            label={OptionalTitle('Min. amount')}
            status={touched.minimum && errors?.minimum ? 'error' : undefined}
            helpText={touched.minimum && errors?.minimum}
            layout="horizontal-responsive">
            {isPercentageRateType && (
              <MoneyInput
                max={ceilingNumber}
                allowTrailingZero
                className="w-full sm:w-48"
                decimalPlaces={2}
                value={values.minimum}
                onChangeValue={(value) => setFieldValue('minimum', value)}
              />
            )}
            {(isNoneRateType || isFlatRateType) && (
              <TextInput value="-" disabled={true} className="w-full sm:w-48" />
            )}
          </FieldContainer>
          <FieldContainer
            label={OptionalTitle('Max. amount')}
            status={touched.maximum && errors?.maximum ? 'error' : undefined}
            helpText={touched.maximum && errors?.maximum}
            layout="horizontal-responsive">
            {isPercentageRateType && (
              <MoneyInput
                max={ceilingNumber}
                allowTrailingZero
                className="w-full sm:w-48"
                decimalPlaces={2}
                value={values.maximum}
                onChangeValue={(value) => setFieldValue('maximum', value)}
              />
            )}
            {(isNoneRateType || isFlatRateType) && (
              <TextInput value="-" disabled={true} className="w-full sm:w-48" />
            )}
          </FieldContainer>
        </ModalBody>
        <ModalFooter className="flex justify-between">
          <div className="flex-grow text-right">
            <Button onClick={() => setShowModal(false)} variant="outline" className="mr-2">
              CANCEL
            </Button>
            <Button isLoading={isLoading} onClick={() => handleSubmit()} variant="primary">
              SAVE CHANGES
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

interface FormValues {
  family: string;
  brand: string;
  rateType: string;
  rate: string;
  minimum: string;
  maximum: string;
}

interface FormErrors {
  rate?: string;
  minimum?: string;
  maximum?: string;
}

function getErrors(values: FormValues) {
  return {
    ...getRateErrors(values),
    ...getMinMaxAmountErrors(values),
  };
}

function getRateErrors(values: FormValues) {
  const {rate, rateType} = values;

  if (rateType === FeePlansPaymentMethodRateTypes.NONE) {
    return {};
  }

  if (isEmpty(rate)) {
    return {rate: requiredText('rate')};
  }

  if (DecimalInput.getNumberValue(rate) === 0) {
    return {rate: positiveMessage('Rate')};
  }
}

function getMinMaxAmountErrors(values: FormValues) {
  const {minimum, maximum, rateType} = values;

  if (isEmpty(minimum) && isEmpty(maximum)) {
    return {};
  }

  if (DecimalInput.getNumberValue(minimum) === 0 || DecimalInput.getNumberValue(maximum) === 0) {
    let errorsMinMax = {};

    if (DecimalInput.getNumberValue(minimum) === 0) {
      errorsMinMax = {...errorsMinMax, minimum: positiveMessage('Minimum')};
    }

    if (DecimalInput.getNumberValue(maximum) === 0) {
      errorsMinMax = {...errorsMinMax, maximum: positiveMessage('Maximum')};
    }

    return errorsMinMax;
  }

  if (
    rateType === FeePlansPaymentMethodRateTypes.PERCENTAGE &&
    DecimalInput.getNumberValue(removeCommasInBigNumber(minimum)) >=
      DecimalInput.getNumberValue(removeCommasInBigNumber(maximum))
  ) {
    return {maximum: 'Max. amount must be greater than Min. amount'};
  }
}
