import {JsonPanel} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useMerchantAdjustmentDetails} from '../payments-adjustments.queries';

export interface PaymentsMerchantAdjustmentDetailsProps {
  id: string;
}

export const PaymentsMerchantAdjustmentDetails = (
  props: PaymentsMerchantAdjustmentDetailsProps,
) => {
  const {data} = useMerchantAdjustmentDetails(props.id);

  return (
    <PageContainer heading="Adjustment Transaction Details">
      {data && <JsonPanel json={data as any} allowToggleFormat defaultOpen />}
    </PageContainer>
  );
};
