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
import {TransferStatus} from 'src/app/transfers/shared/const-var';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {Link} from 'src/react/routing/link';
import {
  IndexMerchantTransactionFilter,
  indexMerchantTransactions,
} from 'src/react/services/api-merchants.service';
import {TransactionSubType, TransactionType} from 'src/react/services/api-merchants.type';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {paymentTransfersQueryKey} from '../payments-transfers.queries';

const webDashboardUrl = CURRENT_ENTERPRISE.dashboardUrl;

export const PaymentsTransfersListing = () => {
  const {
    query: {isLoading, isFetching, data},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter: {
      status: '',
      dateRange: ['', ''],
    } as FilterValues,
    queryKey: paymentTransfersQueryKey.indexTransfers,
    queryFn: (data) => indexMerchantTransactions(transformToApiFilter(data)),
    components: [
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
        key: 'dateRange',
        type: 'daterange',
        props: {
          label: 'Created at',
        },
      },
    ],
  });

  return (
    <PageContainer heading="Transfers">
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
                total={data.nextPage * pagination.perPage}
              />
            )
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Transaction Id</Table.Th>
              <Table.Th>Direction</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Merchant</Table.Th>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Created on</Table.Th>
              <Table.Th className="text-right">Amount (RM)</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data &&
              data.items.map((trx) => (
                <Table.Tr key={trx.id}>
                  <Table.Td>
                    <Link to={`/payments/transfers/details/${trx.transactionUid}`}>
                      {trx.transactionUid}
                    </Link>
                  </Table.Td>
                  <Table.Td>
                    {trx.subType === TransactionSubType.TRANSFER_MERCHANT_BONUS_WALLET ? (
                      <>Merchant {'->'} Customer</>
                    ) : trx.subType === TransactionSubType.TRANSFER_REFUND_MERCHANT_BONUS_WALLET ? (
                      <>Customer {'->'} Merchant</>
                    ) : null}
                  </Table.Td>
                  <Table.Td>
                    <Badge color={statusColor[trx.status]} className="uppercase">
                      {trx.status}
                    </Badge>
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
                    <a href={`/customers/${trx.userId}`} target="_BLANK">
                      {trx.fullName}
                    </a>
                  </Table.Td>
                  <Table.Td>{formatDate(trx.createdAt, {formatType: 'dateAndTime'})}</Table.Td>
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
  status: string;
  dateRange: [string, string];
}

const transformToApiFilter = ({
  dateRange: [transactionDateFrom, transactionDateTo],
  ...filter
}: FilterValues): IndexMerchantTransactionFilter => {
  return {
    ...filter,
    type: TransactionType.TRANSFER,
    transactionDateFrom,
    transactionDateTo,
  };
};

const statusOptions = Object.values(TransferStatus).map((value) => ({
  value,
  label: titleCase(value),
}));

const statusColor = {
  [TransferStatus.SUCCEEDED]: 'success',
  [TransferStatus.FAILED]: 'error',
  [TransferStatus.SETTLED]: 'blue',
  [TransferStatus.CREATED]: 'lemon',
} as const;
