import {Tabs} from '@setel/portal-ui';
import * as React from 'react';
import {useParams, useRouter} from 'src/react/routing/routing.context';
import {PaymentsCustomerAdjustmentsListing} from './payments-customer-adjustments-listing';
import {PaymentsMerchantAdjustmentsListing} from './payments-merchant-adjustments-listing';

export const PaymentsAdjustmentsListing = () => {
  const params = useParams();
  const router = useRouter();
  const activeTabIndex = tabs.indexOf(params.tab) || 0;

  return (
    <Tabs
      index={activeTabIndex}
      onChange={(newIndex) => {
        router.navigateByUrl(`/payments/adjustments/listing/${tabs[newIndex]}`);
      }}>
      <Tabs.TabList>
        <Tabs.Tab label="Merchant Adjustments" />
        <Tabs.Tab label="Customer Adjustments" />
      </Tabs.TabList>
      <Tabs.Panels>
        <Tabs.Panel>
          <PaymentsMerchantAdjustmentsListing enabled={activeTabIndex === 0} />
        </Tabs.Panel>
        <Tabs.Panel>
          <PaymentsCustomerAdjustmentsListing enabled={activeTabIndex === 1} />
        </Tabs.Panel>
      </Tabs.Panels>
    </Tabs>
  );
};

const tabs = ['merchant', 'customer'];
