import * as React from 'react';
import {
  DataTable as Table,
  PaginationNavigation,
  usePaginationState,
  formatDate,
  Button,
  PlusIcon,
  useFilter,
  FilterControls,
  Filter,
} from '@setel/portal-ui';
import {PageContainer} from 'src/react/components/page-container';
import {QueryErrorAlert} from 'src/react/components/query-error-alert';
import {HasPermission} from 'src/react/modules/auth/HasPermission';
import {Link} from 'src/react/routing/link';
import {rebatePlansRole} from 'src/shared/helpers/roles.type';
import {EmptyDataTableCaption} from 'src/react/components/empty-data-table-caption';
import {useRebatePlans} from '../../rebate-plans.queries';
import {RebatePlansCreateModal} from './rebate-plans-create-modal';
import {useMalaysiaTime} from '../../../billing-invoices/billing-invoices.helpers';
import {IRebatePlan} from '../../../../services/api-rebates.type';

export const RebatePlansListing = () => {
  const {page, setPage, perPage, setPerPage} = usePaginationState();
  const [showModalCreate, setShowModalCreate] = React.useState(false);

  const filter = useFilter(
    {
      searchRebatePlan: '',
    },
    {
      components: [
        {
          key: 'searchRebatePlan',
          type: 'search',
          props: {
            label: 'Search',
            placeholder: 'Enter rebate plan name or ID',
            wrapperClass: 'col-span-2',
          },
        },
      ],
    },
  );
  const [{values}] = filter;

  const {data, isLoading, isError, error} = useRebatePlans({
    page,
    perPage,
    searchRebatePlan: values.searchRebatePlan,
  });
  const isEmpty = !isLoading && data?.rebatePlans?.length === 0;

  return (
    <PageContainer
      heading="Rebate plans"
      className={'space-y-4'}
      action={
        <HasPermission accessWith={[rebatePlansRole.modify]}>
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
      <FilterControls className="lg:grid-cols-4" filter={filter} />
      <Filter filter={filter} />
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
            <Table.Th className="w-1/3">Rebate plan</Table.Th>
            <Table.Th className="w-1/6">Plan id</Table.Th>
            <Table.Th className="w-1/6">Type</Table.Th>
            <Table.Th className="w-1/3 text-right">Created on</Table.Th>
          </Table.Tr>
        </Table.Thead>
        {!isEmpty && (
          <Table.Tbody>
            {data?.rebatePlans?.map((rebatePlan: IRebatePlan) => (
              <Table.Tr
                key={rebatePlan.id}
                render={(props) => (
                  <Link {...props} to={`/pricing/rebate-plans/${rebatePlan.planId}`} />
                )}>
                <Table.Td>{rebatePlan.planName}</Table.Td>
                <Table.Td>{rebatePlan.planId}</Table.Td>
                <Table.Td>{rebatePlan.type}</Table.Td>
                <Table.Td className="text-right">
                  {formatDate(useMalaysiaTime(rebatePlan?.createdAt))}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        )}
        {isEmpty && <EmptyDataTableCaption />}
      </Table>
      {showModalCreate && <RebatePlansCreateModal setShowModal={setShowModalCreate} />}
    </PageContainer>
  );
};
