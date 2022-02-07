import {
  Badge,
  Button,
  classes,
  usePaginationState,
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  Filter,
  FilterControls,
  formatDate,
  PaginationNavigation,
  DataTableCaption,
  useFilter,
  PlusIcon,
  Alert,
} from '@setel/portal-ui';
import {useNotification} from 'src/react/hooks/use-notification';
import {useTerminals, useGetMerchants} from '../terminals.queries';
import * as React from 'react';
import {
  TerminalStatusColorMap,
  TerminalStatusOptions,
  TerminalTypeOptions,
} from '../terminals.constant';
import {TerminalsModal} from './terminals-modal';
import {ReplacementModal} from './replacement-modal';

export interface LegacyTerminalListingProps {
  enabled: boolean;
}

export const TerminalListing = (props: LegacyTerminalListingProps) => {
  const [merchantSearchValue, setMerchantSearchValue] = React.useState<string>('');
  const {data: merchants} = useGetMerchants({name: merchantSearchValue});
  const filter = useFilter(
    {
      status: '',
      type: '',
      dateRange: ['', ''] as [string, string],
      merchantId: '',
    },
    {
      components: [
        {
          key: 'status',
          type: 'select',
          props: {
            'data-testid': 'status-filter-box',
            label: 'Status',
            placeholder: 'All status',
            options: TerminalStatusOptions,
          },
        },
        {
          key: 'type',
          type: 'select',
          props: {
            'data-testid': 'type-filter-box',
            label: 'Terminal type',
            placeholder: 'Any type',
            options: TerminalTypeOptions,
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
          key: 'merchantId',
          type: 'searchableselect',
          props: {
            wrapperClass: 'col-span-2',
            label: 'Merchant',
            placeholder: 'Search by Merchant ID or Name',
            onInputValueChange: setMerchantSearchValue,
            options: merchants,
          },
        },
      ],
      onChange: () => setPage(1),
    },
  );

  const [{values}] = filter;
  const [visibleCreateModal, setVisibleCreateModal] = React.useState(false);
  const [visibleReplacementModal, setVisibleReplacementModal] = React.useState(false);
  const showMessage = useNotification();
  const {page, perPage, setPage, setPerPage} = usePaginationState({
    initialPerPage: 50,
  });
  const {data, isFetching, isError} = useTerminals({
    enabled: props.enabled,
    status: values.status,
    type: values.type,
    merchantId: values.merchantId || undefined,
    from: values.dateRange[0],
    to: values.dateRange[1],
    page,
    perPage,
  });

  const isEmptyTerminalList = data && data.terminals && data.terminals.length === 0;

  const handleSuccessCreate = (recordType: string, description: React.ReactNode) => {
    showMessage({
      title: `Create ${recordType} successfully`,
      description,
      removeAfterMs: 5000,
    });
  };

  React.useEffect(() => {
    if (!values.merchantId) {
      setMerchantSearchValue('');
    }
  }, [values.merchantId]);

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between">
          <div>
            <h1 className={classes.h1}>Terminals</h1>
          </div>
          {!isFetching && !isError && (
            <div className="flex flex-wrap items-center space-x-2">
              {/* <Button variant="outline" onClick={() => setVisibleReplacementModal(true)}>
                REPLACE
              </Button> */}
              <Button
                variant="primary"
                leftIcon={<PlusIcon />}
                onClick={() => setVisibleCreateModal(true)}>
                CREATE
              </Button>
            </div>
          )}
        </div>
        {isError && (
          <Alert variant="error" description="Server error! Please try again." accentBorder />
        )}
        <FilterControls filter={filter} />
        <Filter filter={filter} labelText="Search results for" />
        <Table
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
            <Tr>
              <Td className="w-1/6">Terminal Id</Td>
              <Td className="w-1/6">Status</Td>
              <Td className="w-1/3">Merchant Name</Td>
              <Td className="w-1/6 ">Last Seen</Td>
              <Td className="w-1/6 text-right">Created on</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {data?.terminals &&
              data.terminals.map((terminal, index) => (
                <Tr key={index} data-testid="terminal-row">
                  <Td
                    className="w-1/6"
                    render={(props) => (
                      <a
                        target={'_blank'}
                        href={`/gateway/terminals/${terminal.terminalId}/merchants/${terminal.merchant.id}`}
                        {...props}
                      />
                    )}>
                    {terminal.terminalId}
                  </Td>
                  <Td className="w-1/6">
                    <Badge
                      className="tracking-wider font-semibold"
                      rounded="rounded"
                      color={TerminalStatusColorMap[terminal.status]}>
                      {terminal && terminal.status}
                    </Badge>
                  </Td>
                  <Td className="w-1/3">{terminal.merchant.name}</Td>
                  <Td className="w-1/6 text-right">
                    {terminal.updatedAt &&
                      formatDate(terminal.updatedAt, {
                        formatType: 'dateAndTime',
                      })}
                  </Td>
                  <Td className="w-1/6 text-right">
                    {terminal.createdAt &&
                      formatDate(terminal.createdAt, {
                        formatType: 'dateAndTime',
                      })}
                  </Td>
                </Tr>
              ))}
          </DataTableRowGroup>
          <DataTableCaption>
            {!isFetching && isEmptyTerminalList && (
              <div className="py-12">
                <p className="text-center text-gray-400 text-sm">No data available</p>
              </div>
            )}
          </DataTableCaption>
        </Table>
      </div>
      {visibleCreateModal && (
        <TerminalsModal
          visible={visibleCreateModal}
          onSuccessCreate={handleSuccessCreate}
          onClose={() => {
            setVisibleCreateModal(false);
          }}
        />
      )}
      {visibleReplacementModal && (
        <ReplacementModal
          visible={visibleReplacementModal}
          onSuccessCreate={handleSuccessCreate}
          onClose={() => {
            setVisibleReplacementModal(false);
          }}
        />
      )}
      {isFetching && <div data-testid="loading-temp-component"></div>}
    </>
  );
};
