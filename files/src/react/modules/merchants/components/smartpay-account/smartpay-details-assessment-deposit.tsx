import * as React from 'react';
import {
  Button,
  Card,
  Checkbox,
  DescItem,
  DescList,
  DropdownSelect,
  EditIcon,
  FieldContainer,
  Fieldset,
  Modal,
  MoneyInput,
  TextareaField,
} from '@setel/portal-ui';
import {useSmartpayAssessmentDetails, useUpdateSmartpayAssessment} from '../../merchants.queries';
import {
  AuditLogFeatureName,
  FleetPlan,
  SmartpayAssessmentDetails,
  SmartpayAssessmentFormData,
  SmartpayAssessmentRatingOptions,
} from '../../merchants.type';
import {formatMoney} from '@setel/web-utils';
import {useFormik} from 'formik';
import {SmartpayCreditAssessmentSchema} from './smartpay-validation-schema';
import {QueryErrorAlert} from '../../../../components/query-error-alert';
import {getOptionLabel} from '../../merchants.lib';
import {useNotification} from '../../../../hooks/use-notification';
import {useAuth} from '../../../auth';
import {AuditLogs} from './audit-logs';

export const SmartpayDetailsAssessmentDeposit = (props: {
  applicationId: string;
  merchantId: string;
}) => {
  const {data, error, isLoading} = useSmartpayAssessmentDetails(props.applicationId);

  const [showEditModal, setShowEditModal] = React.useState(false);

  const showMessage = useNotification();

  const showEditButton = true;
  return (
    <>
      <Card isLoading={isLoading} className={'mb-8'}>
        <Card.Heading title={'Credit assessment'}>
          {showEditButton && (
            <>
              <Button
                className={'ml-3 pu-min-w-20'}
                leftIcon={<EditIcon />}
                variant={'outline'}
                onClick={() => setShowEditModal(true)}>
                EDIT
              </Button>
              {data && showEditModal && (
                <EditAssessmentModal
                  data={data}
                  appId={props.applicationId}
                  onDone={() => {
                    setShowEditModal(false);
                    showMessage({
                      title: 'Successful!',
                      description: 'You have successfully updated your credit assessment',
                    });
                  }}
                  isMerchantView={!!props.merchantId}
                  onDismiss={() => setShowEditModal(false)}
                />
              )}
            </>
          )}
        </Card.Heading>
        <Card.Content>
          {error && <QueryErrorAlert error={error as any} />}
          <Fieldset legend={<div className={'-mt-3'}>CREDIT LIMIT</div>} className={'pb-7'}>
            <DescList>
              <DescItem
                label={
                  <span>
                    Approved credit
                    <br /> limit{' '}
                  </span>
                }
                value={`RM ${formatMoney(data?.creditLimit?.approvedCreditLimit || 0)}`}
              />
              {data?.fleetPlan === FleetPlan.POSTPAID && (
                <>
                  <DescItem
                    label={
                      <span>
                        Requested credit
                        <br /> limit{' '}
                      </span>
                    }
                    value={`RM ${formatMoney(data?.creditLimit?.requestedCreditLimit || 0)}`}
                  />
                  <DescItem
                    label={
                      <span>
                        Recommended
                        <br /> credit limit{' '}
                      </span>
                    }
                    value={`RM ${formatMoney(data?.creditLimit?.recommendedCreditLimit || 0)}`}
                  />
                </>
              )}
            </DescList>
          </Fieldset>
          <Fieldset
            legend={<div className={'-mt-3'}>SECURITY DEPOSIT</div>}
            borderTop
            className={'pb-7'}>
            <DescList>
              <DescItem
                label={
                  <span>
                    With security
                    <br />
                    deposit
                  </span>
                }
                value={data?.securityDeposit.securityDepositRequired ? 'Yes' : 'No'}
              />
              {data?.securityDeposit.securityDepositRequired && (
                <>
                  <DescItem
                    label={
                      <span>
                        Approved security
                        <br /> deposit amount
                      </span>
                    }
                    value={`RM ${formatMoney(
                      data?.securityDeposit.approvedSecurityDepositAmount || 0,
                    )}`}
                  />
                  <DescItem
                    label={
                      <span>
                        Requested security
                        <br /> deposit amount
                      </span>
                    }
                    value={`RM ${formatMoney(
                      data?.securityDeposit.requestedSecurityDepositAmount || 0,
                    )}`}
                  />
                  <DescItem
                    label={
                      <span>
                        Recommended
                        <br /> security deposit
                        <br /> amount
                      </span>
                    }
                    value={`RM ${formatMoney(
                      data?.securityDeposit.recommendedSecurityDepositAmount || 0,
                    )}`}
                  />
                </>
              )}
            </DescList>
          </Fieldset>
          <Fieldset legend={<div className={'-mt-3'}>RATINGS</div>} borderTop className={'pb-7'}>
            <DescList>
              <DescItem
                label={'Qualitative rating'}
                value={
                  data?.ratings.qualitativeRating
                    ? getOptionLabel(
                        SmartpayAssessmentRatingOptions,
                        data?.ratings.qualitativeRating,
                      )
                    : '-'
                }
              />
              <DescItem
                label={'Quantitative rating'}
                value={
                  data?.ratings.quantitativeRating
                    ? getOptionLabel(
                        SmartpayAssessmentRatingOptions,
                        data?.ratings.quantitativeRating,
                      )
                    : '-'
                }
              />
            </DescList>
          </Fieldset>
          <Fieldset legend={<div className={'-mt-3'}>OTHERS</div>} borderTop>
            <DescList>
              <DescItem label={'Remarks'} value={data?.others.remarks || '-'} />
            </DescList>
          </Fieldset>
        </Card.Content>
      </Card>
      {data?.id && (
        <AuditLogs refId={data.id} featureName={AuditLogFeatureName.CREDIT_ASSESSMENT} />
      )}
    </>
  );
};

