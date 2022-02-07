import {Badge} from '@setel/portal-ui';
import {formatDate, formatMoney} from '@setel/web-utils';
import * as React from 'react';
import {Link} from 'src/react/routing/link';
import {useCustomerDetails} from '../../customers/customers.queries';
import {getStoreOrderStateBadgeColor, getStoreOrderStateLabel} from '../store-orders.helpers';
import {useDeliver2MeOrder} from '../store-orders.queries';
import {StoreOrderDetails} from './store-order-details';

export function Deliver2MeOrderDetails(props: {orderId: string}) {
  const {data: order} = useDeliver2MeOrder(props.orderId);
  const {data: customer} = useCustomerDetails(order?.userId);
  return (
    <>
      <StoreOrderDetails
        header="Deliver2Me details"
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
                    {customer?.fullName || order?.userFullName}
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
                value: order?.userPhoneNumber && (
                  <a className="hover:text-brand-500" href={`tel:${order?.userPhoneNumber}`}>
                    +{order?.userPhoneNumber}
                  </a>
                ),
              },
            ],
          },
          {
            legend: 'ORDER DETAILS',
            items: [
              {
                label: 'State',
                value: order?.status && (
                  <Badge
                    size="small"
                    color={getStoreOrderStateBadgeColor(order?.state)}
                    className="uppercase">
                    {getStoreOrderStateLabel(order.state)}
                  </Badge>
                ),
              },
              {label: 'Total amount', value: formatMoney(order?.totalAmount, 'RM')},
              {
                label: 'Station',
                value: (
                  <Link
                    className="hover:text-brand-500"
                    to={`/stations/${order?.stationId}/details`}>
                    {order?.stationName}
                  </Link>
                ),
              },
              {
                label: 'Store',
                value: (
                  <Link className="hover:text-brand-500" to={`/stores/${order?.storeId}`}>
                    {order?.storeName}
                  </Link>
                ),
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
