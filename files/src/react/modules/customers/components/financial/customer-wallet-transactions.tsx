import {
  Badge,
  Card,
  CardContent,
  CardHeading,
  DataTable as Table,
  DataTableCaption,
  DataTableCell as Td,
  DataTableExpandableGroup as ExpandGroup,
  DataTableExpandableRow as ExpandableRow,
  DataTableExpandButton as ExpandButton,
  DataTableRow as Tr,
  DataTableRowGroup,
  DescItem,
  DescList,
  Filter,
  FilterControls,
  PaginationNavigation,
  Section,
  formatDate,
  formatMoney,
  titleCase,
} from '@setel/portal-ui';
import * as React from 'react';
import {AxiosError} from 'axios';
import {transactionRole} from 'src/shared/helpers/roles.type';
import {HasPermission} from 'src/react/modules/auth/HasPermission';
import {Link} from 'src/react/routing/link';
import {
  IndexPaymentsTransactionFilter,
  indexTransactions,
  PaymentTransaction,
  TransactionStatus,
} from 'src/react/services/api-payments.service';
import {TRANSACTION_MIX_TYPE} from 'src/react/modules/payments-transactions/payment-transactions.const';
import {TRANSACTION_MIX_PAYMENT_METHODS} from 'src/app/transactions/shared/const-var';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {paymentTransactionsQueryKey} from '../../../payments-transactions/payment-transactions.queries';
import {
  getPaymentMethod,
  readErrorMessage,
} from 'src/react/modules/payments-transactions/payment-transactions.lib';
import {usePaymentTransactionDetails} from '../../customers.queries';

export function CustomerWalletTransactions({userId}: {userId: string}) {
  const [open, setOpen] = React.useState(false);

  const {
    query: {isLoading, isFetching, isFetched, data},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter: {
      userId,
      status: '',
      paymentMethod: '',
      type: '',
      dateRange: ['', ''],
    } as FilterValues,
    queryKey: paymentTransactionsQueryKey.indexUserTransactions,
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
    ],
    enabled: open,
    retry: (retryCount, err: AxiosError) => {
      return err?.response?.status !== 404 && retryCount < 3;
    },
  });

  return (
    <HasPermission accessWith={[transactionRole.view]}>
      <Section>
        <Card
          expandable
          isOpen={open}
          onToggleOpen={() => setOpen((prev) => !prev)}
          data-testid="customer-financial-wallet-transactions-card">
          <CardHeading title="Transactions" />
          <CardContent>
            <div className="sm:-mx-7 -mx-4 -my-5">
              <FilterControls className="mb-2 shadow-none" filter={filter} />
              <Filter filter={filter} className="sm:px-7 px-4 pb-3.5" />
              <Table
                native
                isLoading={isLoading}
                isFetching={isFetching}
                pagination={
                  data?.items?.length && (
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
                <DataTableRowGroup groupType="thead">
                  <Tr>
                    <Td data-testid="customer-wallet-transactions-card-id">Transaction Id</Td>
                    <Td>Status</Td>
                    <Td>Type</Td>
                    <Td>Created On</Td>
                    <Td className="text-right">Payment Method</Td>
                  </Tr>
                </DataTableRowGroup>
                <DataTableRowGroup groupType="tbody">
                  {data?.items?.map((transaction) => (
                    <CustomerWalletTransactionsRow key={transaction.id} transaction={transaction} />
                  ))}
                </DataTableRowGroup>
                {isFetching ||
                  (isFetched && !data?.items?.length && (
                    <DataTableCaption>
                      <div className="py-12">
                        <p className="text-sm text-center text-gray-400">No data available.</p>
                      </div>
                    </DataTableCaption>
                  ))}
              </Table>
            </div>
          </CardContent>
        </Card>
      </Section>
    </HasPermission>
  );
}

export function CustomerWalletTransactionsRow({transaction}: {transaction: PaymentTransaction}) {
  const [open, setOpen] = React.useState(false);

  const {data: trxDetails, isLoading: trxDetailsLoading} = usePaymentTransactionDetails(
    transaction.id,
    {enabled: open},
  );

  return (
    <ExpandGroup>
      <Tr>
        <Td>
          <ExpandButton
            data-testid={`expand-customer-wallet-transaction-details-btn-${transaction.id}`}
            onClick={() => setOpen((prev) => !prev)}
          />
          <Link className="inline" to={`/payments/transactions/${transaction.id}`}>
            {transaction.id}
          </Link>
        </Td>
        <Td>
          <Badge color={statusColor[transaction.status]} className="uppercase">
            {transaction.status}
          </Badge>
        </Td>
        <Td>{titleCase(transaction.type)}</Td>
        <Td>{formatDate(transaction.createdAt, {formatType: 'dateAndTime'})}</Td>
        <Td className="text-right">{getPaymentMethod(transaction)}</Td>
      </Tr>
      <ExpandableRow>
        <DescList isLoading={trxDetailsLoading} data-testid="customer-wallet-transaction-details">
          <DescItem
            label="Station name"
            value={trxDetails?.stationName ? trxDetails?.stationName : '-'}
          />
          <DescItem label="Amount" value={transaction.amount ? transaction.amount : '-'} />
          {transaction.paymentMethod ===
            TRANSACTION_MIX_PAYMENT_METHODS['walletSetel'].paymentMethod &&
            transaction.paymentSubmethod ===
              TRANSACTION_MIX_PAYMENT_METHODS['walletSetel'].paymentSubmethod && (
              <DescItem
                label="Wallet balance"
                value={
                  formatMoney(trxDetails?.walletBalance)
                    ? `RM ${formatMoney(trxDetails?.walletBalance)}`
                    : '-'
                }
              />
            )}
          <DescItem
            label="Error message"
            value={readErrorMessage(transaction) ? readErrorMessage(transaction) : '-'}
            data-testid="customer-wallet-transaction-details-error"
          />
          <DescItem label="Message" value={transaction.message ? transaction.message : '-'} />
        </DescList>
      </ExpandableRow>
    </ExpandGroup>
  );
}

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
