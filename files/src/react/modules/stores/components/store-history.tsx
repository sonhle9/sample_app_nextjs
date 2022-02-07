import {
  Alert,
  Button,
  CardHeading,
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableExpandButton as ExpandButton,
  DataTableExpandableGroup as ExpandGroup,
  DataTableExpandableSection as ExpandSection,
  PaginationNavigation,
  useDebounce,
  DownloadIcon,
  DATE_RANGE_OPTIONS_EXTENDED,
  titleCase,
  formatDate,
} from '@setel/portal-ui';

import {filterEmptyString, IPaginationResult} from 'src/react/lib/ajax';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import React, {useState} from 'react';
import {
  ActivityTypeEnum,
  IStoreError,
  IStoreHistory,
  UserTypeEnum,
} from 'src/react/services/api-stores.type';
import {AxiosError} from 'axios';
import {getStoreHistory} from 'src/react/services/api-stores.service';
import {ITimeSlot, IStoreTrigger, IFulfilment} from '../stores.types';
import {getActivityTypeOptions, getTimeLabel, getUserTypeOptions} from '../stores.helpers';
import {STORE_FULFILMENT_LABELS, STORE_TRIGGER_LABELS} from '../stores.const';
import {useDownloadStoreHistory, useStoreHistoryUsers} from '../stores.queries';
import {downloadTextFile} from 'src/react/modules/store-orders/store-orders.helpers';
import {sub} from 'date-fns';

type StoreHistoryFilter = {
  query?: string;
  date?: [string, string];
  activityType?: ActivityTypeEnum;
  userType?: UserTypeEnum;
  userId?: string;
  storeId?: string;
};
const initialFilter: StoreHistoryFilter = {
  query: '',
  date: ['', ''],
  activityType: null,
  userType: null,
  userId: '',
  storeId: '',
};

function useStoreHistoryDataTableState(options?: {
  isActive?: boolean;
  baseValues?: StoreHistoryFilter;
  onSearchChange?: React.ChangeEventHandler<HTMLInputElement>;
}) {
  const [storeHistoryUserQuery, setStoreHistoryUserQuery] = React.useState('');
  const debouncedStoreHistoryUser = useDebounce(storeHistoryUserQuery, 300);
  const {data: users} = useStoreHistoryUsers(
    {page: 1, perPage: 10},
    {userName: debouncedStoreHistoryUser, storeId: options.baseValues.storeId},
  );

  return useDataTableState<
    StoreHistoryFilter,
    IPaginationResult<IStoreHistory>,
    AxiosError<IStoreError>
  >({
    queryKey: ['store-history', options?.isActive],
    queryFn: (filter) =>
      options?.isActive
        ? getStoreHistory(
            {page: filter.page, perPage: filter.perPage},
            {
              from: filter.date?.[0],
              to: filter.date?.[1],
              query: filter.query,
              storeId: options.baseValues.storeId,
              activityType: filter.activityType,
              userType: filter.userType,
              userId: filter.userId,
            },
          )
        : undefined,
    initialFilter: {...initialFilter, ...options.baseValues},
    baseValues: {...initialFilter, ...options.baseValues},
    components: [
      {
        key: 'date',
        type: 'daterange',
        props: {
          label: 'Date',
          disableFuture: true,
          options: DATE_RANGE_OPTIONS_EXTENDED,
        },
      },
      {
        key: 'activityType',
        type: 'select',
        props: {
          label: 'Event type',
          placeholder: 'All events',
          options: getActivityTypeOptions(),
        },
      },
      {
        key: 'userType',
        type: 'select',
        props: {
          label: 'User type',
          placeholder: 'All user types',
          options: getUserTypeOptions(),
        },
      },
      {
        key: 'userId',
        type: 'searchableselect',
        props: {
          label: 'User',
          placeholder: 'Search user',
          onInputValueChange: setStoreHistoryUserQuery,
          options: users?.items?.map((user) => ({
            label: user.userName ?? user.userId,
            value: user.userId,
          })),
        },
      },
      {
        key: 'query',
        type: 'search',
        props: {
          label: 'Search',
          placeholder: 'Search the object',
          wrapperClass: !!options?.baseValues?.query ? 'hidden' : 'col-span-2',
          list: 'stations',
          onChange: options?.onSearchChange,
          'data-testid': 'filter-query',
        },
      },
    ],
  });
}

