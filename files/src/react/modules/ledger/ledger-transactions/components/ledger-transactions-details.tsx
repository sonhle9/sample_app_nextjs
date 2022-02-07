import {JsonPanel} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useLedgerTransactionsDetails} from '../ledger-transactions.queries';

interface ILedgerTransactionsDetailsProps {
  id: string;
}

export const LedgerTransactionsDetails = (props: ILedgerTransactionsDetailsProps) => {
  const {data} = useLedgerTransactionsDetails(props.id);
  return (
    <PageContainer heading={`Ledger transactions details - ${props.id}`}>
      <JsonPanel defaultOpen allowToggleFormat json={data as any} />
    </PageContainer>
  );
};
