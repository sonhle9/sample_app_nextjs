import {
  Badge,
  Card,
  DataTable as Table,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  formatMoney,
  Filter,
  FilterControls,
  formatDate,
  PaginationNavigation,
  useFilter,
  usePaginationState,
  titleCase,
} from '@setel/portal-ui';
import * as React from 'react';
import {Link} from 'src/react/routing/link';
import {ExternalOrderStatus, PurchaseOrderType} from 'src/react/services/api-external-orders.type';
import {EXTERNAL_ORDER_STATUS_COLOR} from '../external-orders.const';
import {
  getExternalOrderStatusLabel,
  getExternalOrderStatusOptions,
  getExternalOrderPurchaseOptions,
} from '../external-orders.helpers';
import {useExternalOrders} from '../external-orders.queries';

export function ExternalOrdersAccountCard(props: {userId: string}) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  return (
    <Card
      expandable
      onToggleOpen={() => setIsExpanded((prev) => !prev)}
      isOpen={isExpanded}
      data-testid="external-order-account-card">
      <Card.Heading title="External order"></Card.Heading>
      <Card.Content>
        {isExpanded && <ExternalOrdersAccountList userId={props.userId} />}
      </Card.Content>
    </Card>
  );
}

export function ExternalOrdersAccountList(props: {userId: string}) {
  const {page, perPage, setPage, setPerPage} = usePaginationState();

  const filter = useFilter<{
    status?: ExternalOrderStatus;
    purchaseType: PurchaseOrderType;
    createdAt: [string, string];
  }>(
    {
      status: undefined,
      purchaseType: undefined,
      createdAt: ['', ''],
    },
    {
      components: [
        {
          key: 'status',
          type: 'select',
          props: {
            'data-testid': 'filter-order-status',
            label: 'Status',
            options: getExternalOrderStatusOptions(),
            placeholder: 'Any statuses',
          },
        },
        {
          key: 'purchaseType',
          type: 'select',
          props: {
            label: 'Purchase Type',
            options: getExternalOrderPurchaseOptions(),
            placeholder: 'Any types',
            'data-testid': 'h-filter-order-status',
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
    },
  );

  React.useEffect(() => {
    setPage(1);
  }, [filter[0].values]);

  const {
    data: externalOrders,
    isLoading,
    isSuccess,
  } = useExternalOrders(
    props.userId,
    {perPage, page},
    {
      status: filter[0].values.status,
      orderType: filter[0].values.purchaseType,
      from: filter[0].values.createdAt[0],
      to: filter[0].values.createdAt[1],
    },
    {
      select: (orders) => ({
        ...orders,
        items: orders.items.map((order) => ({
          ...order,
          amount: order.items.reduce((acc, item) => {
            if (item) {
              return acc + item.totalPrice;
            } else {
              return acc;
            }
          }, 0),
        })),
      }),
    },
  );

  const pagination = (
    <PaginationNavigation
      className="sm:px-7 px-4 py-3.5"
      total={externalOrders?.total}
      currentPage={page}
      perPage={perPage}
      onChangePage={setPage}
      onChangePageSize={setPerPage}
    />
  );
  return (
    <div className="-mx-4 -my-5 sm:-mx-7">
      <FilterControls className="mb-2 shadow-none" filter={filter} />
      <Filter filter={filter} className="sm:px-7 px-4 pb-3.5" />

      <Table
        native
        type="secondary"
        heading={<div className="px-3">{pagination}</div>}
        isLoading={isLoading}
        data-testid="external-order-list">
        <DataTableRowGroup groupType="thead">
          <Tr>
            <Td data-testid="external-order-amount-col">Amount (RM)</Td>
            <Td>Status</Td>
            <Td>Purchase Type</Td>
            <Td>Station Name</Td>
            <Td className="text-right">Created On</Td>
          </Tr>
        </DataTableRowGroup>
        <DataTableRowGroup groupType="tbody">
          {externalOrders?.items?.map((externalOrder) => (
            <Tr data-testid="external-order-data" key={externalOrder.id}>
              <Td>
                <Link
                  data-testid="external-orders-link"
                  className="inline"
                  to={`/external-orders/${externalOrder.id}`}>
                  {formatMoney(externalOrder.amount)}
                </Link>
              </Td>
              <Td>
                <Badge
                  color={EXTERNAL_ORDER_STATUS_COLOR[externalOrder.status]}
                  className="uppercase">
                  {getExternalOrderStatusLabel(externalOrder.status)}
                </Badge>
              </Td>
              <Td>{titleCase(externalOrder.orderType)}</Td>
              <Td className="capitalize">
                {externalOrder.stationName
                  ? `PETRONAS ${externalOrder.stationName.toLowerCase()}`
                  : '-'}
              </Td>
              <Td className="text-right">
                {externalOrder.createdAt && formatDate(externalOrder.createdAt)}
              </Td>
            </Tr>
          ))}
        </DataTableRowGroup>

        {isSuccess && !externalOrders?.items?.length && (
          <DataTableCaption>
            <div className="py-12">
              <p className="text-center text-gray-400 text-sm">No data available.</p>
            </div>
          </DataTableCaption>
        )}
      </Table>
      {pagination}
    </div>
  );
}
