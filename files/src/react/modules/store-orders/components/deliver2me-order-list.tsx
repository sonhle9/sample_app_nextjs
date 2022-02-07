import {
  Alert,
  Badge,
  Button,
  DataTable as Table,
  formatMoney,
  formatDate,
  PaginationNavigation,
  useDebounce,
  Card,
  HelpText,
  titleCase,
  DownloadIcon,
  DATE_RANGE_OPTIONS_EXTENDED,
} from '@setel/portal-ui';
import * as React from 'react';
import _pickBy from 'lodash/pickBy';
import {
  getStoreOrderStateBadgeColor,
  getStoreOrderStateLabel,
  getStoreOrderStateOptions,
  downloadTextFile,
} from '../store-orders.helpers';
import {useDownloadDeliver2MeStoreOrders} from '../store-orders.queries';
import {HasPermission} from '../../auth/HasPermission';
import {
  IDeliver2MeOrder,
  IStoreOrderError,
  IStoreOrderFilter,
} from 'src/react/services/api-store-orders.type';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {getDeliver2MeOrders} from 'src/react/services/api-store-orders.service';
import {IPaginationResult} from 'src/react/lib/ajax';
import {AxiosError} from 'axios';
import {Link} from 'src/react/routing/link';
import {retailRoles} from 'src/shared/helpers/roles.type';
import {useStations} from '../../stations/stations.queries';
import {useStores} from '../../stores/stores.queries';

type StoreOrderFilter = IStoreOrderFilter & {createdAt?: [string, string]};

const initialFilter: StoreOrderFilter = {
  state: '',
  storeName: '',
  stationId: '',
  orderId: '',
  createdAt: ['', ''],
};

function useDeliver2MeOrdersDataTableState(options?: {
  isActive?: boolean;
  baseValues?: StoreOrderFilter;
  onSearchChange?: React.ChangeEventHandler<HTMLInputElement>;
}) {
  const [storeQuery, setStoreQuery] = React.useState('');
  const debouncedStoreQuery = useDebounce(storeQuery, 300);
  const {data: stores} = useStores({page: 1, perPage: 10}, {query: debouncedStoreQuery});

  return useDataTableState<
    StoreOrderFilter,
    IPaginationResult<IDeliver2MeOrder>,
    AxiosError<IStoreOrderError>
  >({
    queryKey: ['deliver2me-orders', options?.isActive],
    queryFn: (filter) =>
      options?.isActive
        ? getDeliver2MeOrders(
            {page: filter.page, perPage: filter.perPage},
            {...filter, from: filter.createdAt?.[0], to: filter.createdAt?.[1]},
          )
        : undefined,
    initialFilter: {...initialFilter, ...options?.baseValues},
    baseValues: {...initialFilter, ...options?.baseValues},
    components: [
      {
        key: 'state',
        type: 'select',
        props: {
          label: 'State',
          options: getStoreOrderStateOptions(),
          wrapperClass: 'col-span-2',
        },
      },
      {
        key: 'createdAt',
        type: 'daterange',
        props: {
          label: 'Created on',
          disableFuture: true,
          wrapperClass: 'col-span-2',
          options: DATE_RANGE_OPTIONS_EXTENDED,
        },
      },
      {
        key: 'storeName',
        type: 'searchableselect',
        props: {
          label: 'Store',
          wrapperClass: 'col-span-2',
          placeholder: 'All stores',
          onInputValueChange: setStoreQuery,
          options: stores?.items?.map((store) => ({
            label: store.name,
            value: store.name,
          })),
          'data-testid': 'filter-store-name',
        },
      },
      {
        key: 'query',
        type: 'search',
        props: {
          label: 'Search',
          wrapperClass: !!options?.baseValues?.stationId ? 'hidden' : 'col-span-2',
          placeholder: 'Enter station name, station ID or order ID',
          list: 'stations',
          onChange: options?.onSearchChange,
          'data-testid': 'filter-query',
        },
      },
    ],
  });
}

export function Deliver2MeOrderList(props: {
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
    query: {data: storeOrders, isLoading, isSuccess, error},
  } = useDeliver2MeOrdersDataTableState({
    isActive: isOpen,
    baseValues: {stationId: props.stationId, query: props.stationId, userId: props.userId},
    onSearchChange: (e) => setStationSearch(e.target.value),
  });

  const {mutate: downloadStoreOrders, isLoading: isDownloading} = useDownloadDeliver2MeStoreOrders({
    onSuccess(csv) {
      downloadTextFile(
        csv,
        `concierge-orders.${new Date().toISOString()}.${JSON.stringify(
          _pickBy(values, Boolean),
        )}.csv`,
      );
    },
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
          data-testid="deliver2me-list-table"
          isLoading={isLoading}
          heading={
            <Card.Heading title={props.title || 'Deliver2Me'}>
              {!props?.hideDownload && (
                <HasPermission accessWith={[retailRoles.storeInCarOrderExport]}>
                  <Button
                    variant="outline"
                    leftIcon={<DownloadIcon />}
                    onClick={() =>
                      downloadStoreOrders({
                        storeName: values.storeName,
                        query: values.query,
                        state: values.state,
                        from: values.createdAt[0],
                        to: values.createdAt[1],
                      })
                    }
                    disabled={isDownloading || !storeOrders?.items?.length}
                    data-testid="action-download">
                    DOWNLOAD CSV
                  </Button>
                </HasPermission>
              )}
            </Card.Heading>
          }
          filter={filter}
          pagination={
            <PaginationNavigation
              currentPage={page}
              total={storeOrders?.total}
              perPage={perPage}
              onChangePage={setPage}
              onChangePageSize={setPerPage}
            />
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Customer</Table.Th>
              <Table.Th>State</Table.Th>
              <Table.Th>Store Name</Table.Th>
              <Table.Th className="text-right">Amount (RM)</Table.Th>
              <Table.Th className="text-right">Created On</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {storeOrders?.items?.map((order) => (
              <Table.Tr
                key={order.id}
                render={(props) => (
                  <Link
                    to={`/store-orders/concierge/${order.id}`}
                    {...props}
                    data-testid="deliver2me-list-item"
                  />
                )}>
                <Table.Td>{order.userFullName}</Table.Td>
                <Table.Td>
                  <Badge
                    size="small"
                    color={getStoreOrderStateBadgeColor(order.state)}
                    className="uppercase">
                    {getStoreOrderStateLabel(order.state)}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  {order.storeName}
                  <br />
                  <HelpText className="text-lightgrey">{order.stationName}</HelpText>
                </Table.Td>
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
          {isSuccess && !storeOrders?.items?.length && (
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
