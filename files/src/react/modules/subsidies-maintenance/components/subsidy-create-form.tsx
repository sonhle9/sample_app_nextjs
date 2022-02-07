import {
  ceilingNumber,
  confirmationDescriptionCostRecoveryRate,
  confirmationDescriptionPrice,
  fieldClasses,
  fieldRequiredMessage,
  labelClasses,
  SubsidyActionType,
  SubsidyCostRecoveryRateModel,
  SubsidyCostRecoveryRateModelOptions,
  SubsidyPriceModel,
  SubsidyPricingModelOptions,
  TITLE_SUCCESSFUL,
} from '../subsidy-maintenance.types';
import {
  useCreateSubsidyCostRecoveryRate,
  useCreateSubsidyPrice,
} from '../subsidy-maintenance.queries';
import * as React from 'react';
import {
  Modal,
  ModalBody,
  ModalHeader,
  Field,
  Label,
  Text,
  HelpText,
  MoneyInput,
  ModalFooter,
  DropdownSelect,
  DaySelector,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogProps,
} from '@setel/portal-ui';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {QueryErrorAlert} from '../../../components/query-error-alert';
import {useNotification} from '../../../hooks/use-notification';
import {AxiosError} from 'axios';

type SubsidyMaintenanceFormProps = {
  type: SubsidyActionType;
  currentTime: Date;
  onClose(): void;
};

export const SubsidyCreateForm = ({type, currentTime, onClose}: SubsidyMaintenanceFormProps) => {
  const {
    mutateAsync: createSubsidyPrice,
    isLoading: isCreatingPrice,
    error: createErrorPrice,
  } = useCreateSubsidyPrice();
  const {
    mutateAsync: createSubsidyCostRecoveryRate,
    isLoading: isCreatingCost,
    error: createErrorCost,
  } = useCreateSubsidyCostRecoveryRate();
  const isLoading = isCreatingPrice || isCreatingCost;
  const serverError = createErrorPrice || createErrorCost;
  const serverErrorMessage = buildServerError(serverError);
  const showMsg = useNotification();
  const onSubmit = () => {
    setCreateOpen(true);
  };

  const typeModelOption =
    type === SubsidyActionType.subsidy_price
      ? SubsidyPricingModelOptions
      : SubsidyCostRecoveryRateModelOptions;

  const SubsidyPriceSchema = Yup.object({
    type: Yup.mixed<SubsidyPriceModel>()
      .oneOf(Object.values(SubsidyPriceModel))
      .required(fieldRequiredMessage),
    amount: Yup.number().required(fieldRequiredMessage),
    startDate: Yup.date().required(fieldRequiredMessage),
  });

  const SubsidyCostRecoveryRateSchema = Yup.object({
    type: Yup.mixed<SubsidyCostRecoveryRateModel>()
      .oneOf(Object.values(SubsidyCostRecoveryRateModel))
      .required(fieldRequiredMessage),
    amount: Yup.number().required(fieldRequiredMessage),
    startDate: Yup.date().required(fieldRequiredMessage),
  });

  const {values, errors, touched, setFieldValue, handleSubmit} = useFormik({
    initialValues: {
      type: '',
      amount: '',
      startDate: '',
    },
    validationSchema:
      type === SubsidyActionType.subsidy_price ? SubsidyPriceSchema : SubsidyCostRecoveryRateSchema,
    onSubmit,
  });

  const [isCreateOpen, setCreateOpen] = React.useState(false);
  return (
    <>
      <Modal
        isOpen
        onDismiss={onClose}
        aria-label="Create Subsidy Maintenance"
        data-testid="add-custom-field-modal">
        <ModalHeader>Create new {type}</ModalHeader>
        <ModalBody>
          <Field
            className={fieldClasses}
            status={errors.type && touched.type ? 'error' : undefined}>
            <Label className={labelClasses}>
              {type === SubsidyActionType.subsidy_price ? (
                <Text color="lightgrey">Subsidy area</Text>
              ) : (
                <div>
                  <Text color="lightgrey">Cost recovery rate</Text>
                  <Text color="lightgrey">type</Text>
                </div>
              )}
            </Label>
            <div className="sm:col-span-1">
              <DropdownSelect
                className="w-48"
                name={'pricingModel'}
                value={values.type}
                onChangeValue={(value) => {
                  setFieldValue('type', value);
                }}
                options={typeModelOption}
                placeholder={'Please select'}
              />
              {touched.type && errors.type && <HelpText>{errors.type}</HelpText>}
            </div>
          </Field>
          <Field
            className={fieldClasses}
            status={errors.amount && touched.amount ? 'error' : undefined}>
            <Label className={labelClasses}>
              <Text color="lightgrey">
                {type === SubsidyActionType.subsidy_price ? 'Subsidy price' : 'Cost recovery rate'}
              </Text>
            </Label>
            <div>
              <MoneyInput
                className="w-48"
                value={values?.amount}
                decimalPlaces={4}
                max={ceilingNumber}
                onChangeValue={(value) => setFieldValue('amount', value)}
                placeholder="0.0000"
              />
              {touched.amount && errors.amount && <HelpText>{errors.amount}</HelpText>}
            </div>
          </Field>
          <Field
            className={fieldClasses}
            status={
              (errors.startDate && touched.startDate) || serverErrorMessage.startDate
                ? 'error'
                : undefined
            }>
            <Label className={labelClasses}>
              <Text color="lightgrey">Start date</Text>
            </Label>
            <div className="sm:col-span-3">
              <DaySelector
                name="startDate"
                value={values?.startDate ? new Date(values.startDate) : null}
                onChangeValue={(value) => setFieldValue('startDate', value)}
                emptyValue="Select date"
                className="w-48"
                minDate={new Date(currentTime)}
                onBlur={() => setFieldValue('startDate', values.startDate)}
                data-testid="subsidy-start-date"
              />
              {((errors.startDate && touched.startDate) || serverErrorMessage.startDate) && (
                <HelpText>{errors.startDate || serverErrorMessage.startDate}</HelpText>
              )}
            </div>
          </Field>
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-end">
            <div className="flex-grow text-right">
              <Button variant="outline" type="button" disabled={isLoading} onClick={onClose}>
                CANCEL
              </Button>
              <Button
                variant="primary"
                className="ml-3"
                minWidth="none"
                isLoading={isLoading}
                onClick={() => {
                  handleSubmit();
                }}>
                SAVE
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
      {isCreateOpen && (
        <CreateConfirmation
          featureName={type}
          description={
            type === SubsidyActionType.subsidy_price
              ? confirmationDescriptionPrice
              : confirmationDescriptionCostRecoveryRate
          }
          isOpen={isCreateOpen}
          isCreating={isLoading}
          onConfirm={async () => {
            setCreateOpen(false);
            let reqBody: any = {
              startDate: values.startDate,
            };
            if (type === SubsidyActionType.subsidy_price) {
              reqBody.area = values.type;
              reqBody.price = Number(values.amount);
              await createSubsidyPrice(reqBody);
            }
            if (type === SubsidyActionType.cost_recovery_rate) {
              reqBody.rate = Number(values.amount);
              reqBody.type = values.type;
              await createSubsidyCostRecoveryRate(reqBody);
            }
            showMsg({
              title: TITLE_SUCCESSFUL,
              description: `You have successfully created a ${type}.`,
            });
            onClose();
          }}
          onDismiss={() => setCreateOpen(false)}
          className="mt-32"
        />
      )}
    </>
  );
};

