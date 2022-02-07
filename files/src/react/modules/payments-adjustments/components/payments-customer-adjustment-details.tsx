import {JsonPanel} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useCustomerAdjustmentDetails} from '../payments-adjustments.queries';

export interface PaymentsCustomerAdjustmentDetailsProps {
  id: string;
}

export const PaymentsCustomerAdjustmentDetails = (
  props: PaymentsCustomerAdjustmentDetailsProps,
) => {
  const {data} = useCustomerAdjustmentDetails(props.id);

  return (
    <PageContainer heading="Adjustment Transaction Details">
      {data && <JsonPanel json={data as any} allowToggleFormat defaultOpen />}
    </PageContainer>
  );
};
