import {
  DataTable as Table,
  Filter,
  FilterControls,
  formatDate,
  formatMoney,
  PaginationNavigation,
  titleCase,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {Link} from 'src/react/routing/link';
import {
  GetWalletTransactionOptions,
  getWalletTransactions,
} from 'src/react/services/api-wallets.service';
import {TransactionType} from 'src/shared/enums/wallet.enum';
import {paymentAdjustmentsQueryKey} from '../payments-adjustments.queries';

export interface PaymentsCustomerAdjustmentsListingProps {
  enabled: boolean;
}

export const PaymentsCustomerAdjustmentsListing = (
  props: PaymentsCustomerAdjustmentsListingProps,
) => {
  const {
    query: {isLoading, isFetching, data},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter: {
      dateRange: ['', ''],
    } as FilterValues,
    queryKey: paymentAdjustmentsQueryKey.indexCustomerAdjustments,
    queryFn: (data) => getWalletTransactions(transformToApiFilter(data)),
    components: [
      {
        key: 'dateRange',
        type: 'daterange',
        props: {
          label: 'Created at',
        },
      },
    ],
    enabled: props.enabled,
  });

  return (
    <PageContainer heading="Customer Adjustments">
      <div className="space-y-5">
        <FilterControls filter={filter} />
        <Filter filter={filter} />
        <Table
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={
            data &&
            (data.items.length > 0 || pagination.page > 1) && (
              <PaginationNavigation
                variant="prev-next"
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
              <Table.Th>Transaction Id</Table.Th>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Created on</Table.Th>
              <Table.Th className="text-right">Amount (RM)</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data &&
              data.items.map((trx) => (
                <Table.Tr key={trx.id}>
                  <Table.Td
                    render={(cellProps) => (
                      <Link
                        {...cellProps}
                        to={`/payments/adjustments/details/customer/${trx.transactionUid}`}
                      />
                    )}>
                    {trx.transactionUid}
                  </Table.Td>
                  <Table.Td
                    render={(cellProps) => <Link {...cellProps} to={`/customers/${trx.userId}`} />}>
                    {titleCase(trx.fullName) || '-'}
                  </Table.Td>
                  <Table.Td>{formatDate(trx.transactionDate)}</Table.Td>
                  <Table.Td className="text-right">{formatMoney(trx.amount)}</Table.Td>
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
}

const transformToApiFilter = ({
  dateRange: [transactionDateFrom, transactionDateTo],
  ...filter
}: FilterValues): GetWalletTransactionOptions => {
  return {
    ...filter,
    type: TransactionType.ADJUSTMENT,
    transactionDateFrom,
    transactionDateTo,
  };
};
