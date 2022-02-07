import {
  Badge,
  Button,
  DataTable as Table,
  DownloadIcon,
  Filter,
  FilterControls,
  formatDate,
  formatMoney,
  TextEllipsis,
  PaginationNavigation,
  titleCase,
} from '@setel/portal-ui';
import * as React from 'react';
import {TRANSACTION_MIX_PAYMENT_METHODS} from 'src/app/transactions/shared/const-var';
import {Link} from 'src/react/routing/link';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {
  IndexPaymentsTransactionFilter,
  indexTransactions,
  TransactionStatus,
} from 'src/react/services/api-payments.service';
import {TRANSACTION_MIX_TYPE} from '../payment-transactions.const';
import {
  paymentTransactionsQueryKey,
  useDownloadTransactions,
} from '../payment-transactions.queries';
import {readErrorMessage, getPaymentMethod} from '../payment-transactions.lib';

export const PaymentsTransactionsListing = () => {
  const {
    query: {isLoading, isFetching, data},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter: {
      status: '',
      paymentMethod: '',
      type: '',
      dateRange: ['', ''],
    } as FilterValues,
    queryKey: paymentTransactionsQueryKey.indexTransactions,
    queryFn: (data) => indexTransactions(transformToApiFilter(data)),
    components: [
      {
        key: 'type',
        type: 'select',
        props: {
          label: 'Type',
          options: typeOptions,
          placeholder: 'All type',
          'data-testid': 'type-filter',
        },
      },
      {
        key: 'status',
        type: 'select',
        props: {
          label: 'Status',
          options: statusOptions,
          placeholder: 'All status',
        },
      },
      {
        key: 'paymentMethod',
        type: 'select',
        props: {
          label: 'Payment method',
          options: paymentMethodOptions,
          placeholder: 'All payment method',
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

  const {mutate: download, isLoading: isDownloading} = useDownloadTransactions();

  const [{values}] = filter;

  return (
    <PageContainer
      heading="Transactions"
      action={
        <Button
          onClick={() => {
            const {
              type,
              subtype,
              dateRange: [from, to],
              status,
            } = transformToApiFilter(values);
            download({
              type,
              subType: subtype,
              from,
              to,
              status,
            });
          }}
          variant="outline"
          leftIcon={<DownloadIcon />}
          isLoading={isDownloading}>
          DOWNLOAD CSV
        </Button>
      }>
      <div className="space-y-5">
        <FilterControls filter={filter} />
        <Filter filter={filter} />
        <Table
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={
            data && (
              <PaginationNavigation
                variant="prev-next"
                onChangePage={pagination.setPage}
                onChangePageSize={pagination.setPerPage}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                hideIfSinglePage={false}
              />
            )
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Transaction Id</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Created on</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Payment method</Table.Th>
              <Table.Th className="text-right">Amount (RM)</Table.Th>
              <Table.Th>Error message</Table.Th>
              <Table.Th>Message</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data &&
              data.items.map((trx) => (
                <Table.Tr key={trx.id}>
                  <Table.Td>
                    <Link to={`/payments/transactions/details/${trx.id}`}>{trx.id}</Link>
                  </Table.Td>
                  <Table.Th>
                    <Badge color={statusColor[trx.status]} className="uppercase">
                      {trx.status}
                    </Badge>
                  </Table.Th>
                  <Table.Th>
                    <a href={`/customers/${trx.userId}`} target="_BLANK">
                      {trx.fullName}
                    </a>
                  </Table.Th>
                  <Table.Th>{formatDate(trx.createdAt, {formatType: 'dateAndTime'})}</Table.Th>
                  <Table.Th>{titleCase(trx.type)}</Table.Th>
                  <Table.Th>{getPaymentMethod(trx)}</Table.Th>
                  <Table.Th className="text-right">{formatMoney(trx.amount)}</Table.Th>
                  <Table.Th>
                    <TextEllipsis text={readErrorMessage(trx)} widthClass="w-36" />
                  </Table.Th>
                  <Table.Th>
                    {trx.message && <TextEllipsis text={trx.message} widthClass="w-20" />}
                  </Table.Th>
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

interface FilterValues
  extends Omit<
    IndexPaymentsTransactionFilter,
    'type' | 'subtype' | 'paymentMethod' | 'paymentSubmethod'
  > {
  type: string;
  paymentMethod: string;
}

const transformToApiFilter = (filter: FilterValues): IndexPaymentsTransactionFilter => {
  const {type, subType} = TRANSACTION_MIX_TYPE[filter.type] || {};
  const {paymentMethod, paymentSubmethod} =
    TRANSACTION_MIX_PAYMENT_METHODS[filter.paymentMethod] || {};
  return {
    ...filter,
    type,
    subtype: subType,
    paymentMethod,
    paymentSubmethod,
  };
};

const statusOptions = Object.values(TransactionStatus).map((value) => ({
  value,
  label: titleCase(value),
}));

const typeOptions = Object.entries(TRANSACTION_MIX_TYPE).map(([value, details]) => ({
  value,
  label: details.text,
}));

const paymentMethodOptions = Object.entries(TRANSACTION_MIX_PAYMENT_METHODS).map(
  ([value, details]) => ({
    value,
    label: details.text,
  }),
);

const statusColor = {
  [TransactionStatus.success]: 'success',
  [TransactionStatus.error]: 'error',
  [TransactionStatus.failed]: 'error',
  [TransactionStatus.pending]: 'lemon',
  [TransactionStatus.cancelled]: 'warning',
  [TransactionStatus.incoming]: 'lemon',
  [TransactionStatus.reversed]: 'blue',
} as const;
