import * as React from 'react';
import {
  TextEllipsis,
  Card,
  CardContent,
  FieldContainer,
  DropdownSelect,
  SearchTextInput,
  OptionsOrGroups,
  DateRangeDropdown,
  DATES,
  useFilter,
  Filter,
  Badge,
  DataTable,
  DataTableRowGroup,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  PaginationNavigation,
  formatDate,
  usePaginationState,
} from '@setel/portal-ui';
import {formatISO} from 'date-fns';
import {TransactionStatus, TransactionStatusName} from '../../loyalty.type';
import {useIndexTransactions} from '../../loyalty.queries';
import {maskMesra} from 'src/shared/helpers/mask-helpers';
import {checkValidMongoId, isValidMesra} from 'src/shared/helpers/check-valid-id';
import {removeDashes} from 'src/shared/helpers/format-text';
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
  const [{values, applied}, {setValue, reset}] = useFilter(
    {
      statuses: '',
      startDate: '',
      endDate: '',
      search: '',
    },
    {
      onChange: () => pagination.setPage(1),
    },
  );
  const [isValid, setIsValid] = React.useState(true);

  const searchCardOrId = React.useMemo(() => {
    if (isValidMesra(values.search)) {
      setIsValid(true);
      return {
        cardNumber: values.search,
      };
    } else if (checkValidMongoId(values.search)) {
      setIsValid(true);
      return {
        transactionId: values.search,
      };
    }

    setIsValid(!values.search);
  }, [values.search]);

  const {data, isError, isLoading} = useIndexTransactions({
    page: pagination.page,
    perPage: pagination.perPage,
    statuses: values.statuses as TransactionStatus,
    startDate: values.startDate,
    endDate: values.endDate,
    ...searchCardOrId,
  });

  const statusOptions: OptionsOrGroups<string | TransactionStatus> = [
    {label: 'All', value: ''},
  ].concat(
    Object.values(TransactionStatus).map((value) => ({
      label: TransactionStatusName.get(value).text,
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
          <FieldContainer className="w-48 md:flex-shrink-0" label="Status">
            <DropdownSelect
              value={values.statuses}
              onChangeValue={(value) => setValue('statuses', value)}
              options={statusOptions}
              data-testid="select-status"
            />
          </FieldContainer>
          <div className="w-48 md:flex-shrink-0">
            <DateRangeDropdown
              label="Created date"
              value={[values.startDate, values.endDate]}
              onChangeValue={(value) => {
                setValue('startDate', value[0]);
                setValue('endDate', value[1]);
              }}
              options={dateOptions}
              disableFuture
              data-testid="select-date"
            />
          </div>
          <FieldContainer
            label="Search"
            className="w-full"
            helpText={!isValid && 'Not a valid card number or transaction ID'}
            status={!isValid ? 'error' : undefined}>
            <SearchTextInput
              value={values.search}
              placeholder="Search by card number or transaction ID"
              onChangeValue={(value) => setValue('search', removeDashes(value))}
              data-testid="search"
            />
          </FieldContainer>
        </CardContent>
      </Card>
      {applied.length > 0 && (
        <Filter className="mb-4" onReset={reset}>
          {applied.map((item) => (
            <Badge onDismiss={item.resetValue} key={item.prop}>
              {item.label}
            </Badge>
          ))}
        </Filter>
      )}
      <DataTable
        isLoading={isLoading}
        pagination={
          <PaginationNavigation
            total={data?.metadata.totalCount}
            currentPage={pagination.page}
            perPage={pagination.perPage}
            onChangePage={pagination.setPage}
            onChangePageSize={pagination.setPerPage}
          />
        }>
        <DataTableRowGroup groupType="thead">
          <Tr>
            <Td>Points</Td>
            <Td>Status</Td>
            <Td className="text-right">Card number</Td>
            <Td className="text-right">Transaction ID</Td>
            <Td>Merchant</Td>
            <Td className="text-right">Created on</Td>
          </Tr>
        </DataTableRowGroup>
        {data?.data?.length === 0 || isError ? (
          <DataTableCaption
            className="text-center py-12 text-mediumgrey text-md"
            data-testid="no-transaction">
            <p>No transaction found</p>
          </DataTableCaption>
        ) : (
          <DataTableRowGroup>
            {data?.data?.map((transaction) => (
              <Tr
                key={transaction.id}
                render={(props) => (
                  <a
                    {...props}
                    href={`/loyalty-affliate/transactions/${transaction.id}`}
                    target="_BLANK"
                    data-testid="loyalty-transaction"
                  />
                )}>
                <Td className="text-right">{getLoyaltyAmount(transaction)}</Td>
                <Td>
                  <Badge
                    color={TransactionStatusName.get(transaction.status)?.color}
                    rounded="rounded"
                    className="uppercase">
                    {TransactionStatusName.get(transaction.status).text}
                  </Badge>
                </Td>
                <Td className="text-right">{maskMesra(transaction.receiverCardNumber)}</Td>
                <Td className="text-right">{transaction.id}</Td>
                <Td>{transaction.merchantName}</Td>
                <Td className="text-right">{formatDate(transaction.createdAt)}</Td>
              </Tr>
            ))}
          </DataTableRowGroup>
        )}
      </DataTable>
    </div>
  );
};
