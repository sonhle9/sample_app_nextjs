import {
  Badge,
  Button,
  Card,
  DaySelector,
  DescItem,
  DescList,
  DropdownSelect,
  EditIcon,
  FieldContainer,
  Modal,
  SearchableDropdown,
  TextareaField,
  TextField,
  Timeline,
  titleCase,
  useDebounce,
} from '@setel/portal-ui';
import {formatDate} from '@setel/web-utils';
import {useFormik} from 'formik';
import * as React from 'react';
import {QueryErrorAlert} from '../../../../components/query-error-alert';
import {useNotification} from '../../../../hooks/use-notification';
import {changeStatusReasonOptions, COMPANY_TYPE} from '../../merchant.const';
import {
  getMerchantTimelineColor,
  getOptionLabel,
  getSmartpayMerchantStatusBadgeColor,
} from '../../merchants.lib';
import {
  merchantQueryKey,
  useCompanies,
  useSmartpayAccountDetails,
  useUpdateMerchantDetails,
  useUpdateSmartpayAccount,
} from '../../merchants.queries';
import {
  MerchantSmartpayBusinessCategoryOptions,
  MerchantSmartpayCompanyInfo,
  MerchantSmartpayCompanyTypeOptions,
  MerchantSmartpayFleetPlanOption,
  MerchantSmartpayGeneralInfo,
  MerchantSmartpayStatus,
  SmartpayAccountDetails,
  SmartpayMerchantStatusActiveFrozenOptions,
  SmartpayMerchantStatusDormantOptions,
  SmartpayMerchantStatusOverdueOptions,
} from '../../merchants.type';
import {
  SmartpayCompanyValidationSchema,
  SmartpayGeneralValidationSchema,
} from './smartpay-validation-schema';
import {useAuth} from '../../../auth';
import {useQueryClient} from 'react-query';

