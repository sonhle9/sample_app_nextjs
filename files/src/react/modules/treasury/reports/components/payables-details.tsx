import {formatDate, JsonPanel, Skeleton} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useReportsDetails} from '../treasury-reports.queries';

export interface IPayablesReportDetailsProps {
  id: string;
}

export const PayablesReportDetails = (props: IPayablesReportDetailsProps) => {
  const {data} = useReportsDetails(props.id);

  return (
    <PageContainer
      heading={
        data ? (
          'Daily Summary Report for ' + formatDate(data.reportDate, {format: 'd MMM yyyy'})
        ) : (
          <Skeleton />
        )
      }>
      <JsonPanel defaultOpen allowToggleFormat json={data as any} className="mb-8" />
    </PageContainer>
  );
};
