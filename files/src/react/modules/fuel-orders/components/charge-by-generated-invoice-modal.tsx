import {
  Button,
  FieldContainer,
  Modal,
  ModalBody,
  ModalFooter,
  MoneyInput,
  TextInput,
} from '@setel/portal-ui';
import * as Yup from 'yup';
import {Formik} from 'formik';
import React from 'react';
import {FormikDropdownField, FormikMoneyInput} from '../../../components/formik';
import {useCurrentFuelPrice, useGetFuelPriceByDate} from '../../fuel/fuel-price.queries';
import {useManualChargeByGeneratedInvoice} from '../fuel-orders.queries';

interface ChargeByGeneratedInvoiceModalProps {
  onDismiss: (boolean) => void;
  orderId: string;
  isOpen: boolean;
  orderCreatedAt: Date;
}

function computeCompletedVolume(amount, pricePerUnit) {
  if (!amount || !pricePerUnit) {
    return '';
  }
  return (((parseFloat(amount) / parseFloat(pricePerUnit)) * 100) / 100).toFixed(3);
}

const validationSchema = Yup.object({
  amount: Yup.number().required('This field is required.'),
  fuelType: Yup.string().required('This field is required.'),
});

export function ChargeByGeneratedInvoiceModal({
  isOpen,
  onDismiss: setShowChargeByGeneratedInvoiceModal,
  orderCreatedAt,
  orderId,
}: ChargeByGeneratedInvoiceModalProps) {
  const {
    mutateAsync: manualChargeByGeneratedInvoice,
    isLoading: isProcessingManualChargeByGeneratedInvoice,
  } = useManualChargeByGeneratedInvoice();

  const {data: currentFuelPriceData} = useCurrentFuelPrice();
  const {data: pastFuelPriceData} = useGetFuelPriceByDate(orderCreatedAt);

  return (
    <Modal
      size="standard"
      header="Generate invoice and charge"
      isOpen={isOpen}
      onDismiss={setShowChargeByGeneratedInvoiceModal}>
      <Formik
        initialValues={{amount: '', fuelType: '', pricePerUnit: '', completedVolume: ''}}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          manualChargeByGeneratedInvoice(
            {
              orderId,
              amount: Number(values.amount),
              fuelType: values.fuelType,
              pricePerUnit: Number(values.pricePerUnit),
              completedVolume: Number(computeCompletedVolume(values.amount, values.pricePerUnit)),
            },
            {
              onSettled: () => setShowChargeByGeneratedInvoiceModal(false),
            },
          );
        }}>
        {(formikBag) => (
          <form onSubmit={formikBag.handleSubmit}>
            <ModalBody>
              <FormikMoneyInput
                fieldName="amount"
                label="Completed amount"
                data-testid="completedAmountInput"
                allowDecimalPlaces
              />
              <FormikDropdownField
                label="Fuel type"
                fieldName="fuelType"
                options={
                  currentFuelPriceData?.prices
                    ? currentFuelPriceData.prices.map(({fuelType, shortName}) => ({
                        value: fuelType,
                        label: shortName,
                      }))
                    : []
                }
                data-testid="fuelTypeInput"
                className="w-60"
                onChangeValue={(fuelType) => {
                  const {currentPrice} = pastFuelPriceData?.prices?.find(
                    (price) => price.fuelType === fuelType,
                  );
                  formikBag.setFieldValue('pricePerUnit', currentPrice);
                }}
              />
              <FieldContainer label="Price per litre" layout="horizontal-responsive">
                <MoneyInput
                  disabled
                  value={
                    formikBag.values.pricePerUnit &&
                    ((parseFloat(formikBag.values.pricePerUnit) * 100) / 100).toFixed(2)
                  }
                  name="pricePerUnit"
                  data-testid="pricePerUnitInput"
                />
              </FieldContainer>
              <FieldContainer label="Completed volume" layout="horizontal-responsive">
                <div className="flex items-center">
                  <TextInput
                    className="w-32"
                    disabled
                    value={computeCompletedVolume(
                      formikBag.values.amount,
                      formikBag.values.pricePerUnit,
                    )}
                    name="completedVolume"
                    data-testid="completedVolumeInput"
                  />
                  <span className="-m-8 text-mediumgrey text-sm">L</span>
                </div>
              </FieldContainer>
            </ModalBody>
            <ModalFooter className="text-right">
              <Button
                onClick={setShowChargeByGeneratedInvoiceModal}
                variant="outline"
                className="mr-3"
                disabled={isProcessingManualChargeByGeneratedInvoice}>
                CANCEL
              </Button>
              <Button
                variant="primary"
                type="submit"
                isLoading={isProcessingManualChargeByGeneratedInvoice}
                disabled={isProcessingManualChargeByGeneratedInvoice}>
                SUBMIT
              </Button>
            </ModalFooter>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
