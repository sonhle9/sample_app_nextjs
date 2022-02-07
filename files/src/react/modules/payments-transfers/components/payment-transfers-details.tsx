import {JsonPanel} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {useTransferDetails} from '../payments-transfers.queries';

export interface PaymentsTransfersDetailsProps {
  id: string;
}

export const PaymentsTransfersDetails = (props: PaymentsTransfersDetailsProps) => {
  const {data, error} = useTransferDetails(props.id);

  return (
    <PageContainer heading="Transfer transaction details">
      {error && <QueryErrorAlert error={error as any} />}
      {data && <JsonPanel json={data as any} allowToggleFormat defaultOpen />}
    </PageContainer>
  );
};