export const SmartpayAccountDetailsGeneral = (props: {
  merchantId: string;
  applicationId: string;
}) => {
  const {data, error, isLoading} = useSmartpayAccountDetails(props.merchantId);

  const [showEditGeneralModal, setShowEditGeneralModal] = React.useState(false);
  const [showEditCompanyModal, setShowEditCompanyModal] = React.useState(false);

  const showMessage = useNotification();
  const queryClient = useQueryClient();

  const showEditButton = data?.generalInfo.status !== MerchantSmartpayStatus.CLOSED;

  return (
    <>
      {!isLoading && error && <QueryErrorAlert error={error as any} />}
      <Card>
        <Card.Heading title={'General'}>
          {showEditButton && (
            <>
              <Button
                className={'ml-3 pu-min-w-20'}
                leftIcon={<EditIcon />}
                variant={'outline'}
                onClick={() => setShowEditGeneralModal(true)}>
                EDIT
              </Button>
              {data && showEditGeneralModal && (
                <EditGeneralModal
                  data={data}
                  id={props.merchantId}
                  appId={props.applicationId}
                  onDone={() => {
                    queryClient.invalidateQueries([
                      merchantQueryKey.smartpayMerchantDetails,
                      props.merchantId,
                    ]);
                    setShowEditGeneralModal(false);
                    showMessage({
                      title: 'Successful!',
                      description: 'Merchant has been updated.',
                    });
                  }}
                  onDismiss={() => setShowEditGeneralModal(false)}
                />
              )}
            </>
          )}
        </Card.Heading>
        <Card.Content>
          <DescList>
            <DescItem label={'Account ID'} value={data?.merchantId} />
            <DescItem label={'Virtual account'} value={data?.generalInfo.virtualAccountId || '-'} />
            <DescItem
              label={'Status'}
              value={
                data?.generalInfo.status ? (
                  <Badge
                    color={getSmartpayMerchantStatusBadgeColor(data?.generalInfo.status)}
                    className={'uppercase'}>
                    {data.generalInfo.status}
                  </Badge>
                ) : (
                  ''
                )
              }
            />
            {/*<DescList.Item*/}
            {/*  label="Reason"*/}
            {/*  value={getOptionLabel(changeStatusReasonOptions, data?.generalInfo.reason)}*/}
            {/*/>*/}
            {/*<DescList.Item label="Remark" value={data?.generalInfo?.remark || '-'} />*/}
            <DescItem
              label={'Fleet plan'}
              value={getOptionLabel(MerchantSmartpayFleetPlanOption, data?.generalInfo.fleetPlan)}
            />
            <DescItem
              label={'SmartPay company'}
              value={data?.generalInfo.smartpayCompanyName || '-'}
            />
            <DescItem
              label={'Authorised signatory'}
              value={data?.generalInfo.authorisedSignatory || '-'}
            />
            <DescItem label={'Website URL'} value={data?.generalInfo.website || '-'} />
            <DescItem
              label={'Created on'}
              value={data?.createdAt ? formatDate(data.createdAt) : '-'}
            />
          </DescList>
        </Card.Content>
      </Card>
      <Card className={'my-8'}>
        <Card.Heading title={'Company/individual'}>
          {showEditButton && (
            <>
              <Button
                leftIcon={<EditIcon />}
                variant={'outline'}
                className={'pu-min-w-20'}
                onClick={() => setShowEditCompanyModal(true)}>
                EDIT
              </Button>
              {data && showEditCompanyModal && (
                <EditCompanyModal
                  data={data}
                  appId={props.applicationId}
                  onDone={() => {
                    queryClient.invalidateQueries([
                      merchantQueryKey.smartpayMerchantDetails,
                      props.merchantId,
                    ]);
                    setShowEditCompanyModal(false);
                    showMessage({
                      title: 'Successful!',
                      description: 'Merchant has been updated.',
                    });
                  }}
                  onDismiss={() => setShowEditCompanyModal(false)}
                />
              )}
            </>
          )}
        </Card.Heading>
        <Card.Content>
          <DescList>
            <DescItem
              label={'Company type'}
              value={
                data?.companyOrIndividualInfo.companyType
                  ? getOptionLabel(
                      MerchantSmartpayCompanyTypeOptions,
                      data?.companyOrIndividualInfo.companyType,
                    )
                  : '-'
              }
            />
            <DescItem
              label={
                <span>
                  Company/individual
                  <br />
                  name
                </span>
              }
              value={data?.companyOrIndividualInfo.companyOrIndividualName || '-'}
            />
            <DescItem
              label={
                <span>
                  Company
                  <br />
                  registration number
                </span>
              }
              value={data?.companyOrIndividualInfo.companyRegNo || '-'}
            />
            <DescItem
              label={
                <span>
                  Company
                  <br />
                  registration date
                </span>
              }
              value={
                data?.companyOrIndividualInfo.companyRegDate
                  ? formatDate(data?.companyOrIndividualInfo.companyRegDate, {
                      formatType: 'dateOnly',
                    })
                  : '-'
              }
            />
            <DescItem
              label={'Company embossed name'}
              value={data?.companyOrIndividualInfo.companyEmbossName || '-'}
            />
            <DescItem
              label={'Business category'}
              value={
                data?.companyOrIndividualInfo.businessCategory
                  ? getOptionLabel(
                      MerchantSmartpayBusinessCategoryOptions,
                      data?.companyOrIndividualInfo.businessCategory,
                    )
                  : '-'
              }
            />
          </DescList>
        </Card.Content>
      </Card>
      <Card className={'my-8'}>
        <Card.Heading title={'Timeline'} />
        <Card.Content>
          <Timeline>
            {data?.timelines && data.timelines.length > 0 ? (
              data.timelines.map((timeline, index) => {
                return (
                  <Timeline.Item
                    key={index}
                    title={<span className={'text-sm'}>{titleCase(timeline.status)}</span>}
                    description={
                      <>
                        {timeline.email && (
                          <p className={'text-xs text-black'}>Updated by: {timeline.email}</p>
                        )}
                        <p className={'text-xs'}>{formatDate(timeline.time)}</p>
                      </>
                    }
                    color={getMerchantTimelineColor(timeline.status)}
                  />
                );
              })
            ) : (
              <div className="py-4">
                <p className="text-center text-gray-400 text-sm">No data available.</p>
              </div>
            )}
          </Timeline>
        </Card.Content>
      </Card>
    </>
  );
};