const EditAssessmentModal = (props: {
  onDismiss: () => void;
  onDone: () => void;
  appId: string;
  data: SmartpayAssessmentDetails;
  isMerchantView: boolean;
}) => {
  const {
    mutate: updateAssessment,
    error: updateError,
    isLoading,
  } = useUpdateSmartpayAssessment(props.appId);

  const assessment = props.data;
  const {sessionPayload} = useAuth();

  const {setFieldValue, handleSubmit, values} = useFormik<SmartpayAssessmentFormData>({
    initialValues: {
      approvedCreditLimit: assessment.creditLimit?.approvedCreditLimit || 0,
      requestedCreditLimit: assessment.creditLimit?.requestedCreditLimit || 0,
      recommendedCreditLimit: assessment.creditLimit?.recommendedCreditLimit || 0,

      securityDepositRequired: !!assessment.securityDeposit.securityDepositRequired,
      approvedSecurityDepositAmount: assessment.securityDeposit.approvedSecurityDepositAmount || 0,
      requestedSecurityDepositAmount:
        assessment.securityDeposit.requestedSecurityDepositAmount || 0,
      recommendedSecurityDepositAmount:
        assessment.securityDeposit.recommendedSecurityDepositAmount || 0,

      qualitativeRating: assessment.ratings.qualitativeRating || '',
      quantitativeRating: assessment.ratings.quantitativeRating || '',

      remarks: assessment.others.remarks || '',
    },
    onSubmit: () => {
      updateAssessment(
        {
          creditLimit: {
            approvedCreditLimit: Number(values.approvedCreditLimit || 0),
            requestedCreditLimit: Number(values.requestedCreditLimit || 0),
            recommendedCreditLimit: Number(values.recommendedCreditLimit || 0),
          },
          securityDeposit: {
            securityDepositRequired: values.securityDepositRequired,
            approvedSecurityDepositAmount: Number(values.approvedSecurityDepositAmount || 0),
            recommendedSecurityDepositAmount: Number(values.recommendedSecurityDepositAmount || 0),
            requestedSecurityDepositAmount: Number(values.requestedSecurityDepositAmount || 0),
          },
          ratings: {
            quantitativeRating: values.quantitativeRating || null,
            qualitativeRating: values.qualitativeRating || null,
          },
          others: {
            remarks: values.remarks || null,
          },
          createdOrUpdatedBy: sessionPayload.email,
        },
        {
          onSuccess: props.onDone,
        },
      );
    },
    validationSchema: SmartpayCreditAssessmentSchema,
  });

  return (
    <Modal isOpen onDismiss={props.onDismiss} aria-label={'edit-company-modal'}>
      <form onSubmit={handleSubmit}>
        <Modal.Header>Edit details</Modal.Header>
        <Modal.Body>
          {!isLoading && updateError && <QueryErrorAlert error={updateError as any} />}
          <Fieldset legend={<div className={'-mt-3'}>CREDIT LIMIT</div>} className={'pb-7'}>
            <FieldContainer
              layout={'horizontal-responsive'}
              label={
                <span>
                  Approved credit
                  <br /> limit
                </span>
              }>
              <MoneyInput
                className={'w-36'}
                name={'approvedCreditLimit'}
                disabled={assessment.fleetPlan === FleetPlan.PREPAID}
                value={formatMoney(values.approvedCreditLimit)}
                onChangeValue={(v) => setFieldValue('approvedCreditLimit', v)}
              />
            </FieldContainer>
            {assessment.fleetPlan === FleetPlan.POSTPAID && (
              <>
                <FieldContainer
                  layout={'horizontal-responsive'}
                  label={
                    <span>
                      Requested credit
                      <br /> limit
                    </span>
                  }>
                  <MoneyInput
                    className={'w-36'}
                    disabled={props.isMerchantView}
                    name={'requestedCreditLimit'}
                    value={formatMoney(values.requestedCreditLimit)}
                    onChangeValue={(v) => setFieldValue('requestedCreditLimit', v)}
                  />
                </FieldContainer>
                <FieldContainer
                  layout={'horizontal-responsive'}
                  label={
                    <span>
                      Recommended
                      <br /> credit limit
                    </span>
                  }>
                  <MoneyInput
                    className={'w-36'}
                    disabled={props.isMerchantView}
                    name={'recommendedCreditLimit'}
                    value={formatMoney(values.recommendedCreditLimit)}
                    onChangeValue={(v) => setFieldValue('recommendedCreditLimit', v)}
                  />
                </FieldContainer>
              </>
            )}
          </Fieldset>
          <Fieldset
            legend={<div className={'-mt-3'}>SECURITY DEPOSIT</div>}
            borderTop
            className={'pb-7'}>
            <Checkbox
              name={'securityDepositRequired'}
              label={'Security deposit required'}
              checked={values.securityDepositRequired}
              onChangeValue={(v) => setFieldValue('securityDepositRequired', v)}
            />
            {values.securityDepositRequired && (
              <>
                <FieldContainer
                  className={'mt-7'}
                  layout={'horizontal-responsive'}
                  label={
                    <span>
                      Approved security
                      <br /> deposit amount
                    </span>
                  }>
                  <MoneyInput
                    className={'w-36'}
                    name={'approvedSecurityDepositAmount'}
                    value={formatMoney(values.approvedSecurityDepositAmount)}
                    onChangeValue={(v) => setFieldValue('approvedSecurityDepositAmount', v)}
                  />
                </FieldContainer>
                <FieldContainer
                  layout={'horizontal-responsive'}
                  label={
                    <span>
                      Requested security
                      <br /> deposit amount
                    </span>
                  }>
                  <MoneyInput
                    className={'w-36'}
                    name={'requestedSecurityDepositAmount'}
                    disabled={props.isMerchantView}
                    value={formatMoney(values.requestedSecurityDepositAmount)}
                    onChangeValue={(v) => setFieldValue('requestedSecurityDepositAmount', v)}
                  />
                </FieldContainer>
                <FieldContainer
                  layout={'horizontal-responsive'}
                  label={
                    <span>
                      Recommended
                      <br /> security deposit <br />
                      amount
                    </span>
                  }>
                  <MoneyInput
                    className={'w-36'}
                    disabled={props.isMerchantView}
                    name={'recommendedSecurityDepositAmount'}
                    value={formatMoney(values.recommendedSecurityDepositAmount)}
                    onChangeValue={(v) => setFieldValue('recommendedSecurityDepositAmount', v)}
                  />
                </FieldContainer>
              </>
            )}
          </Fieldset>
          <Fieldset legend={<div className={'-mt-3'}>RATINGS</div>} borderTop className={'pb-7'}>
            <FieldContainer layout={'horizontal-responsive'} label={'Qualitative rating'}>
              <DropdownSelect
                className={'w-72'}
                name={'qualitativeRating'}
                value={values.qualitativeRating}
                onChangeValue={(v) => setFieldValue('qualitativeRating', v)}
                options={[
                  {
                    label: 'Any rating',
                    value: '',
                  },
                  ...SmartpayAssessmentRatingOptions,
                ]}
              />
            </FieldContainer>
            <FieldContainer layout={'horizontal-responsive'} label={'Quantitative rating'}>
              <DropdownSelect
                className={'w-72'}
                name={'quantitativeRating'}
                value={values.quantitativeRating}
                onChangeValue={(v) => setFieldValue('quantitativeRating', v)}
                options={[
                  {
                    label: 'Any rating',
                    value: '',
                  },
                  ...SmartpayAssessmentRatingOptions,
                ]}
              />
            </FieldContainer>
          </Fieldset>
          <Fieldset legend={<div className={'-mt-3'}>OTHERS</div>} borderTop>
            <TextareaField
              name={'remarks'}
              label={'Remarks'}
              value={values.remarks}
              layout={'horizontal-responsive'}
              onChangeValue={(v) => setFieldValue('remarks', v)}
            />
          </Fieldset>
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
