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
  TextField,
  Timeline,
  titleCase,
  useDebounce,
} from '@setel/portal-ui';
import {formatDate} from '@setel/web-utils';
import {useFormik} from 'formik';
import * as React from 'react';
import {MerchantTypeCodes} from '../../../../../shared/enums/merchant.enum';
import {QueryErrorAlert} from '../../../../components/query-error-alert';
import {useNotification} from '../../../../hooks/use-notification';
import {useRouter} from '../../../../routing/routing.context';
import {COMPANY_TYPE} from '../../merchant.const';
import {
  getMerchantTimelineColor,
  getOptionLabel,
  getSmartpayMerchantStatusBadgeColor,
} from '../../merchants.lib';
import {
  useCancelSmartpayApp,
  useCompanies,
  useDeleteSmartpayAccount,
  useResubmitSmartpayApp,
  useSmartpayApplicationDetails,
  useUpdateSmartpayAccount,
} from '../../merchants.queries';
import {
  MerchantSmartpay,
  MerchantSmartpayBusinessCategoryOptions,
  MerchantSmartpayCompanyInfo,
  MerchantSmartpayCompanyTypeOptions,
  MerchantSmartpayFleetPlanOption,
  MerchantSmartpayGeneralInfo,
  MerchantSmartpayStatus,
  MerchantSmartpayStatusOptions,
} from '../../merchants.type';
import {
  SmartpayCompanyValidationSchema,
  SmartpayGeneralValidationSchema,
} from './smartpay-validation-schema';
import {useAuth} from '../../../auth';

