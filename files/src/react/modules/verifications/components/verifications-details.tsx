import {
  Badge,
  Button,
  Card,
  DescList,
  EditIcon,
  formatDate,
  ImageThumbnail,
  JsonPanel,
  Modal,
  titleCase,
  Fieldset,
  IconButton,
  ExternalIcon,
} from '@setel/portal-ui';
import dateFormat from 'date-fns/format';
import * as React from 'react';
import {isNil} from 'lodash';

import {PageContainer} from 'src/react/components/page-container';
import {useQueryParams, useRouter} from 'src/react/routing/routing.context';
import {
  IVerification,
  IJumioAssessment,
  IJumioAssessmentCriteria,
  CallbackCompletionStatusEnum,
} from 'src/shared/interfaces/verifications.interface';
import {EmbedQueryParamEnum} from 'src/react/services/api-verifications.type';

import {useCustomerDetails} from '../../customers/customers.queries';
import {
  useExperianRecord,
  useVerificationsDetails,
  useJumioAssessmentByVerificationId,
} from '../verifications.queries';
import {VerificationsUpdateModal} from './modals/verifications-update-modal';
import {VerificationsUpdateJumioAssessmentModal} from './modals/update-jumio-assessment-modal';
import {HasPermission} from '../../auth/HasPermission';
import {verificationRoles} from '../../../../shared/helpers/roles.type';
import {textLooselyMatching} from '../../../../shared/helpers/common';

export interface IVerificationDetailsProps {
  id: string;
}

