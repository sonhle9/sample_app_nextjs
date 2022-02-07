import * as React from 'react';
import {
  DataTable,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DataTableCaption,
  PaginationNavigation,
  formatDate,
  DropdownItem,
  DropdownMenu,
  DropdownMenuItems,
  Badge,
  usePaginationState,
  DotVerticalIcon,
  Notification,
  useTransientState,
  Card,
  CardContent,
  OptionsOrGroups,
  DropdownSelectField,
  useFilter,
  Filter,
  DateRangeDropdown,
  DATES,
} from '@setel/portal-ui';
import {formatISO} from 'date-fns';
import {useGetPointTransactions} from '../../points.queries';
import {useAdjustmentApproval} from '../../loyalty.queries';
import {Link} from 'src/react/routing/link';
import {
  OperationTypes,
  AdjustmentTypes,
  AdjustmentTypesName,
  AdjustmentApprovalStatus,
  TransactionStatus,
  TransactionStatusName,
} from '../../points.type';
import {PageContainer} from 'src/react/components/page-container';

const DropdownActionButton: React.VFC<{
  referenceId: string;
  cardNumber?: string;
  disabled?: boolean;
  workflowId?: string;
}> = ({referenceId, cardNumber, disabled, workflowId}) => {
  const {mutate: mutateAdjustment, isLoading, isSuccess, isError, error} = useAdjustmentApproval();
  const [showNotification, setShowNotification] = useTransientState(false);

  React.useEffect(() => {
    setShowNotification(isError || isSuccess);
  }, [isError, isSuccess]);

  if (disabled) {
    return (
      <div className="inline-flex justify-center items-center p-1.5">
        <DotVerticalIcon className="w-5 h-5 text-gray-300" />
      </div>
    );
  }

  const onApproval = (approve: boolean) => {
    mutateAdjustment({
      referenceId,
      cardNumber,
      adjustmentStatus: approve
        ? AdjustmentApprovalStatus.APPROVED
        : AdjustmentApprovalStatus.REJECTED,
      workflowId,
    });
  };

  return (
    <>
      <Notification
        isShow={showNotification}
        variant={isError ? 'error' : 'success'}
        title={isError ? 'Error when updating approval' : 'Successfully updated approval'}
        description={isError && (error as Error)?.message}
      />
      <DropdownMenu
        variant="icon"
        label={
          <>
            <span className="sr-only">Menu</span>
            <DotVerticalIcon className="w-5 h-5 text-gray-500" />
          </>
        }
        isLoading={isLoading}>
        <DropdownMenuItems className="min-w-32">
          <DropdownItem onSelect={() => onApproval(true)}>Approve</DropdownItem>
          <DropdownItem onSelect={() => onApproval(false)}>Reject</DropdownItem>
        </DropdownMenuItems>
      </DropdownMenu>
    </>
  );
};

export const LoyaltyPointApproval = () => {
  const pagination = usePaginationState();
  const [{values, applied}, {setValue, reset}] = useFilter(
    {
      status: '',
      startDate: '',
      endDate: '',
    },
    {
      onChange: () => pagination.setPage(1),
    },
  );
  const {data, isSuccess, isLoading, isError} = useGetPointTransactions({
    operationType: OperationTypes.ADJUSTMENT,
    page: pagination.page,
    perPage: pagination.perPage,
    status: values.status as TransactionStatus,
    transactionDateTimeSince: values.startDate,
    transactionDateTimeUntil: values.endDate,
  });

  const dateOptions = [
    {
      label: 'Any dates',
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

  const statusOptions: OptionsOrGroups<string | TransactionStatus> = [
    {label: 'Any statuses', value: ''},
  ].concat(
    Object.values(TransactionStatus).map((value) => ({
      label: TransactionStatusName.get(value).text,
      value,
    })),
  );

  return (
    <PageContainer heading="Points approval">
      <Card className="mb-8">
        <CardContent className="flex space-x-5" data-testid="filter-card">
          <DropdownSelectField
            className="w-48"
            label="Status"
            value={values.status}
            options={statusOptions}
            onChangeValue={(value) => setValue('status', value)}
          />
          <DateRangeDropdown
            label="Created on"
            value={[values.startDate, values.endDate]}
            onChangeValue={(value) => {
              setValue('startDate', value[0]);
              setValue('endDate', value[1]);
            }}
            options={dateOptions}
            disableFuture
            className="min-w-80 flex-shrink"
          />
        </CardContent>
      </Card>
      {applied.length > 0 && (
        <Filter className="mb-8" onReset={reset}>
          {applied.map((item) => (
            <Badge onDismiss={item.resetValue} key={item.prop}>
              {item.label}
            </Badge>
          ))}
        </Filter>
      )}
      <DataTable
        isLoading={isLoading}
        skeletonRowNum={3}
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
            <Td className="text-right">Loyalty points</Td>
            <Td>Approval status</Td>
            <Td>Type</Td>
            <Td>Created on</Td>
            <Td></Td>
          </Tr>
        </DataTableRowGroup>
        {isError || !data?.data?.length ? (
          <DataTableCaption
            className="text-center py-12 text-mediumgrey text-md"
            data-testid="no-transaction">
            <p>No approval transactions found</p>
          </DataTableCaption>
        ) : (
          <DataTableRowGroup>
            {isSuccess &&
              data.data?.length > 0 &&
              data.data?.map((transaction) => (
                <Tr key={transaction.id}>
                  <Td
                    className="text-right hover:text-blue-500"
                    render={(props) => (
                      <Link
                        {...props}
                        to={`/loyalty/point-approval/${transaction.referenceId}`}
                        data-testid="transaction-row"
                      />
                    )}>
                    {transaction.amount < 0 ? transaction.amount * -1 : transaction.amount} pts
                  </Td>
                  <Td>
                    {transaction.status && (
                      <Badge
                        color={
                          (TransactionStatusName.get(transaction.status)?.color || 'grey') as any
                        }
                        rounded="rounded"
                        className="uppercase">
                        {TransactionStatusName.get(transaction.status).text}
                      </Badge>
                    )}
                  </Td>
                  <Td>
                    {transaction.amount > 0
                      ? AdjustmentTypesName.get(AdjustmentTypes.GRANT)
                      : AdjustmentTypesName.get(AdjustmentTypes.REVOKE)}
                  </Td>
                  <Td>{formatDate(transaction.createdAt)}</Td>
                  <Td>
                    <DropdownActionButton
                      referenceId={transaction.referenceId}
                      cardNumber={transaction.cardNumber}
                      disabled={transaction.status !== TransactionStatus.PENDING}
                      workflowId={transaction.workflowId}
                    />
                  </Td>
                </Tr>
              ))}
          </DataTableRowGroup>
        )}
      </DataTable>
    </PageContainer>
  );
};