export const SmartpayApplicationDetailsGeneral = (props: {applicationId: string}) => {
  const {sessionPayload} = useAuth();
  const {data, error, isLoading} = useSmartpayApplicationDetails(props.applicationId);

  const timelinesPending =
    data?.timelines.filter((t) => t.status === MerchantSmartpayStatus.PENDING) || [];
  const requesterEmail =
    timelinesPending.length && timelinesPending[timelinesPending.length - 1].email;

  const {
    mutate: deleteSmartpayAccount,
    error: deleteError,
    isLoading: deleteLoading,
  } = useDeleteSmartpayAccount(props.applicationId);
  const {
    mutate: cancelApprove,
    error: cancelError,
    isLoading: cancelLoading,
  } = useCancelSmartpayApp();
  const {mutate: resubmitApplication, isLoading: resubmitLoading} = useResubmitSmartpayApp();
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showEditGeneralModal, setShowEditGeneralModal] = React.useState(false);
  const [showEditCompanyModal, setShowEditCompanyModal] = React.useState(false);

  const showMessage = useNotification();
  const router = useRouter();

  const handleCancel = () => {
    cancelApprove(data.approvalRequestId, {
      onSuccess: () => {
        showMessage({
          title: 'Successful!',
          description: 'Request has been cancelled.',
        });
      },
    });
  };

  const handleDelete = () => {
    deleteSmartpayAccount(null, {
      onSuccess: () => {
        showMessage({
          title: 'Successful!',
          description: 'Application has been deleted.',
        });
        router.navigateByUrl(`/merchants/types/${MerchantTypeCodes.SMART_PAY_ACCOUNT}`);
      },
    });
  };

  const handleResubmit = () => {
    resubmitApplication(
      {
        applicationId: data.applicationId,
        email: sessionPayload.email,
      },
      {
        onSuccess: () => {
          showMessage({
            title: 'Successful!',
            description: 'Application has been resubmitted.',
          });
        },
        onError: (err: any) => {
          const response = err.response && err.response.data;
          showMessage({
            title: 'Error!',
            variant: 'error',
            description: response?.message || err.message,
          });
        },
      },
    );
  };

  const showEditButton =
    data?.status !== MerchantSmartpayStatus.CLOSED &&
    data?.status !== MerchantSmartpayStatus.PENDING;
  const showDeleteButton =
    data?.status === MerchantSmartpayStatus.REJECTED ||
    data?.status === MerchantSmartpayStatus.CANCELLED;
  const showCancelButton =
    data?.status === MerchantSmartpayStatus.PENDING &&
    requesterEmail &&
    requesterEmail === sessionPayload.email;
  const showResubmitButton = showDeleteButton;

  return (
    <>
      {!isLoading && error && <QueryErrorAlert error={error as any} />}
      <Card>
        <Card.Heading title={'General'}>
          {showDeleteButton && (
            <>
              <Button
                className={'pu-min-w-20'}
                variant={'error'}
                onClick={() => setShowDeleteModal(true)}>
                DELETE
              </Button>
              <Modal
                onDismiss={() => setShowDeleteModal(false)}
                isOpen={showDeleteModal}
                style={{width: '600px', height: '220px'}}
                aria-label={'delete-modal'}>
                <Modal.Header>Are you sure to delete application?</Modal.Header>
                <Modal.Body>
                  {!deleteLoading && deleteError && <QueryErrorAlert error={deleteError as any} />}
                  This action cannot be undone. Once deleted, this application will be deleted from
                  the application list.
                </Modal.Body>
                <Modal.Footer className={'text-right space-x-3'}>
                  <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                    CANCEL
                  </Button>
                  <Button variant="error" onClick={() => handleDelete()} isLoading={deleteLoading}>
                    CONFIRM
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          )}
          {showCancelButton && (
            <>
              <Button
                className={'ml-3 pu-min-w-20'}
                variant={'error-outline'}
                onClick={() => setShowCancelModal(true)}>
                CANCEL
              </Button>
              <Modal
                onDismiss={() => setShowCancelModal(false)}
                isOpen={showCancelModal}
                aria-label={'cancel-modal'}>
                <Modal.Header>Are you sure to cancel application?</Modal.Header>
                <Modal.Body>
                  {!cancelLoading && cancelError && <QueryErrorAlert error={cancelError as any} />}
                  This action cannot be undone. Once cancelled, this request will not be able to
                  proceed to the next process.
                </Modal.Body>
                <Modal.Footer className={'text-right space-x-3'}>
                  <Button variant="outline" onClick={() => setShowCancelModal(false)}>
                    GO BACK
                  </Button>
                  <Button variant="error" isLoading={cancelLoading} onClick={() => handleCancel()}>
                    CONFIRM
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          )}
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
                  id={props.applicationId}
                  onDone={() => {
                    setShowEditGeneralModal(false);
                    showMessage({
                      title: 'Successful!',
                      description: 'Application has been updated.',
                    });
                  }}
                  onDismiss={() => setShowEditGeneralModal(false)}
                />
              )}
            </>
          )}
          {showResubmitButton && (
            <>
              <Button
                className={'ml-3 pu-min-w-20'}
                variant={'outline'}
                onClick={() => handleResubmit()}
                isLoading={resubmitLoading}>
                RESUBMIT
              </Button>
            </>
          )}
        </Card.Heading>
        <Card.Content>
          <DescList>
            {data?.merchantId ? (
              <DescItem label={'Merchant ID'} value={data?.merchantId} />
            ) : data?.applicationId ? (
              <DescItem label={'Application ID'} value={data?.applicationId} />
            ) : null}
            <DescItem
              label={'Status'}
              value={
                data?.status ? (
                  <Badge
                    color={getSmartpayMerchantStatusBadgeColor(data?.status)}
                    className={'uppercase'}>
                    {data.status}
                  </Badge>
                ) : (
                  ''
                )
              }
            />
            <DescItem
              label={'Fleet plan'}
              value={getOptionLabel(MerchantSmartpayFleetPlanOption, data?.generalInfo.fleetPlan)}
            />
            <DescItem
              label={'Smartpay company'}
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
                  id={props.applicationId}
                  onDone={() => {
                    setShowEditCompanyModal(false);
                    showMessage({
                      title: 'Successful!',
                      description: 'Application has been updated.',
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
              label={'Company registration date'}
              value={
                data?.companyOrIndividualInfo.companyRegDate
                  ? formatDate(data?.companyOrIndividualInfo.companyRegDate, {
                      formatType: 'dateOnly',
                    })
                  : '-'
              }
            />
            <DescItem
              label={
                <span>
                  Company embossed
                  <br /> name
                </span>
              }
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
  data: MerchantSmartpay;
  id: string;
}) => {
  const [searchCompanies, setSearchCompanies] = React.useState(null);
  const debounceSearchCompanies = useDebounce(searchCompanies, 500);

  const {
    mutate: updateApplication,
    error: updateError,
    isLoading,
  } = useUpdateSmartpayAccount(props.id);

  const {data: companies} = useCompanies({
    name: debounceSearchCompanies,
    perPage: '50',
    companyType: COMPANY_TYPE.SMARTPAY,
  });

  const {setFieldValue, handleBlur, touched, errors, handleSubmit, values} =
    useFormik<MerchantSmartpayGeneralInfo>({
      initialValues: {
        status: props.data.status || '',
        smartpayCompanyId: props.data.generalInfo.smartpayCompanyId || '',
        smartpayCompanyName: props.data.generalInfo.smartpayCompanyName || '',
        fleetPlan: props.data.generalInfo.fleetPlan || '',
        website: props.data.generalInfo.website || '',
        authorisedSignatory: props.data.generalInfo.authorisedSignatory || '',
      },
      onSubmit: () => {
        updateApplication(
          {
            generalInfo: {
              fleetPlan: values.fleetPlan,
              smartpayCompanyId: values.smartpayCompanyId || null,
              website: values.website || null,
              authorisedSignatory: values.authorisedSignatory || null,
            },
          },
          {
            onSuccess: props.onDone,
          },
        );
      },
      validationSchema: SmartpayGeneralValidationSchema,
    });
  return (
    <Modal isOpen onDismiss={props.onDismiss} aria-label={'edit-general-modal'}>
      <form onSubmit={handleSubmit}>
        <Modal.Header>Edit details</Modal.Header>
        <Modal.Body>
          {!isLoading && updateError && <QueryErrorAlert error={updateError as any} />}
          <FieldContainer layout={'horizontal-responsive'} label={'Status'}>
            <DropdownSelect
              disabled
              className={'w-72'}
              name={'status'}
              value={values.status}
              onChangeValue={(v) => setFieldValue('status', v)}
              options={MerchantSmartpayStatusOptions}
            />
          </FieldContainer>
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
              value={values.smartpayCompanyName}
              onChangeValue={(v) => {
                setFieldValue('smartpayCompanyId', v);
                setFieldValue('smartpayCompanyName', v);
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
  id: string;
  data: MerchantSmartpay;
}) => {
  const {
    mutate: updateApplication,
    error: updateError,
    isLoading,
  } = useUpdateSmartpayAccount(props.id);

  const {setFieldValue, handleBlur, handleSubmit, touched, errors, values} =
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
        updateApplication(
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
            onBlur={handleBlur}
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
            status={touched.companyRegNo && errors.companyRegNo ? 'error' : undefined}
            helpText={touched.companyRegNo && errors.companyRegNo ? errors.companyRegNo : ''}
            className={'w-72'}
            placeholder={'Company registration number'}
            name={'companyRegNo'}
            value={values.companyRegNo}
            onChangeValue={(v) => setFieldValue('companyRegNo', v)}
          />
          <FieldContainer
            layout={'horizontal-responsive'}
            label={
              <span>
                Company
                <br /> registration date
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
            onBlur={handleBlur}
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
