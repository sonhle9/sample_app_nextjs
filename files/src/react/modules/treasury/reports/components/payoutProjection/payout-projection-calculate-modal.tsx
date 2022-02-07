import {
  Button,
  DecimalInput,
  DescItem,
  DescList,
  FieldContainer,
  formatMoney,
  HelpText,
  InfoIcon,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Skeleton,
  TextField,
  Tooltip,
} from '@setel/portal-ui';
import {useFormik} from 'formik';
import React from 'react';
import * as Yup from 'yup';
import cx from 'classnames';

import {usePayoutMax} from '../../treasury-reports.queries';
import {calculateProjectedAmount} from 'src/react/services/api-processor.service';

export const payoutProjectionSchema = Yup.object({
  bufferDays: Yup.number().integer('Must be an integer').required('This field is required'),
  discretionaryBuffer: Yup.string().nullable().required('This field is required'),
});

export interface IPayoutProjectionCalculateModalProps {
  onClose?: () => void;
  consecutiveOffDays: number;
}

export const PayoutProjectionCalculateModal = (props: IPayoutProjectionCalculateModalProps) => {
  const {data: payoutMax, isLoading} = usePayoutMax();

  const getProjectedAmount = () => {
    const projectedAmount = calculateProjectedAmount(
      payoutMax.totalAmount,
      props.consecutiveOffDays,
      values.bufferDays ?? 0,
      values.discretionaryBuffer,
    );
    return formatMoney(projectedAmount, 'RM');
  };

  const {values, errors, touched, handleBlur, setFieldValue} = useFormik({
    initialValues: {
      bufferDays: 2,
      discretionaryBuffer: null,
    },
    validationSchema: payoutProjectionSchema,
    onSubmit: () => {},
  });

  const changeBufferDays = (value) => {
    setFieldValue('bufferDays', value);
  };

  const changeDiscretionaryBuffer = (value) => {
    setFieldValue('discretionaryBuffer', value);
  };

  return (
    <>
      <Modal
        isOpen={true}
        onDismiss={props.onClose}
        aria-label={'Calculate Projection'}
        size="small">
        <ModalHeader>Calculate Projection</ModalHeader>
        <ModalBody className="space-y-4">
          <FieldContainer className="mb-5 pb-5 border-b">
            <div className="flex relative justify-between items-center">
              <Label>Buffer Days *</Label>
              <TextField
                status={touched.bufferDays && errors.bufferDays ? 'error' : null}
                name="bufferDays"
                onBlur={handleBlur}
                type="number"
                value={values.bufferDays}
                helpText={errors.bufferDays}
                onChangeValue={changeBufferDays}
                className="w-32 text-right"
              />
            </div>
            <div className="flex relative justify-between items-center">
              <Label>Discretionary Buffer (%)</Label>
              <div className="relative">
                <DecimalInput
                  name="discretionaryBuffer"
                  allowTrailingZero
                  onBlur={handleBlur}
                  value={values.discretionaryBuffer ?? ''}
                  onChangeValue={(value) => changeDiscretionaryBuffer(value)}
                  className={cx(
                    'w-32 text-left pr-8',
                    touched.discretionaryBuffer && errors.discretionaryBuffer
                      ? 'border-error-500'
                      : '',
                  )}
                />
                <div className="absolute top-2 right-0 text-mediumgrey inline-flex items-center pr-3">
                  %
                </div>
                {touched.discretionaryBuffer && errors.discretionaryBuffer && (
                  <HelpText className="text-error-500">{errors.discretionaryBuffer}</HelpText>
                )}
              </div>
            </div>
          </FieldContainer>
          <DescList className="grid-cols-2">
            <DescItem
              labelClassName="sm:text-black"
              valueClassName="text-right font-medium"
              label="Payout amount baseline"
              value={isLoading ? <Skeleton /> : formatMoney(payoutMax.totalAmount, 'RM')}
            />
            <DescItem
              labelClassName="sm:text-black"
              valueClassName="text-right font-medium"
              label="Total consecutive holidays/weekends"
              value={isLoading ? <Skeleton /> : props.consecutiveOffDays}
            />
            <DescItem
              labelClassName="sm:text-black text-base font-medium"
              valueClassName="text-right text-base font-medium"
              label={
                <div className="flex items-center">
                  <span className="mr-1">Projected Amount</span>
                  <Tooltip
                    label={
                      <>
                        <p className="text-xs">
                          (Total consecutive holidays/weekends + 1 + buffer days)
                        </p>
                        <p className="text-xs">x historical highest payout + % buffer</p>
                      </>
                    }>
                    <InfoIcon className="w-5 h-5 fill-current text-gray-400" />
                  </Tooltip>
                </div>
              }
              value={isLoading ? <Skeleton /> : getProjectedAmount()}
            />
          </DescList>
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-end lg:py-2">
            <Button variant="primary" onClick={props.onClose}>
              DONE
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};
