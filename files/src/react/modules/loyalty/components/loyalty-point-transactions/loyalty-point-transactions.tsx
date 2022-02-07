import * as React from 'react';
import {
  Card,
  CardContent,
  FieldContainer,
  DateRangeDropdown,
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  Pagination,
  DataTableCaption,
  Badge,
  formatDate,
  DATES,
  OptionsOrGroups,
  Filter,
  useFilter,
  usePaginationState,
  SearchInput,
  useDebounce,
  DropdownSelectField,
  SearchTextField,
} from '@setel/portal-ui';
import {PageContainer} from 'src/react/components/page-container';
import {formatISO} from 'date-fns';
import {
  TransactionStatus,
  TransactionTypes,
  TransactionStatusName,
  TransactionTypeOptions,
} from '../../loyalty.type';
import {formatThousands} from 'src/shared/helpers/formatNumber';
import {useIndexTransactionsByType} from '../../loyalty.queries';
import {maskMesra} from 'src/shared/helpers/mask-helpers';
import {checkValidMongoId, isValidMesra} from 'src/shared/helpers/check-valid-id';
import {getLoyaltyAmount} from 'src/shared/helpers/get-loyalty-amount';
import {removeDashes} from 'src/shared/helpers/format-text';
import {useMerchantSearch, useMerchantDetails} from 'src/react/modules/merchants/merchants.queries';

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

export const LoyaltyPointTransactions = ({type}: {type: TransactionTypes}) => {
  const pagination = usePaginationState();

  const [{values, applied}, {setValue, reset}] = useFilter(
    {
      statuses: '',
      startDate: '',
      endDate: '',
      search: '',
      merchantId: '',
      type,
    },
    {
      onChange: () => pagination.setPage(1),
    },
  );

  const [isValid, setIsValid] = React.useState(true);
  const [searchMerchantName, setSearchMerchantName] = React.useState('');
  const searchMerchant = useDebounce(searchMerchantName);

  const {data: merchants, isSuccess: merchantSuccess} = useMerchantSearch(
    {name: searchMerchant},
    {enabled: Boolean(searchMerchant)},
  );
  const {data: merchantDetail} = useMerchantDetails(values.merchantId, {
    enabled: Boolean(values.merchantId),
  });

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

  const {data, isLoading, isError} = useIndexTransactionsByType(values.type, {
    page: pagination.page,
    perPage: pagination.perPage,
    statuses: values.statuses as TransactionStatus,
    startDate: values.startDate,
    endDate: values.endDate,
    merchantId: values.merchantId,
    ...searchCardOrId,
  });

  const readableStatusName = (value: TransactionStatus) =>
    TransactionStatusName.get(value).altText || TransactionStatusName.get(value).text;

  const statusOptions: OptionsOrGroups<string | TransactionStatus> = [
    {label: 'All', value: ''},
  ].concat(
    Object.values(TransactionStatus).map((value) => ({
      label: readableStatusName(value),
      value,
    })),
  );

  return (
    <PageContainer
      heading={`Loyalty point ${type === TransactionTypes.EARN ? 'earnings' : 'redemptions'}`}>
      <Card className="mb-8">
        <CardContent className="flex flex-wrap space-x-2">
          <DropdownSelectField
            className="min-w-48"
            label="Type"
            value={values.type}
            onChangeValue={(value) => setValue('type', value as TransactionTypes)}
            options={TransactionTypeOptions.get(type)}
            data-testid="select-type"
          />
          <DropdownSelectField
            className="min-w-48"
            label="Status"
            value={values.statuses}
            onChangeValue={(value) => setValue('statuses', value)}
            options={statusOptions}
            data-testid="select-status"
          />
          <div className="min-w-48">
            <DateRangeDropdown
              label="Created on"
              value={[values.startDate, values.endDate]}
              onChangeValue={(value) => {
                setValue('startDate', value[0]);
                setValue('endDate', value[1]);
              }}
              options={dateOptions}
              disableFuture
            />
          </div>
          <FieldContainer label="Merchant" className="min-w-48">
            <SearchInput
              placeholder="Select merchant"
              onInputValueChange={setSearchMerchantName}
              onSelect={(id) => {
                setValue('merchantId', id);
              }}
              results={
                merchantSuccess &&
                merchants?.items?.map((merchant) => ({
                  value: merchant.id,
                  label: merchant.name,
                  description: merchant.legalName,
                }))
              }
            />
          </FieldContainer>
          <SearchTextField
            label="Search"
            className="min-w-80"
            helpText={!isValid && 'Not a valid card number or transaction ID'}
            status={!isValid ? 'error' : undefined}
            value={values.search}
            placeholder="Search by card number or transaction ID"
            onChangeValue={(value) => setValue('search', removeDashes(value))}
            data-testid="search-input"
          />
        </CardContent>
      </Card>
      {applied.length > 0 && (
        <Filter className="mb-8" onReset={reset}>
          {applied.map((item) => (
            <Badge onDismiss={item.resetValue} key={item.prop} className="capitalize">
              {item.prop === 'merchantId' ? merchantDetail?.name : item.label}
            </Badge>
          ))}
        </Filter>
      )}
      <DataTable
        data-testid="transaction-table"
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
          <Tr render={(props) => <div {...props} data-testid="transaction-column-names" />}>
            <Td className="text-right">Points</Td>
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
            data-testid="no-members">
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
                    href={`/loyalty/members/transaction/${transaction.id}`}
                    data-testid="loyalty-transaction"
                  />
                )}>
                <Td className="text-right">{formatThousands(getLoyaltyAmount(transaction))}</Td>
                <Td>
                  {transaction.status && (
                    <Badge
                      color={TransactionStatusName.get(transaction.status)?.color || 'grey'}
                      rounded="rounded"
                      className="uppercase">
                      {readableStatusName(transaction.status)}
                    </Badge>
                  )}
                </Td>
                <Td className="text-right">
                  {maskMesra(transaction.receiverCardNumber) ||
                    maskMesra(transaction.senderCardNumber)}
                </Td>
                <Td className="text-right">{transaction.id}</Td>
                <Td>{transaction.merchantName}</Td>
                <Td className="text-right">{formatDate(transaction.createdAt)}</Td>
              </Tr>
            ))}
          </DataTableRowGroup>
        )}
      </DataTable>
    </PageContainer>
  );
};
