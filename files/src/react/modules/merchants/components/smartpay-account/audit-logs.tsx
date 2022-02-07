import {merchantQueryKey} from '../../merchants.queries';
import {useDataTableState} from '../../../../hooks/use-state-with-query-params';
import {getSmartpayAuditLogs} from '../../merchants.service';
import {
  AuditLogEventTypeOptions,
  AuditLogFeatureName,
  ISecurityDeposit,
  SmartpayAssessmentDetails,
  SmartpayAssessmentRatingOptions,
} from '../../merchants.type';
import {
  Card,
  DataTable,
  DataTableCaption,
  DataTableCell as Td,
  DataTableExpandableGroup as ExpandGroup,
  DataTableExpandableRow as ExpandableRow,
  DataTableExpandButton as ExpandButton,
  DataTableRow as Tr,
  DataTableRowGroup,
  Filter,
  FilterControls,
  formatDate,
  formatMoney,
  PaginationNavigation,
  titleCase,
} from '@setel/portal-ui';
import {QueryErrorAlert} from '../../../../components/query-error-alert';
import * as React from 'react';
import {getOptionLabel} from '../../merchants.lib';
import {useAdminUsers} from '../../../admin-user/admin-users.queries';
import {
  bankAccountNames,
  bankAccountTypes,
  depositTypes,
} from './smartpay-details-security-deposit-modal';

export const AuditLogs = (props: {refId: string; featureName: AuditLogFeatureName}) => {
  const {data: usersData} = useAdminUsers({
    page: 1,
    perPage: 999,
  });

  const {
    query: {isLoading, isFetching, data, error},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter: {
      date: '',
      eventType: '',
      userId: '',
      search: '',
    },
    queryKey: `${merchantQueryKey.auditLogs}_${props.featureName}`,
    queryFn: (data) =>
      getSmartpayAuditLogs({
        refId: props.refId,
        page: data.page,
        perPage: data.perPage,
        userId: data.userId || undefined,
        searchValue: data.search || undefined,
        eventType: data.eventType || undefined,
        startDate: data.date[0] || undefined,
        endDate: data.date[1] || undefined,
        featureName: props.featureName,
      }),
    components: [
      {
        key: 'date',
        type: 'daterange',
        props: {
          label: 'Date',
          placeholder: 'Any dates',
          wrapperClass: 'md:col-span-2 col-span-1',
        },
      },
      {
        key: 'eventType',
        type: 'select',
        props: {
          label: 'Event type',
          options:
            props.featureName === AuditLogFeatureName.SECURITY_DEPOSIT
              ? [
                  ...AuditLogEventTypeOptions,
                  {
                    label: 'Deleted',
                    value: 'deleted',
                  },
                ]
              : AuditLogEventTypeOptions,
          placeholder: 'All event types',
          wrapperClass: 'md:col-span-2 col-span-1',
        },
      },
      {
        key: 'userId',
        type: 'searchableselect',
        props: {
          label: 'User',
          options: usersData?.users
            ? usersData.users.map((user) => ({
                label: user.fullName,
                value: user.id,
              }))
            : [],
          placeholder: 'All users',
          wrapperClass: 'md:col-span-2 col-span-1',
        },
      },
      {
        key: 'search',
        type: 'search',
        props: {
          label: 'Search',
          placeholder: 'Enter event name',
          wrapperClass: 'md:col-span-4 col-span-2',
        },
      },
    ],
  });

  React.useEffect(() => {
    const [{}, {resetValue}] = filter;
    resetValue('date');
    resetValue('eventType');
    resetValue('userId');
    resetValue('search');
    pagination.setPage(1);
    pagination.setPerPage(20);
  }, []);

  const makeTitle = (title: string) => {
    return title.split(' ').map((value, index) => {
      if (index === 0) {
        return <span key={index}>{titleCase(value)}</span>;
      } else if ('details' === value) {
        return <span key={index}>{` ${value}`}</span>;
      } else {
        return <span key={index} className={'font-bold'}>{` ${titleCase(value)}`}</span>;
      }
    });
  };

  return (
    <Card expandable defaultIsOpen>
      <Card.Heading title={'History'} />
      <Card.Content className={'p-0'}>
        <div>
          <FilterControls className={'px-7 rounded-none'} filter={filter} />
          <Filter className={'px-7 py-4'} filter={filter} />
          {error && !isLoading && <QueryErrorAlert error={error as any} />}
          <DataTable
            native
            isLoading={isLoading}
            isFetching={isFetching}
            pagination={
              data &&
              !!data.items.length && (
                <PaginationNavigation
                  currentPage={pagination.page}
                  perPage={pagination.perPage}
                  total={data.total}
                  onChangePage={pagination.setPage}
                  onChangePageSize={pagination.setPerPage}
                />
              )
            }>
            <DataTableRowGroup groupType="thead">
              <Tr>
                <Td className={'pl-7'}>Event</Td>
                <Td>User</Td>
                <Td className="text-right pr-7">Date & Time</Td>
              </Tr>
            </DataTableRowGroup>
            <DataTableRowGroup>
              {data &&
                data.items.map((log, index) => (
                  <ExpandGroup key={index}>
                    <Tr>
                      <Td className={'pl-7'}>
                        <ExpandButton />
                        {makeTitle(log.name.toLowerCase())}
                      </Td>
                      <Td>{log.updatedBy.fullName}</Td>
                      <Td className={'text-right pr-7'}>{formatDate(log.updatedOn)}</Td>
                    </Tr>
                    <ExpandableRow className={'p-0 border-none'}>
                      <DataTable>
                        <DataTableRowGroup groupType="thead">
                          <Tr>
                            <Td>Field name</Td>
                            <Td>Old value</Td>
                            <Td>New value</Td>
                          </Tr>
                        </DataTableRowGroup>
                        {props.featureName === AuditLogFeatureName.CREDIT_ASSESSMENT && (
                          <DiffAssessmentLog
                            current={log.currentRecord || {}}
                            last={log.lastRecord || {}}
                          />
                        )}
                        {props.featureName === AuditLogFeatureName.SECURITY_DEPOSIT && (
                          <DiffSecurityLog
                            current={log.currentRecord || {}}
                            last={log.lastRecord || {}}
                          />
                        )}
                      </DataTable>
                    </ExpandableRow>
                  </ExpandGroup>
                ))}
            </DataTableRowGroup>
            {data && !data.items.length && (
              <DataTableCaption>
                <div className="flex items-center justify-center py-16">
                  <p>No history found.</p>
                </div>
              </DataTableCaption>
            )}
          </DataTable>
        </div>
      </Card.Content>
    </Card>
  );
};

