import {
  DataTable as Table,
  formatDate,
  Badge,
  Button,
  Card,
  TabButtonGroup,
  DATE_RANGES,
  DataTableCaption,
} from '@setel/portal-ui';
import kebabCase from 'lodash/kebabCase';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {
  reliabilityQueryKeys,
  useFailedServiceStats,
  useRetriggerFailedActions,
} from 'src/react/modules/reward-reliability/reward-reliability.queries';
import {getFailedActions} from 'src/react/services/api-rewards.service';
import {useRouter} from 'src/react/routing/routing.context';

export const RewardReliabilityListing = () => {
  const router = useRouter();
  const {
    query: {data, isLoading, isFetching},
    filter,
  } = useDataTableState({
    initialFilter: {service: 'apiRewards', createdOn: DATE_RANGES.today},
    components: [
      {
        key: 'createdOn',
        type: 'daterange',
        props: {
          label: 'Created at',
          dayOnly: true,
          wrapperClass: 'md:col-span-1',
        },
      },
      // dummy component below needed to avoid daterange truncated width
      {
        key: 'service',
        type: 'search',
        props: {wrapperClass: 'hidden'},
      },
    ],
    queryKey: reliabilityQueryKeys.list,
    queryFn: ({service, createdOn: [startDate, endDate]}) =>
      getFailedActions({service, startDate, endDate}),
  });
  const [filterState, filterActions] = filter;
  const [startDate, endDate] = filterState.values.createdOn;
  const failedServiceStatsQuery = useFailedServiceStats({startDate, endDate});

  const serviceOptions =
    failedServiceStatsQuery?.data?.map(({service, data: {successRate, success, total}}) => ({
      label: (
        <div>
          {kebabCase(service)}
          <div>{total ? `${success} / ${total}` : '-'}</div>
        </div>
      ),
      value: service,
      badge: successRate + '%',
    })) || [];

  const {mutate: retriggerFailedActions} = useRetriggerFailedActions();

  return (
    <PageContainer heading="Rewards Reliability">
      <Table
        isLoading={isLoading}
        isFetching={isFetching}
        filter={filter}
        preContent={
          <TabButtonGroup
            value={filterState.values.service}
            onChangeValue={filterActions.setValueCurry('service')}
            options={serviceOptions}
            className="px-3 sm:px-6 py-3"
          />
        }
        heading={
          <Card.Heading title={`Failed actions (${filterState.values.service})`}>
            <Button
              variant="outline"
              minWidth="none"
              disabled={isFetching || !data?.length}
              isLoading={isFetching}
              onClick={() => retriggerFailedActions({service: filterState.values.service})}>
              RETRIGGER
            </Button>
          </Card.Heading>
        }>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>User ID</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Created At</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data?.map((action) => (
            <Table.Tr
              key={action._id}
              className="cursor-pointer"
              onClick={() => router.navigateByUrl(`/customers/${action.userId}`)}>
              <Table.Td>{action.userId}</Table.Td>
              <Table.Td>
                <Badge className="uppercase" color="grey">
                  {action.type}
                </Badge>
              </Table.Td>
              <Table.Td>{formatDate(action.createdAt)}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
        {!(isLoading && isFetching) && data?.length === 0 && (
          <DataTableCaption>
            <div className="py-12">
              <p className="text-center text-gray-400 text-sm">No data available.</p>
            </div>
          </DataTableCaption>
        )}
      </Table>
    </PageContainer>
  );
};
