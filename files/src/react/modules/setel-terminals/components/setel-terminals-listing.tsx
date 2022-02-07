import {
  Badge,
  Button,
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DownloadIcon,
  Filter,
  FilterControls,
  formatDate,
  PaginationNavigation,
  DataTableCaption,
  PlusIcon,
  Alert,
  DropdownItem,
  DropdownMenu,
  DropdownMenuItems,
  useDebounce,
} from '@setel/portal-ui';
import {useNotification} from 'src/react/hooks/use-notification';
import {
  SETEL_TERMINAL_QUERY_KEY,
  useDownloadTerminalReport,
  useGetMerchants,
  useGetSerialNumbers,
  useGetTerminalIds,
} from '../setel-terminals.queries';
import * as React from 'react';
import {
  TerminalStatusColorMap,
  TerminalStatusOptions,
  TerminalTypeOptions,
} from '../setel-terminals.const';
import {CreateTerminalsModal} from './create-terminals-modal';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {getTerminals} from 'src/react/services/api-terminal.service';
import ImportSerialNumberModal from './import-serial-number-modal';
import UploadCSVModal from './upload-csv-modal';
import {downloadFile} from '../../../lib/utils';

interface ISetelTerminalFilter {
  status: string;
  type: string;
  dateRange: [string, string];
  lastSeenRange: [string, string];
  merchantId: string;
  serialNum: string;
  terminalId: string;
}
export interface SetelTerminalListingProps {
  enabled: boolean;
}

