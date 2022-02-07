import {
  Alert,
  classes,
  DataTable,
  DataTableCaption,
  DataTableCell,
  DataTableRow,
  DataTableRowGroup,
  Filter,
  FilterControls,
  formatDate,
  PaginationNavigation,
  useFilter,
  usePaginationState,
} from '@setel/portal-ui';
import React from 'react';
import {Link} from 'src/react/routing/link';
import {
  TerminalSwitchFailedLogsSource,
  TerminalSwitchFailedLogType2Text,
  TerminalSwitchTransactionSource2Text,
} from '../terminal-switch-failed-logs.containt';
import {useTerminalSwitchFailedLogs} from '../terminal-switch-failed-logs.query';
import {
  IFailedLogResponseDto,
  TerminalSwitchTransactionSource,
} from '../terminal-switch-failed-logs.type';

export const TerminalSwitchFailedLogsListing = () => {
  const [terminalId, setTerminalId] = React.useState('');
  const filter = useFilter(
    {
      terminalId: '',
      merchantId: '',
      source: '',
      dateRange: ['', ''] as [string, string],
    },
    {
      components: [
        {
          key: 'source',
          type: 'select',
          props: {
            'data-testid': 'source-filter-box',
            label: 'Source',
            placeholder: 'All sources',
            options: TerminalSwitchFailedLogsSource,
          },
        },
        {
          key: 'dateRange',
          type: 'daterange',
          props: {
            label: 'Created on',
          },
        },
        {
          key: 'terminalId',
          type: 'searchableselect',
          props: {
            'data-testid': 'terminalId-filter-box',
            itemScope: false,
            wrapperClass: 'col-span-2',
            label: 'Terminal',
            placeholder: 'Search by Terminal ID',
            onInputValueChange: setTerminalId,
            options: terminalId
              ? [
                  {
                    value: terminalId,
                    label: terminalId,
                  },
                ]
              : [],
          },
        },
      ],
    },
  );
  const [{values}] = filter;
  const {page, perPage, setPage, setPerPage} = usePaginationState({
    initialPerPage: 20,
  });

  React.useEffect(() => {
    setPage(1);
  }, [values]);

  const requestFilter = React.useMemo(() => {
    return {
      source: (values.source as TerminalSwitchTransactionSource) || undefined,
      terminalId: values.terminalId || undefined,
      from: values.dateRange[0],
      to: values.dateRange[1],
      page,
      perPage,
    };
  }, [values, page, perPage]);

  const {data, isFetching, isError} = useTerminalSwitchFailedLogs(requestFilter);
  const isEmptyFailedLogTransactionList = data && data.failedLogs && data.failedLogs.length == 0;

  const mapFailedLogsToRow = (failedLog: IFailedLogResponseDto, index: number) => {
    const {source, createdAt: rawCreatedAt, terminalId, merchantId, type} = failedLog;
    const prettyTransactionSource = TerminalSwitchTransactionSource2Text[source];
    const prettyFailedLogType = TerminalSwitchFailedLogType2Text[type];
    const createdAt =
      rawCreatedAt &&
      formatDate(rawCreatedAt, {
        formatType: 'dateAndTime',
      });
    return (
      <DataTableRow
        key={index}
        render={(props) => (
          <Link
            data-testid="terminal-failed-logs"
            to={`gateway/failed-logs/${failedLog.id}`}
            {...props}
          />
        )}>
        <DataTableCell className="align-middle">
          <div className="h-8 flex bd-highlight items-center"> {terminalId}</div>
        </DataTableCell>
        <DataTableCell className="align-middle">
          <div className="h-8 flex bd-highlight items-center">{merchantId}</div>
        </DataTableCell>
        <DataTableCell className="align-middle">
          <div className="h-8 flex bd-highlight items-center">{prettyTransactionSource}</div>
        </DataTableCell>
        <DataTableCell className="text-right align-middle">{createdAt}</DataTableCell>
        <DataTableCell className="align-middle">
          <div className="h-8 flex bd-highlight items-center">{prettyFailedLogType}</div>
        </DataTableCell>
      </DataTableRow>
    );
  };

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex justify-between">
          <div>
            <h1 className={classes.h1}>Failed Logs</h1>
          </div>
        </div>
        {isError && (
          <Alert variant="error" description="Server error! Please try again." accentBorder />
        )}
        <FilterControls filter={filter} />
        <Filter filter={filter} labelText="Search results for" />
        <DataTable
          isLoading={isFetching}
          striped
          pagination={
            <PaginationNavigation
              total={data && data.total}
              currentPage={page}
              perPage={perPage}
              onChangePage={setPage}
              onChangePageSize={setPerPage}
            />
          }>
          <DataTableRowGroup groupType="thead">
            <DataTableRow>
              <DataTableCell className="w-1/6">Terminal ID</DataTableCell>
              <DataTableCell className="w-1/6">Merchant Id</DataTableCell>
              <DataTableCell className="w-1/12">Source</DataTableCell>
              <DataTableCell className="w-1/4 text-right">Created</DataTableCell>
              <DataTableCell className="w-1/4">Error type</DataTableCell>
            </DataTableRow>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {!isFetching &&
              !isEmptyFailedLogTransactionList &&
              data.failedLogs.map((item: IFailedLogResponseDto, index: number) =>
                mapFailedLogsToRow(item, index),
              )}
          </DataTableRowGroup>
          <DataTableCaption>
            {!isFetching && isEmptyFailedLogTransactionList && (
              <div className="py-12">
                <p className="text-center text-gray-400 text-sm">No transaction was found</p>
              </div>
            )}
          </DataTableCaption>
        </DataTable>
        {isFetching && <div data-testid="loading-temp-component"></div>}
      </div>
    </>
  );
};
