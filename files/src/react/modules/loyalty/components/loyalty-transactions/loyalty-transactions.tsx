import * as React from 'react';
import {TextEllipsis} from '@setel/portal-ui';
import {useIndexTransactions} from '../../loyalty.queries';
import {
  Card,
  CardContent,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  Pagination,
  DataTableCaption,
  DropdownSelect,
  FieldContainer,
  DATES,
  DateRangeDropdown,
  Badge,
  formatDate,
  OptionsOrGroups,
  usePaginationState,
} from '@setel/portal-ui';
import {
  TransactionStatus,
  TransactionStatusName,
  TransactionTypesName,
  CardIssuers,
  CardIssuersName,
} from '../../loyalty.type';
import {formatISO} from 'date-fns';
import {parseJSON} from 'src/shared/helpers/parseJSON';
import {getLoyaltyAmount} from 'src/shared/helpers/get-loyalty-amount';

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

export const LoyaltyTransactions = () => {
  const pagination = usePaginationState();
  const [statuses, setStatus] = React.useState('');
  const [issuers, setIssuers] = React.useState('');
  const [date, setDate] = React.useState<[string, string]>(['', '']);
  const {data, isError, isLoading} = useIndexTransactions({
    page: pagination.page,
    perPage: pagination.perPage,
    statuses: statuses as TransactionStatus,
    issuers: issuers as CardIssuers,
    startDate: date[0],
    endDate: date[1],
  });

  const statusOptions: OptionsOrGroups<string | TransactionStatus> = [
    {label: 'All', value: ''},
  ].concat(
    Object.values(TransactionStatus).map((value) => ({
      label: TransactionStatusName.get(value).text,
      value,
    })),
  );

  const cardIssuersOptions: OptionsOrGroups<string | CardIssuers> = [
    {label: 'All', value: ''},
  ].concat(
    Object.values(CardIssuers).map((value) => ({
      label: CardIssuersName.get(value),
      value,
    })),
  );

  return (
    <div className="mb-10 mx-auto px-16 pt-8">
      <TextEllipsis
        className="flex-grow text-2xl pb-4"
        text="Loyalty transactions"
        widthClass="w-full"
      />
      <Card className="mb-4">
        <CardContent className="flex space-x-2">
          <FieldContainer className="w-40" label="Status">
            <DropdownSelect<string>
              value={statuses}
              onChangeValue={setStatus}
              options={statusOptions}
              data-testid="select-status"
            />
          </FieldContainer>
          <FieldContainer className="w-40" label="Issued by">
            <DropdownSelect<string>
              value={issuers}
              onChangeValue={setIssuers}
              options={cardIssuersOptions}
              data-testid="select-issuers"
            />
          </FieldContainer>
          <div className="min-w-48">
            <DateRangeDropdown
              label="Created date"
              value={date}
              onChangeValue={setDate}
              options={dateOptions}
              disableFuture
            />
          </div>
        </CardContent>
      </Card>
      <DataTable
        isLoading={isLoading}
        pagination={
          <Pagination
            currentPage={pagination.page}
            pageSize={pagination.perPage}
            onChangePage={pagination.setPage}
            onChangePageSize={pagination.setPerPage}
            lastPage={data?.metadata.pageCount}
            onGoToLast={() => {}}
            variant="prev-next"
          />
        }>
        <DataTableRowGroup groupType="thead">
          <Tr>
            <Td>Title</Td>
            <Td>Status</Td>
            <Td>User ID</Td>
            <Td>Points</Td>
            <Td>Type</Td>
            <Td>Loyalty point no</Td>
            <Td className="max-w-lg">Error message</Td>
            <Td className="text-right">Created on</Td>
          </Tr>
        </DataTableRowGroup>
        {data?.data?.length === 0 || isError ? (
          <DataTableCaption
            className="text-center py-12 text-mediumgrey text-md"
            data-testid="no-members">
            <p>No transaction found</p>
          </DataTableCaption>
        ) : (
          <DataTableRowGroup>
            {data?.data?.map((transaction) => (
              <Tr key={transaction.id}>
                <Td
                  render={(props) => (
                    <a
                      {...props}
                      href={`/payments/transactions/loyalty/${transaction.id}`}
                      target="_BLANK"
                      data-testid="transaction-title"
                    />
                  )}
                  className="hover:text-blue-500">
                  {transaction.title}
                </Td>
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
                <Td
                  render={(props) => (
                    <a {...props} href={`/customers/${transaction.userId}`} target="_BLANK" />
                  )}
                  className="hover:text-blue-500">
                  {transaction.userId}
                </Td>

                <Td>{getLoyaltyAmount(transaction)}</Td>
                <Td>{TransactionTypesName.get(transaction.type)}</Td>
                <Td>{transaction.receiverCardNumber}</Td>
                <Td className="max-w-lg truncate">
                  {parseJSON(transaction.vendorFailureReason)?.message ||
                    transaction.vendorFailureReason ||
                    transaction.failureReason}
                </Td>
                <Td className="text-right">{formatDate(transaction.createdAt)}</Td>
              </Tr>
            ))}
          </DataTableRowGroup>
        )}
      </DataTable>
    </div>
  );
};