export const TerminalListing = (props: SetelTerminalListingProps) => {
  const [merchantSearchValue, setMerchantSearchValue] = React.useState<string>('');
  const [serialNumberSearchValue, setSerialNumberSearchValue] = React.useState<string>('');
  const [terminalIdSearchValue, setTerminalIdSearchValue] = React.useState<string>('');
  const [visibleCreateModal, setVisibleCreateModal] = React.useState(false);
  const [isVisibleImportModal, setIsVisibleImportModal] = React.useState(false);
  const [uploadCSVModal, setUploadCSVModal] = React.useState(false);
  const searchMerchantDebounce = useDebounce(merchantSearchValue);
  const {data: merchants} = useGetMerchants({name: searchMerchantDebounce});
  const {data: serialNumbers} = useGetSerialNumbers(serialNumberSearchValue);
  const {data: terminalIds} = useGetTerminalIds({terminalId: terminalIdSearchValue});
  const {mutate: downloadReport, isLoading: isDownloadingReport} = useDownloadTerminalReport();
  const {
    query: {data, isFetching, isError, isLoading},
    filter,
    pagination,
  } = useDataTableState({
    enabled: props.enabled,
    initialPerPage: 50,
    initialFilter: {
      status: '',
      type: '',
      dateRange: ['', ''] as [string, string],
      lastSeenRange: ['', ''] as [string, string],
      merchantId: '',
      serialNum: '',
      terminalId: '',
    },
    queryKey: SETEL_TERMINAL_QUERY_KEY.TERMINALS_LISTING,
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
          ].concat(TerminalStatusOptions),
        },
      },
      {
        key: 'type',
        type: 'select',
        props: {
          'data-testid': 'type-filter-box',
          label: 'Terminal type',
          placeholder: 'All types',
          options: [
            {
              label: 'All types',
              value: '',
            },
          ].concat(TerminalTypeOptions),
        },
      },
      {
        key: 'dateRange',
        type: 'daterange',
        props: {
          label: 'SN imported on',
        },
      },
      {
        key: 'serialNum',
        type: 'searchableselect',
        props: {
          label: 'Serial number (SN)',
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
          wrapperClass: 'col-start-1',
        },
      },
      {
        key: 'lastSeenRange',
        type: 'daterange',
        props: {
          label: 'Last seen',
        },
      },
      {
        key: 'merchantId',
        type: 'searchableselect',
        props: {
          wrapperClass: 'col-span-2',
          label: 'Merchant',
          placeholder: 'Search by Merchant ID or Name',
          onInputValueChange: setMerchantSearchValue,
          options: merchants,
          'data-testid': 'terminal-listing-search-merchantId',
        },
      },
    ],
    queryFn: (f) => getTerminals(computeFilterValue(f)),
  });

  const showMessage = useNotification();
  const isEmptyTerminalList = data && data.terminals && data.terminals.length === 0;

  const handleSuccessCreate = (recordType: string, description: React.ReactNode) => {
    showMessage({
      title: `Create ${recordType} successfully`,
      description,
      removeAfterMs: 5000,
    });
  };

  const handleDownloadCSV = () => {
    downloadReport(computeFilterValue(filter[0].values), {
      onSuccess: (csvBlob) => {
        downloadFile(
          csvBlob,
          `Terminal-Details-Report-${formatDate(new Date(), {format: 'yyyy-MM-dd'})}.csv`,
        );
        showMessage({
          title: `Report downloaded successfully`,
          removeAfterMs: 5000,
        });
      },
      onError: (err: any) => {
        showMessage({
          title: `Report download failed`,
          variant: 'error',
          description: err.message || 'Unknown error',
          removeAfterMs: 5000,
        });
      },
    });
  };
  const handleSuccessImportSerialNumbers = () => {
    showMessage({
      title: 'Import serial numbers successfully',
      removeAfterMs: 5000,
    });
  };

  React.useEffect(() => {
    if (!filter[0].values.merchantId) {
      setMerchantSearchValue('');
    }
  }, [filter[0].values.merchantId]);

  return (
    <>
      <PageContainer
        heading="Terminal"
        action={
          !isLoading &&
          !isError && (
            <div className="flex flex-wrap items-center space-x-2">
              <Button
                onClick={handleDownloadCSV}
                variant="outline"
                leftIcon={<DownloadIcon />}
                isLoading={isDownloadingReport}>
                DOWNLOAD CSV
              </Button>
              <DropdownMenu label="IMPORT SERIAL NO." variant="outline">
                <DropdownMenuItems width="match-button">
                  <DropdownItem onSelect={() => setUploadCSVModal(true)}>Upload CSV</DropdownItem>
                  <DropdownItem onSelect={() => setIsVisibleImportModal(true)}>
                    Manual Input
                  </DropdownItem>
                </DropdownMenuItems>
              </DropdownMenu>
              <Button
                variant="primary"
                leftIcon={<PlusIcon />}
                onClick={() => setVisibleCreateModal(true)}>
                CREATE
              </Button>
            </div>
          )
        }>
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
          data-testid="setel-terminal-listing-table">
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td className="w-1/6">Terminal ID/Serial No</Td>
              <Td className="w-1/6">Status</Td>
              <Td className="w-2/6">Merchant Name</Td>
              <Td className="w-1/6 text-right">SN Imported Date</Td>
              <Td className="w-1/6 text-right">Last Seen</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {data?.terminals &&
              data.terminals.map((terminal, index) => (
                <Tr key={index} data-testid="setel-terminal-row">
                  <Td
                    className="w-1/6"
                    render={(props) => (
                      <a
                        target={'_blank'}
                        href={`/terminal/details/setel/${terminal.serialNum}`}
                        {...props}
                      />
                    )}>
                    {terminal.terminalId}
                    <br />
                    <span className="text-gray-400 text-sm">{terminal.serialNum}</span>
                  </Td>
                  <Td className="w-1/6">
                    <Badge
                      className="tracking-wider font-semibold"
                      rounded="rounded"
                      color={TerminalStatusColorMap[terminal.status]}>
                      {terminal.status}
                    </Badge>
                  </Td>
                  <Td className="w-1/3">{terminal.merchantName}</Td>
                  <Td className="w-1/6 text-right">
                    {terminal.createdAt &&
                      formatDate(terminal.createdAt, {
                        formatType: 'dateAndTime',
                      })}
                  </Td>
                  <Td className="w-1/6 text-right">
                    {terminal.lastSeenAt &&
                      formatDate(terminal.lastSeenAt, {
                        formatType: 'dateAndTime',
                      })}
                  </Td>
                </Tr>
              ))}
          </DataTableRowGroup>
          <DataTableCaption>
            {!isLoading && isEmptyTerminalList && (
              <div className="py-12">
                <p className="text-center text-gray-400 text-sm">No data available</p>
              </div>
            )}
          </DataTableCaption>
        </Table>
      </PageContainer>
      {visibleCreateModal && (
        <CreateTerminalsModal
          visible={visibleCreateModal}
          onSuccessCreate={handleSuccessCreate}
          onClose={() => {
            setVisibleCreateModal(false);
          }}
        />
      )}
      {isVisibleImportModal && (
        <ImportSerialNumberModal
          visible={isVisibleImportModal}
          onSuccessCreate={handleSuccessImportSerialNumbers}
          onClose={() => {
            setIsVisibleImportModal(false);
          }}
        />
      )}
      {uploadCSVModal && (
        <UploadCSVModal
          visible={uploadCSVModal}
          onSuccessUpload={(title) => showMessage({title, removeAfterMs: 5000})}
          onClose={() => setUploadCSVModal(false)}
        />
      )}
      {isLoading && <div data-testid="loading-temp-component"></div>}
    </>
  );
};

function computeFilterValue({
  dateRange: [from, to],
  lastSeenRange: [fromLastSeen, toLastSeen],
  ...f
}: ISetelTerminalFilter & {page?: number; perPage?: number}) {
  return {
    ...f,
    from,
    to,
    fromLastSeen,
    toLastSeen,
  };
}
