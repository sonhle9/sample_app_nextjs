import {
  DataTable,
  DataTableRowGroup,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableExpandableGroup as ExpandGroup,
  DataTableExpandButton as ExpandButton,
  DataTableExpandableRow as ExpandableRow,
  DescList,
  DescItem,
  Badge,
  Card,
  ExternalIcon,
} from '@setel/portal-ui';
import {AxiosError} from 'axios';
import moment from 'moment';
import * as React from 'react';
import {TRANSACTION_MIX_PAYMENT_METHODS} from 'src/app/transactions/shared/const-var';
import {Link} from 'src/react/routing/link';
import {PaymentTransaction} from 'src/react/services/api-payments.type';
import {ConciergeOrderStatus} from 'src/react/services/api-store-orders.type';
import {FuelColorState} from 'src/shared/enums/orders.enum';
import {StoreOrderStatusesEnum} from 'src/shared/enums/storeOrders.enum';
import {camelToSentenceCase} from 'src/shared/helpers/format-text';
import {IPag} from 'src/shared/interfaces/core.interface';
import {IPump} from 'src/shared/interfaces/station.interface';
import {getPaymentMethod} from '../../payments-transactions/payment-transactions.lib';
import {PumpStatusColorMap} from '../../stations/stations.const';
import {useStations} from '../../stations/stations.queries';
import {useDeliver2MeOrders} from '../../store-orders/store-orders.queries';
import {StationStatusColorMap} from '../customers.constant';
import {
  useCustomerLatestOrders,
  useCustomerLatestStoreOrders,
  useStation,
  usePaymentTransactionDetails,
  usePaymentTransactions,
} from '../customers.queries';
import {
  useCanReadFuelOrder,
  useCanReadStoreOrder,
  useCanReadStoreOrderInCarView,
} from '../hooks/use-customer-permissions';

enum OrderType {
  fuel = 'Fuel order',
  store = 'Store order',
  concierge = 'Concierge order',
}

const conciergeOrderStatusesColor = {
  [ConciergeOrderStatus.created]: 'warning',
  [ConciergeOrderStatus.modified]: 'warning',

  [ConciergeOrderStatus.chargeError]: 'error',
  [ConciergeOrderStatus.pointIssuanceError]: 'error',
  [ConciergeOrderStatus.pointVoidError]: 'error',
  [ConciergeOrderStatus.voidError]: 'error',
  [ConciergeOrderStatus.CancelError]: 'error',

  [ConciergeOrderStatus.chargeSuccess]: 'success',
  [ConciergeOrderStatus.delivered]: 'success',
  [ConciergeOrderStatus.pointIssuanceSuccess]: 'success',
} as const;

const storeOrderStatusColor = {
  [StoreOrderStatusesEnum.created]: 'warning',
  [StoreOrderStatusesEnum.voidPending]: 'warning',
  [StoreOrderStatusesEnum.confirmed]: 'warning',

  [StoreOrderStatusesEnum.chargeError]: 'error',
  [StoreOrderStatusesEnum.voidError]: 'error',
  [StoreOrderStatusesEnum.pointIssuanceError]: 'error',
  [StoreOrderStatusesEnum.pointVoidError]: 'error',
  [StoreOrderStatusesEnum.error]: 'error',

  [StoreOrderStatusesEnum.chargeSuccessful]: 'success',
  [StoreOrderStatusesEnum.voidSuccessful]: 'success',
  [StoreOrderStatusesEnum.pointIssuanceSuccessful]: 'success',
  [StoreOrderStatusesEnum.pointVoidSuccessful]: 'success',
} as const;

const filterFuelOrderStatus = (status: string) => {
  return status.replace(/_/g, ' ').replace(/FUEL ORDER /, '');
};

interface ICustomer {
  customerId: string;
}

interface ICombinedOrder {
  id: string;
  referenceType: string; //'Fuel Order' 'Store Order' 'Concierge Order'
  status: string;
  createdAt: Date;
  stationName: string;
  stationId?: string;
  paymentProvider: string;
  transactionId?: string;
  amount: number;
  pumpId?: string;
}

interface ReadStationProps {
  id: string;
  name: string;
  status: string;
}

interface ReadStationByNameProps {
  name: string;
}

