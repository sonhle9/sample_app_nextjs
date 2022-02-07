import {JsonPanel} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useLedgerAdjustmentDetails} from '../ledger-adjustments.query';

interface ILedgerAdjustmentDetailsProps {
  id: string;
}

export const LedgerAdjustmentDetails = (props: ILedgerAdjustmentDetailsProps) => {
  const {data} = useLedgerAdjustmentDetails(props.id);
  return (
    <PageContainer heading={`Ledger adjustment details - ${props.id}`}>
      <JsonPanel defaultOpen allowToggleFormat json={data as any} />
    </PageContainer>
  );
};
