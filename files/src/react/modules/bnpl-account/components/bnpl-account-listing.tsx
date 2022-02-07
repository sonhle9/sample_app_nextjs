import {
  Badge,
  DataTable as Table,
  Filter,
  FilterControls,
  formatDate,
  formatMoney,
  PaginationNavigation,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {getBnplAccounts} from 'src/react/services/api-bnpl.service';
import {
  bnplAccountAvailableLimitOptions,
  bnplAccountCreditLimitOptions,
  bnplAccountStatusColor,
  bnplAccountStatusOptions,
  dateOptions,
} from '../bnpl-account.constant';
import {BnplAccountStatus, GetBnplAccountOptions} from '../bnpl-account.type';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {bnplAccountQueryKey} from '../bnpl-account.queries';
import {Link} from 'src/react/routing/link';

export const BNPLAccountListing = () => {
  const {
    query: {data, isLoading, isFetching},
    pagination,
    filter,
  } = useDataTableState({
    initialFilter: {
      status: '',
      dateRange: ['', ''],
      creditLimit: '',
      creditBalance: '',
      search: '',
    } as unknown as FilterValues,
    queryKey: bnplAccountQueryKey.accountListing,
    queryFn: (values: FilterValues) => getBnplAccounts(transformToApiFilter(values)),
    components: [
      {
        key: 'status',
        type: 'select',
        props: {
          label: 'Account status',
          options: bnplAccountStatusOptions,
          placeholder: 'All status',
        },
      },
      {
        key: 'creditLimit',
        type: 'select',
        props: {
          label: 'Credit limit',
          options: bnplAccountCreditLimitOptions,
          placeholder: 'Any credit limit',
        },
      },
      {
        key: 'creditBalance',
        type: 'select',
        props: {
          label: 'Available limit',
          options: bnplAccountAvailableLimitOptions,
          placeholder: 'Any available limit',
        },
      },
      {
        key: 'dateRange',
        type: 'daterange',
        props: {
          dayOnly: true,
          label: 'Activation date',
          placeholder: 'All dates',
          options: dateOptions,
        },
      },
      {
        key: 'search',
        type: 'search',
        props: {
          label: 'Search',
          wrapperClass: 'col-span-2',
          placeholder: 'Search by name',
          'data-testid': 'textbox',
        },
      },
    ],
  });

  return (
    <PageContainer heading="BNPL Accounts">
      <div className="space-y-5">
        <FilterControls className="grid-cols-4" filter={filter} />
        <Filter filter={filter} />
        <Table
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={
            data &&
            (data.items.length > 0 || pagination.page > 1) && (
              <PaginationNavigation
                variant="page-list"
                onChangePage={pagination.setPage}
                onChangePageSize={pagination.setPerPage}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                total={data.total}
              />
            )
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Account Status</Table.Th>
              <Table.Th className="text-right">Credit limit (RM)</Table.Th>
              <Table.Th className="text-right">Available limit (RM)</Table.Th>
              <Table.Th className="text-right">activation date</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data &&
              data.items.map((acc) => (
                <Table.Tr
                  key={acc.id}
                  render={(cellProps) => (
                    <Link {...cellProps} to={`/buy-now-pay-later/accounts/details/${acc.id}`} />
                  )}>
                  <Table.Td>{acc.name}</Table.Td>

                  <Table.Td>
                    <Badge color={bnplAccountStatusColor[acc.status]}>
                      {BnplAccountStatus[acc.status].toUpperCase()}
                    </Badge>
                  </Table.Td>

                  <Table.Td className="text-right">
                    {acc.creditLimit ? formatMoney(acc.creditLimit) : '-'}
                  </Table.Td>

                  <Table.Td className="text-right">
                    {acc.creditBalance ? formatMoney(acc.creditBalance) : '-'}
                  </Table.Td>
                  <Table.Td className="text-right">
                    {acc.activationDate
                      ? formatDate(
                          new Date(acc.activationDate).toLocaleString('en-US', {
                            timeZone: 'Asia/Kuala_Lumpur',
                          }),
                          {format: 'dd MMM yyyy'},
                        )
                      : '-'}
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
          {data && data.items.length === 0 && (
            <Table.Caption>
              <div className="p-6 text-center">
                <span>No records found.</span>
              </div>
            </Table.Caption>
          )}
        </Table>
      </div>
    </PageContainer>
  );
};

interface FilterValues {
  dateRange: [string, string];
  status: BnplAccountStatus;
  creditLimit: number;
  creditBalance: number;
  search: string;
}

const transformToApiFilter = ({
  dateRange: [dateFrom, dateTo],
  ...filter
}: FilterValues): GetBnplAccountOptions => {
  return {
    ...filter,
    dateFrom,
    dateTo,
  };
};