export const VerificationsDetails = (props: IVerificationDetailsProps) => {
  const router = useRouter();
  const {
    params: {accountId},
  } = useQueryParams();

  const {data, isLoading} = useVerificationsDetails(props.id);
  const {data: jumioAssessment} = useJumioAssessmentByVerificationId(
    data?.callbackStatus === CallbackCompletionStatusEnum.Completed && data.id,
    {embed: [EmbedQueryParamEnum.VerifiedBy]},
  );
  const {data: experianData} = useExperianRecord(data?.id);
  const {data: customerDetails} = useCustomerDetails(accountId);
  const [showVerifyForm, setShowVerifyForm] = React.useState(false);
  const [showJumioAsssessmentUpdateModal, toggleJumioAssessmentUpdateModal] = React.useState(false);

  const dismissVerifyForm = () => {
    setShowVerifyForm(false);
  };

  return (
    <PageContainer heading="Customer Verifications Details">
      <Modal
        size="small"
        isOpen={showVerifyForm}
        aria-label="Edit result"
        onDismiss={dismissVerifyForm}>
        <Modal.Header>Edit result</Modal.Header>
        {data && (
          <VerificationsUpdateModal
            currentVerifications={data}
            onSuccess={dismissVerifyForm}
            onCancel={dismissVerifyForm}
          />
        )}
      </Modal>
      {jumioAssessment && showJumioAsssessmentUpdateModal && (
        <VerificationsUpdateJumioAssessmentModal
          onDismiss={() => toggleJumioAssessmentUpdateModal(false)}
          data={jumioAssessment}
        />
      )}

      <Card className="mb-6">
        <Card.Heading title="General" />
        <Card.Content>
          <Fieldset legend={<div className={'w-64'}>CUSTOMER INFO</div>}>
            <DescList className="mb-6 px-24">
              <DescList.Item
                label="Account name"
                value={
                  customerDetails &&
                  ((
                    <div className="flex items-center">
                      {titleCase(customerDetails.fullName, {hasWhitespace: true})}
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.navigate(['/customers/' + accountId], {
                            queryParams: {tabIndex: 1},
                          });
                        }}>
                        <ExternalIcon color="#00b0ff" />
                      </IconButton>
                    </div>
                  ) ||
                    '-')
                }
              />
              <DescList.Item
                label="Account ID"
                value={customerDetails && (customerDetails.userId || '-')}
              />

              <DescList.Item
                label="Customer name"
                value={data && (titleCase(data.fullName, {hasWhitespace: true}) || '-')}
              />
              <DescList.Item
                label="Document type"
                value={data && (titleCase(data.idType, {hasUnderscore: true}) || '-')}
              />
              <DescList.Item label="ID number" value={data && (data.idNumber || '-')} />
              <DescList.Item label="Mobile number" value={data && (data.mobileNum || '-')} />
              <DescList.Item
                label="Nationality"
                value={data && (data.countryDisplayName || data.country || '-')}
              />
              <DescList.Item label="Gender" value={data && (data.gender || '-')} />
              <DescList.Item
                label="Residential address"
                value={data && (data.address?.formattedAddress || '-')}
              />
              <DescList.Item
                label="Date of birth"
                value={
                  data &&
                  data.dateOfBirth &&
                  (dateFormat(new Date(data.dateOfBirth), 'd MMM yyyy') || '-')
                }
              />
              <DescList.Item
                label="Passport expiry date"
                value={
                  data?.passportExpiredAt
                    ? formatDate(data.passportExpiredAt, {format: 'd MMM yyyy'})
                    : '-'
                }
              />
              <DescList.Item
                label="Issuing country"
                value={data && (data.countryDisplayName || data.country || '-')}
              />

              <DescList.Item label="Occupation type" value={data && (data.occupation || '-')} />
              <DescList.Item label="Nature of employment" value={data && (data.industry || '-')} />
              <DescList.Item
                label="Purpose of transaction"
                value={data && (data.purposeOfTransaction || '-')}
              />
            </DescList>
          </Fieldset>

          <Fieldset legend={<div className={'w-64'}>VERIFICATION INFO</div>} borderTop>
            <DescList className={'px-24'}>
              <DescList.Item label="Attempt no." value={data && (data.attemptNum || '-')} />
              <DescList.Item
                label="Created on"
                value={data && formatDate(data.createdAt, {format: 'd MMM yyyy, p'})}
              />
            </DescList>
          </Fieldset>
        </Card.Content>
      </Card>

      <Card className="mb-6">
        <Card.Heading title="Result">
          <Button
            onClick={() => setShowVerifyForm(true)}
            variant="outline"
            minWidth="none"
            disabled={data && data.verificationStatus === 'PENDING'}
            leftIcon={<EditIcon />}>
            EDIT
          </Button>
        </Card.Heading>
        <Card.Content>
          <DescList isLoading={isLoading}>
            <DescList.Item
              label="Verification status"
              value={
                data && (
                  <Badge color={statusColorMap[data.verificationStatus]} rounded="rounded">
                    {data.verificationStatus}
                  </Badge>
                )
              }
            />
            <DescList.Item label="Remarks" value={data && (data.updateRemarks || '-')} />
            <DescList.Item
              label="Classification"
              value={data && (titleCase(data.classification, {hasUnderscore: true}) || '-')}
            />
            <DescList.Item label="Reason" value={data && (data.rejectReason || '-')} />
            <DescList.Item
              label="Last updated date"
              value={data && (formatDate(data.updatedAt, {format: 'd MMM yyyy - h:mm a'}) || '-')}
            />
            <DescList.Item
              label="Last updated by"
              value={data && (data.lastUpdatedByUser || '-')}
            />
          </DescList>
        </Card.Content>
      </Card>

      {jumioAssessment && (
        <HasPermission accessWith={[verificationRoles.viewJumio]}>
          <Card className="mb-6">
            <Card.Heading title="Jumio's Result">
              <HasPermission accessWith={[verificationRoles.updateJumio]}>
                {canUpdateJumioAssessment(jumioAssessment) && (
                  <Button
                    variant="outline"
                    data-testid="edit-jumio-assessment-btn"
                    minWidth="none"
                    leftIcon={<EditIcon />}
                    onClick={() => toggleJumioAssessmentUpdateModal(true)}>
                    EDIT
                  </Button>
                )}
              </HasPermission>
            </Card.Heading>

            <Card.Content>
              <Fieldset className="mb-4" legend={<div className={'w-64 -mt-2.5'}>JUMIO</div>}>
                <DescList className={'px-24'}>
                  <DescList.Item
                    label="Result"
                    value={
                      <Badge
                        color={jumioAssessmentResultColorMap[jumioAssessment.result]}
                        rounded="rounded">
                        {jumioAssessment.result}
                      </Badge>
                    }
                  />
                </DescList>
              </Fieldset>
              <Fieldset
                className="mb-5"
                legend={<div className={'w-64 -mt-2.5'}>MANUAL VERIFICATION</div>}
                borderTop>
                <DescList className={'px-24'}>
                  <DescList.Item
                    label="Document authenticity"
                    value={displayJumioAssessmentCriteria(jumioAssessment.documentAuthenticity)}
                  />
                  <DescList.Item
                    label="Biometric matching"
                    value={displayJumioAssessmentCriteria(jumioAssessment.biometricMatching)}
                  />
                  <DescList.Item
                    label="Others"
                    value={displayJumioAssessmentCriteria(jumioAssessment.others)}
                  />
                  <DescList.Item label="Remarks" value={jumioAssessment.remark || '-'} />
                  <DescList.Item
                    label="Overall classification"
                    value={
                      jumioAssessment.overallClassification
                        ? displayJumioAssessmentCriteria(jumioAssessment.overallClassification)
                        : 'Unverified'
                    }
                  />
                </DescList>
              </Fieldset>
              <Fieldset legend={<div className={'w-64 -mt-2.5'}>HISTORY</div>} borderTop>
                <DescList className={'px-24'}>
                  <DescList.Item
                    label="Last verified date"
                    value={
                      jumioAssessment.verifiedAt
                        ? formatDate(jumioAssessment.verifiedAt, {format: 'd MMM yyyy - h:mm a'})
                        : '-'
                    }
                  />
                  <DescList.Item
                    label="Last verified by"
                    value={jumioAssessment._embedded?.verifiedBy?.identifier || '-'}
                  />
                </DescList>
              </Fieldset>
            </Card.Content>
          </Card>
        </HasPermission>
      )}

      {experianData ? (
        <JsonPanel
          title="Experian report"
          defaultOpen
          allowToggleFormat
          json={experianData as any}
          className="mb-8"
        />
      ) : (
        <Card className="mb-6">
          <Card.Heading title="Experian report" />
          <Card.Content>
            <NoRecordFoundInList />
          </Card.Content>
        </Card>
      )}
      <Card className="mb-6">
        <Card.Heading title="Attachment" />
        <Card.Content>
          {(data && data.images && (
            <>
              <div className="flex flex-col md:flex-row mb-3 border-b border-gray-200 pb-3">
                <div className="w-5/5 md:w-1/5 py-2 text-gray-400 text-xs tracking-1 font-semibold">
                  <p>DOCUMENT</p>
                </div>
                <div className="w-4/5">
                  <ImageThumbnail src={data.images.scan} className="m-1" />
                  <ImageThumbnail src={data.images.back} className="m-1 " />
                </div>{' '}
              </div>
              <div className="flex flex-col md:flex-row mb-3">
                <div className="w-5/5 md:w-1/5 py-2 text-gray-400 text-xs tracking-1 font-semibold">
                  <p>PHOTOS</p>
                </div>
                <div className="w-4/5">
                  <ImageThumbnail src={data.images.face} className="m-1" />
                  {data.livenessImages.map((img) => (
                    <ImageThumbnail src={img} className="m-1" key={img} />
                  ))}
                </div>
              </div>
            </>
          )) || <NoRecordFoundInList />}
        </Card.Content>
      </Card>

      <JsonPanel defaultOpen allowToggleFormat json={data as any} className="mb-8" />
    </PageContainer>
  );
};

const displayJumioAssessmentCriteria = ({classification, assessment}: IJumioAssessmentCriteria) => {
  if (isNil(assessment)) {
    return titleCase(classification, {hasUnderscore: true});
  }

  return `${titleCase(`${assessment}`)} ${titleCase(classification, {hasUnderscore: true})}`;
};

const canUpdateJumioAssessment = (data: IJumioAssessment): boolean => {
  const matcher = textLooselyMatching('not available');
  for (const key of jumioClassificationKeys) {
    if (!matcher(data[key].classification)) {
      return true;
    }
  }

  return false;
};

export const statusColorMap: Record<IVerification['verificationStatus'], any> = {
  PENDING: 'lemon',
  APPROVED: 'success',
  REJECTED: 'error',
};

const jumioAssessmentResultColorMap: Record<IJumioAssessment['result'], any> = {
  POSITIVE: 'success',
  NEGATIVE: 'error',
  NOT_AVAILABLE: 'lemon',
};

const jumioClassificationKeys: readonly string[] = [
  'documentAuthenticity',
  'biometricMatching',
  'others',
];

export const NoRecordFoundInList = () => {
  return (
    <div className="text-center py-12 text-mediumgrey text-md">
      <p>No records found</p>
    </div>
  );
};
