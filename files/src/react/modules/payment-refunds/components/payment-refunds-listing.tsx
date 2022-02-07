import {
  Badge,
  DataTable as Table,
  Filter,
  FilterControls,
  formatDate,
  formatMoney,
  PaginationNavigation,
  TextEllipsis,
  titleCase,
} from '@setel/portal-ui';
import * as React from 'react';
import {RefundStatus} from 'src/app/refunds/shared/const-var';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {
  IndexMerchantTransactionFilter,
  indexMerchantTransactions,
} from 'src/react/services/api-merchants.service';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {TransactionType} from 'src/shared/enums/merchant.enum';
import {paymentRefundsQueryKey} from '../payment-refunds.queries';

const webDashboardUrl = CURRENT_ENTERPRISE.dashboardUrl;

export const PaymentRefundsListing = () => {
  const {
    query: {isLoading, isFetching, data},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter: {
      status: '',
      dateRange: ['', ''],
    } as FilterValues,
    queryKey: paymentRefundsQueryKey.indexRefunds,
    queryFn: (filterValues) => indexMerchantTransactions(transformToApiFilter(filterValues)),
    components: [
      {
        key: 'status',
        type: 'select',
        props: {
          label: 'Status',
          options: statusOptions,
          placeholder: 'All statuses',
          'data-testid': 'status-filter',
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
    <PageContainer heading="Refunds">
      <div className="space-y-5">
        <FilterControls filter={filter} />
        <Filter filter={filter} />
        <Table
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={
            data &&
            data.items.length > 0 && (
              <PaginationNavigation
                variant="prev-next"
                onChangePage={pagination.setPage}
                onChangePageSize={pagination.setPerPage}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                hideIfSinglePage={data.nextPage <= pagination.page && !isFetching}
              />
            )
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Transaction Id</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Merchant</Table.Th>
              <Table.Th>Created on</Table.Th>
              <Table.Th className="text-right">Amount (RM)</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data &&
              data.items.map((trx) => (
                <Table.Tr key={trx.transactionUid}>
                  <Table.Td
                    render={(cellProps) => (
                      <a
                        {...cellProps}
                        href={`${webDashboardUrl}/payments/transactions?merchantId=${trx.merchantId}&transactionId=${trx.transactionUid}&redirect-from=admin`}
                        target="_BLANK"
                        rel="noopener noreferrer"
                      />
                    )}>
                    {trx.transactionUid}
                  </Table.Td>
                  <Table.Td>
                    <Badge color={statusColor[trx.status]} className="uppercase">
                      {trx.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td
                    render={(cellProps) => (
                      <a {...cellProps} href={`/customers/${trx.userId}`} target="_BLANK" />
                    )}>
                    {trx.fullName}
                  </Table.Td>
                  <Table.Td
                    render={
                      trx.merchantId
                        ? (cellProps) => (
                            <a
                              {...cellProps}
                              href={`${webDashboardUrl}/settings?merchantId=${trx.merchantId}&redirect-from=admin`}
                              target="_BLANK"
                              rel="noopener noreferrer"
                            />
                          )
                        : undefined
                    }>
                    <TextEllipsis
                      text={
                        (trx.attributes &&
                          titleCase(trx.attributes.merchantName, {hasWhitespace: true})) ||
                        '-'
                      }
                      widthClass="w-36"
                    />
                  </Table.Td>
                  <Table.Td>
                    {formatDate(trx.createdAt, {
                      formatType: 'dateAndTime',
                      format: 'dd MMM yyyy, hh:mm a',
                    })}
                  </Table.Td>
                  <Table.Td className="text-right">{formatMoney(trx.amount)}</Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
          {data && data.items.length === 0 && (
            <Table.Caption>
              <div className="p-12 text-center">
                <p>No data to be displayed.</p>
              </div>
            </Table.Caption>
          )}
        </Table>
      </div>
    </PageContainer>
  );
};

const statusOptions = Object.entries(RefundStatus).map(([value, label]) => ({
  value,
  label: titleCase(label, {hasUnderscore: true}),
}));

interface FilterValues {
  status: string;
  dateRange: [string, string];
}

const transformToApiFilter = ({
  dateRange: [transactionDateFrom, transactionDateTo],
  ...filter
}: FilterValues &
  Pick<IndexMerchantTransactionFilter, 'page' | 'perPage'>): IndexMerchantTransactionFilter => {
  return {
    ...filter,
    type: TransactionType.REFUND,
    transactionDateFrom,
    transactionDateTo,
  };
};

const statusColor = {
  [RefundStatus.SUCCEEDED]: 'success',
  [RefundStatus.SETTLED]: 'blue',
  [RefundStatus.FAILED]: 'error',
  [RefundStatus.CREATED]: 'lemon',
} as const;
