import {
  Alert,
  Badge,
  classes,
  DataTable as Table,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  Filter,
  FilterControls,
  formatDate,
  PaginationNavigation,
  useFilter,
  usePaginationState,
  useTransientState,
  Notification,
} from '@setel/portal-ui';
import * as React from 'react';
import {Link} from 'src/react/routing/link';
import {useReconciliations, useGetMerchants} from '../reconciliation.queries';
import {
  defaultSettingReconciliationPage,
  ReconciliationStatusColorMap,
  ReconciliationStatusOptions,
  ReconciliationTypeOptions,
} from '../reconciliation.type';
import {DownloadCsvDropdown} from 'src/react/components/download-csv-dropdown';
import {sendReportViaEmail, downloadReportCSV} from 'src/react/services/api-settlements.service';
import {useMountSafe} from 'src/react/hooks/use-mount-safe';
import {
  mapSettlementTypeToPaymentMethod,
  SettlementTypeFilter,
} from 'src/react/services/api-settlements.type';

export const ReconciliationListing = () => {
  const {page, perPage, setPage, setPerPage} = usePaginationState({
    initialPerPage: defaultSettingReconciliationPage.defaultPerPage,
  });
  const [batchId, setBatchId] = React.useState('');
  const [terminalId, setTerminalId] = React.useState('');
  const [merchantSearchValue, setMerchantSearchValue] = React.useState<string>('');
  const {data: merchants} = useGetMerchants({name: merchantSearchValue});

  const filter = useFilter(
    {
      status: '',
      type: '',
      dateRange: ['', ''] as [string, string],
      batchId: '',
      terminalId: '',
      merchantId: '',
      settlementType: '',
    },
    {
      components: [
        {
          key: 'status',
          type: 'select',
          props: {
            label: 'Status',
            placeholder: 'All status',
            options: ReconciliationStatusOptions,
          },
        },
        {
          key: 'type',
          type: 'select',
          props: {
            label: 'Type',
            placeholder: 'All type',
            options: ReconciliationTypeOptions,
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
          key: 'settlementType',
          type: 'select',
          props: {
            label: 'Card Type',
            placeholder: 'All card type',
            options: SettlementTypeFilter,
          },
        },
        {
          key: 'batchId',
          type: 'searchableselect',
          props: {
            label: 'Batch',
            placeholder: 'Select by Batch Number',
            onInputValueChange: setBatchId,
            options: batchId
              ? [
                  {
                    value: batchId,
                    label: batchId,
                  },
                ]
              : [],
          },
        },
        {
          key: 'terminalId',
          type: 'searchableselect',
          props: {
            label: 'Terminal',
            placeholder: 'Select by Terminal ID',
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
        {
          key: 'merchantId',
          type: 'searchableselect',
          props: {
            label: 'Merchant',
            placeholder: 'Search by Merchant ID or Name',
            onInputValueChange: setMerchantSearchValue,
            options: merchants,
            wrapperClass: 'col-span-2',
          },
        },
      ],
      onChange: () => setPage(defaultSettingReconciliationPage.defaultPage),
    },
  );

  const [{values}] = filter;

  React.useEffect(() => {
    if (!values.merchantId) {
      setMerchantSearchValue('');
    }
  }, [values.merchantId]);

  const requestFilters = React.useMemo(
    () => ({
      isAmountMatch: values.status ? values.status === 'succeeded' : undefined,
      type: values.type || undefined,
      createdAtFrom: values.dateRange[0],
      createdAtTo: values.dateRange[1],
      merchantId: values.merchantId || undefined,
      posBatchSettlementId: values.batchId || undefined,
      terminalId: values.terminalId || undefined,
      settlementType: values.settlementType || undefined,
      page,
      perPage,
    }),
    [values, page, perPage],
  );

  const {data, isLoading, isError} = useReconciliations(requestFilters);

  //notification
  const [showNoti, setShowNoti] = useTransientState(false);
  const setShowNotiSafe = useMountSafe(setShowNoti);
  const [notiType, setNotiType] = React.useState<'success' | 'error' | undefined>(undefined);
  const setNotiTypeSafe = useMountSafe(setNotiType);

  const sendReconciliationReportViaEmail = React.useCallback(
    (emails: string[]) => {
      const {page, perPage, ...rest} = requestFilters;
      return sendReportViaEmail('Reconciliation', emails, rest)
        .then(() => {
          setShowNotiSafe(true);
          setNotiTypeSafe('success');
        })
        .catch(() => {
          setShowNotiSafe(true);
          setNotiTypeSafe('error');
        });
    },
    [requestFilters],
  );

  const downloadReconciliationReportCSV = React.useCallback(() => {
    const {page, perPage, ...rest} = requestFilters;
    return downloadReportCSV('Reconciliation', rest);
  }, [requestFilters]);

  const isEmptyReconciliations =
    !isLoading && data && data.reconciliations && data.reconciliations.length === 0;

  return (
    <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex justify-between">
        <div>
          <h1 className={classes.h1}>Reconciliations</h1>
        </div>
        <DownloadCsvDropdown
          variant="outline"
          onSendEmail={sendReconciliationReportViaEmail}
          onDownload={downloadReconciliationReportCSV}
          emailModalTitle="Send email"
        />
      </div>
      {isError && (
        <Alert variant="error" description="Server error! Please try again." accentBorder />
      )}
      <FilterControls filter={filter} />
      <Filter filter={filter} labelText="Search results for" />

      <div className="mb-8">
        <Table
          isLoading={isLoading}
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
              <Td className="w-1/6">Merchant Name</Td>
              <Td className="w-1/6">Status</Td>
              <Td className="w-1/6 text-right">Number of transaction</Td>
              <Td className="w-1/6 text-right">Card Type</Td>
              <Td className="w-1/6 text-right">Recon date</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {data &&
              data.reconciliations.map((item, index) => (
                <Tr
                  key={index}
                  render={(props) => (
                    <Link {...props} to={`/gateway/reconciliations/${item.id}`} />
                  )}>
                  <Td className={classes.h4}>{item.merchantName}</Td>
                  <Td>
                    <Badge
                      className="tracking-wider font-semibold"
                      rounded="rounded"
                      size="large"
                      color={
                        ReconciliationStatusColorMap[item.isAmountMatch ? 'SUCCEEDED' : 'FAILED']
                      }>
                      {item && item.isAmountMatch === true ? 'SUCCEEDED' : 'FAILED'}
                    </Badge>
                  </Td>
                  <Td>
                    <div style={{textAlign: 'right'}}>
                      Terminal:{' '}
                      {item.terminalAmounts.totalNetPurchaseCount +
                        item.terminalAmounts.totalNetTopupCount}
                    </div>
                    <div style={{textAlign: 'right'}}>
                      System:{' '}
                      {item.systemAmounts.totalNetPurchaseCount +
                        item.systemAmounts.totalNetTopupCount}
                    </div>
                  </Td>
                  <Td className="text-right">
                    {mapSettlementTypeToPaymentMethod.get(item.settlementType)}
                  </Td>
                  <Td className="text-right">
                    {item.updatedAt &&
                      formatDate(item.updatedAt, {
                        formatType: 'dateAndTime',
                      })}
                  </Td>
                </Tr>
              ))}
          </DataTableRowGroup>
          {isEmptyReconciliations && (
            <DataTableCaption>
              <div className="py-12">
                <p className="text-center text-gray-400 text-sm">No data available</p>
              </div>
            </DataTableCaption>
          )}
        </Table>
      </div>
      <Notification
        isShow={showNoti}
        variant={notiType}
        title={
          notiType === 'success'
            ? 'Request successfully. The report will be sent shortly.'
            : 'Fail to request.'
        }
      />
    </div>
  );
};