export function LatestOrder({customerId}: ICustomer) {
  const customerLatestOrdersInput: IPag = {
    page: 1,
    perPage: 4,
  };
  const userCanViewFuelOrder = useCanReadFuelOrder();
  const {data: customerFuelOrders, isLoading: isFuelOrdersLoading} = useCustomerLatestOrders(
    customerLatestOrdersInput,
    {userId: customerId},
    {
      select: (orders) =>
        orders.items.map((order) => ({
          id: order.orderId,
          referenceType: OrderType.fuel,
          status: order.orderStatus,
          createdAt: order.createdAt,
          stationName: order.stationName,
          stationId: order.stationId,
          paymentProvider: order.paymentProvider,
          transactionId: '',
          amount: order.amount,
          pumpId: order.pumpId,
        })),

      retry: (retryCount, err) => {
        const error = err as AxiosError;
        return retryCount < 3 && error?.response?.status !== 404;
      },
      enabled: userCanViewFuelOrder,
    },
  );
  const userCanViewStoreOrder = useCanReadStoreOrder();
  const {data: customerStoreOrders, isLoading: isStoreOrdersLoading} = useCustomerLatestStoreOrders(
    customerLatestOrdersInput,
    {userId: customerId},
    {
      select: (orders) =>
        orders.items.map((order) => ({
          id: order.id,
          referenceType: OrderType.store,
          status: order.storeOrderStatus,
          createdAt: order.createdAt,
          stationName: order.stationName,
          stationId: order.retailerId,
          paymentProvider: order.paymentProvider,
          transactionId: order.chargeTransactionId,
          amount: order.totalAmount,
        })),
      retry: (retryCount) => {
        return retryCount < 3;
      },
      enabled: userCanViewStoreOrder,
    },
  );
  const userCanViewConciergeOrders = useCanReadStoreOrderInCarView();
  const {data: customerConciergeOrders, isLoading: isConciergeOrdersLoading} = useDeliver2MeOrders(
    customerLatestOrdersInput,
    {userId: customerId},
    {
      select: (orders) =>
        orders.items.map((order) => ({
          id: order.id,
          referenceType: OrderType.concierge,
          status: order.status,
          createdAt: order.createdAt,
          stationName: order.stationName,
          stationId: '',
          paymentProvider: order.paymentProvider,
          transactionId: order.paymentTransactionId,
          amount: order.totalAmount,
        })),
      retry: (retryCount, err) => {
        const error = err as AxiosError;
        return retryCount < 3 && error?.response?.status !== 404;
      },
      enabled: userCanViewConciergeOrders,
    },
  );
  const isOrdersLoading = isConciergeOrdersLoading || isStoreOrdersLoading || isFuelOrdersLoading;
  const sortedOrders: ICombinedOrder[] = React.useMemo(
    () =>
      isOrdersLoading
        ? undefined
        : [
            ...(customerFuelOrders ?? []),
            ...(customerStoreOrders ?? []),
            ...(customerConciergeOrders ?? []),
          ]
            .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
            .splice(0, 4),
    [customerFuelOrders, customerStoreOrders, customerConciergeOrders, isOrdersLoading],
  );
  //sort expect +ve if a>b, but we want to arrange in desc
  // show 4 latest orders
  /**
   * call 3 api (index/orders) & (index/store-orders) & (index/in-car)
   * sort according to date
   */

  return (
    <Card className="w-full min-h-64">
      <Card.Heading title="Latest order" />
      {sortedOrders?.length === 0 ? (
        <div className="text-lg text-mediumgrey text-center py-10 w-full">
          Customer does not have any order
        </div>
      ) : (
        <>
          <DataTable native isLoading={isOrdersLoading}>
            <DataTableRowGroup groupType="thead">
              <Tr>
                <Td>ORDER ID</Td>
                <Td>STATUS</Td>
                <Td>REFERENCE TYPE</Td>
                <Td className="text-right">CREATED ON</Td>
              </Tr>
            </DataTableRowGroup>
            <DataTableRowGroup>
              {sortedOrders?.map((order) => {
                if (order.referenceType === OrderType.concierge) {
                  return <ConciergeOrderRow {...order} key={order.id} />;
                } else if (order.referenceType === OrderType.store) {
                  return <StoreOrderRow {...order} key={order.id} />;
                } else if (order.referenceType === OrderType.fuel) {
                  return <FuelOrderRow {...order} key={order.id} />;
                } else {
                  //return default
                }
              })}
            </DataTableRowGroup>
          </DataTable>
          {sortedOrders && (
            <Link
              className="text-center my-2 text-base text-brand-500"
              to={`/customers/${customerId}?tabIndex=4`}>
              <strong>SEE MORE</strong>
            </Link>
          )}
        </>
      )}
    </Card>
  );
}

