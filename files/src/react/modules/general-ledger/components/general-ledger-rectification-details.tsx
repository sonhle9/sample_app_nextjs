import {Badge, Card, DescList, Skeleton, JsonPanel} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useGLExceptionsDetails} from '../general-ledger.queries';

export interface IGeneralLedgerRectificationDetailsProps {
  id: string;
}

export const GeneralLedgerRectificationDetails = (
  props: IGeneralLedgerRectificationDetailsProps,
) => {
  const {data, isLoading} = useGLExceptionsDetails(props.id);

  return (
    <PageContainer heading={data ? data.eventData.transactionType : <Skeleton />}>
      <Card className="mb-6">
        <Card.Heading title="General" />
        <Card.Content>
          <DescList isLoading={isLoading}>
            <DescList.Item label="Error Reason" value={data && data.errorReason} />
            <DescList.Item
              label="Status"
              value={
                data &&
                (data.isResolved ? (
                  <Badge rounded="rounded" color="success">
                    Succeeded
                  </Badge>
                ) : (
                  <Badge rounded="rounded" color="warning">
                    Pending
                  </Badge>
                ))
              }
            />
          </DescList>
        </Card.Content>
      </Card>
      <Card className="mb-6">
        <Card.Heading title="Event Data" />
        <Card.Content>
          <DescList isLoading={isLoading}>
            <DescList.Item label="GL Profile" value={data && data.eventData.GLProfile} />
            <DescList.Item label="Date" value={data && data.eventData.date} />
            <DescList.Item
              label="Transaction Type"
              value={data && data.eventData.transactionType}
            />
            <DescList.Item label="Amount" value={data && data.eventData.amount} />
            <DescList.Item label="Assignment" value={data && data.eventData.assignment} />
            <DescList.Item label="Reference" value={data && data.eventData.reference} />
            <DescList.Item label="Transaction ID" value={data && data.eventData.transactionId} />
            <DescList.Item label="Source Service" value={data && data.eventData.sourceService} />
          </DescList>
        </Card.Content>
      </Card>
      <JsonPanel json={data as any} />
    </PageContainer>
  );
};
