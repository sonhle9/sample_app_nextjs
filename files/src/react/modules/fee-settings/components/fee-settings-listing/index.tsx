import * as React from 'react';
import {
  DataTable as Table,
  PaginationNavigation,
  usePaginationState,
  formatDate,
  formatMoney,
} from '@setel/portal-ui';
import {PageContainer} from 'src/react/components/page-container';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {EmptyDataTableCaption} from 'src/react/components/empty-data-table-caption';
import {useFeeSettings} from '../../fee-settings.queries';
import {Link} from 'src/react/routing/link';

export const FeeSettingsListing = () => {
  const {page, setPage, perPage, setPerPage} = usePaginationState();
  const {data, isLoading, isError, error, isFetching} = useFeeSettings({page, perPage});

  const isEmpty = !isLoading && data?.feeSettings?.length === 0;

  return (
    <PageContainer heading="Fee settings" className="space-y-4 mt-6">
      {isError && <QueryErrorAlert error={error as any} />}
      {!isError && (
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
            />
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className="w-1/4">Fee setting</Table.Th>
              <Table.Th className="w-1/4 text-right">Fee amount (RM)</Table.Th>
              <Table.Th className="w-1/4">Created on</Table.Th>
              <Table.Th className="text-right">Updated on</Table.Th>
            </Table.Tr>
          </Table.Thead>
          {!isEmpty && (
            <Table.Tbody>
              {data?.feeSettings?.map((feeSetting) => (
                <Table.Tr
                  key={feeSetting.feeSettingId}
                  render={(props) => (
                    <Link {...props} to={`/pricing/fee-settings/${feeSetting.feeSettingId}`} />
                  )}>
                  <Table.Td>{feeSetting.name}</Table.Td>
                  <Table.Td className="text-right">
                    {!isNaN(feeSetting?.amount) ? formatMoney(feeSetting?.amount) : '-'}
                  </Table.Td>
                  <Table.Td>
                    {feeSetting.createdAt ? formatDate(feeSetting?.createdAt) : '-'}
                  </Table.Td>
                  <Table.Td className="text-right">
                    {feeSetting.updatedAt ? formatDate(feeSetting?.updatedAt) : '-'}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          )}
          {isEmpty && <EmptyDataTableCaption />}
        </Table>
      )}
    </PageContainer>
  );
};
