import {JsonPanel} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {Seo} from 'src/react/components/seo';
import {useTopupRefundDetails} from '../topup-refund.queries';

export const TopupRefundDetails = (props: {id: string}) => {
  const {data} = useTopupRefundDetails(props.id);

  return (
    <PageContainer heading="Top-up Refund Details">
      <Seo title="Top-up Refund Details" />
      {data && <JsonPanel json={data as any} allowToggleFormat defaultOpen />}
    </PageContainer>
  );
};