export function StoreHistory(props: {storeId?: string}) {
  const [isCardExpanded, setIsCardExpanded] = useState(true);

  const {
    pagination: {page, perPage, setPage, setPerPage},
    filter,
    filter: [{values}],
    query: {data: historyData, isLoading, isSuccess, error},
  } = useStoreHistoryDataTableState({
    isActive: isCardExpanded,
    baseValues: {storeId: props?.storeId},
  });

  const {mutate: downloadStoreHistory, isLoading: isDownloading} = useDownloadStoreHistory({
    onSuccess(csv) {
      downloadTextFile(
        csv,
        `store-history.${new Date().toISOString()}.${JSON.stringify(
          filterEmptyString(values),
        )}.csv`,
      );
    },
  });

  return (
    <>
      {error && (
        <Alert
          variant="error"
          description={error?.response?.data?.message || error?.message}
          className="mb-4"
        />
      )}
      <Table
        data-testid="store-history-table"
        native
        onToggleOpen={() => setIsCardExpanded((prevExpanded) => !prevExpanded)}
        isLoading={isLoading}
        heading={
          <CardHeading title="History" data-testid="store-history-card-heading">
            <Button
              data-testid="store-history-download"
              variant="outline"
              minWidth="none"
              leftIcon={<DownloadIcon />}
              disabled={isDownloading || !historyData?.items?.length}
              onClick={() =>
                downloadStoreHistory({
                  userType: values.userType,
                  query: values.query,
                  activityType: values.activityType,
                  userId: values.userId,
                  storeId: values.storeId,
                  from: values.date[0] || sub(new Date(), {months: 3}).toISOString(),
                  to: values.date[1] || new Date().toISOString(),
                })
              }>
              DOWNLOAD CSV
            </Button>
          </CardHeading>
        }
        expandable
        defaultIsOpen
        filter={filter}
        pagination={
          <PaginationNavigation
            currentPage={page}
            total={historyData?.total}
            perPage={perPage}
            onChangePage={setPage}
            onChangePageSize={setPerPage}
          />
        }>
        <Table.Thead>
          <Tr>
            <Td>EVENT</Td>
            <Td>USER</Td>
            <Td className="text-right">DATE & TIME</Td>
          </Tr>
        </Table.Thead>
        <Table.Tbody>
          {historyData?.items.map((history) => {
            return (
              <ExpandGroup key={history.id}>
                <Tr>
                  <Td>
                    <ExpandButton />
                    {titleCase(history.activityType, {hasUnderscore: true})}
                  </Td>
                  <Td>{history?.updatedBy.userName ?? history?.updatedBy.userId}</Td>
                  <Td className="text-right">
                    {(history?.dateTime && formatDate(history.dateTime)) ?? '-'}
                  </Td>
                </Tr>
                <ExpandSection>
                  <Tr>
                    <Td colSpan={5} className="px-4 sm:px-6 lg:px-8">
                      <Table striped responsive>
                        <Table.Thead>
                          <Tr>
                            <Td
                              className="px-4 s
                              m:px-6 lg:px-8 w-1/5">
                              Field name
                            </Td>
                            <Td className="px-4 sm:px-6 lg:px-8 w-2/5">Old value</Td>
                            <Td className="px-4 sm:px-6 lg:px-8 w-2/5 text-right">New value</Td>
                          </Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {history?.changes?.map((detail, idx) => (
                            <Tr key={idx}>
                              <StoreHistoryDetail detail={detail} />
                            </Tr>
                          ))}
                        </Table.Tbody>{' '}
                        {!history?.changes?.length && (
                          <Table.Caption>
                            <div className="py-12">
                              <p className="text-center text-gray-400 text-sm">
                                No data available.
                              </p>
                            </div>
                          </Table.Caption>
                        )}
                      </Table>
                    </Td>
                  </Tr>
                </ExpandSection>
              </ExpandGroup>
            );
          })}
        </Table.Tbody>
        {isSuccess && !historyData?.items.length && (
          <Table.Caption>
            <div className="py-12">
              <p className="text-center text-gray-400 text-sm">No data available.</p>
            </div>
          </Table.Caption>
        )}
      </Table>
    </>
  );
}

