import React from 'react';
import {Card, CardContent, CardHeading, DescItem, DescList} from '@setel/portal-ui';
import {useMerchantDetails} from '../../merchants/merchants.queries';

type FleetCardMerchantReferenceProps = {
  merchantId?: string;
};

function FleetCardMerchantReference(props: FleetCardMerchantReferenceProps) {
  const {data} = useMerchantDetails(props.merchantId, {
    enabled: Boolean(props.merchantId),
  });

  const [merchantId, merchantName] = React.useMemo(() => {
    if (data) {
      return [data.id, data.name];
    }
    return ['-', '-'];
  }, [data?.merchantType]);

  const fleetPlan = React.useMemo(() => {
    if (data?.smartPayAccountAttributes?.fleetPlan || data?.fleetPlan) {
      return data?.smartPayAccountAttributes?.fleetPlan || data?.fleetPlan;
    }
    return '-';
  }, [data?.balances]);

  return (
    <Card className="mb-4" expandable defaultIsOpen>
      <CardHeading title="Merchant details"></CardHeading>
      <CardContent>
        <DescList className="col-span-5 py-2">
          <DescItem
            labelClassName="text-sm"
            valueClassName="text-sm capitalize"
            label="Merchant ID"
            value={merchantId}
          />
          <DescItem
            labelClassName="text-sm"
            valueClassName="text-sm capitalize"
            label="Merchant name"
            value={merchantName}
          />
          <DescItem
            labelClassName="text-sm"
            valueClassName="text-sm capitalize"
            label="Fleet plan"
            value={fleetPlan}
          />
        </DescList>
      </CardContent>
    </Card>
  );
}

export default FleetCardMerchantReference;
