import React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {PrefundingBalancePrepaid} from './prefunding-balance-prepaid';
import {PrefundingBalanceAlerts} from './prefunding-balance-alerts';
import {PrefundingBalanceSummary} from './prefunding-balance-summary';

export const PrefundingBalance = () => {
  return (
    <PageContainer heading="Prepaid Balance" aria-label="Prepaid Balance">
      <PrefundingBalancePrepaid />
      <PrefundingBalanceSummary />
      <PrefundingBalanceAlerts />
    </PageContainer>
  );
};