const DiffAssessmentLog = (props: {
  current: SmartpayAssessmentDetails;
  last: SmartpayAssessmentDetails;
}) => {
  const {current, last} = props;

  const formatValue = (name, value): string => {
    switch (name) {
      case 'With security deposit':
        return value ? 'Yes' : 'No';
      case 'Qualitative rating':
      case 'Quantitative rating':
        return value ? getOptionLabel(SmartpayAssessmentRatingOptions, value) : '-';
      case 'Remarks':
        return value;
      default:
        return `RM ${formatMoney(value)}`;
    }
  };

  const compare = (name: string, oldValue: any, newValue: any) => {
    return oldValue != newValue ? (
      <Tr>
        <Td>{name}</Td>
        <Td>{oldValue !== undefined ? formatValue(name, oldValue) : '-'}</Td>
        <Td>{newValue !== undefined ? formatValue(name, newValue) : '-'}</Td>
      </Tr>
    ) : null;
  };

  return (
    <DataTableRowGroup>
      {compare(
        'Approved credit limit',
        last.creditLimit?.approvedCreditLimit,
        current.creditLimit?.approvedCreditLimit,
      )}
      {compare(
        'Requested credit limit',
        last.creditLimit?.requestedCreditLimit,
        current.creditLimit?.requestedCreditLimit,
      )}
      {compare(
        'Recommended credit limit',
        last.creditLimit?.recommendedCreditLimit,
        current.creditLimit?.recommendedCreditLimit,
      )}

      {compare(
        'With security deposit',
        last.securityDeposit?.securityDepositRequired,
        current.securityDeposit?.securityDepositRequired,
      )}
      {compare(
        'Approved security deposit amount',
        last.securityDeposit?.approvedSecurityDepositAmount,
        current.securityDeposit?.approvedSecurityDepositAmount,
      )}
      {compare(
        'Requested security deposit amount',
        last.securityDeposit?.requestedSecurityDepositAmount,
        current.securityDeposit?.requestedSecurityDepositAmount,
      )}
      {compare(
        'Recommended security deposit amount',
        last.securityDeposit?.recommendedSecurityDepositAmount,
        current.securityDeposit?.recommendedSecurityDepositAmount,
      )}

      {compare(
        'Qualitative rating',
        last.ratings?.qualitativeRating,
        current.ratings?.qualitativeRating,
      )}
      {compare(
        'Quantitative rating',
        last.ratings?.quantitativeRating,
        current.ratings?.quantitativeRating,
      )}

      {compare('Remarks', last.others?.remarks, current.others?.remarks)}
    </DataTableRowGroup>
  );
};

