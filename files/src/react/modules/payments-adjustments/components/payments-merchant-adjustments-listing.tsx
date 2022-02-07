import {
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
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {Link} from 'src/react/routing/link';
import {
  IndexMerchantTransactionFilter,
  indexMerchantTransactions,
} from 'src/react/services/api-merchants.service';
import {TransactionType} from 'src/react/services/api-merchants.type';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {paymentAdjustmentsQueryKey} from '../payments-adjustments.queries';

const webDashboardUrl = CURRENT_ENTERPRISE.dashboardUrl;

export interface PaymentsMerchantAdjustmentsListingProps {
  enabled: boolean;
}

export const PaymentsMerchantAdjustmentsListing = (
  props: PaymentsMerchantAdjustmentsListingProps,
) => {
  const {
    query: {isLoading, isFetching, data},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter: {
      dateRange: ['', ''],
    } as FilterValues,
    queryKey: paymentAdjustmentsQueryKey.indexMerchantAdjustments,
    queryFn: (data) => indexMerchantTransactions(transformToApiFilter(data)),
    enabled: props.enabled,
    components: [
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
    <PageContainer heading="Merchant Adjustments">
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
              <Table.Th>Merchant</Table.Th>
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
                        to={`/payments/adjustments/details/merchant/${trx.transactionUid}`}
                      />
                    )}>
                    {trx.transactionUid}
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
  dateRange: [string, string];
}

const transformToApiFilter = ({
  dateRange: [transactionDateFrom, transactionDateTo],
  ...filter
}: FilterValues): IndexMerchantTransactionFilter => {
  return {
    ...filter,
    type: TransactionType.ADJUSTMENT,
    transactionDateFrom,
    transactionDateTo,
  };
};