function ConciergeOrderRow(order: ICombinedOrder) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const {data: transactionDetails} = usePaymentTransactionDetails(order.transactionId, {
    enabled: isExpanded,
  });

  return (
    <ExpandGroup>
      <Tr>
        <Td>
          <ExpandButton
            data-testid={`expand-order-button-${order.id}`}
            onClick={() => setIsExpanded((prev) => !prev)}
          />
          {' ' + order.id}
        </Td>
        <Td>
          <Badge color={conciergeOrderStatusesColor[order.status]} className="uppercase">
            {camelToSentenceCase(order.status)}
          </Badge>
        </Td>
        <Td>{order.referenceType}</Td>
        <Td className="text-right">{moment(order.createdAt).format('DD  MMM YYYY, h:mm a')}</Td>
      </Tr>
      <ExpandableRow>
        <DescList>
          <DescItem
            label="Station name"
            value={<DisplayStationStatusByName name={order.stationName} />}
          />
          <DescItem
            label="Payment method"
            value={transactionDetails && <DisplayPaymentMethod {...transactionDetails} />}
          />
          <DescItem label="Amount" value={'RM' + order.amount} />
          <DescItem
            label="Wallet balance"
            value={
              transactionDetails &&
              (transactionDetails?.walletBalance || transactionDetails?.walletBalance === 0)
                ? 'RM' + transactionDetails.walletBalance
                : '-'
            }
          />
        </DescList>
      </ExpandableRow>
    </ExpandGroup>
  );
}

function StoreOrderRow(order: ICombinedOrder) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const {data: stationDetails} = useStation(order.stationId, {enabled: isExpanded});
  const {data: transactionDetails} = usePaymentTransactionDetails(order.transactionId, {
    enabled: isExpanded,
  });

  return (
    <ExpandGroup>
      <Tr>
        <Td>
          <ExpandButton
            data-testid={`expand-order-button-${order.id}`}
            onClick={() => setIsExpanded((prev) => !prev)}
          />
          {' ' + order.id}
        </Td>
        <Td>
          <Badge color={storeOrderStatusColor[order.status]} className="uppercase">
            {camelToSentenceCase(order.status)}
          </Badge>
        </Td>
        <Td>{order.referenceType}</Td>
        <Td className="text-right">{moment(order.createdAt).format('DD  MMM YYYY, h:mm a')}</Td>
      </Tr>
      <ExpandableRow>
        <DescList>
          <DescItem
            label="Station name"
            value={
              stationDetails && (
                <DisplayStationStatus
                  id={stationDetails.id}
                  name={stationDetails.name}
                  status={stationDetails.status}
                />
              )
            }
          />
          <DescItem
            label="Payment method"
            value={transactionDetails && <DisplayPaymentMethod {...transactionDetails} />}
          />
          <DescItem label="Amount" value={'RM' + order.amount} />
          <DescItem
            label="Wallet balance"
            value={
              transactionDetails &&
              (transactionDetails?.walletBalance || transactionDetails?.walletBalance === 0)
                ? 'RM' + transactionDetails.walletBalance
                : '-'
            }
          />
        </DescList>
      </ExpandableRow>
    </ExpandGroup>
  );
}

