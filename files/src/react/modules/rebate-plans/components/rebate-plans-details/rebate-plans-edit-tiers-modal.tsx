import * as React from 'react';
import {
  Button,
  Modal,
  FieldContainer,
  PaginationNavigation,
  usePaginationState,
  DataTable as Table,
  PlusIcon,
  DecimalInput,
  TrashIcon,
  DialogContent,
  DialogFooter,
  Dialog,
  Alert,
} from '@setel/portal-ui';
import {useNotification} from 'src/react/hooks/use-notification';
import {useEditTierRebatePlan} from '../../rebate-plans.queries';
import {FormikErrors, useFormik} from 'formik';
import * as Yup from 'yup';
import {
  BilledValueNumber,
  fieldRequiredMessageError,
  MaximumGreaterThanMinimum,
  MaximumValueNumber,
  RebatePlansNotificationMessages,
} from '../../rebate-plans.constant';
import {buildServerError, fillMinimumValueOfTiers} from '../../rebate-plans.helper';
import {IRebatePlan, ITierBase, rebatePlanTypes} from '../../../../services/api-rebates.type';

export const RebatePlansModalTierEdit = ({
  setShowModal,
  rebatePlanDetail,
}: {
  setShowModal: Function;
  rebatePlanDetail: IRebatePlan;
}) => {
  const showMessage = useNotification();
  const cancelRef = React.useRef(null);
  const {page, setPage, perPage, setPerPage} = usePaginationState();
  const {mutateAsync: editRebatePlanTier, isLoading, isError, error} = useEditTierRebatePlan();
  const serverErrorMessage: any = buildServerError(error);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = React.useState(false);
  const [deleteIndex, setDeleteIndex] = React.useState(-1);

  const tierSchema = Yup.object({
    tiers: Yup.array(
      Yup.object({
        minimumValue: Yup.number(),
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

  const {values, errors, setFieldValue, handleSubmit} = useFormik({
    initialValues: {
      ...rebatePlanDetail,
      tiers: rebatePlanDetail.tiers.map((tier) => {
        return {
          maximumValue: tier.maximumValue.toString(),
          minimumValue: tier.minimumValue.toString(),
          basicValue: tier.basicValue.toString(),
          billedValue: tier.billedValue.toString(),
        };
      }),
    },
    validationSchema: tierSchema,
    validateOnChange: false,
    validateOnMount: false,
    onSubmit: async (values) => {
      await editRebatePlanTier({body: values, planId: rebatePlanDetail.planId});
      setShowModal(false);
      showMessage({
        title: RebatePlansNotificationMessages.successTitle,
        description: RebatePlansNotificationMessages.updatedRebatePlan,
      });
    },
  });

  return (
    <Modal
      header="Edit details"
      isOpen={true}
      onDismiss={() => setShowModal(false)}
      data-testid="Edit details tiers"
      className={'w-full'}>
      {isError && <Alert variant="error" description={serverErrorMessage?.message} />}
      <Modal.Body className={'px-0 py-0'}>
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
                    }
                    className={'pu-mb-0'}>
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
                    }
                    className={'pu-mb-0'}>
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
                        setFieldValue('tiers', values.tiers);
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
                    }
                    className={'pu-mb-0'}>
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
                    }
                    className={'pu-mb-0'}>
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
                        setDeleteIndex(index);
                        setOpenDeleteConfirmation(true);
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
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button className="mr-2" onClick={() => setShowModal(false)} variant="outline">
          {'CANCEL'}
        </Button>
        <Button onClick={() => handleSubmit()} variant="primary" isLoading={isLoading}>
          {'SAVE CHANGES'}
        </Button>
      </Modal.Footer>
      {openDeleteConfirmation && (
        <Dialog
          className={'mt-48'}
          onDismiss={() => setOpenDeleteConfirmation(false)}
          leastDestructiveRef={cancelRef}>
          <DialogContent header="Are you sure to delete this tier?">
            This item will be deleted permanently. You can't undo this action.
          </DialogContent>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDeleteConfirmation(false)}
              ref={cancelRef}>
              CANCEL
            </Button>
            <Button
              variant="error"
              onClick={() => {
                values.tiers.splice(deleteIndex, 1);
                setFieldValue('tiers', values.tiers);
                setOpenDeleteConfirmation(false);
              }}>
              DELETE
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </Modal>
  );
};
