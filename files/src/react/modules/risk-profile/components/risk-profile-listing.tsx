import {
  DataTable as Table,
  Filter,
  FilterControls,
  formatDate,
  IconButton,
  PaginationNavigation,
  titleCase,
  ExternalIcon,
  Button,
  PlusIcon,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {
  IIndexRiskProfileFilters,
  indexRiskProfiles,
  RiskRatingLevel,
} from 'src/react/services/api-risk-profiles.service';
import {adminRiskProfile} from 'src/shared/helpers/roles.type';
import {HasPermission} from '../../auth/HasPermission';
import {cacheKeys} from '../risk-profile.queries';
import {ratingOptions} from '../risk-profile.const';
import {useRouter} from 'src/react/routing/routing.context';
import {RiskProfileModal} from './risk-profile-modal';
import {Link} from 'src/react/routing/link';
import {BlacklistUpload} from './risk-profile-upload';

export const RiskProfileListing = () => {
  const [isOpenRiskProfileModal, setRiskProfileModal] = React.useState(false);

  const {
    query: {data, isLoading, isFetching},
    pagination,
    filter,
  } = useDataTableState({
    queryKey: cacheKeys.riskProfileList,
    queryFn: (values) => indexRiskProfiles(mapFilterToApi(values)),
    initialFilter: {
      dateRange: ['', ''],
      rating: '' as any,
      identifier: '',
    } as RiskProfileFilter,
    components: [
      {
        key: 'rating',
        type: 'select',
        props: {
          label: 'Rating',
          options: ratingOptions,
          placeholder: 'All',
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
        key: 'identifier',
        type: 'search',
        props: {
          label: 'Search',
          placeholder: 'Enter account ID or ID number',
          wrapperClass: 'xl:col-span-2',
        },
      },
    ],
  });

  const router = useRouter();

  return (
    <PageContainer
      heading="Risk profiles"
      action={
        !isLoading && (
          <div className="flex items-center justify-end">
            <HasPermission accessWith={[adminRiskProfile.adminBlacklistUpload]}>
              <BlacklistUpload />
            </HasPermission>
            <HasPermission accessWith={[adminRiskProfile.adminCreate]}>
              <Button
                className="ml-5"
                onClick={() => setRiskProfileModal(true)}
                leftIcon={<PlusIcon />}
                variant="primary">
                CREATE
              </Button>
            </HasPermission>
          </div>
        )
      }>
      <div className="space-y-5" data-testid="risk-profile-listing">
        <HasPermission accessWith={[adminRiskProfile.adminSearch]}>
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
              <Table.Th>Account ID</Table.Th>
              <Table.Th>ID Number</Table.Th>
              <Table.Th>Rating</Table.Th>
              <Table.Th>Created On</Table.Th>
              <Table.Th className="text-right">Updated On</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data &&
              data.items.map((profile) => (
                <Table.Tr key={profile.id}>
                  <Table.Td className="flex flex-row">
                    <Link
                      data-testid="risk-profile-navigate-risk-profile-detail"
                      to={`/risk-controls/risk-profiles/details/${profile.id}`}>
                      {profile.accountId}
                    </Link>
                    <IconButton
                      className="pl-2 p-0"
                      data-testid="risk-profile-navigate-to-account-detail"
                      onClick={() => {
                        router.navigateByUrl(`customers/${profile.accountId}`);
                      }}>
                      <ExternalIcon className="text-brand-500 w-5 h-5" />
                    </IconButton>
                  </Table.Td>
                  <Table.Td>{profile.idNumber}</Table.Td>
                  <Table.Td>{titleCase(profile.riskRating)}</Table.Td>
                  <Table.Td>{formatDate(profile.createdAt)}</Table.Td>
                  <Table.Td className="text-right">{formatDate(profile.updatedAt)}</Table.Td>
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
      {isOpenRiskProfileModal && <RiskProfileModal onClose={() => setRiskProfileModal(false)} />}
    </PageContainer>
  );
};

interface RiskProfileFilter {
  dateRange: [string, string];
  rating: RiskRatingLevel;
  identifier: string;
}

const mapFilterToApi = ({
  dateRange: [startDate, endDate],
  ...filter
}: RiskProfileFilter): IIndexRiskProfileFilters => ({
  ...filter,
  startDate,
  endDate,
});
