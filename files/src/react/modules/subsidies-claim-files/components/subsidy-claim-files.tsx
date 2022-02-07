import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {
  BareButton,
  DataTable as Table,
  DocIcon,
  usePaginationState,
  PaginationNavigation,
  Notification,
  createAjaxOperation,
  formatDate,
  useAjaxOperations,
  IconButton,
  ReloadIcon,
  Progress,
} from '@setel/portal-ui';
import {useSubsidyClaimFiles} from '../subsidy-claim-files.queries';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {getSubsidyClaimFileDownloadUrl} from '../subsidy-claim-files.services';
import {useMalaysiaTime} from '../../subsidies-maintenance/subsidy-maintenance.helpers';

export const SubsidyClaimFiles = () => {
  const {page, perPage, setPage, setPerPage} = usePaginationState();
  const {data, error, isLoading, isError, isFetching} = useSubsidyClaimFiles({
    page,
    perPage,
  });

  const handleDownload = createAjaxOperation(async ({YYMM}, _cancelToken, updateProgress) => {
    const downloadUrl = await getSubsidyClaimFileDownloadUrl(YYMM);

    updateProgress(0.5);

    window.open(downloadUrl, '_blank');
  });

  const {add, items} = useAjaxOperations({
    operation: handleDownload,
    autoRemoveDelayWhenSuccess: 3000,
  });

  const isEmpty = !isLoading && data?.isEmpty;

  return (
    <PageContainer heading="Subsidy claim files" className="pt-8">
      {isError && <QueryErrorAlert error={error as any} />}
      <Table
        isLoading={isLoading}
        isFetching={isFetching}
        pagination={
          <PaginationNavigation
            total={data?.total}
            currentPage={page}
            perPage={perPage}
            onChangePage={setPage}
            onChangePageSize={setPerPage}
            isFetching={isFetching}
          />
        }>
        <Table.Thead>
          <Table.Tr>
            <Table.Th className="w-1/2">Subsidy claim file month and year</Table.Th>
            <Table.Th className="w-1/4">Created on</Table.Th>
            <Table.Th className="text-right"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {!isEmpty &&
            data?.claimFiles.map((claimFile) => (
              <Table.Tr key={claimFile.id}>
                <Table.Td className="w-1/2">
                  {formatDate(useMalaysiaTime(new Date(claimFile.claimFileTime)), {
                    format: 'MMMM y',
                  })}
                </Table.Td>
                <Table.Td className="w-1/4">
                  {formatDate(useMalaysiaTime(new Date(claimFile.createdAt)), {format: 'd/M/y'})}
                </Table.Td>
                <Table.Td className="text-right">
                  <BareButton
                    className="text-brand-500"
                    onClick={() =>
                      add({
                        YYMM: formatDate(useMalaysiaTime(new Date(claimFile.claimFileTime)), {
                          format: 'yyMM',
                        }),
                        fileName: `Subsidy_${formatDate(
                          useMalaysiaTime(new Date(claimFile.claimFileTime)),
                          {
                            format: 'MMMM',
                          },
                        )}`,
                      })
                    }>
                    DOWNLOAD
                  </BareButton>
                </Table.Td>
              </Table.Tr>
            ))}
        </Table.Tbody>
        {isEmpty && (
          <Table.Caption>
            <div className="py-12">
              <p className="text-center text-gray-400 text-sm">No claim files was found</p>
            </div>
          </Table.Caption>
        )}
      </Table>
      {items.map((item) => (
        <Notification
          title={item.input['fileName']}
          Icon={item.status === 'pending' ? DocIcon : undefined}
          variant={item.status !== 'pending' ? item.status : undefined}
          description={
            item.status === 'pending'
              ? 'Preparing to download. Please wait...'
              : 'You have successfully downloaded the ZIP file.'
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
    </PageContainer>
  );
};
