import {
  Alert,
  Badge,
  Card,
  DataTable as Table,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DataTableExpandButton as ExpandButton,
  DataTableExpandableGroup as ExpandGroup,
  DataTableExpandableRow as ExpandableRow,
  DescList,
  DescItem,
  Filter,
  FilterControls,
  formatDate,
  formatMoney,
  useFilter,
  usePaginationState,
  Pagination,
} from '@setel/portal-ui';
import * as React from 'react';
import {Link} from 'src/react/routing/link';
import {FUEL_STATUS_DROPDOWN_OPTIONS} from '../fuel-orders.const';
import {TRANSACTION_MIX_PAYMENT_METHODS} from 'src/app/transactions/shared/const-var';
import {retailRoles} from 'src/shared/helpers/roles.type';
import {PaymentTransaction} from 'src/react/services/api-payments.type';
import {HasPermission} from 'src/react/modules/auth/HasPermission';
import {getPaymentMethod} from 'src/react/modules/payments-transactions/payment-transactions.lib';
import {
  usePaymentTransactions,
  usePaymentTransactionDetails,
} from '../../customers/customers.queries';
import {useFuelOrders} from '../fuel-orders.queries';
import {OrderStatusFilterOptions} from '../fuel-orders.type';
import {IFuelOrder} from '../../../services/api-orders.type';
import {getBadgeColorForStatus} from '../fuel-orders.helpers';

export function FuelOrdersAccountCard(props: {userId: string}) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  return (
    <HasPermission accessWith={[retailRoles.fuelOrderView]}>
      <Card
        expandable
        onToggleOpen={() => setIsExpanded((prev) => !prev)}
        isOpen={isExpanded}
        data-testid="fuel-order-account-card">
        <Card.Heading title="Fuel Orders"></Card.Heading>
        <Card.Content>{isExpanded && <FuelOrdersAccountList userId={props.userId} />}</Card.Content>
      </Card>
    </HasPermission>
  );
}

function FuelOrdersAccountList(props: {userId: string}) {
  const {page, perPage, setPage, setPerPage} = usePaginationState();

  const filter = useFilter<{
    status?: OrderStatusFilterOptions;
    createdAt: [string, string];
  }>(
    {
      status: undefined,
      createdAt: ['', ''],
    },
    {
      components: [
        {
          key: 'status',
          type: 'select',
          props: {
            label: 'Status',
            options: FUEL_STATUS_DROPDOWN_OPTIONS,
            placeholder: 'Any statuses',
            'data-testid': 'filter-order-status',
          },
        },
        {
          key: 'createdAt',
          type: 'daterange',
          props: {
            label: 'Created on',
          },
        },
      ],
      onChange: () => {
        setPage(1);
      },
    },
  );

  const {
    data: fuelOrders,
    isLoading,
    isSuccess,
    error,
  } = useFuelOrders(
    {perPage, page},
    {
      userId: props.userId,
      status: filter[0].values.status,
      from: filter[0].values.createdAt?.[0],
      to: filter[0].values.createdAt?.[1],
    },
  );

  return (
    <div className="-mx-4 -my-5 sm:-mx-7">
      <FilterControls className="mb-2 shadow-none" filter={filter} />
      <Filter filter={filter} className="sm:px-7 px-4 pb-3.5" />
      {error && (
        <Alert
          variant="error"
          description={error?.response?.data?.message || error?.message}
          className="mb-4"
        />
      )}
      <Table
        native
        type="primary"
        pagination={
          ((fuelOrders && fuelOrders.items.length > 0) || page > 1) && (
            <Pagination
              currentPage={page}
              lastPage={0}
              pageSize={perPage}
              onChangePage={setPage}
              onChangePageSize={setPerPage}
              variant="prev-next"
              hideIfSinglePage={false}
            />
          )
        }
        isLoading={isLoading}
        data-testid="store-order-list">
        <DataTableRowGroup groupType="thead">
          <Tr>
            <Td data-testid="fuel-order-amount-col">Amount (RM)</Td>
            <Td>Status</Td>
            <Td>Station Name</Td>
            <Td className="text-right">Created On</Td>
          </Tr>
        </DataTableRowGroup>
        <DataTableRowGroup groupType="tbody">
          {fuelOrders?.items?.map((fuelOrder) => (
            <FuelOrdersAccountRow key={fuelOrder.orderId} fuelOrder={fuelOrder} />
          ))}
        </DataTableRowGroup>
        {isSuccess && !fuelOrders?.items?.length && (
          <DataTableCaption>
            <div className="py-12">
              <p className="text-center text-gray-400 text-sm">No data available.</p>
            </div>
          </DataTableCaption>
        )}
      </Table>
    </div>
  );
}

function FuelOrdersAccountRow({fuelOrder}: {fuelOrder: IFuelOrder}) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const {data: orderTransactions, isLoading: paymentTrxIsLoading} = usePaymentTransactions(
    {orderId: fuelOrder.orderId},
    {enabled: isExpanded},
  );

  const captureTransaction =
    orderTransactions && orderTransactions.find((trx) => trx.type === 'CAPTURE');

  const {data: captureTransactionDetails, isLoading: trxDetailsIsLoading} =
    usePaymentTransactionDetails(captureTransaction?.id, {
      enabled: !!captureTransaction,
    });

  return (
    <ExpandGroup>
      <Tr>
        <Td>
          <ExpandButton
            data-testid={`expand-fuel-orders-details-btn-${fuelOrder.orderId}`}
            onClick={() => setIsExpanded((prev) => !prev)}
          />
          <Link className="inline" to={`/retail/fuel-orders/${fuelOrder.orderId}`}>
            {formatMoney(fuelOrder.amount)}
          </Link>
        </Td>
        <Td>
          <Badge color={getBadgeColorForStatus(fuelOrder.status)} className="uppercase">
            {fuelOrder.statusLabel}
          </Badge>
        </Td>
        <Td>{fuelOrder.stationName}</Td>
        <Td className="text-right">{fuelOrder.createdAt && formatDate(fuelOrder.createdAt)}</Td>
      </Tr>
      <ExpandableRow>
        <DescList isLoading={paymentTrxIsLoading || trxDetailsIsLoading}>
          <DescItem
            label="Order ID"
            value={<Link to={`/retail/fuel-orders/${fuelOrder.orderId}`}>{fuelOrder.orderId}</Link>}
          />
          <DescItem
            label="Payment Method"
            value={captureTransaction && <DisplayPaymentMethod {...captureTransaction} />}
          />
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
          <DescItem
            label="Error Message"
            value={
              captureTransactionDetails &&
              (captureTransactionDetails.error.code !== null
                ? captureTransactionDetails?.error.code
                : '-')
            }
          />
        </DescList>
      </ExpandableRow>
    </ExpandGroup>
  );
}

function DisplayPaymentMethod(paymentTrx: PaymentTransaction) {
  const paymentMethod = getPaymentMethod(paymentTrx);

  return (
    <div className="h-5">
      {paymentMethod === TRANSACTION_MIX_PAYMENT_METHODS.walletSetel.text ? (
        <>
          <img
            src="assets/icons/icon-72x72.png"
            className="inline h-full w-auto pl-2 pr-2 border-gray-200 bg-white border"
          />
          {' ' + 'Setel Wallet'}
        </>
      ) : (
        <>{paymentMethod}</>
      )}
    </div>
  );
}
