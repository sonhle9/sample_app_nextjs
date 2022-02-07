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
import {ChargeStatus, TRANSACTION_MIX_PAYMENT_METHODS} from 'src/app/charges/shared/const-var';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {
  IndexMerchantTransactionFilter,
  indexMerchantTransactions,
} from 'src/react/services/api-merchants.service';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {TransactionType} from 'src/shared/enums/merchant.enum';
import {getPaymentMethod} from '../payment-charges.lib';
import {paymentChargesQueryKey} from '../payment-charges.queries';

const webDashboardUrl = CURRENT_ENTERPRISE.dashboardUrl;

export const PaymentChargesListing = () => {
  const {
    query: {isLoading, isFetching, data},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter: {
      status: '',
      paymentMethod: '',
      dateRange: ['', ''],
    } as FilterValues,
    queryKey: paymentChargesQueryKey.indexCharges,
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
        key: 'paymentMethod',
        type: 'select',
        props: {
          label: 'Payment method',
          options: paymentMethodOptions,
          placeholder: 'All payment methods',
          'data-testid': 'payment-method-filter',
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
    <PageContainer heading="Charges">
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
                total={data.nextPage * pagination.perPage}
              />
            )
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Transaction Id</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Merchant</Table.Th>
              <Table.Th>Payment method</Table.Th>
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
                    {getPaymentMethod(trx, {exact: false, fallback: 'walletSetel'})}
                  </Table.Td>
                  <Table.Td>{formatDate(trx.createdAt, {formatType: 'dateAndTime'})}</Table.Td>
                  <Table.Td className="text-right">{formatMoney(trx.amount)}</Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
          {data && data.items.length === 0 && (
            <Table.Caption>
              <div className="p-6 text-center">
                <p>No data to be displayed.</p>
              </div>
            </Table.Caption>
          )}
        </Table>
      </div>
    </PageContainer>
  );
};

const paymentMethodOptions = Object.entries(TRANSACTION_MIX_PAYMENT_METHODS).map(
  ([value, details]) => ({
    value,
    label: details.text,
  }),
);

const statusOptions = Object.entries(ChargeStatus).map(([value, label]) => ({
  value,
  label: titleCase(label, {hasUnderscore: true}),
}));

interface FilterValues {
  status: string;
  dateRange: [string, string];
  paymentMethod: string;
}

const transformToApiFilter = ({
  dateRange: [transactionDateFrom, transactionDateTo],
  ...filter
}: FilterValues & {page: number; perPage: number}): IndexMerchantTransactionFilter => {
  const {paymentMethod, paymentSubmethod} =
    TRANSACTION_MIX_PAYMENT_METHODS[filter.paymentMethod] || {};

  return {
    ...filter,
    type: TransactionType.CHARGE,
    transactionDateFrom,
    transactionDateTo,
    paymentMethod,
    paymentSubmethod,
  };
};

const statusColor = {
  [ChargeStatus.SUCCEEDED]: 'success',
  [ChargeStatus.SETTLED]: 'success',
  [ChargeStatus.FAILED]: 'error',
  [ChargeStatus.CREATED]: 'lemon',
  [ChargeStatus.AUTHORISED]: 'lemon',
  [ChargeStatus.EXPIRED]: 'warning',
  [ChargeStatus.CANCELLED]: 'warning',
  [ChargeStatus.PARTIALLY_REFUNDED]: 'blue',
  [ChargeStatus.REFUNDED]: 'blue',
} as const;
