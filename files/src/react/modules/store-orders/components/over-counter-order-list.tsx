import * as React from 'react';
import {
  DataTable as Table,
  Card,
  Alert,
  PaginationNavigation,
  formatDate,
  Badge,
  HelpText,
  titleCase,
  useDebounce,
  formatMoney,
  DATE_RANGE_OPTIONS_EXTENDED,
} from '@setel/portal-ui';
import {OverCounterDownload} from './over-counter-download';
import {IOverCounterOrder, IStoreOrderError} from 'src/react/services/api-store-orders.type';
import {IPaginationResult} from 'src/react/lib/ajax';
import {AxiosError} from 'axios';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {getOverCounterOrders} from 'src/react/services/api-store-orders.service';
import {
  camelToSentenceCase,
  getOverCounterOrderStatusBadgeColor,
  getOverCounterStatusOptions,
} from '../store-orders.helpers';
import {Link} from 'src/react/routing/link';
import {useStations} from '../../stations/stations.queries';

type OverCounterFilter = {
  status?: string;
  query?: string;
  createdAt?: [string, string];
  userId?: string;
};

const initialFilter: OverCounterFilter = {
  status: '',
  query: '',
  createdAt: ['', ''],
};

function useOverCounterDataTableState(options?: {
  isActive?: boolean;
  baseValues?: OverCounterFilter;
  onSearchChange?: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return useDataTableState<
    OverCounterFilter,
    IPaginationResult<IOverCounterOrder>,
    AxiosError<IStoreOrderError>
  >({
    queryKey: ['over-counter-orders', options?.isActive],
    queryFn: (filter) =>
      options?.isActive
        ? getOverCounterOrders(
            {page: filter.page, perPage: filter.perPage},
            {
              query: filter.query,
              status: filter.status,
              from: filter.createdAt?.[0],
              to: filter.createdAt?.[1],
              userId: filter.userId,
            },
          )
        : undefined,
    initialFilter: {...initialFilter, ...options.baseValues},
    baseValues: {...initialFilter, ...options.baseValues},
    components: [
      {
        key: 'status',
        type: 'select',
        props: {
          label: 'Status',
          options: getOverCounterStatusOptions(),
          'data-testid': 'status-filter',
        },
      },
      {
        key: 'createdAt',
        type: 'daterange',
        props: {
          label: 'Created on',
          disableFuture: true,
          options: DATE_RANGE_OPTIONS_EXTENDED,
        },
      },
      {
        key: 'query',
        type: 'search',
        props: {
          label: 'Search',
          placeholder: 'Enter station name, station ID or order ID',
          wrapperClass: !!options?.baseValues?.query ? 'hidden' : 'col-span-2',
          list: 'stations',
          onChange: options?.onSearchChange,
        },
      },
    ],
  });
}

export function OverCounterOrderList(props: {
  title?: string;
  stationId?: string;
  userId?: string;
  expandable?: boolean;
  hideDownload?: boolean;
}) {
  const [stationSearch, setStationSearch] = React.useState('');
  const [isOpen, setOpen] = React.useState(!props.expandable);
  const toggleOpen = () => setOpen((v) => !v);

  const {
    pagination: {page, perPage, setPage, setPerPage},
    filter,
    filter: [{values}],
    query: {data: orders, isLoading, isSuccess, error},
  } = useOverCounterDataTableState({
    isActive: isOpen,
    baseValues: {query: props?.stationId, userId: props?.userId},
    onSearchChange: (e) => setStationSearch(e.target.value),
  });

  const stationName = useDebounce(stationSearch, 500);
  const {data: stations} = useStations({name: stationName, perPage: 10});

  return (
    <>
      {error && (
        <Alert
          variant="error"
          description={error?.response?.data?.message || error?.message}
          className="mb-4"
        />
      )}
      <datalist id="stations">
        {stations?.items?.map((station) => (
          <option key={station.id} value={station.id}>
            {station.name}
          </option>
        ))}
      </datalist>
      <div className="mb-10">
        <Table
          expandable={!!props.expandable}
          isOpen={isOpen}
          onToggleOpen={() => toggleOpen()}
          data-testid="over-counter-list-table"
          isLoading={isLoading}
          heading={
            <Card.Heading title={props.title || 'Over counter'}>
              {!props?.hideDownload && (
                <OverCounterDownload
                  filter={{
                    query: values.query,
                    status: values.status,
                    from: values.createdAt[0],
                    to: values.createdAt[1],
                  }}
                />
              )}
            </Card.Heading>
          }
          filter={filter}
          pagination={
            <PaginationNavigation
              currentPage={page}
              total={orders?.total}
              perPage={perPage}
              onChangePage={setPage}
              onChangePageSize={setPerPage}
            />
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Station Name</Table.Th>
              <Table.Th className="text-right">Amount (RM)</Table.Th>
              <Table.Th className="text-right">Created On</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {orders?.items?.map((order) => (
              <Table.Tr
                key={order.id}
                render={(props) => (
                  <Link
                    to={`/store-orders/over-counter/${order.id}`}
                    {...props}
                    data-testid="over-counter-list-item"
                  />
                )}>
                <Table.Td>{order.fullName}</Table.Td>
                <Table.Td>
                  <Badge
                    size="small"
                    color={getOverCounterOrderStatusBadgeColor(order.storeOrderStatus)}
                    className="uppercase">
                    {camelToSentenceCase(order.storeOrderStatus)}
                  </Badge>
                </Table.Td>
                <Table.Td>{order.stationName}</Table.Td>
                <Table.Td className="text-right">
                  {formatMoney(order.totalAmount)}
                  <br />
                  <HelpText className="text-lightgrey">
                    {order.paymentProvider === 'wallet'
                      ? 'Setel Wallet'
                      : titleCase(order.paymentProvider)}
                  </HelpText>
                </Table.Td>
                <Table.Td className="text-right">{formatDate(order.createdAt)}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
          {isSuccess && !orders?.items?.length && (
            <Table.Caption>
              <div className="py-12">
                <p className="text-center text-gray-400 text-sm">No data available.</p>
              </div>
            </Table.Caption>
          )}
        </Table>
      </div>
    </>
  );
}
