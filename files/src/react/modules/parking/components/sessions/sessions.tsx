import * as React from 'react';
import {
  FilterControls,
  Filter,
  useFilter,
  DATE_RANGES,
  DATE_RANGE_OPTIONS_EXTENDED,
  usePaginationState,
  DataTable,
  DataTableRowGroup,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  PaginationNavigation,
  formatMoney,
  formatDate,
  Badge,
  useDebounce,
} from '@setel/portal-ui';
import {PageContainer} from 'src/react/components/page-container';
import {
  // PaymentTypeOptions,
  SessionStatusesOptions,
  SessionStatusesBadge,
} from '../../parking.const';
import {useGetParkingSessions} from '../../parking.queries';
import {useGetLocationsList} from '../../custom-hooks/use-get-locations-list';

export const ParkingSessions = () => {
  const pagination = usePaginationState();
  const [searchLocation, setSearchLocation] = React.useState('');
  const searchLocationName = useDebounce(searchLocation);
  const {optionsGroup} = useGetLocationsList({name: searchLocationName});

  const filter = useFilter(
    {paymentId: '', sessionStatus: '', dateRange: DATE_RANGES.anyDate, query: '', locationId: ''},
    {
      baseValues: {paymentId: '', sessionStatus: '', dateRange: DATE_RANGES.anyDate, query: ''},
      components: [
        // {
        //   key: 'paymentId',
        //   type: 'select',
        //   props: {label: 'Payment method', options: PaymentTypeOptions},
        // },
        {
          key: 'sessionStatus',
          type: 'select',
          props: {label: 'Parking status', options: SessionStatusesOptions},
        },
        {
          key: 'dateRange',
          type: 'daterange',
          props: {
            label: 'Created on',
            options: DATE_RANGE_OPTIONS_EXTENDED,
            disableFuture: true,
          },
        },
        {
          key: 'locationId',
          type: 'searchableselect',
          props: {
            label: 'Location',
            onInputValueChange: setSearchLocation,
            options: optionsGroup,
            placeholder: 'Search for location',
          },
        },
        {
          key: 'query',
          type: 'search',
          props: {
            label: 'Search',
            wrapperClass: 'col-span-2',
            placeholder: 'Search vehicle plate no',
          },
        },
      ],
    },
  );

  const [{values}] = filter;

  const {data, isLoading, isError} = useGetParkingSessions({...values, pagination});

  return (
    <PageContainer heading="Sessions">
      <FilterControls className="grid-cols-4 mb-6" filter={filter} data-testid="filter-controls" />
      <Filter filter={filter} className="pb-6" />
      <DataTable
        isLoading={isLoading}
        pagination={
          <PaginationNavigation
            currentPage={pagination.page}
            perPage={pagination.perPage}
            onChangePage={pagination.setPage}
            onChangePageSize={pagination.setPerPage}
          />
        }>
        <DataTableRowGroup groupType="thead">
          <Tr data-testid="session-column-names">
            <Td>Plate number</Td>
            <Td>Status</Td>
            <Td>Location Name</Td>
            <Td className="text-right">Amount (RM)</Td>
            <Td>Created On</Td>
          </Tr>
        </DataTableRowGroup>
        {isError || !data?.data?.length ? (
          <DataTableCaption className="text-center py-12 text-mediumgrey text-md">
            <p>No sessions found</p>
          </DataTableCaption>
        ) : (
          <DataTableRowGroup>
            {data?.data?.map((session) => (
              <Tr
                key={session.id}
                render={(props) => (
                  <a
                    {...props}
                    href={`/parking-affiliate/sessions/${session.id}`}
                    data-testid="sessions-row"
                  />
                )}>
                <Td className="flex flex-col">
                  <div>{session.plateNumber ?? '-'}</div>
                  <div className="text-gray-400 text-xs">{session.userFullname}</div>
                </Td>
                <Td>
                  {session.status ? (
                    <Badge
                      color={SessionStatusesBadge.get(session.status)?.color || 'grey'}
                      rounded="rounded"
                      className="uppercase">
                      {SessionStatusesBadge.get(session.status)?.text || session.status}
                    </Badge>
                  ) : (
                    '-'
                  )}
                </Td>
                <Td>{session.locationName}</Td>
                <Td className="text-right flex flex-col">
                  <div>{formatMoney(session.finalFees)}</div>
                  {/*<div className="text-gray-400 text-xs">{session.paymentId}</div>*/}
                </Td>
                <Td>{formatDate(session.createdAt)}</Td>
              </Tr>
            ))}
          </DataTableRowGroup>
        )}
      </DataTable>
    </PageContainer>
  );
};
