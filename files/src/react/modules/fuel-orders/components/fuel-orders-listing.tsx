import {
  Badge,
  DataTable,
  DataTableCaption,
  DataTableCell,
  DataTableRow,
  DataTableRowGroup,
  DATE_RANGE_OPTIONS_EXTENDED,
  Filter,
  FilterControls,
  formatMoney,
  Pagination,
  DATE_RANGES,
} from '@setel/portal-ui';
import {AxiosError} from 'axios';
import format from 'date-fns/format';
import React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {filterEmptyString, IPaginationResult} from 'src/react/lib/ajax';
import {IFuelOrder, IOrdersError} from 'src/react/services/api-orders.type';
import {DownloadCsvDropdown} from '../../../components/download-csv-dropdown';
import {useNotification} from '../../../hooks/use-notification';
import {Link} from '../../../routing/link';
import {indexOrders} from '../../../services/api-orders.service';
import {sendReport} from '../../../services/api-reports.service';
import {
  fuelOrdersReportConfig,
  FUEL_ORDER_FILTERS_PAYMENT_METHODS,
  FUEL_STATUS_DROPDOWN_OPTIONS,
} from '../fuel-orders.const';
import {getBadgeColorForStatus} from '../fuel-orders.helpers';
import {useGetAdminTags} from '../fuel-orders.queries';
import {IFuelOrdersFilter} from '../fuel-orders.type';

type IFilters = Pick<
  IFuelOrdersFilter,
  'query' | 'paymentProvider' | 'status' | 'date' | 'adminTags'
>;

const initialFilter: IFilters = {
  query: '',
  paymentProvider: '',
  status: '',
  date: DATE_RANGES.last7days,
  adminTags: [],
};

const DATE_RANGE_OPTIONS_WITHOUT_ANY = DATE_RANGE_OPTIONS_EXTENDED.slice(1);

