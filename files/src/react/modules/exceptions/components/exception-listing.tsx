import {
  Card,
  classes,
  usePaginationState,
  DataTable as Table,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  formatDate,
  PaginationNavigation,
  DataTableCaption,
  Notification,
  useTransientState,
  useFilter,
  FilterControls,
  Filter,
} from '@setel/portal-ui';
import * as React from 'react';
import {Link} from 'src/react/routing/link';
import {useExceptions, useGetMerchants} from '../exceptions.queries';
import {defaultSettingPage} from '../exceptions.type';
import {DownloadCsvDropdown} from 'src/react/components/download-csv-dropdown';
import {sendReportViaEmail, downloadReportCSV} from 'src/react/services/api-settlements.service';
import {useMountSafe} from 'src/react/hooks/use-mount-safe';
import {
  mapSettlementTypeToPaymentMethod,
  SettlementTypeFilter,
} from 'src/react/services/api-settlements.type';

export const ExceptionListing = () => {
  const {page, perPage, setPage, setPerPage} = usePaginationState({
    initialPerPage: defaultSettingPage.defaultPerPage,
  });
  const [merchantSearchValue, setMerchantSearchValue] = React.useState<string>('');
  const {data: merchants} = useGetMerchants({name: merchantSearchValue});
  const [batchId, setBatchId] = React.useState<string>('');
  const [terminalId, setTerminalId] = React.useState('');

  //notification
  const [showNoti, setShowNoti] = useTransientState(false);
  const setShowNotiSafe = useMountSafe(setShowNoti);
  const [notiType, setNotiType] = React.useState<'success' | 'error' | undefined>(undefined);
  const setNotiTypeSafe = useMountSafe(setNotiType);

  const filter = useFilter(
    {
      dateRange: ['', ''] as [string, string],
      batchId: '',
      terminalId: '',
      merchantId: '',
      settlementType: '',
    },
    {
      components: [
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
      onChange: () => setPage(defaultSettingPage.defaultPage),
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
      merchantId: values.merchantId || undefined,
      posBatchSettlementId: values.batchId || undefined,
      terminalId: values.terminalId || undefined,
      createdAtFrom: values.dateRange[0],
      createdAtTo: values.dateRange[1],
      settlementType: values.settlementType || undefined,
      page,
      perPage,
    }),
    [values, page, perPage],
  );

  let condition = false;
  const {data, isLoading} = useExceptions(requestFilters);

  condition = !isLoading && data && data.exceptions && data.exceptions.length > 0;

  const sendExceptionReportViaEmail = React.useCallback(
    (emails: string[]) => {
      const {page, perPage, ...rest} = requestFilters;
      return sendReportViaEmail('Exception', emails, rest)
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

  const downloadExceptionReportCSV = React.useCallback(() => {
    const {page, perPage, ...rest} = requestFilters;
    return downloadReportCSV('Exception', rest);
  }, [requestFilters]);

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between">
          <h1 className={classes.h1}>Exceptions</h1>
          <DownloadCsvDropdown
            variant="outline"
            onSendEmail={sendExceptionReportViaEmail}
            onDownload={downloadExceptionReportCSV}
            emailModalTitle="Send email"
          />
        </div>
        <FilterControls filter={filter} />
        <Filter filter={filter} labelText="Search results for" />
        <Card>
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
                <Td className="w-1/6 text-left">Merchant Name</Td>
                <Td className="w-1/6 text-left">Batch Number</Td>
                <Td className="w-1/6 text-center">Number of processed transaction</Td>
                <Td className="w-1/6 text-left">Card Type</Td>
                <Td className="w-1/6 text-right">Settlement Date</Td>
              </Tr>
            </DataTableRowGroup>
            <DataTableRowGroup>
              {condition &&
                data?.exceptions.map((exception, index) => (
                  <Tr key={index} data-testid="exception">
                    <Td
                      className="w-1/6 text-left"
                      render={(props) => (
                        <Link {...props} to={`/gateway/exceptions/${exception.id}`} />
                      )}>
                      {exception?.merchantName || '-'}
                    </Td>
                    <Td className="w-1/6 text-left">{exception?.posBatchSettlementId || ''}</Td>
                    <Td className="w-1/6 text-center">{exception?.transactionNum || 0}</Td>
                    <Td className="text-left">
                      {mapSettlementTypeToPaymentMethod.get(exception.settlementType)}
                    </Td>
                    <Td className="w-1/6 text-right">
                      {exception.createdAt &&
                        formatDate(exception.createdAt, {
                          formatType: 'dateAndTime',
                        })}
                    </Td>
                  </Tr>
                ))}
            </DataTableRowGroup>
            <DataTableCaption>
              {!isLoading && !(data?.exceptions && data?.exceptions.length) && (
                <div className="py-12">
                  <p className="text-center text-gray-400 text-sm">No data available</p>
                </div>
              )}
            </DataTableCaption>
          </Table>
        </Card>
        <Notification
          isShow={showNoti}
          variant={notiType}
          title={
            notiType === 'success'
              ? 'Request successfully. The report will be sent shortly.'
              : 'Fail to request.'
          }
        />
        {isLoading && <div data-testid="loading-temp-component"></div>}
      </div>
    </>
  );
};
