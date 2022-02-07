import * as React from 'react';
import {
  Button,
  Checkbox,
  DaySelector,
  FieldContainer,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  SearchInput,
  Text,
  TextareaField,
  TextInput,
  useDebounce,
} from '@setel/portal-ui';
import {useFormik} from 'formik';
import {useNotification} from '@setel/portal-ui';
import {CreateConfirmation} from '../../subsidies-maintenance/components/subsidy-create-form';
import {
  confirmationDescription,
  createRebateSettingTitle,
  fieldRequiredMessageError,
  levelOptions,
  RebateSettingNotificationMessages,
} from '../rebate-settings.constant';
import {useMalaysiaTime} from '../rebate-setting.helper';
import {useCreateRebateSetting, useSearchAccountOrCompany} from '../rebate-setting.queries';
import * as Yup from 'yup';
import {isAfter, startOfDay} from 'date-fns';

export const RebateSettingCreateModal = ({
  setShowModal,
  planId,
}: {
  setShowModal: Function;
  planId: number;
}) => {
  const {
    mutateAsync: createRebateSetting,
    isLoading: isCreating,
    error: serverError,
  } = useCreateRebateSetting();
  const showMessage = useNotification();
  const [isCreateOpen, setCreateOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [latestDate, setLatestDate] = React.useState(undefined);
  const [accountOrCompanySelected, setAccountOrCompanySelected] = React.useState('');
  const search = useDebounce(searchValue);
  const serverErrorMessage: any = buildServerError(serverError);

  const validationSchema = Yup.object({
    level: Yup.string().required(fieldRequiredMessageError),
    spId: Yup.string().required(fieldRequiredMessageError),
    startDate: Yup.date().required(fieldRequiredMessageError),
    endDateEnable: Yup.boolean(),
    endDate: Yup.date().when('endDateEnable', {
      is: true,
      then: Yup.date().required(fieldRequiredMessageError),
    }),
    remarks: Yup.string().max(100),
  });

  const {values, touched, errors, setFieldValue, handleSubmit} = useFormik({
    initialValues: {
      level: undefined,
      spId: undefined,
      remarks: undefined,
      startDate: undefined,
      endDate: undefined,
      endDateEnable: false,
    },
    validationSchema,
    validateOnMount: false,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: () => {
      setCreateOpen(true);
    },
  });

  const {data} = useSearchAccountOrCompany({
    searchSPAccountsCompanies: search,
    level: values.level,
  });

  return (
    <>
      <Modal
        isOpen
        onDismiss={() => setShowModal(false)}
        aria-label="Create rebate setting"
        data-testid="add-custom-field-modal">
        <div aria-label="Create rebate setting form">
          <ModalHeader>{createRebateSettingTitle}</ModalHeader>
          <ModalBody>
            <FieldContainer
              label={'Type'}
              status={touched?.level && errors?.level ? 'error' : undefined}
              helpText={touched?.level && errors?.level}
              layout="horizontal-responsive">
              <div className="sm:col-span-3">
                <RadioGroup
                  value={values.level}
                  onChangeValue={(value) => {
                    setFieldValue('level', value);
                    setFieldValue('spId', undefined);
                    setFieldValue('startDate', undefined);
                    setFieldValue('endDate', undefined);
                  }}
                  name="rebateSettingLevel">
                  {levelOptions.map((level) => (
                    <Radio key={level.value} value={level.value}>
                      {level.label}
                    </Radio>
                  ))}
                </RadioGroup>
              </div>
            </FieldContainer>
            <FieldContainer
              label={'Account/Company'}
              status={values.level && touched?.spId && errors?.spId ? 'error' : undefined}
              helpText={values.level && touched?.spId && errors?.spId}
              layout="horizontal-responsive">
              {!values.spId ? (
                <SearchInput
                  onInputValueChange={setSearchValue}
                  data-testid="merchant-filter"
                  placeholder={'Enter account/company name or ID'}
                  disabled={!values.level}
                  onSelect={(value) => {
                    setAccountOrCompanySelected(value.name);
                    setFieldValue('spId', value.id);
                    setFieldValue('startDate', undefined);
                    setFieldValue('endDate', undefined);
                    setLatestDate(new Date(value.latestDate));
                  }}
                  results={
                    search !== searchValue
                      ? undefined
                      : data &&
                        data?.map((accountOrCompany) => ({
                          value: {
                            id: accountOrCompany.id,
                            name: accountOrCompany.name,
                            latestDate: accountOrCompany.latestDate,
                          },
                          label: accountOrCompany.name,
                          description: accountOrCompany.code,
                        }))
                  }
                />
              ) : (
                <TextInput
                  value={accountOrCompanySelected}
                  onChangeValue={() => {
                    setFieldValue('spId', '');
                  }}
                  className="pu-w-full"
                />
              )}
            </FieldContainer>
            <FieldContainer
              layout="horizontal-responsive"
              helpText={serverErrorMessage.endDate || serverErrorMessage.startDate}
              status={
                serverErrorMessage.endDate || serverErrorMessage.startDate ? 'error' : undefined
              }
              label={'Effective date'}>
              <div className="sm:col-span-3">
                <div className="flex flex-row">
                  <FieldContainer
                    className={'pu-mb-0'}
                    helpText={errors.startDate}
                    status={errors.startDate ? 'error' : undefined}>
                    <DaySelector
                      name="startDate"
                      value={values?.startDate ? useMalaysiaTime(values.startDate) : null}
                      showMonthYearDropdown
                      onChangeValue={(value) => {
                        setFieldValue('startDate', value);
                        setFieldValue('endDate', undefined);
                      }}
                      minDate={latestDate}
                      emptyValue="Start date"
                      className="w-48"
                      data-testid="rebate-setting-start-date"
                    />
                  </FieldContainer>
                  <Text color="lightgrey" className={'flex mx-3 mt-2'}>
                    —
                  </Text>
                  <FieldContainer
                    className={'pu-mb-0'}
                    helpText={errors.endDate ? errors.endDate : undefined}
                    status={errors.endDate ? 'error' : undefined}>
                    <DaySelector
                      name="endDate"
                      value={values?.endDate ? useMalaysiaTime(values.endDate) : undefined}
                      showMonthYearDropdown
                      disabled={!values.endDateEnable}
                      minDate={
                        values.startDate && isAfter(values.startDate, latestDate)
                          ? startOfDay(values.startDate)
                          : latestDate
                      }
                      onChangeValue={(value) => setFieldValue('endDate', value)}
                      emptyValue="End date"
                      className="w-48"
                      data-testid="rebate-setting-end-date"
                    />
                  </FieldContainer>
                </div>
                <Checkbox
                  checked={values.endDateEnable}
                  label="Select an End date for this setting."
                  labelClass="text-lightgrey pu-text-sm"
                  onChangeValue={(value) => {
                    setFieldValue('endDateEnable', value);
                    setFieldValue('endDate', undefined);
                  }}
                  data-testid="rebate-setting-enable-end-date"
                />
              </div>
            </FieldContainer>
            <TextareaField
              value={values.remarks}
              maxLength={100}
              label={'Remarks (Optional)'}
              layout="horizontal-responsive"
              name="remarks"
              onChangeValue={(value) => setFieldValue('remarks', value)}
              onBlur={() => setFieldValue('remarks', values.remarks)}
              data-testid="rebate-setting-remarks"
            />
          </ModalBody>
          <ModalFooter className="text-right space-x-2">
            <Button
              variant="outline"
              type="button"
              disabled={isCreating}
              onClick={() => setShowModal(false)}>
              CANCEL
            </Button>
            <Button
              variant="primary"
              className="ml-3"
              isLoading={isCreating}
              onClick={() => {
                handleSubmit();
              }}>
              SAVE
            </Button>
          </ModalFooter>
        </div>
      </Modal>
      {isCreateOpen && (
        <CreateConfirmation
          featureName="rebate setting"
          description={confirmationDescription}
          isOpen={isCreateOpen}
          isCreating={isCreating}
          className={'mt-48'}
          onConfirm={async () => {
            await createRebateSetting({...values, planId});
            showMessage({
              title: RebateSettingNotificationMessages.successTitle,
              description: RebateSettingNotificationMessages.createdRebateSetting,
            });
            setShowModal(false);
            setCreateOpen(false);
          }}
          onDismiss={() => setCreateOpen(false)}
        />
      )}
    </>
  );
};

function buildServerError(serverError?: any) {
  const errors: any = {};
  if (serverError?.response?.status === 400) {
    errors[serverError?.response?.data.field] = serverError?.response?.data.message;
  }
  return errors;
}
