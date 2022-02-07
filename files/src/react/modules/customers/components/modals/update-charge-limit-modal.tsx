import {Button, Dialog, Modal, Fieldset} from '@setel/portal-ui';
import * as React from 'react';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {isEmpty, pickBy} from 'lodash';

import {FormikMoneyInput, FormikDecimalInput} from 'src/react/components/formik';
import {useNotification} from 'src/react/hooks/use-notification';

import {getMessageFromApiError} from 'src/shared/helpers/errorHandling';

import {
  ICustomerLimitation,
  ICustomerLimitationType,
  IPeriodCustomerAccumulation,
} from 'src/app/api-blacklist-service';

import {useUpdateUserLimitation} from '../../customers.queries';

export interface IUpdateChargeLimitModalProps {
  onDismiss: () => void;
  data: Record<'daily' | 'monthly' | 'annually', IPeriodCustomerAccumulation>;
  customerId: string;
}

export const UpdateChargeLimitModal = ({
  onDismiss,
  data,
  customerId,
}: IUpdateChargeLimitModalProps) => {
  const [isShowConfirmForm, toggleConfirmationForm] = React.useState(false);

  const cancelRef = React.useRef();
  const {mutate: updateCustomerLimitation} = useUpdateUserLimitation();
  const notify = useNotification();

  const closeConfirmForm = () => toggleConfirmationForm(false);

  const handleUpdateCustomerLimitation = (formData: typeof initialValues) => {
    const updateDataArr: ICustomerLimitation[] = [];
    const dailyData = pickBy(formData.daily, (value, key) => initialValues.daily[key] !== value);
    if (!isEmpty(dailyData)) {
      updateDataArr.push({...dailyData, type: ICustomerLimitationType.DAILY, userId: customerId});
    }
    if (formData.monthly.chargeLimit !== initialValues.monthly.chargeLimit) {
      updateDataArr.push({
        ...formData.monthly,
        type: ICustomerLimitationType.MONTHLY,
        userId: customerId,
      });
    }
    if (formData.annually.chargeLimit !== initialValues.annually.chargeLimit) {
      updateDataArr.push({
        ...formData.annually,
        type: ICustomerLimitationType.ANNUALLY,
        userId: customerId,
      });
    }

    updateCustomerLimitation(
      {userId: customerId, input: updateDataArr},
      {
        onSuccess: () => {
          notify({
            title: 'Successful!',
            variant: 'success',
            description: 'Customer fraud profile was updated successfully.',
          });
          onDismiss();
        },
        onError: (error: any) => {
          notify({
            title: 'Error!',
            variant: 'error',
            description: getMessageFromApiError(error),
          });
        },
        onSettled: closeConfirmForm,
      },
    );
  };

  const validationSchema = Yup.object({
    daily: Yup.object({
      chargeLimit: Yup.number()
        .required('This field is required.')
        .min(0, 'Cannot be smaller than 0'),
      numberTransactionLimit: Yup.number()
        .required('This field is required.')
        .min(0, 'Cannot be smaller than 0'),
      maxTransactionAmount: Yup.number()
        .required('This field is required.')
        .min(0, 'Cannot be smaller than 0'),
    }),
    monthly: Yup.object({
      chargeLimit: Yup.number()
        .required('This field is required.')
        .min(0, 'Cannot be smaller than 0'),
    }),
    annually: Yup.object({
      chargeLimit: Yup.number()
        .required('This field is required.')
        .min(0, 'Cannot be smaller than 0'),
    }),
  });
  const initialValues = {
    daily: {
      chargeLimit: data.daily.chargeLimit,
      maxTransactionAmount: data.daily.maxTransactionAmount,
      numberTransactionLimit: data.daily.numberTransactionLimit,
    },
    monthly: {
      chargeLimit: data.monthly.chargeLimit,
    },
    annually: {
      chargeLimit: data.annually.chargeLimit,
    },
    dailyChargeAccumulation: data.daily.chargeAccumulation,
    monthlyChargeAccumulation: data.monthly.chargeAccumulation,
    annuallyChargeAccumulation: data.annually.chargeAccumulation,
    numberTransactionAccumulation: data.daily.numberTransactionAccumulation,
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleUpdateCustomerLimitation}
        validateOnChange={false}
        validateOnMount={false}>
        {(formikProps) => (
          <Modal
            header="Edit charge limit"
            isOpen
            data-testid="customer-update-charge-limit-modal"
            onDismiss={onDismiss}>
            <Modal.Body>
              <Fieldset
                legend={<div className="mt-5">DAILY LIMIT</div>}
                className="-mt-4 sm:col-span-2">
                <FormikMoneyInput
                  fieldName="daily.chargeLimit"
                  label="Daily charge limit"
                  wrapperClass="mt-5 pl-14"
                  data-testid="dailyChargeLimitInput"
                />
                <FormikMoneyInput
                  fieldName="dailyChargeAccumulation"
                  label="Daily amount accumulation"
                  data-testid="dailyChargeAccumulationInput"
                  wrapperClass="pl-14"
                  disabled
                />
              </Fieldset>
              <hr className="col-span-4" />
              <Fieldset
                legend={<div className="mt-5">MONTHLY LIMIT</div>}
                className="sm:col-span-2">
                <FormikMoneyInput
                  fieldName="monthly.chargeLimit"
                  label="Monthly charge limit"
                  wrapperClass="mt-5 pl-14"
                  data-testid="monthlyChargeLimitInput"
                />
                <FormikMoneyInput
                  fieldName="monthlyChargeAccumulation"
                  label="Monthly amount accumulation"
                  data-testid="monthlyChargeAccumulationInput"
                  wrapperClass="pl-14"
                  disabled
                />
              </Fieldset>
              <hr className="col-span-4" />
              <Fieldset legend={<div className="mt-5">ANNUAL LIMIT</div>} className="sm:col-span-2">
                <FormikMoneyInput
                  fieldName="annually.chargeLimit"
                  label="Annual charge limit"
                  wrapperClass="mt-5 pl-14"
                  data-testid="annuallyChargeLimitInput"
                />
                <FormikMoneyInput
                  fieldName="annuallyChargeAccumulation"
                  label="Annual amount accumulation"
                  data-testid="annuallyChargeAccumulationInput"
                  wrapperClass="pl-14"
                  disabled
                />
              </Fieldset>
              <hr className="col-span-4" />
              <Fieldset
                legend={<div className="mt-5">TRANSACTION COUNT LIMIT</div>}
                className="sm:col-span-2">
                <FormikDecimalInput
                  fieldName="daily.numberTransactionLimit"
                  label="Max transaction count per day"
                  wrapperClass="mt-5 pl-14"
                  className="pu-w-32 text-left"
                  data-testid="numberTransactionLimitInput"
                />
                <FormikDecimalInput
                  fieldName="numberTransactionAccumulation"
                  label="Daily accumulation"
                  data-testid="numberTransactionAccumulationInput"
                  wrapperClass="pl-14 text-left"
                  className="pu-w-32"
                  disabled
                />
              </Fieldset>
              <hr className="col-span-4" />
              <Fieldset
                legend={<div className="mt-3">TRANSACTION AMOUNT LIMIT</div>}
                className="sm:col-span-2">
                <FormikMoneyInput
                  fieldName="daily.maxTransactionAmount"
                  label="Max payment transaction amount"
                  wrapperClass="mt-5 pl-14"
                  data-testid="maxTransactionAmountInput"
                />
              </Fieldset>
            </Modal.Body>
            <Modal.Footer className="text-right">
              <Button
                variant="outline"
                className="mr-2"
                onClick={onDismiss}
                data-testid="update-charge-limit-cancel-btn">
                CANCEL
              </Button>
              <Button
                variant="primary"
                data-testid="submit-btn"
                onClick={() => toggleConfirmationForm(true)}>
                SAVE CHANGES
              </Button>
            </Modal.Footer>
            {isShowConfirmForm && (
              <Dialog onDismiss={closeConfirmForm} leastDestructiveRef={cancelRef}>
                <Dialog.Content header="Are you sure want to change the limits?">
                  By making this change, please be aware that the user may be affected
                </Dialog.Content>
                <Dialog.Footer>
                  <form onSubmit={formikProps.handleSubmit}>
                    <Button variant="outline" onClick={closeConfirmForm} ref={cancelRef}>
                      CANCEL
                    </Button>
                    <Button variant="primary" type="submit" className="ml-3">
                      CONFIRM
                    </Button>
                  </form>
                </Dialog.Footer>
              </Dialog>
            )}
          </Modal>
        )}
      </Formik>
    </>
  );
};
