import {Card, DescList, Fieldset, JsonPanel} from '@setel/portal-ui';
import * as React from 'react';
import cx from 'classnames';
import {StoreOrderPaymentTransactions} from './store-order-payment-transactions';
import {StoreOrderLoyaltyTransactions} from './store-order-loyalty-transactions';
import {PageContainer} from 'src/react/components/page-container';
import {IDeliver2MeOrder, IOverCounterOrder} from '../../../services/api-store-orders.type';

export function StoreOrderDetails(props: {
  header: string;
  order: IDeliver2MeOrder | IOverCounterOrder;
  orderId: string;
  generalDetails: {
    legend: string;
    items: {
      label: string;
      value: React.ReactNode;
    }[];
  }[];
}) {
  return (
    <PageContainer heading={props.header} className="mt-2">
      <Card className="mb-8">
        <Card.Heading title={props.orderId}></Card.Heading>
        <Card.Content>
          {props.generalDetails.map((details, i, arr) => (
            <Fieldset
              legend={details.legend}
              key={details.legend}
              className={cx({'pb-3 border-b border-grey-500': i < arr.length - 1, 'pt-3': i > 0})}>
              <DescList className="py-3">
                {details.items.map((item) => (
                  <DescList.Item key={item.label} label={item.label} value={item.value} />
                ))}
              </DescList>
            </Fieldset>
          ))}
        </Card.Content>
      </Card>
      <StoreOrderPaymentTransactions orderId={props.orderId} />
      <StoreOrderLoyaltyTransactions orderId={props.orderId} />
      <JsonPanel
        className="mb-12"
        json={props.order as any}
        allowToggleFormat
        defaultOpen
        initialExpanded
      />
    </PageContainer>
  );
}
