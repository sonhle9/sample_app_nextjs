import {
  Button,
  PlusIcon,
  Badge,
  Filter,
  FilterControls,
  DataTable as Table,
  flattenArray,
  dedupeArray,
  PaginationNavigation,
  formatDate,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {Link} from 'src/react/routing/link';
import {useHasPermission} from 'src/react/modules/auth/HasPermission';
import {useCampaignDetailsModal} from './use-campaign-details-modal';
import {rewardsRole} from 'src/shared/helpers/roles.type';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {campaignQueryKeys} from 'src/react/modules/reward-campaign/reward-campaign.queries';
import {listCampaigns} from 'src/react/services/api-rewards.service';

export const RewardCampaignListing = () => {
  const {
    filter,
    pagination,
    query: {data, isLoading, isFetching},
  } = useDataTableState({
    initialFilter: {isActive: '', createdOn: ['', ''], name: ''},
    components: [
      {
        key: 'isActive',
        type: 'select',
        props: {
          label: 'Status',
          options: [
            {value: '', label: 'All statuses'},
            {value: 'true', label: 'Active'},
            {value: 'false', label: 'Inactive'},
          ],
          wrapperClass: 'md:col-span-1',
        },
      },
      {
        key: 'createdOn',
        type: 'daterange',
        props: {
          label: 'Created on',
          dayOnly: true,
          wrapperClass: 'md:col-span-1',
        },
      },
      {
        key: 'name',
        type: 'search',
        props: {
          label: 'Search',
          placeholder: 'Enter campaign name',
          wrapperClass: 'md:col-span-2',
        },
      },
    ],
    keepPreviousData: true,
    queryKey: campaignQueryKeys.list,
    queryFn: ({page, perPage, createdOn: [fromDate, toDate], isActive, name}) =>
      listCampaigns({
        page,
        perPage,
        name: name || undefined,
        isActive: isActive || undefined,
        fromDate: !!fromDate ? fromDate : undefined,
        toDate: !!toDate ? toDate : undefined,
      }),
  });

  const campaignDetailsModal = useCampaignDetailsModal();
  const hasCreatePermission = useHasPermission([rewardsRole.admin_rewards_campaign_create]);

  return (
    <PageContainer
      heading="Campaigns"
      className="space-y-8"
      action={
        hasCreatePermission && (
          <>
            <Button onClick={campaignDetailsModal.open} variant="primary" leftIcon={<PlusIcon />}>
              CREATE
            </Button>
            {campaignDetailsModal.component}
          </>
        )
      }>
      <FilterControls filter={filter} />
      <Filter filter={filter} />
      <Table
        isLoading={isLoading}
        isFetching={isFetching}
        pagination={
          <PaginationNavigation
            total={data?.total}
            currentPage={pagination.page}
            perPage={pagination.perPage}
            onChangePage={pagination.setPage}
            onChangePageSize={pagination.setPerPage}
            pageSizeOptions={[20, 50]}
          />
        }>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Restriction</Table.Th>
            <Table.Th>Criteria</Table.Th>
            <Table.Th>Consequence</Table.Th>
            <Table.Th>Start Date</Table.Th>
            <Table.Th>End Date</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data?.data?.map((campaign) => (
            <Table.Tr key={campaign.id}>
              <Table.Td
                render={(cellProps) => (
                  <Link {...cellProps} to={`rewards/rewards-campaigns/${campaign.id}`} />
                )}>
                {campaign.name}
              </Table.Td>
              <Table.Td>
                <Badge className="uppercase" color={campaign.isActive ? 'success' : 'grey'}>
                  {campaign.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </Table.Td>
              <Table.Td>{campaign.restriction.join(', ')}</Table.Td>
              <Table.Td>
                {dedupeArray(
                  flattenArray(campaign.goals?.map((g) => g.criteria?.map((c) => c.type))),
                )?.join(', ')}
              </Table.Td>
              <Table.Td>
                {dedupeArray(
                  flattenArray(
                    campaign.goals?.map(({consequence}) =>
                      Array.isArray(consequence) ? undefined : consequence.type,
                    ),
                  ),
                )?.join(', ')}
              </Table.Td>
              <Table.Td>{formatDate(campaign.startDate)}</Table.Td>
              <Table.Td>{campaign.endDate ? formatDate(campaign.endDate) : '-'}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </PageContainer>
  );
};
