import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {
  Alert,
  Card,
  classes,
  DataTable,
  DataTableRowGroup,
  PaginationNavigation,
  Filter,
  FilterControls,
} from '@setel/portal-ui';
import {DataTableRow as Tr} from '@setel/portal-ui';
import {DataTableCell as Td} from '@setel/portal-ui';
import {Link} from '../../routing/link';
import * as React from 'react';
import {getCustomer} from './customers.service';

export const CustomerListing = () => {
  const {
    query: {data, isError, isLoading},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter: {filterText: ''},
    components: [
      {
        key: 'filterText',
        type: 'search',
        props: {
          label: 'Search',
          placeholder: 'Search by name, email, mobile number or device ID',
          wrapperClass: 'md:col-span-2',
        },
      },
    ],
    queryKey: 'customer',
    keepPreviousData: true,
    queryFn: ({filterText, page, perPage}) =>
      getCustomer({
        page,
        perPage,
        sortDate: 'desc',
        search: filterText.trim() !== '' ? filterText.trim() : undefined,
      }),
  });

  const isEmptyCustomerList = !data || !data.items || data?.items?.length === 0;
  return (
    <>
      <div className="grid gap-4 pt-4 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between">
          <h1 className={classes.h1}>Accounts</h1>
        </div>
        {isError && (
          <Alert variant="error" description="Server error! Please try again." accentBorder />
        )}
        {!isError && (
          <>
            <FilterControls filter={filter}></FilterControls>
            <Filter filter={filter}></Filter>
            <Card className="mb-8">
              <DataTable
                data-testid="customers-listing-table"
                isLoading={isLoading}
                striped
                pagination={
                  <PaginationNavigation
                    total={data && data.total}
                    currentPage={pagination.page}
                    perPage={pagination.perPage}
                    onChangePage={pagination.setPage}
                    onChangePageSize={pagination.setPerPage}
                  />
                }>
                <DataTableRowGroup groupType="thead">
                  <Tr>
                    <Td>Name</Td>
                    <Td>Phone Number</Td>
                    <Td>Email</Td>
                    <Td className="w-1/7">Tier</Td>
                    <Td>Created On</Td>
                  </Tr>
                </DataTableRowGroup>
                <DataTableRowGroup>
                  {!isLoading &&
                    !isError &&
                    !isEmptyCustomerList &&
                    data?.items.map((Customer, index) => (
                      <Tr
                        render={(props) => <Link {...props} to={`/customers/${Customer.id}`} />}
                        key={index}>
                        <Td>{Customer?.name}</Td>
                        <Td>{Customer?.phone}</Td>
                        <Td>{Customer?.email}</Td>
                        <Td>{Customer?.tierTitle}</Td>
                        <Td>{Customer?.createdAt}</Td>
                      </Tr>
                    ))}
                </DataTableRowGroup>
              </DataTable>
              {isEmptyCustomerList && (
                <Card className="w-full flex items-center justify-center py-12">
                  No users found
                </Card>
              )}
            </Card>
          </>
        )}
      </div>
    </>
  );
};
