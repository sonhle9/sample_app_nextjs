import * as React from 'react';
import {
  DataTable as Table,
  PaginationNavigation,
  usePaginationState,
  formatDate,
  Button,
  PlusIcon,
} from '@setel/portal-ui';
import {PageContainer} from 'src/react/components/page-container';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {HasPermission} from 'src/react/modules/auth/HasPermission';
import {Link} from 'src/react/routing/link';
import {feePlansRole} from 'src/shared/helpers/roles.type';
import {EmptyDataTableCaption} from 'src/react/components/empty-data-table-caption';
import {useFeePlans} from '../../fee-plans.queries';
import {FeePlansModalCreate} from './fee-plans-modal-create';

export const FeePlansListing = () => {
  const {page, setPage, perPage, setPerPage} = usePaginationState();
  const {data, isLoading, isError, error} = useFeePlans({page, perPage});
  const [showModalCreate, setShowModalCreate] = React.useState(false);

  const isEmpty = !isLoading && data?.feePlans?.length === 0;

  return (
    <PageContainer
      heading="Fee plans"
      className={'space-y-4'}
      action={
        <HasPermission accessWith={[feePlansRole.modify]}>
          <Button
            variant="primary"
            leftIcon={<PlusIcon />}
            onClick={() => setShowModalCreate(true)}
            data-testid="btn-create">
            CREATE
          </Button>
        </HasPermission>
      }>
      {isError && <QueryErrorAlert error={error as any} />}
      {!isError && (
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
              <Table.Th className="w-1/4">Fee plan</Table.Th>
              <Table.Th className="w-1/4">Merchant assigned</Table.Th>
              <Table.Th className="w-1/2 text-right">Created on</Table.Th>
            </Table.Tr>
          </Table.Thead>
          {!isEmpty && (
            <Table.Tbody>
              {data?.feePlans?.map((feePlan) => (
                <Table.Tr
                  key={feePlan.id}
                  render={(props) => <Link {...props} to={`/pricing/fee-plans/${feePlan.id}`} />}>
                  <Table.Td>{feePlan.name}</Table.Td>
                  <Table.Td>
                    {feePlan.merchantCount === 1
                      ? `${feePlan.merchantCount} merchant assigned`
                      : `${feePlan.merchantCount} merchants assigned`}
                  </Table.Td>
                  <Table.Td className="text-right">{formatDate(feePlan?.createdAt)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          )}
          {isEmpty && <EmptyDataTableCaption />}
        </Table>
      )}
      {showModalCreate && <FeePlansModalCreate setShowModal={setShowModalCreate} />}
    </PageContainer>
  );
};
