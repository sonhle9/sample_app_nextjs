import {
  Alert,
  DataTable,
  DataTableRowGroup,
  DataTableCell as Td,
  DataTableRow as Tr,
  PaginationNavigation,
  usePaginationState,
  formatMoney,
  formatDate,
  CardHeading,
} from '@setel/portal-ui';
import React from 'react';
import {usePrefundingBalancesSummary} from '../prefunding-balance.query';

export const PrefundingBalanceSummary = () => {
  const pagination = usePaginationState();
  const {
    data: resolvedData,
    isLoading,
    isError,
  } = usePrefundingBalancesSummary({
    page: pagination.page,
    perPage: pagination.perPage,
  });
  return (
    <div className="mb-8">
      {isError ? (
        <Alert variant="error" className="mb-8" description="Failed to load data" />
      ) : (
        <DataTable
          heading={<CardHeading title="Prepaid balance summary" />}
          isLoading={isLoading}
          pagination={
            resolvedData && (
              <PaginationNavigation
                total={resolvedData.total}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                onChangePage={pagination.setPage}
                onChangePageSize={pagination.setPerPage}
              />
            )
          }>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td className="w-1/5 text-right">Balance snapshot (RM)</Td>
              <Td className="text-right">Created on</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {resolvedData &&
              resolvedData.items.map((prefundingBalanceDaily, index) => (
                <Tr key={index} data-testid="balance-daily-record">
                  <Td className="w-1/5 text-right">
                    {formatMoney(prefundingBalanceDaily.balance, 'RM')}
                  </Td>
                  <Td className="text-right">
                    {formatDate(prefundingBalanceDaily.createdAt, {format: 'd MMM yyyy'})}
                  </Td>
                </Tr>
              ))}
          </DataTableRowGroup>
        </DataTable>
      )}
    </div>
  );
};
