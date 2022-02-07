import {Section, SectionHeading} from '@setel/portal-ui';
import * as React from 'react';

import {HasPermission} from 'src/react/modules/auth/HasPermission';
import {customerBlacklistRoles} from 'src/shared/helpers/roles.type';

import {useGetAccumulations} from '../../customers.queries';

import {CustomerFraudProfileBlacklist} from './customer-fraud-profile-blacklist';
import {CustomerFraudProfileChargeLimitCard} from './customer-fraud-profile-charge-limit-card';

interface CustomerFraudProfileParams {
  userId: string;
}

export function CustomerFraudProfile({userId}: CustomerFraudProfileParams) {
  const {data: customerAccumulations, isLoading: isCustomerAccumulationLoading} =
    useGetAccumulations(userId);

  return (
    <HasPermission accessWith={[customerBlacklistRoles.access]}>
      <Section>
        <SectionHeading title="Fraud Profile" />
        <CustomerFraudProfileBlacklist userId={userId} />
        <CustomerFraudProfileChargeLimitCard
          data={customerAccumulations}
          isLoading={isCustomerAccumulationLoading}
          customerId={userId}
        />
      </Section>
    </HasPermission>
  );
}
