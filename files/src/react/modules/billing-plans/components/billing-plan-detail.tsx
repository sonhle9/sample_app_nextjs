import * as React from 'react';
import {Card, DescList, formatDate, JsonPanel} from '@setel/portal-ui';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {IBillingPlanDetailProps} from '../billing-plan.types';
import {useBillingPlan} from '../billing-plan.queries';
import {BillingMerchantsListing} from './billing-merchant-listing';
import {PageContainer} from 'src/react/components/page-container';
import {getIntervalString, getMoneyFormat, getPricingModel} from '../billing-plan.utils';

export const BillingPlanDetail = ({id}: IBillingPlanDetailProps) => {
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
                <DescList.Item label="Plan ID" value={billingPlan && billingPlan.id} />
                <DescList.Item
                  label="Invoice name"
                  value={billingPlan && (billingPlan.invoiceName || '-')}
                />
                <DescList.Item
                  label="Plan description"
                  value={billingPlan && (billingPlan.description || '-')}
                />
                <DescList.Item
                  label="Bill every"
                  value={
                    billingPlan &&
                    getIntervalString(billingPlan.billingInterval, billingPlan.billingIntervalUnit)
                  }
                />
                <DescList.Item
                  label="Trial period"
                  value={
                    billingPlan &&
                    (getIntervalString(billingPlan?.trialPeriod, billingPlan?.trialPeriodUnit) ??
                      '-')
                  }
                />
                <DescList.Item
                  label="Pricing model"
                  value={billingPlan && getPricingModel(billingPlan.pricingModel)}
                />
                <DescList.Item
                  label="Price"
                  value={billingPlan && (getMoneyFormat(billingPlan?.price) ?? '-')}
                />
                <DescList.Item
                  label="Setup fee"
                  value={billingPlan && (getMoneyFormat(billingPlan?.setupFee) ?? '-')}
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
          <Card className="my-8">
            <JsonPanel json={billingPlan as any} />
          </Card>
        </>
      )}
    </PageContainer>
  );
};
