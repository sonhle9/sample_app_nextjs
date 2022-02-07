import * as React from 'react';
import {Card, DescList, formatDate} from '@setel/portal-ui';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {BillingDateTextPair, IBillingPlanDetailProps} from '../billing-plan.types';
import {useBillingPlan} from '../billing-plan.queries';
import {BillingMerchantsListing} from './billing-merchant-listing';
import {PageContainer} from 'src/react/components/page-container';
import {getIntervalString} from '../billing-plan.utils';

export const BillingPlanDetailSmartpay = ({id}: IBillingPlanDetailProps) => {
  const {data: billingPlan, isLoading, isError, error} = useBillingPlan(id);

  return (
    <PageContainer heading="Billing plan details">
      {isError && <QueryErrorAlert error={error as any} />}
      {!isError && (
        <>
          <Card className="mb-6">
            <Card.Heading title="General" />
            <Card.Content>
              <DescList isLoading={isLoading}>
                <DescList.Item label="Plan name" value={billingPlan && billingPlan.name} />
                <DescList.Item
                  label="Plan description"
                  value={billingPlan && (billingPlan.description || '-')}
                />
                <DescList.Item label="Plan ID" value={billingPlan && billingPlan.id} />
                <DescList.Item
                  label="Bill every"
                  value={
                    billingPlan &&
                    getIntervalString(billingPlan.billingInterval, billingPlan.billingIntervalUnit)
                  }
                />
                <DescList.Item
                  label="Billing date"
                  value={billingPlan && (BillingDateTextPair[billingPlan.billingDate] || '-')}
                />
                <DescList.Item
                  label="Last updated"
                  value={
                    billingPlan &&
                    formatDate(billingPlan.updatedAt, {
                      formatType: 'dateAndTime',
                    })
                  }
                />
              </DescList>
            </Card.Content>
          </Card>
          <BillingMerchantsListing billingPlanId={id} />
        </>
      )}
    </PageContainer>
  );
};