export type CreateConfirmationProps = {
  featureName: string;
  isOpen: boolean;
  isCreating?: boolean;
  error?: AxiosError<unknown> | {message: string} | null;
  onConfirm: () => void;
  onDismiss: () => void;
  description?: React.ReactNode;
} & Omit<DialogProps, 'children' | 'leastDestructiveRef'>;

export const CreateConfirmation = ({
  featureName,
  isOpen,
  isCreating,
  error,
  onConfirm,
  onDismiss,
  description,
  ...dialogProps
}: CreateConfirmationProps) => {
  const cancelBtnRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Dialog
      {...dialogProps}
      isOpen={isOpen}
      leastDestructiveRef={cancelBtnRef}
      onDismiss={onDismiss}>
      <DialogContent header={`Are you sure you want to create new ${featureName}?`}>
        {error && <QueryErrorAlert error={error} />}
        {description ||
          'This action cannot be undone and you will not be able to recover any data.'}
      </DialogContent>
      <DialogFooter>
        <Button onClick={onDismiss} variant="outline" ref={cancelBtnRef}>
          CANCEL
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isCreating}
          variant="primary"
          data-testid="confirm-Create-btn">
          {isCreating ? 'CREATING...' : 'CONFIRM'}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

function buildServerError(serverError?: any) {
  const errors: any = {};
  if (serverError?.response?.status === 400) {
    errors[serverError?.response?.data.field] = serverError?.response?.data.message;
  }
  return errors;
}
