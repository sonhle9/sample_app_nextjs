import {Badge} from '@setel/portal-ui';
import {formatDate, formatMoney} from '@setel/web-utils';
import * as React from 'react';
import {Link} from 'src/react/routing/link';
import {useCustomerDetails} from '../../customers/customers.queries';
import {camelToSentenceCase, getOverCounterOrderStatusBadgeColor} from '../store-orders.helpers';
import {useOverCounterOrder} from '../store-orders.queries';
import {StoreOrderDetails} from './store-order-details';

export function OverCounterOrderDetails(props: {orderId: string}) {
  const {data: order} = useOverCounterOrder(props.orderId);
  const {data: customer} = useCustomerDetails(order?.userId);
  return (
    <>
      <StoreOrderDetails
        header="Over counter details"
        orderId={props.orderId}
        generalDetails={[
          {
            legend: 'GENERAL',
            items: [
              {label: 'Order ID', value: props.orderId},
              {
                label: 'Customer name',
                value: (
                  <Link className="hover:text-brand-500" to={`/customers/${order?.userId}`}>
                    {customer?.fullName || order?.fullName}
                  </Link>
                ),
              },
              {
                label: 'Customer email',
                value: (
                  <a className="hover:text-brand-500" href={`mailto:${customer?.email}`}>
                    {customer?.email}
                  </a>
                ),
              },
              {
                label: 'Phone number',
                value: customer?.phone && (
                  <a className="hover:text-brand-500" href={`tel:${customer?.phone}`}>
                    +{customer?.phone}
                  </a>
                ),
              },
            ],
          },
          {
            legend: 'ORDER DETAILS',
            items: [
              {
                label: 'Status',
                value: order?.storeOrderStatus && (
                  <Badge
                    size="small"
                    color={getOverCounterOrderStatusBadgeColor(order.storeOrderStatus)}
                    className="uppercase">
                    {camelToSentenceCase(order.storeOrderStatus)}
                  </Badge>
                ),
              },
              {label: 'Total amount', value: formatMoney(order?.totalAmount, 'RM')},
              {
                label: 'Station',
                value: (
                  <Link
                    className="hover:text-brand-500"
                    to={`/stations/${order?.retailerId}/details`}>
                    {order?.stationName}
                  </Link>
                ),
              },
              {
                label: 'Vendor POS',
                value: <span className="capitalize">{String(order?.vendorType)}</span>,
              },
              {label: 'Created on', value: order?.createdAt && formatDate(order?.createdAt)},
            ],
          },
          {
            legend: 'MESRA DETAILS',
            items: [
              {label: 'Loyalty card number', value: order?.loyalty?.petronas?.cardNumber || '-'},
              {
                label: 'Mesra points earned',
                value: `${order?.loyalty?.petronas?.earnedPoints || 0} points`,
              },
              {
                label: 'Mesra balance after purchase',
                value: `${order?.loyalty?.petronas?.balance || 0} points`,
              },
            ],
          },
        ]}
        order={order}
      />
    </>
  );
}