export const FuelOrdersListing = () => {
  const setGlobalMessage = useNotification();
  const {data: adminTags} = useGetAdminTags<{value: string; label: string}[]>({
    select: (result) =>
      result.map((adminTag) => ({
        value: adminTag.name,
        label: adminTag.name,
      })),
  });

  const {
    filter,
    filter: [{values: filters}],
    pagination: {page, perPage, setPage, setPerPage},
    query: {data: fuelOrderData, isLoading},
  } = useDataTableState<IFilters, IPaginationResult<IFuelOrder>, AxiosError<IOrdersError>>({
    queryKey: 'fuel-orders-listing',
    queryFn: (filter) =>
      indexOrders(
        {page: filter.page, perPage: filter.perPage},
        {
          query: filter.query,
          status: filter.status,
          paymentProvider: filter.paymentProvider,
          from: filter.date[0],
          to: filter.date[1],
          adminTags: filter.adminTags,
        },
      ),
    initialFilter,
    baseValues: initialFilter,
    components: [
      {
        key: 'paymentProvider',
        type: 'select',
        props: {
          options: FUEL_ORDER_FILTERS_PAYMENT_METHODS,
          label: 'Payment method',
          wrapperClass: 'col-span-1',
          placeholder: 'Any payment method',
          'data-testid': 'fuel-order-filter-pay-methods',
        },
      },
      {
        key: 'status',
        type: 'select',
        props: {
          options: FUEL_STATUS_DROPDOWN_OPTIONS,
          label: 'Fuelling status',
          wrapperClass: 'col-span-1',
          placeholder: 'Any fuelling statuses',
          'data-testid': 'fuel-order-filter-status',
        },
      },
      {
        key: 'date',
        type: 'daterange',
        props: {
          label: 'Created date',
          placeholder: 'Any dates',
          wrapperClass: 'col-span-2',
          disableFuture: true,
          options: DATE_RANGE_OPTIONS_WITHOUT_ANY,
          'data-testid': 'fuel-order-filter-date',
        },
      },
      {
        key: 'adminTags',
        props: {
          label: 'Search by tag',
          wrapperClass: 'col-span-2',
          placeholder: 'Search any tag',
          'data-testid': 'fuel-order-search-tags',
          options: adminTags,
        },
        type: 'multiselect',
      },
      {
        key: 'query',
        props: {
          label: 'Search',
          wrapperClass: 'col-span-2',
          placeholder: 'Search by Order ID or Station ID',
          'data-testid': 'fuel-order-search-orderId',
        },
        type: 'search',
      },
    ],
  });

  return (
    <PageContainer
      heading="Fuel orders"
      action={
        <DownloadCsvDropdown
          leftIcon
          onSendEmail={(emails) =>
            sendReport({
              emails,
              reportName: fuelOrdersReportConfig.reportName,
              filter: filterEmptyString({
                query: filters.query,
                status: filters.status,
                paymentProvider: filters.paymentProvider,
                from: filters.date[0],
                to: filters.date[1],
                adminTags: filters.adminTags,
              }),
            })
              .then(() => setGlobalMessage({title: 'Successfully sent reports'}))
              .catch(() =>
                setGlobalMessage({
                  title: 'Failed to send reports',
                  variant: 'error',
                }),
              )
          }
        />
      }>
      <div className="pb-6">
        <FilterControls className="grid-cols-4" filter={filter}></FilterControls>
        <Filter labelText="Search results for" className="pt-6" filter={filter} />
      </div>
      <div>
        <DataTable
          isLoading={isLoading}
          striped
          pagination={
            ((fuelOrderData && fuelOrderData.items.length > 0) || page > 1) && (
              <Pagination
                currentPage={page}
                pageSize={perPage}
                lastPage={0}
                onChangePage={setPage}
                onChangePageSize={setPerPage}
                variant="prev-next"
                hideIfSinglePage={false}
              />
            )
          }
          data-testid="fuel-orders-list">
          <DataTableRowGroup groupType="thead">
            <DataTableRow>
              <DataTableCell className="max-w-xs lg:max-w-md text-lightgrey">
                CUSTOMER
              </DataTableCell>
              <DataTableCell className="text-lightgrey">FUELLING STATUS</DataTableCell>
              <DataTableCell className="max-w-xs lg:max-w-md text-lightgrey">
                STATION NAME
              </DataTableCell>
              <DataTableCell className="whitespace-nowrap text-right text-lightgrey">
                AMOUNT (RM)
              </DataTableCell>
              <DataTableCell className="min-w-44 text-right text-lightgrey">
                CREATED ON
              </DataTableCell>
            </DataTableRow>
          </DataTableRowGroup>
          <DataTableRowGroup groupType="tbody">
            {fuelOrderData &&
              fuelOrderData.items.map((fuelOrder) => (
                <DataTableRow key={fuelOrder.orderId}>
                  <DataTableCell className="max-w-xs lg:max-w-md">
                    <Link to={`/customers/${fuelOrder.userId}`}>{fuelOrder.userFullName}</Link>
                  </DataTableCell>
                  <DataTableCell>
                    <Link to={`/retail/fuel-orders/${fuelOrder.orderId}`}>
                      <Badge
                        color={getBadgeColorForStatus(fuelOrder.status)}
                        rounded="rounded"
                        size="small">
                        {fuelOrder.statusLabel.toUpperCase()}
                      </Badge>
                    </Link>
                  </DataTableCell>
                  <DataTableCell className="max-w-xs lg:max-w-md">
                    <Link to={`/stations/${fuelOrder.stationId}/orders`}>
                      {fuelOrder.stationName}
                    </Link>
                  </DataTableCell>
                  <DataTableCell className="text-right">
                    {fuelOrder.amount ? (
                      <div className="text-right">
                        <div className="flex justify-end items-center">
                          <span className="mr-1">{formatMoney(fuelOrder.amount)}</span>
                        </div>
                        <div className="text-gray-400 text-xs">{fuelOrder.paymentProvider}</div>
                      </div>
                    ) : (
                      '-'
                    )}
                  </DataTableCell>
                  <DataTableCell className="text-right">
                    {fuelOrder.createdAt &&
                      format(new Date(fuelOrder.createdAt), 'dd MMM yyyy, hh:mm a')}
                  </DataTableCell>
                </DataTableRow>
              ))}
          </DataTableRowGroup>
          {fuelOrderData && fuelOrderData.items.length === 0 && (
            <DataTableCaption>
              <div className="py-3 bg-white">
                <p className="text-gray-400 text-center my-3">No fuel order was found</p>
              </div>
            </DataTableCaption>
          )}
        </DataTable>
      </div>
    </PageContainer>
  );
};
