import * as React from 'react';
import {
  JsonPanel,
  Button,
  Notification,
  useTransientState,
  Card,
  CardHeading,
  CardContent,
  formatDate,
  Badge,
  BareButton,
} from '@setel/portal-ui';
import {useGetPointTransactions} from '../../points.queries';
import {
  TransactionStatus,
  AdjustmentApprovalStatus,
  AdjustmentTypesName,
  AdjustmentTypes,
  TransactionStatusName,
} from '../../points.type';
import {useGetSignedUrl} from '../../loyalty.queries';
import {useAdjustmentApproval} from '../../loyalty.queries';
import {PageContainer} from 'src/react/components/page-container';
import {PointRuleField} from '../point-rule-field';
import {getS3FileNameFromURL} from 'src/shared/helpers/get-s3-filekey';
import {maskMesra} from 'src/shared/helpers/mask-helpers';

type LoyaltyPointsApprovalDetailsProps = {
  referenceId: string;
};

export const LoyaltyPointsApprovalDetails: React.VFC<LoyaltyPointsApprovalDetailsProps> = ({
  referenceId,
}) => {
  const {data} = useGetPointTransactions({referenceId});
  const {data: signedUrl, isSuccess} = useGetSignedUrl(data?.data?.[0]?.attachment);
  const {
    mutate: mutateAdjustment,
    isSuccess: approvalSuccess,
    isError: approvalError,
    isLoading: approvalLoading,
    error,
  } = useAdjustmentApproval();
  const [showNotification, setShowNotification] = useTransientState(false);
  React.useEffect(() => {
    setShowNotification(approvalError || approvalSuccess);
  }, [approvalError, approvalSuccess]);

  const dataObject = data?.data[0];

  const onApproval = (approve: boolean) => {
    mutateAdjustment({
      adjustmentStatus: approve
        ? AdjustmentApprovalStatus.APPROVED
        : AdjustmentApprovalStatus.REJECTED,
      workflowId: dataObject.workflowId as string,
    });
  };

  return (
    <>
      <Notification
        isShow={showNotification}
        variant={approvalError ? 'error' : 'success'}
        title={approvalError ? 'Error when updating approval' : 'Successfully updated approval'}
        description={approvalError && (error as Error)?.message}
      />
      <PageContainer
        heading="Points approval details"
        action={
          <div className="p-0 m-0 flex space-x-5">
            <Button
              variant="error"
              onClick={() => onApproval(false)}
              disabled={dataObject?.status !== TransactionStatus.PENDING}
              isLoading={approvalLoading}>
              REJECT
            </Button>
            <Button
              variant="primary"
              onClick={() => onApproval(true)}
              disabled={dataObject?.status !== TransactionStatus.PENDING}
              isLoading={approvalLoading}>
              APPROVE
            </Button>
          </div>
        }>
        <Card className="mb-6">
          <CardHeading title="General" />
          <CardContent>
            <PointRuleField name="Status">
              <Badge
                color={(TransactionStatusName.get(dataObject?.status)?.color || 'grey') as any}
                rounded="rounded"
                className="uppercase">
                {dataObject?.status && TransactionStatusName.get(dataObject.status).text}
              </Badge>
            </PointRuleField>
            <PointRuleField name="Card number">{maskMesra(dataObject?.cardNumber)}</PointRuleField>
            <PointRuleField name="Loyalty member ID">{dataObject?.loyaltyMembersId}</PointRuleField>
            <PointRuleField name="Reference ID">{referenceId}</PointRuleField>
            <PointRuleField name="Operation type">
              {dataObject?.amount > 0
                ? AdjustmentTypesName.get(AdjustmentTypes.GRANT)
                : AdjustmentTypesName.get(AdjustmentTypes.REVOKE)}
            </PointRuleField>
            <PointRuleField name="Attachment">
              {getS3FileNameFromURL(dataObject?.attachment) && (
                <BareButton
                  className="text-blue-500 text-sm"
                  render={(props) => (
                    <a href={signedUrl} {...props} download data-testid="download-attachment" />
                  )}
                  disabled={!isSuccess}>
                  {getS3FileNameFromURL(dataObject?.attachment)}
                </BareButton>
              )}
            </PointRuleField>
            <PointRuleField name="Points amount">{`${dataObject?.amount ?? 0} pts`}</PointRuleField>
            <PointRuleField name="Created on">
              {dataObject?.createdAt && formatDate(dataObject.createdAt)}
            </PointRuleField>
            <PointRuleField name="Last updated on">
              {dataObject?.updatedAt && formatDate(dataObject.updatedAt)}
            </PointRuleField>
          </CardContent>
        </Card>
        <JsonPanel defaultOpen allowToggleFormat defaultIsPretty json={dataObject} />
      </PageContainer>
    </>
  );
};