const EditGeneralModal = (props: {
  onDismiss: () => void;
  onDone: () => void;
  data: SmartpayAccountDetails;
  id: string;
  appId: string;
}) => {
  const {sessionPayload} = useAuth();
  const [searchCompanies, setSearchCompanies] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const debounceSearchCompanies = useDebounce(searchCompanies, 500);

  const {
    mutate: updateAccount,
    error: updateAppError,
    isLoading: updateAppLoading,
  } = useUpdateSmartpayAccount(props.appId);

  const {
    mutate: updateMerchant,
    error: updateMerchantError,
    isLoading: updateMerchantLoading,
  } = useUpdateMerchantDetails(props.id);

  const {data: companies} = useCompanies({
    name: debounceSearchCompanies,
    perPage: '50',
    companyType: COMPANY_TYPE.SMARTPAY,
  });

  const {setFieldValue, handleBlur, touched, errors, handleSubmit, values} =
    useFormik<MerchantSmartpayGeneralInfo>({
      initialValues: {
        merchantId: props.data.merchantId || '',
        virtualAccountId: props.data.generalInfo.virtualAccountId || '',
        status: props.data.generalInfo.status || '',
        reason: props.data.generalInfo.reason || '',
        remark: props.data.generalInfo.remark || '',
        smartpayCompanyId: props.data.generalInfo.smartpayCompanyId || '',
        fleetPlan: props.data.generalInfo.fleetPlan || '',
        website: props.data.generalInfo.website || '',
        authorisedSignatory: props.data.generalInfo.authorisedSignatory || '',
      },
      onSubmit: () => {
        setIsSubmitting(true);
        updateAccount({
          generalInfo: {
            ...props.data.generalInfo,
            fleetPlan: values.fleetPlan,
            smartpayCompanyId: values.smartpayCompanyId || null,
            website: values.website || null,
            authorisedSignatory: values.authorisedSignatory || null,
          },
        });
        updateMerchant({
          status: values.status,
          reason: values.reason || null,
          remark: values.remark || null,
          createdOrUpdatedBy: sessionPayload.email || undefined,
        });
      },
      validationSchema: SmartpayGeneralValidationSchema,
    });

  const isLoading = updateAppLoading || updateMerchantLoading;
  const error = updateAppError || updateMerchantError;

  React.useEffect(() => {
    if (isSubmitting && !isLoading && !error) {
      setIsSubmitting(false);
      props.onDone();
    }
  }, [isLoading, error]);

  let statusOptions;

  switch (props.data.generalInfo.status) {
    case MerchantSmartpayStatus.ACTIVE:
    case MerchantSmartpayStatus.FROZEN:
      statusOptions = SmartpayMerchantStatusActiveFrozenOptions;
      break;
    case MerchantSmartpayStatus.OVERDUE:
      statusOptions = SmartpayMerchantStatusOverdueOptions;
      break;
    case MerchantSmartpayStatus.DORMANT:
      statusOptions = SmartpayMerchantStatusDormantOptions;
      break;
    default:
      statusOptions = [
        {
          label: titleCase(props.data.generalInfo.status.toLowerCase()),
          value: props.data.generalInfo.status,
        },
      ];
  }

  const [disabledReason, setDisabledReason] = React.useState(true);

  React.useEffect(() => {
    if (values.status !== props.data.generalInfo.status) {
      setFieldValue('reason', '');
      setFieldValue('remark', '');
      setDisabledReason(false);
    } else {
      setDisabledReason(true);
      setFieldValue('reason', props.data.generalInfo.reason || '');
      setFieldValue('remark', props.data.generalInfo.remark || '');
    }
  }, [values.status]);

  return (
    <Modal isOpen onDismiss={props.onDismiss} aria-label={'edit-general-modal'}>
      <form onSubmit={handleSubmit}>
        <Modal.Header>Edit details</Modal.Header>
        <Modal.Body>
          {!isLoading && error && (
            <QueryErrorAlert
              className="mb-4"
              error={(updateAppError || updateMerchantError) as any}
            />
          )}
          <TextField
            disabled
            className={'w-72'}
            layout={'horizontal-responsive'}
            label={'Account ID'}
            value={values.merchantId}
          />
          <TextField
            disabled
            className={'w-72'}
            layout={'horizontal-responsive'}
            label={'Virtual account'}
            value={values.virtualAccountId}
          />
          <FieldContainer layout={'horizontal-responsive'} label={'Status'}>
            <DropdownSelect
              className={'w-72'}
              name={'status'}
              value={values.status}
              onChangeValue={(v) => setFieldValue('status', v)}
              options={statusOptions}
            />
          </FieldContainer>
          <FieldContainer layout={'horizontal-responsive'} label={'Reason code'}>
            <DropdownSelect
              onBlur={handleBlur}
              disabled={isLoading || disabledReason}
              className={'w-72'}
              name={'reason'}
              placeholder={'Please select'}
              onChangeValue={(v) => setFieldValue('reason', v)}
              value={values.reason}
              options={[
                {
                  label: 'Please select',
                  value: '',
                },
                ...changeStatusReasonOptions,
              ]}
            />
          </FieldContainer>
          <TextareaField
            onBlur={handleBlur}
            disabled={isLoading || disabledReason}
            layout={'horizontal-responsive'}
            label={'Remarks'}
            name={'remark'}
            placeholder={'Enter remarks'}
            onChangeValue={(v) => setFieldValue('remark', v)}
            value={values.remark}
          />
          <FieldContainer
            layout={'horizontal-responsive'}
            label={'Fleet plan'}
            status={touched.fleetPlan && errors.fleetPlan ? 'error' : undefined}
            helpText={touched.fleetPlan && errors.fleetPlan ? errors.fleetPlan : ''}>
            <DropdownSelect
              onBlur={handleBlur}
              className={'w-72'}
              name={'fleetPlan'}
              value={values.fleetPlan}
              onChangeValue={(v) => setFieldValue('fleetPlan', v)}
              placeholder={'Fleet plan'}
              options={[
                {
                  label: 'Select fleet plan',
                  value: '',
                },
                ...MerchantSmartpayFleetPlanOption,
              ]}
            />
          </FieldContainer>
          <FieldContainer layout={'horizontal-responsive'} label={'SmartPay company'}>
            <SearchableDropdown
              className={'w-72'}
              placeholder={'Enter SmartPay company'}
              value={values.smartpayCompanyId}
              onChangeValue={(v) => {
                setFieldValue('smartpayCompanyId', v);
              }}
              onChange={(value) => {
                setSearchCompanies(value.target.value);
              }}
              options={
                companies &&
                companies.map((company: any) => ({
                  value: company._id,
                  description: `${company.name}`,
                  label: company.name,
                }))
              }
            />
          </FieldContainer>
          <TextField
            layout={'horizontal-responsive'}
            label={'Authorised signatory'}
            placeholder={'Enter authorised signatory'}
            className={'w-72'}
            name={'authorisedSignatory'}
            value={values.authorisedSignatory}
            onChangeValue={(v) => setFieldValue('authorisedSignatory', v)}
          />
          <TextField
            layout={'horizontal-responsive'}
            label={'Website URL'}
            placeholder={'Enter website URL'}
            className={'w-72'}
            name={'website'}
            value={values.website}
            onChangeValue={(v) => setFieldValue('website', v)}
          />
        </Modal.Body>
        <Modal.Footer className={'text-right space-x-3'}>
          <Button variant="outline" onClick={props.onDismiss}>
            CANCEL
          </Button>
          <Button variant="primary" type={'submit'} isLoading={isLoading}>
            SAVE CHANGES
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

const EditCompanyModal = (props: {
  onDismiss: () => void;
  onDone: () => void;
  appId: string;
  data: SmartpayAccountDetails;
}) => {
  const {
    mutate: updateAccount,
    error: updateError,
    isLoading,
  } = useUpdateSmartpayAccount(props.appId);

  const {setFieldValue, handleSubmit, touched, errors, values} =
    useFormik<MerchantSmartpayCompanyInfo>({
      initialValues: {
        businessCategory: props.data.companyOrIndividualInfo.businessCategory || '',
        companyEmbossName: props.data.companyOrIndividualInfo.companyEmbossName || '',
        companyOrIndividualName: props.data.companyOrIndividualInfo.companyOrIndividualName || '',
        companyRegDate: props.data.companyOrIndividualInfo.companyRegDate || '',
        companyType: props.data.companyOrIndividualInfo.companyType || '',
        companyRegNo: props.data.companyOrIndividualInfo.companyRegNo || '',
      },
      onSubmit: () => {
        updateAccount(
          {
            companyOrIndividualInfo: {
              companyOrIndividualName: values.companyOrIndividualName,
              companyEmbossName: values.companyEmbossName,
              companyRegDate: values.companyRegDate,
              companyType: values.companyType,
              companyRegNo: values.companyRegNo,
              businessCategory: values.businessCategory,
            },
          },
          {
            onSuccess: props.onDone,
          },
        );
      },
      validationSchema: SmartpayCompanyValidationSchema,
    });

  return (
    <Modal isOpen onDismiss={props.onDismiss} aria-label={'edit-company-modal'}>
      <form onSubmit={handleSubmit}>
        <Modal.Header>Edit company/individual</Modal.Header>
        <Modal.Body>
          {!isLoading && updateError && <QueryErrorAlert error={updateError as any} />}
          <FieldContainer
            layout={'horizontal-responsive'}
            label={'Company type'}
            status={touched.companyType && errors.companyType ? 'error' : undefined}
            helpText={touched.companyType && errors.companyType ? errors.companyType : ''}>
            <DropdownSelect
              className={'w-72'}
              name={'companyType'}
              value={values.companyType}
              onChangeValue={(v) => setFieldValue('companyType', v)}
              options={[
                {
                  label: 'Select company types',
                  value: '',
                },
                ...MerchantSmartpayCompanyTypeOptions,
              ]}
            />
          </FieldContainer>
          <TextField
            layout={'horizontal-responsive'}
            placeholder={'Company/individual name'}
            label={
              <span>
                Company/individual
                <br />
                name
              </span>
            }
            className={'w-72'}
            name={'companyOrIndividualName'}
            value={values.companyOrIndividualName}
            onChangeValue={(v) => setFieldValue('companyOrIndividualName', v)}
            status={
              touched.companyOrIndividualName && errors.companyOrIndividualName
                ? 'error'
                : undefined
            }
            helpText={
              touched.companyOrIndividualName && errors.companyOrIndividualName
                ? errors.companyOrIndividualName
                : ''
            }
          />
          <TextField
            layout={'horizontal-responsive'}
            label={
              <span>
                Company
                <br />
                registration number
              </span>
            }
            className={'w-72'}
            placeholder={'Company registration number'}
            name={'companyRegNo'}
            value={values.companyRegNo}
            status={touched.companyRegNo && errors.companyRegNo ? 'error' : undefined}
            helpText={touched.companyRegNo && errors.companyRegNo ? errors.companyRegNo : ''}
            onChangeValue={(v) => setFieldValue('companyRegNo', v)}
          />
          <FieldContainer
            layout={'horizontal-responsive'}
            label={
              <span>
                Company
                <br />
                registration date
              </span>
            }
            status={touched.companyRegDate && errors.companyRegDate ? 'error' : undefined}
            helpText={touched.companyRegDate && errors.companyRegDate ? errors.companyRegDate : ''}>
            <DaySelector
              showMonthYearDropdown
              name={'companyRegDate'}
              placeholder={'Select company registration date'}
              value={values.companyRegDate ? new Date(values.companyRegDate) : undefined}
              onChangeValue={(v) => setFieldValue('companyRegDate', v?.toISOString())}
              className={'w-72'}
            />
          </FieldContainer>
          <TextField
            layout={'horizontal-responsive'}
            label={
              <span>
                Company embossed
                <br />
                name
              </span>
            }
            placeholder={'Company embossed name'}
            className={'w-72'}
            name={'companyEmbossName'}
            value={values.companyEmbossName}
            onChangeValue={(v) => setFieldValue('companyEmbossName', v)}
            status={touched.companyEmbossName && errors.companyEmbossName ? 'error' : undefined}
            helpText={
              touched.companyEmbossName && errors.companyEmbossName ? errors.companyEmbossName : ''
            }
          />
          <FieldContainer
            layout={'horizontal-responsive'}
            label={'Business category'}
            status={touched.businessCategory && errors.businessCategory ? 'error' : undefined}
            helpText={
              touched.businessCategory && errors.businessCategory ? errors.businessCategory : ''
            }>
            <DropdownSelect
              className={'w-72'}
              name={'businessCategory'}
              value={values.businessCategory}
              onChangeValue={(v) => setFieldValue('businessCategory', v)}
              options={[
                {
                  label: 'Select business categories',
                  value: '',
                },
                ...MerchantSmartpayBusinessCategoryOptions,
              ]}
            />
          </FieldContainer>
        </Modal.Body>

        <Modal.Footer className={'text-right space-x-3'}>
          <Button variant="outline" onClick={props.onDismiss}>
            CANCEL
          </Button>
          <Button variant="primary" type={'submit'} isLoading={isLoading}>
            SAVE CHANGES
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
