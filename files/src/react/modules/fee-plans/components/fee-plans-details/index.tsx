import * as React from 'react';
import {IFeePlanDetailProps} from '../../fee-plans.type';
import {FeePlansPaymentMethods} from '../fee-plans-payment-methods';
import {FeeMerchantsListing} from './fee-plans-merchant-listing';
import {PageContainer} from 'src/react/components/page-container';
import {FeePlanTypes} from '../../fee-plans.constant';

export const FeePlansDetails = ({feePlanId}: IFeePlanDetailProps) => {
  return (
    <PageContainer heading="Fee plan details" className="space-y-8">
      <FeePlansPaymentMethods feePlanId={feePlanId} feePlanType={FeePlanTypes.PRE_DEFINED} />
      <FeeMerchantsListing feePlanId={feePlanId} />
    </PageContainer>
  );
};