export function StoreHistoryDetail({detail}) {
  switch (detail.key) {
    case 'operatingHours':
      return (
        <>
          <Td className="hidden">{detail.key}</Td>
          <Td className="px-4 sm:px-6 lg:px-8">{detail.fieldName ?? '-'}</Td>
          <Td className="px-4 sm:px-6 lg:px-8">
            {typeof detail.oldValue === 'string' || detail.oldValue.length === 0
              ? '-'
              : detail.oldValue.map((hours: ITimeSlot, index: number) => (
                  <div key={index}>{getTimeLabel(hours)}</div>
                ))}
          </Td>
          <Td className="px-4 sm:px-6 lg:px-8 text-right">
            {typeof detail.newValue === 'string' || detail.newValue.length === 0
              ? '-'
              : detail.newValue.map((hours: ITimeSlot, index: number) => (
                  <div key={index}>{getTimeLabel(hours)}</div>
                ))}
          </Td>
        </>
      );
    case 'fulfilments':
      return (
        <>
          <Td className="hidden">{detail.key}</Td>
          <Td className="px-4 sm:px-6 lg:px-8">{detail.fieldName ?? '-'}</Td>
          <Td className="px-4 sm:px-6 lg:px-8">
            {detail.oldValue.map((fulfilment: IFulfilment, index: number) => (
              <div key={index}>
                {STORE_FULFILMENT_LABELS[fulfilment.type] + ': ' + fulfilment.status}
              </div>
            ))}
          </Td>
          <Td className="px-4 sm:px-6 lg:px-8 text-right">
            {detail.newValue.map((fulfilment: IFulfilment, index: number) => (
              <div key={index}>
                {STORE_FULFILMENT_LABELS[fulfilment.type] + ': ' + fulfilment.status}
              </div>
            ))}
          </Td>
        </>
      );
    case 'triggers':
      return (
        <>
          <Td className="hidden">{detail.key}</Td>
          <Td className="px-4 sm:px-6 lg:px-8">{detail.fieldName ?? '-'}</Td>
          <Td className="px-4 sm:px-6 lg:px-8">
            {detail.oldValue.map((trigger: IStoreTrigger, index: number) => (
              <div key={index}>{STORE_TRIGGER_LABELS[trigger.event] + ': ' + trigger.status}</div>
            ))}
          </Td>
          <Td className="px-4 sm:px-6 lg:px-8 text-right">
            {detail.newValue.map((trigger: IStoreTrigger, index: number) => (
              <div key={index}>{STORE_TRIGGER_LABELS[trigger.event] + ': ' + trigger.status}</div>
            ))}
          </Td>
        </>
      );
    default:
      return (
        <>
          <Td className="hidden">{detail.key}</Td>
          <Td className="px-4 sm:px-6 lg:px-8">{detail.fieldName ?? '-'}</Td>
          <Td className="px-4 sm:px-6 lg:px-8">
            {typeof detail.oldValue === 'string' ? detail.oldValue ?? '-' : <div>object</div>}
          </Td>
          <Td className="px-4 sm:px-6 lg:px-8 text-right">
            {typeof detail.newValue === 'string' ? detail.newValue ?? '-' : <div>object</div>}
          </Td>
        </>
      );
  }
}