const DiffSecurityLog = (props: {current: ISecurityDeposit; last: ISecurityDeposit}) => {
  const {current, last} = props;
  const formatValue = (name, value): string => {
    switch (name) {
      case 'Security deposit type':
        return value ? getOptionLabel(depositTypes, value) : '-';
      case 'Bank account type':
        return value ? getOptionLabel(bankAccountTypes, value) : '-';
      case 'Validity period':
        return '';
      case 'Bank name':
        return value ? getOptionLabel(bankAccountNames, value) : '-';
      case 'Security deposit amount':
        return `RM ${formatMoney(value)}`;
      default:
        return value;
    }
  };

  const compare = (name: string, oldValue: any, newValue: any) => {
    if (name === 'Validity period') {
      if (oldValue.startDate !== newValue.startDate || oldValue.endDate !== newValue.endDate) {
        return (
          <Tr>
            <Td>{name}</Td>
            <Td>
              {oldValue.startDate !== undefined
                ? `${formatDate(oldValue.startDate, {formatType: 'dateOnly'})} - ${formatDate(
                    oldValue.endDate,
                    {formatType: 'dateOnly'},
                  )}`
                : '-'}
            </Td>
            <Td>
              {newValue.startDate !== undefined
                ? `${formatDate(newValue.startDate, {formatType: 'dateOnly'})} - ${formatDate(
                    newValue.endDate,
                    {formatType: 'dateOnly'},
                  )}`
                : '-'}
            </Td>
          </Tr>
        );
      }
      return null;
    }
    return oldValue != newValue ? (
      <Tr>
        <Td>{name}</Td>
        <Td>{oldValue !== undefined ? formatValue(name, oldValue) : '-'}</Td>
        <Td>{newValue !== undefined ? formatValue(name, newValue) : '-'}</Td>
      </Tr>
    ) : null;
  };

  return (
    <DataTableRowGroup>
      {compare('Security deposit type', last.securityDepositType, current.securityDepositType)}
      {compare(
        'Validity period',
        {
          startDate: last.startDate,
          endDate: last.endDate,
        },
        {
          startDate: current.startDate,
          endDate: current.endDate,
        },
      )}
      {compare(
        'Security deposit amount',
        last.securityDepositAmount,
        current.securityDepositAmount,
      )}

      {compare(
        'Security deposit reference number',
        last.securityDepositReferenceNumber,
        current.securityDepositReferenceNumber,
      )}
      {compare('Bank account type', last.bankAccountType, current.bankAccountType)}
      {compare('Bank name', last.bankName, current.bankName)}
      {compare('Bank account number', last.bankAccountNumber, current.bankAccountNumber)}

      {compare('SAP reference number', last.sapReferenceNumber, current.sapReferenceNumber)}

      {compare('Remarks', last.remarks, current.remarks)}
    </DataTableRowGroup>
  );
};
