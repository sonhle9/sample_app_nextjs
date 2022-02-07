import {
  Badge,
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
import {TransactionStatus, TransactionType, getTopUpTypeLabel} from 'src/shared/enums/wallet.enum';
import {topupRefundQueryKeys} from '../topup-refund.queries';
import {topupRefundStatusColor} from '../topup-refund.const';

export const TopupRefundListing = () => {
  const {
    query: {isLoading, isFetching, data},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter: {
      dateRange: ['', ''],
      status: '',
    } as FilterValues,
    queryKey: topupRefundQueryKeys.list,
    queryFn: (data) => getWalletTransactions(transformToApiFilter(data)),
    components: [
      {
        key: 'status',
        type: 'select',
        props: {
          label: 'Status',
          options: statusOptions,
          placeholder: 'All',
        },
      },
      {
        key: 'dateRange',
        type: 'daterange',
        props: {
          label: 'Created at',
        },
      },
    ],
  });

  return (
    <PageContainer heading="Top-up Refunds">
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
              <Table.Th>Status</Table.Th>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Topup Type</Table.Th>
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
                        to={`/wallet/topup-refunds/details/${trx.transactionUid}`}
                      />
                    )}>
                    {trx.transactionUid}
                  </Table.Td>
                  <Table.Td>
                    <Badge color={topupRefundStatusColor[trx.status]}>{trx.status}</Badge>
                  </Table.Td>
                  <Table.Td
                    render={(cellProps) => <Link {...cellProps} to={`/customers/${trx.userId}`} />}>
                    {titleCase(trx.fullName) || '-'}
                  </Table.Td>
                  <Table.Td>{getTopUpTypeLabel(trx.subType)}</Table.Td>
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
  status: '';
}

const transformToApiFilter = ({
  dateRange: [transactionDateFrom, transactionDateTo],
  ...filter
}: FilterValues): GetWalletTransactionOptions => {
  return {
    ...filter,
    type: TransactionType.TOPUP_REFUND,
    transactionDateFrom,
    transactionDateTo,
  };
};

const statusOptions = Object.values(TransactionStatus).map((value) => ({
  value,
  label: titleCase(value),
}));
