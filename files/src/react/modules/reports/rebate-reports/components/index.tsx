import * as React from 'react';
import {
  formatDate,
  PaginationNavigation,
  usePaginationState,
  DataTable as Table,
  useAjaxOperations,
  Notification,
  DocIcon,
  Progress,
  BareButton,
  IconButton,
  createAjaxOperation,
  ExclamationIcon,
  ReloadIcon,
} from '@setel/portal-ui';
import {PageContainer} from 'src/react/components/page-container';
import {QueryErrorAlert} from '../../../../components/query-error-alert';
import {EmptyDataTableCaption} from '../../../../components/empty-data-table-caption';
import {RebatePlansCreateModal} from '../../../rebate-plans/components/rebate-plans-listing/rebate-plans-create-modal';
import {useRebateReports} from '../rebate-reports.queries';
import {rebateReportRole} from '../../../../../shared/helpers/roles.type';
import {HasPermission} from 'src/react/modules/auth/HasPermission';
import {useMalaysiaTime} from '../../../subsidies-maintenance/subsidy-maintenance.helpers';
import {downloadFile} from '../../../../lib/utils';
import {getRebateReportDetailsCSV} from '../../../../services/api-rebates.service';
import {IRebateReport} from '../../../../services/api-rebates.type';

export const RebateReportsListing = () => {
  const {page, setPage, perPage, setPerPage} = usePaginationState();
  const [showModalCreate, setShowModalCreate] = React.useState(false);
  const [fileName, setFileName] = React.useState('');
  const {data, isLoading, isError, error} = useRebateReports({
    page,
    perPage,
  });
  const isEmpty = !isLoading && data?.rebateReports?.length === 0;

  const handleDownload = createAjaxOperation(
    async ({processDate, fileName}, _cancelToken, updateProgress) => {
      const csvData = await getRebateReportDetailsCSV(processDate);

      updateProgress(0.5);
      downloadFile(csvData, fileName);
    },
  );
  const {add, items} = useAjaxOperations({
    operation: handleDownload,
    autoRemoveDelayWhenSuccess: 3000,
  });

  return (
    <HasPermission accessWith={[rebateReportRole.view]}>
      {items.map((item) => (
        <Notification
          title={fileName}
          Icon={
            items[0]?.status === 'pending'
              ? DocIcon
              : items[0]?.status === 'error'
              ? ExclamationIcon
              : undefined
          }
          variant={
            items[0]?.status === 'pending'
              ? undefined
              : items[0]?.status === 'error'
              ? 'error'
              : 'success'
          }
          description={
            items[0]?.status === 'pending' ? (
              <span className="w-96">Preparing to download. Please wait...</span>
            ) : items[0]?.status === 'error' ? (
              <span className="w-96 text-error-500">File error. Please try again.</span>
            ) : (
              <span className="w-96 tracking-wider font-medium text-brand-500">DOWNLOAD FILE</span>
            )
          }
          onDismiss={item.onRemove}
          key={item.key}
          actions={
            item.status === 'error' && (
              <IconButton onClick={item.onRetry} className="p-0">
                <ReloadIcon className="w-4 h-4 text-lightgrey" />
              </IconButton>
            )
          }>
          {item.status === 'pending' && (
            <Progress progress={item.progress} data-testid="progress" />
          )}
        </Notification>
      ))}
      <PageContainer heading="Rebate reports" className={'space-y-4'}>
        {isError && <QueryErrorAlert error={error as any} />}
        <Table
          isLoading={isLoading}
          pagination={
            <PaginationNavigation
              total={data?.total}
              currentPage={page}
              perPage={perPage}
              onChangePage={setPage}
              onChangePageSize={setPerPage}
            />
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="w-1/2">Rebate report cycle date</Table.Th>
              <Table.Th className="w-1/4">Created on</Table.Th>
              <Table.Th className="w-1/4 text-right">CSV</Table.Th>
            </Table.Tr>
          </Table.Thead>
          {!isEmpty && (
            <Table.Tbody>
              {data?.rebateReports?.map((rebateReport: IRebateReport) => (
                <Table.Tr key={rebateReport.id}>
                  <Table.Td>
                    {formatDate(rebateReport.processDate, {formatType: 'dateOnly'})}
                  </Table.Td>
                  <Table.Td>
                    {' '}
                    {formatDate(useMalaysiaTime(new Date(rebateReport.createdAt)), {
                      formatType: 'dateOnly',
                    })}
                  </Table.Td>
                  <Table.Td className="text-right">
                    <BareButton
                      className="text-brand-500"
                      onClick={() => {
                        const processDateString = formatDate(
                          useMalaysiaTime(new Date(rebateReport.processDate)),
                          {
                            format: 'yyyy-MM-dd',
                          },
                        );
                        setFileName(`Report_Rebate_${processDateString}.csv`);
                        add({
                          processDate: processDateString,
                          fileName: `Report_Rebate_${processDateString}.csv`,
                        });
                      }}>
                      DOWNLOAD
                    </BareButton>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          )}
          {isEmpty && <EmptyDataTableCaption />}
        </Table>
        {showModalCreate && <RebatePlansCreateModal setShowModal={setShowModalCreate} />}
      </PageContainer>
    </HasPermission>
  );
};