function FuelOrderRow(order: ICombinedOrder) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const {data: stationDetails} = useStation(order.stationId, {enabled: isExpanded});
  const {data: orderTransactions} = usePaymentTransactions(
    {orderId: order.id},
    {enabled: isExpanded},
  );
  const captureTransaction =
    orderTransactions && orderTransactions.find((trx) => trx.type === 'CAPTURE');
  const {data: captureTransactionDetails} = usePaymentTransactionDetails(captureTransaction?.id, {
    enabled: !!captureTransaction,
  });

  return (
    <ExpandGroup>
      <Tr>
        <Td>
          <ExpandButton
            data-testid={`expand-order-button-${order.id}`}
            onClick={() => setIsExpanded((prev) => !prev)}
          />
          {' ' + order.id}
        </Td>

        <Td>
          <Badge color={FuelColorState[order.status]} className="uppercase">
            {filterFuelOrderStatus(order.status)}
          </Badge>
        </Td>
        <Td>{order.referenceType}</Td>
        <Td className="text-right">{moment(order.createdAt).format('DD  MMM YYYY, h:mm a')}</Td>
      </Tr>
      <ExpandableRow>
        <DescList>
          <DescItem
            label="Station name"
            value={
              stationDetails && (
                <DisplayStationStatus
                  id={stationDetails.id}
                  name={stationDetails.name}
                  status={stationDetails.status}
                />
              )
            }
          />
          <DescItem
            label="Pump number"
            value={
              stationDetails && (
                <DisplayPumpStatus
                  {...stationDetails.pumps.find((pump) => pump.pumpId === order.pumpId)}
                />
              )
            }
          />
          <DescItem
            label="Payment method"
            value={captureTransaction && <DisplayPaymentMethod {...captureTransaction} />}
          />
          <DescItem label="Amount" value={order.amount ? 'RM' + order.amount : '-'} />
          <DescItem
            label="Wallet balance"
            value={
              captureTransactionDetails &&
              (captureTransactionDetails.walletBalance ||
              captureTransactionDetails.walletBalance === 0
                ? 'RM' + captureTransactionDetails.walletBalance
                : '-')
            }
          />
        </DescList>
      </ExpandableRow>
    </ExpandGroup>
  );
}

function DisplayStationStatus({id, name, status}: ReadStationProps) {
  // <station_name> <external_link> <station_status>
  return (
    <>
      {name + ' '}
      <Link className="inline text-base" to={`/stations/${id}/details`}>
        <ExternalIcon className="inline" color="#00b0ff" />
      </Link>
      &nbsp;&nbsp;&nbsp;
      <Badge color={StationStatusColorMap[status]} className="uppercase">
        {status}
      </Badge>
    </>
  );
}

function DisplayPumpStatus({pumpId, status}: IPump) {
  return (
    <>
      {pumpId + ' '}
      <Badge color={PumpStatusColorMap[status]} className="uppercase">
        {status}
      </Badge>
    </>
  );
}

function DisplayStationStatusByName({name}: ReadStationByNameProps) {
  const {data: stations} = useStations({name: name}, {});
  const foundStation = React.useMemo(
    () => stations && stations.items.find((result) => result.name === name),
    [stations],
  );

  return <>{foundStation && <DisplayStationStatus {...foundStation} />}</>;
}

//handle icons
function DisplayPaymentMethod(paymentTrx: PaymentTransaction) {
  const paymentMethod = getPaymentMethod(paymentTrx);

  switch (paymentMethod) {
    case TRANSACTION_MIX_PAYMENT_METHODS.all.text:
      return <div className="h-5">{' ' + TRANSACTION_MIX_PAYMENT_METHODS.all.paymentMethod}</div>;
    case TRANSACTION_MIX_PAYMENT_METHODS.walletSetel.text:
      return (
        <div className="h-5">
          <img
            src="../../../../assets/icons/icon-72x72.png"
            className="inline h-full w-auto pl-2 pr-2 border-gray-200 bg-white border"></img>
          {' ' + 'Setel Wallet'}
        </div>
      );
    case TRANSACTION_MIX_PAYMENT_METHODS.boost.text:
      return <div className="h-5">{paymentMethod}</div>;
    case TRANSACTION_MIX_PAYMENT_METHODS.cardVisa.text:
      return <div className="h-5">{paymentMethod}</div>;
    case TRANSACTION_MIX_PAYMENT_METHODS.cardMastercard.text:
      return <div className="h-5">{paymentMethod}</div>;
    case TRANSACTION_MIX_PAYMENT_METHODS.cardAmex.text:
      return <div className="h-5">{paymentMethod}</div>;
    case TRANSACTION_MIX_PAYMENT_METHODS.smartpay.text:
      return <div className="h-5">{paymentMethod}</div>;
    default:
      return <>{paymentMethod}</>;
  }
}
