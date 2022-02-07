import * as React from 'react';
import {TextEllipsis} from '@setel/portal-ui';
import {useGetDailyTransactions} from '../../loyalty.queries';
import {
  Card,
  CardContent,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  PaginationNavigation,
  DataTableCaption,
  DATES,
  DateRangeDropdown,
  formatDate,
  usePaginationState,
} from '@setel/portal-ui';
import {formatISO} from 'date-fns';

const dateOptions = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Yesterday',
    value: formatISO(DATES.yesterday) as string,
  },
  {
    label: 'Last 7 days',
    value: formatISO(DATES.sevenDaysAgo) as string,
  },
  {
    label: 'Last 30 days',
    value: formatISO(DATES.thirtyDaysAgo) as string,
  },
];

export const LoyaltyDaily = () => {
  const pagination = usePaginationState();
  const [date, setDate] = React.useState<[string, string]>(['', '']);
  const {data, isSuccess, isError, isLoading} = useGetDailyTransactions({
    page: pagination.page,
    perPage: pagination.perPage,
    fromDate: date[0],
    toDate: date[1],
  });

  return (
    <div className="mb-10 mx-auto px-16 pt-8">
      <TextEllipsis
        className="flex-grow text-2xl pb-4"
        text="Daily loyalty point summary"
        widthClass="w-full"
      />
      <Card className="mb-4">
        <CardContent className="flex space-x-2">
          <div className="min-w-48">
            <DateRangeDropdown
              label="Created date"
              value={date}
              onChangeValue={setDate}
              options={dateOptions}
              disableFuture
              dayOnly
            />
          </div>
        </CardContent>
      </Card>
      <DataTable
        isLoading={isLoading}
        pagination={
          <PaginationNavigation
            currentPage={pagination.page}
            perPage={pagination.perPage}
            onChangePageSize={pagination.setPerPage}
            onChangePage={pagination.setPage}
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
                render={(props) => <div {...props} data-testid="daily-transaction-row" />}
                key={index}>
                <Td>
                  {formatDate(
                    new Date(transaction._id.year, transaction._id.month - 1, transaction._id.day),
                    {format: 'd MMM yyyy '},
                  )}
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
