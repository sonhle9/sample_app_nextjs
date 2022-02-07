import {
  Badge,
  BadgeProps,
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
import {
  TransactionStatus,
  TransactionType,
  CreditCardBrand,
  CreditCardPaymentType,
  getTopUpTypeLabel,
} from 'src/shared/enums/wallet.enum';
import {walletTopupQueryKey} from '../wallet-topup.queries';

export const WalletTopupListing = () => {
  const {
    query: {data, isLoading, isFetching},
    pagination,
    filter,
  } = useDataTableState({
    initialFilter: {
      status: '',
      dateRange: ['', ''],
      cardBrand: '' as any,
      paymentType: '' as any,
    } as FilterValues,
    queryKey: walletTopupQueryKey.topupListing,
    queryFn: (values) => getWalletTransactions(transformToApiFilter(values)),
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
        key: 'cardBrand',
        type: 'select',
        props: {
          label: 'Card brand',
          options: cardBrandOptions,
          placeholder: 'All',
        },
      },
      {
        key: 'paymentType',
        type: 'select',
        props: {
          label: 'Payment type',
          options: paymentTypeOptions,
          placeholder: 'All',
        },
      },
      {
        key: 'dateRange',
        type: 'daterange',
        props: {
          label: 'Created date',
        },
      },
    ],
  });

  return (
    <PageContainer heading="Top-ups">
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
              <Table.Th>Card Brand</Table.Th>
              <Table.Th>Payment Type</Table.Th>
              <Table.Th>Card Number</Table.Th>
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
                      <Link {...cellProps} to={`/wallet/topups/details/${trx.transactionUid}`} />
                    )}>
                    {trx.transactionUid}
                  </Table.Td>
                  <Table.Td>
                    <Badge color={statusColor[trx.status]}>{trx.status}</Badge>
                  </Table.Td>
                  <Table.Td
                    render={(cellProps) => <Link {...cellProps} to={`/customers/${trx.userId}`} />}>
                    {titleCase(trx.fullName) || '-'}
                  </Table.Td>
                  <Table.Td>{getTopUpTypeLabel(trx.subType)}</Table.Td>
                  <Table.Td>
                    {trx.creditCardInfo && titleCase(trx.creditCardInfo.cardBrand)}
                  </Table.Td>
                  <Table.Td>{trx.creditCardInfo && trx.creditCardInfo.paymentType}</Table.Td>
                  <Table.Td>
                    {trx.creditCardInfo &&
                      `${trx.creditCardInfo.firstSixDigits || '******'}****${
                        trx.creditCardInfo.lastFourDigits || '****'
                      }`}
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
  cardBrand: CreditCardBrand;
  paymentType: CreditCardPaymentType;
  status: string;
}

const transformToApiFilter = ({
  dateRange: [transactionDateFrom, transactionDateTo],
  ...filter
}: FilterValues): GetWalletTransactionOptions => {
  return {
    ...filter,
    type: TransactionType.TOPUP,
    transactionDateFrom,
    transactionDateTo,
  };
};

const cardBrandOptions = Object.values(CreditCardBrand).map((value) => ({
  value,
  label: titleCase(value),
}));

const paymentTypeOptions = Object.values(CreditCardPaymentType).map((value) => ({
  value,
  label: value,
}));

const statusOptions = Object.values(TransactionStatus).map((value) => ({
  value,
  label: titleCase(value),
}));

const statusColor: Record<TransactionStatus, BadgeProps['color']> = {
  [TransactionStatus.SUCCEEDED]: 'success',
  [TransactionStatus.PROCESSING]: 'info',
  [TransactionStatus.FAILED]: 'error',
  [TransactionStatus.EXPIRED]: 'error',
  [TransactionStatus.CANCELLED]: 'grey',
  [TransactionStatus.REFUNDED]: 'blue',
  [TransactionStatus.CREATED]: 'lemon',
};
