import {
  BareButton,
  DataTable as Table,
  Filter,
  FilterControls,
  formatDate,
  PaginationNavigation,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {Link} from 'src/react/routing/link';
import {
  FraudProfilesStatus,
  FraudProfilesTargetType,
  IIndexFraudProfileFilters,
  indexFraudProfiles,
} from 'src/react/services/api-blacklist.service';
import {adminFraudProfile} from 'src/shared/helpers/roles.type';
import {HasPermission} from '../../auth/HasPermission';
import {statusOptions} from '../fraud-profile.const';
import {fraudProfileQueryKeys} from '../fraud-profile.queries';
import {FraudProfileStatus} from './fraud-profile-status';

export const FraudProfileListing = () => {
  const {
    query: {data, isLoading, isFetching},
    pagination,
    filter,
  } = useDataTableState({
    queryKey: fraudProfileQueryKeys.listFraudProfile,
    queryFn: (values) => indexFraudProfiles(mapFilterToApi(values)),
    initialFilter: {
      dateRange: ['', ''],
      status: '' as any,
      targetName: '',
    } as FraudProfileFilter,
    components: [
      {
        key: 'status',
        type: 'select',
        props: {
          label: 'Status',
          options: statusOptions,
          placeholder: 'All',
        },
      },
      {
        key: 'dateRange',
        type: 'daterange',
        props: {
          label: 'Created date',
        },
      },
      {
        key: 'targetName',
        type: 'search',
        props: {
          label: 'Search',
          placeholder: 'Search by name',
          wrapperClass: 'xl:col-span-2',
        },
      },
    ],
  });

  return (
    <PageContainer heading="Fraud profiles">
      <div className="space-y-5">
        <HasPermission accessWith={[adminFraudProfile.adminSearch]}>
          <FilterControls filter={filter} />
          <Filter filter={filter} />
        </HasPermission>
        <Table
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={
            data &&
            (data.items.length > 0 || pagination.page > 1) && (
              <PaginationNavigation
                onChangePage={pagination.setPage}
                onChangePageSize={pagination.setPerPage}
                currentPage={pagination.page}
                perPage={pagination.perPage}
                total={data.total}
              />
            )
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Type</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Created On</Table.Th>
              <Table.Th>Updated On</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data &&
              data.items.map((profile) => (
                <Table.Tr key={profile.id}>
                  <Table.Td>{targetTypeLabel[profile.targetType] || profile.targetType}</Table.Td>
                  <Table.Td
                    render={(cellProps) => (
                      <Link {...cellProps} to={`/customers/${profile.targetId}`} />
                    )}>
                    {profile.targetName}
                  </Table.Td>
                  <Table.Td>
                    <FraudProfileStatus status={profile.status} />
                  </Table.Td>
                  <Table.Td>{formatDate(profile.createdAt)}</Table.Td>
                  <Table.Td>{formatDate(profile.updatedAt)}</Table.Td>
                  <Table.Td className="text-right">
                    <BareButton
                      render={(btnProps) => (
                        <Link
                          {...btnProps}
                          to={`/risk-controls/fraud-profiles/details/${profile.targetId}`}
                        />
                      )}
                      className="text-brand-500">
                      DETAILS
                    </BareButton>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
          {data && data.isEmpty && (
            <Table.Caption>
              <div className="p-6 text-center">
                <p>No data to be displayed.</p>
              </div>
            </Table.Caption>
          )}
        </Table>
      </div>
    </PageContainer>
  );
};

interface FraudProfileFilter {
  dateRange: [string, string];
  status: FraudProfilesStatus;
  targetName: string;
}

const mapFilterToApi = ({
  dateRange: [createdAtFrom, createdAtTo],
  ...filter
}: FraudProfileFilter): IIndexFraudProfileFilters => ({
  ...filter,
  createdAtFrom,
  createdAtTo,
});

const targetTypeLabel: Record<FraudProfilesTargetType, string> = {
  [FraudProfilesTargetType.USER]: 'Customer',
  [FraudProfilesTargetType.MERCHANT]: 'Merchant',
};
