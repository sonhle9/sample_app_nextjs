import * as React from 'react';
import {TextEllipsis} from '@setel/portal-ui';
import {useGetMonthlyTransactions} from '../../loyalty.queries';
import {
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  PaginationNavigation,
  DataTableCaption,
  formatDate,
  usePaginationState,
} from '@setel/portal-ui';

export const LoyaltyMonthly = () => {
  const pagination = usePaginationState();
  const {data, isSuccess, isError, isLoading} = useGetMonthlyTransactions({
    page: pagination.page,
    perPage: pagination.perPage,
  });

  return (
    <div className="mb-10 mx-auto px-16 pt-8">
      <TextEllipsis
        className="flex-grow text-2xl pb-4"
        text="Monthly loyalty point summary"
        widthClass="w-full"
      />
      <DataTable
        isLoading={isLoading}
        pagination={
          <PaginationNavigation
            currentPage={pagination.page}
            perPage={pagination.perPage}
            onChangePage={pagination.setPage}
            onChangePageSize={pagination.setPerPage}
            variant="prev-next"
          />
        }>
        <DataTableRowGroup groupType="thead">
          <Tr>
            <Td>Date</Td>
            <Td>Total issuance</Td>
            <Td>Total redeemed</Td>
            <Td>Total redemption reversed</Td>
            <Td>Total amount granted to wallet balance</Td>
            <Td>Total settlement</Td>
          </Tr>
        </DataTableRowGroup>
        {(isSuccess && !data?.length) || isError ? (
          <DataTableCaption
            className="text-center py-12 text-mediumgrey text-md"
            data-testid="no-members">
            <p>No transaction found</p>
          </DataTableCaption>
        ) : (
          <DataTableRowGroup>
            {data?.map((transaction, index) => (
              <Tr
                render={(props) => <div {...props} data-testid="monthly-transaction-row" />}
                key={index}>
                <Td>
                  {formatDate(new Date(transaction._id.year, transaction._id.month - 1), {
                    format: 'MMM yyyy',
                  })}
                </Td>
                <Td>{transaction.totalIssuance} pts</Td>
                <Td>{transaction.totalRedeemed} pts</Td>
                <Td>{transaction.TotalRedemptionReversed}</Td>
                <Td>{transaction.totalAmountToWalletBalanceInCent / 100}</Td>
                <Td>{transaction.totalSettlement}</Td>
              </Tr>
            ))}
          </DataTableRowGroup>
        )}
      </DataTable>
    </div>
  );
};
