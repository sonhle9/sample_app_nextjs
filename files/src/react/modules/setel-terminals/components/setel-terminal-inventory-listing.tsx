import {
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  Alert,
  FilterControls,
  Filter,
  PaginationNavigation,
  DataTableRowGroup,
  Badge,
  formatDate,
  BareButton,
  DataTableCaption,
} from '@setel/portal-ui';
import {useNotification} from 'src/react/hooks/use-notification';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {
  TerminalInventoryStatusOptions,
  TerminalStatus,
  TerminalStatusColorMap,
} from '../setel-terminals.const';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {getTerminalInventory} from 'src/react/services/api-terminal.service';
import {
  SETEL_TERMINAL_QUERY_KEY,
  useGetInventorySerialNumbers,
  useGetTerminalIds,
} from '../setel-terminals.queries';
import {ITerminalInventory} from 'src/react/services/api-terminal.type';
import TerminalInventoryEditSerialNumberModal from './inventory-edit-serial-number-modal';

const TerminalInventoryListing = () => {
  const [terminalIdSearchValue, setTerminalIdSearchValue] = React.useState<string>('');
  const [serialNumberSearchValue, setSerialNumberSearchValue] = React.useState<string>('');
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [selectedTerminal, setSelectedTerminal] = React.useState<ITerminalInventory>();

  const {data: terminalIds} = useGetTerminalIds({
    terminalId: terminalIdSearchValue,
  });

  const {data: serialNumbers} = useGetInventorySerialNumbers({
    serialNum: serialNumberSearchValue,
  });

  const showMessage = useNotification();

  const {
    query: {data, isFetching, isError, isLoading},
    filter,
    pagination,
  } = useDataTableState({
    initialFilter: {
      status: '' as TerminalStatus,
      dateRange: ['', ''] as [string, string],
      serialNum: '',
      terminalId: '',
    },
    queryKey: SETEL_TERMINAL_QUERY_KEY.TERMINALS_INVENTORY_LISTING,
    components: [
      {
        key: 'status',
        type: 'select',
        props: {
          'data-testid': 'status-filter-box',
          label: 'Status',
          placeholder: 'All statuses',
          options: [
            {
              label: 'All statuses',
              value: '',
            },
          ].concat(TerminalInventoryStatusOptions),
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
        key: 'serialNum',
        type: 'searchableselect',
        props: {
          label: 'Serial number',
          placeholder: 'Search by Serial Number',
          onInputValueChange: setSerialNumberSearchValue,
          options: serialNumbers,
        },
      },
      {
        key: 'terminalId',
        type: 'searchableselect',
        props: {
          label: 'Terminal',
          placeholder: 'Search by Terminal ID',
          onInputValueChange: setTerminalIdSearchValue,
          options: terminalIds,
        },
      },
    ],
    queryFn: (filter) => getTerminalInventory(computeFilterValue(filter)),
  });

  const isEditButtonVisible = (status: TerminalStatus) =>
    [TerminalStatus.NEW, TerminalStatus.CREATED].includes(status);

  const handleEditModal = (terminal: ITerminalInventory) => {
    setSelectedTerminal(terminal);
    setShowEditModal(true);
  };

  return (
    <>
      <PageContainer heading="Inventory">
        {isError && (
          <Alert
            className="my-4"
            variant="error"
            description="Server error! Please try again."
            accentBorder
          />
        )}
        <FilterControls className="mb-8" filter={filter} />
        <Filter className="mb-2" filter={filter} labelText="Search results for:" />
        <Table
          isLoading={isLoading}
          isFetching={isFetching}
          striped
          pagination={
            <PaginationNavigation
              total={data && data.total}
              currentPage={pagination.page}
              perPage={pagination.perPage}
              onChangePage={pagination.setPage}
              onChangePageSize={pagination.setPerPage}
            />
          }
          data-testid="setel-terminal-inventory-listing-table">
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td className="w-1/5">Serial No</Td>
              <Td className="w-1/5">Terminal ID</Td>
              <Td className="w-1/5">Status</Td>
              <Td className="w-1/5">Created Date</Td>
              <Td className="w-1/5 text-right">Action</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {data?.terminals &&
              data.terminals.map((terminal, index) => (
                <Tr key={index} data-testid="setel-terminal-row">
                  <Td className="w-1/4">
                    {terminal.serialNum}
                    <br />
                  </Td>
                  <Td className="w-1/4">
                    {terminal.terminalId || '-'}
                    <br />
                  </Td>
                  <Td className="w-1/4">
                    <Badge
                      className="tracking-wider font-semibold"
                      rounded="rounded"
                      color={TerminalStatusColorMap[terminal.status]}>
                      {terminal.status}
                    </Badge>
                  </Td>
                  <Td className="w-1/4">{terminal.createdAt && formatDate(terminal.createdAt)}</Td>
                  <Td className="w-1/4 text-right">
                    {isEditButtonVisible(terminal.status) && (
                      <BareButton
                        className="text-brand-500"
                        onClick={() => handleEditModal(terminal)}>
                        EDIT
                      </BareButton>
                    )}
                  </Td>
                </Tr>
              ))}
          </DataTableRowGroup>
          <DataTableCaption>
            {!isLoading && data?.terminals.length === 0 && (
              <div className="py-12">
                <p className="text-center text-gray-400 text-sm">No data available</p>
              </div>
            )}
          </DataTableCaption>
        </Table>
      </PageContainer>
      {showEditModal && (
        <TerminalInventoryEditSerialNumberModal
          isVisible={showEditModal}
          terminal={selectedTerminal}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            showMessage({
              title: `Inventory has been updated`,
              removeAfterMs: 5000,
            });
          }}
        />
      )}
      {isLoading && <div data-testid="loading-temp-component"></div>}
    </>
  );
};

const computeFilterValue = (filter: {
  status: TerminalStatus;
  dateRange: [string, string];
  serialNum: string;
  terminalId: string;
}) => {
  const {dateRange, ...restOfFilter} = filter;
  const [from, to] = dateRange;

  return {
    ...restOfFilter,
    from,
    to,
  };
};

export default TerminalInventoryListing;
