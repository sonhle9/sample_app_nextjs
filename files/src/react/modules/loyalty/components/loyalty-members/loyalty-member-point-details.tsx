import * as React from 'react';
import {
  Card,
  CardHeading,
  CardContent,
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  PaginationNavigation,
  DataTableCaption,
  DateRangeDropdown,
  DATES,
  Badge,
  formatDate,
  usePaginationState,
} from '@setel/portal-ui';
import {useGetTranscationsByMemberType} from '../../custom-hooks/use-get-transactions-by-member-type';
import {TransactionStatusName, TransactionTypesName} from '../../loyalty.type';
import {getLoyaltyAmount} from 'src/shared/helpers/get-loyalty-amount';
import {Member} from '../../loyalty-members.type';
import {formatISO} from 'date-fns';

const options = [
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

export type LoyaltyMemberPointDetailsProps = {
  member?: Member;
};

export const LoyaltyMemberPointDetails: React.VFC<LoyaltyMemberPointDetailsProps> = ({member}) => {
  const pagination = usePaginationState();
  const [date, setDate] = React.useState<[string, string]>(['', '']);

  const {data, isSuccess, isLoading} = useGetTranscationsByMemberType(member, {
    page: pagination.page,
    perPage: pagination.perPage,
    startDate: date[0],
    endDate: date[1],
  });

  React.useEffect(() => {
    if (isSuccess && data) {
      pagination.setPage(data.metadata.currentPage);
    }
  }, [data, isSuccess]);

  return (
    <Card className="mb-10" data-testid="member-point-details">
      <CardHeading title="Point transactions">
        <div className="min-w-40 -mb-5">
          <DateRangeDropdown
            value={date}
            onChangeValue={setDate}
            options={options}
            dayOnly
            disableFuture
          />
        </div>
      </CardHeading>
      <CardContent className="sm:p-0 md:p-0 sm:px-0">
        <Table
          isLoading={isLoading}
          pagination={
            <PaginationNavigation
              total={data?.metadata?.totalCount}
              currentPage={pagination.page}
              perPage={pagination.perPage}
              onChangePage={pagination.setPage}
              onChangePageSize={pagination.setPerPage}
              variant="prev-next"
            />
          }>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>Title</Td>
              <Td>Status</Td>
              <Td>Amount</Td>
              <Td>Transaction Type</Td>
              <Td>Created on</Td>
            </Tr>
          </DataTableRowGroup>
          {data?.data?.length === 0 || !isSuccess ? (
            <DataTableCaption
              className="text-center py-12 text-mediumgrey text-md"
              data-testid="no-members">
              <p>No transaction found</p>
            </DataTableCaption>
          ) : (
            <DataTableRowGroup>
              {data?.data?.map((transaction) => (
                <Tr
                  render={(props) => (
                    <a
                      {...props}
                      href={`/loyalty/members/transaction/${transaction.id}`}
                      data-testid="members-points-row"
                    />
                  )}
                  key={transaction.referenceId}>
                  <Td>{transaction.title}</Td>
                  <Td>
                    {transaction.status && (
                      <Badge
                        color={TransactionStatusName.get(transaction.status)?.color || 'grey'}
                        rounded="rounded"
                        className="uppercase">
                        {TransactionStatusName.get(transaction.status).text}
                      </Badge>
                    )}
                  </Td>
                  <Td>{getLoyaltyAmount(transaction)}</Td>
                  <Td>{TransactionTypesName.get(transaction.type)}</Td>
                  <Td>{formatDate(transaction.createdAt)}</Td>
                </Tr>
              ))}
            </DataTableRowGroup>
          )}
        </Table>
      </CardContent>
    </Card>
  );
};
