import {
  DownloadIcon,
  Button,
  BareButton,
  Card,
  DescList,
  JsonPanel,
  EditIcon,
  formatDate,
  Badge,
  DataTable as Table,
  PaginationNavigation,
  HelpText,
} from '@setel/portal-ui';
import {Link} from 'src/react/routing/link';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {useHasPermission} from 'src/react/modules/auth/HasPermission';
import {
  useRewardCampaignDetails,
  useGrantCampaign,
} from 'src/react/modules/reward-campaign/reward-campaign.queries';
import {rewardsRole} from 'src/shared/helpers/roles.type';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {
  campaignQueryKeys,
  useDownloadCampaignCustomers,
} from 'src/react/modules/reward-campaign/reward-campaign.queries';
import {listCampaignCustomers} from 'src/react/services/api-rewards.service';
import {
  GoalStatusesEnum,
  ICampaign,
  CampaignRestrictionType,
} from 'src/shared/interfaces/reward.interface';
import {downloadTextFile} from 'src/react/modules/store-orders/store-orders.helpers';
import {useCampaignDetailsModal} from './use-campaign-details-modal';
import {MAX_DATE} from 'src/react/modules/reward-campaign/reward-campaign.const';
import {parseISO, isEqual} from 'date-fns';
import {getCustomerType, customerTypeOptions} from './helper';

export const RewardCampaignDetails = (props: {id: string}) => {
  const [isCustomerCardOpen, setIsCustomerCardOpen] = React.useState(false);
  const {data, isLoading} = useRewardCampaignDetails(props.id);
  const hasCreatePermission = useHasPermission([rewardsRole.admin_rewards_campaign_create]);
  const campaignDetailsModal = useCampaignDetailsModal(data);

  const {
    pagination,
    query: campaignCustomerQuery,
    filter,
  } = useDataTableState({
    initialFilter: {noop: data?.goals?.[0]?.id || '', createdOn: ['', '']},
    components: [
      // 📝 Derek: Goals dropdown for UI cosmetic purpose, does nothing
      {
        key: 'noop',
        type: 'select',
        props: {
          label: 'Goals',
          options: data?.goals?.map(({id, name}) => ({value: id, label: name})) || [],
          wrapperClass: 'md:col-span-1',
        },
      },
      {
        key: 'createdOn',
        type: 'daterange',
        props: {
          label: 'Created on',
          dayOnly: true,
          wrapperClass: 'md:col-span-2',
        },
      },
    ],
    enabled: isCustomerCardOpen,
    queryKey: campaignQueryKeys.customerList,
    queryFn: ({noop, createdOn: [fromDate, toDate], ...pagination}) =>
      listCampaignCustomers({
        id: props.id,
        createdAtGte: fromDate || undefined,
        createdAtLte: toDate || undefined,
        ...pagination,
      }),
  });

  const {mutate: downloadCSV, isLoading: isDownloading} = useDownloadCampaignCustomers();

  const customerTypeOption = data
    ? customerTypeOptions.find((option) => option.value === getCustomerType(data))
    : null;
  const isExistingCustomer = customerTypeOption?.value === 'existing';
  const isBrazeCustomer = data?.restriction?.includes('brazeCustomer' as CampaignRestrictionType);
  const hasCustomerList = data?.includeList?.length || data?.excludeList?.length;
  const restrictionsWithoutBrazeCustomer =
    data?.restriction?.filter((r) => r !== 'brazeCustomer') ?? [];

  return (
    <PageContainer
      heading="Reward campaign details"
      action={
        hasCreatePermission && (
          <>
            <Button
              disabled={isLoading}
              onClick={campaignDetailsModal.open}
              variant="outline"
              leftIcon={<EditIcon />}>
              EDIT
            </Button>
            {campaignDetailsModal.component}
          </>
        )
      }>
      <div className="space-y-8">
        <Card data-testid="general">
          <Card.Heading title="General" />
          <Card.Content>
            <DescList isLoading={isLoading}>
              <DescList.Item label="Campaign title" value={data?.name ?? '-'} />
              <DescList.Item
                label="Status"
                value={
                  <Badge className="uppercase" color={data?.isActive ? 'success' : 'grey'}>
                    {data?.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                }
              />
              <DescList.Item
                label="Category"
                value={data?.category ?? '-'}
                valueClassName="capitalize"
              />
              <DescList.Item label="Description" value={data?.description || '-'} />
              <DescList.Item label="Targeting" value={customerTypeOption?.label || '-'} />
              {isExistingCustomer && (
                <DescList.Item
                  label="Existing customer option"
                  value={
                    (isBrazeCustomer && 'Customers entering Braze Campaign') ||
                    (hasCustomerList && 'Import list of customers') ||
                    '-'
                  }
                />
              )}
              {isBrazeCustomer && (
                <DescList.Item
                  label="Multiple granting via webhook"
                  value={data?.multiGrant ? 'Enabled' : 'Disabled'}
                />
              )}
              <DescList.Item
                label="Start date"
                value={data?.startDate ? formatDate(data.startDate) : '-'}
              />
              <DescList.Item
                label="End date"
                value={
                  data?.endDate && !isEqual(parseISO(data.endDate), MAX_DATE)
                    ? formatDate(data.endDate)
                    : '-'
                }
              />
              <DescList.Item
                label="All goals expire on campaign end date"
                value={data?.rejectProgressAfterCampaignEnd ? 'Enabled' : 'Disabled'}
              />
              <DescList.Item
                label="Restrictions"
                value={
                  restrictionsWithoutBrazeCustomer.length > 0
                    ? restrictionsWithoutBrazeCustomer.map((restriction) => (
                        <Badge key={restriction} className="mr-4 mb-4" color="grey">
                          {restriction}
                        </Badge>
                      ))
                    : '-'
                }
              />
              <DescList.Item
                label="Include past actions to goals for all users"
                value={data?.includePastActions ? 'Enabled' : 'Disabled'}
              />
              {data?.codes?.length > 0 && (
                <DescList.Item
                  label="Codes"
                  value={data.codes.map(({code}) => (
                    <Badge key={code} className="mr-4 mb-4" color="grey">
                      {code}
                    </Badge>
                  ))}
                />
              )}
              {data?.manualOperation && <ManualGranting campaign={data} />}
            </DescList>
          </Card.Content>
        </Card>
        <JsonPanel data-testid="json" json={data || ({} as any)} allowToggleFormat />
        <Table
          data-testid="customers"
          expandable
          isOpen={isCustomerCardOpen}
          onToggleOpen={() => setIsCustomerCardOpen((prev) => !prev)}
          isLoading={campaignCustomerQuery.isLoading}
          isFetching={campaignCustomerQuery.isFetching}
          filter={filter}
          heading={
            <Card.Heading data-testid="customers-heading" title="Customers">
              {isCustomerCardOpen && (
                <Button
                  variant="outline"
                  leftIcon={<DownloadIcon />}
                  minWidth="none"
                  disabled={isDownloading}
                  isLoading={isDownloading}
                  onClick={() =>
                    downloadCSV(
                      {
                        id: props.id,
                        createdAtGte: filter[0].values.createdOn[0] || undefined,
                        createdAtLte: filter[0].values.createdOn[1] || undefined,
                        perPage: pagination.perPage,
                        page: pagination.page,
                      },
                      {onSuccess: (value) => downloadTextFile(value, 'campaign-customers.csv')},
                    )
                  }>
                  DOWNLOAD CSV
                </Button>
              )}
            </Card.Heading>
          }
          pagination={
            <PaginationNavigation
              total={campaignCustomerQuery.data?.total}
              currentPage={pagination.page}
              perPage={pagination.perPage}
              onChangePage={pagination.setPage}
              onChangePageSize={pagination.setPerPage}
              pageSizeOptions={[20, 50]}
            />
          }>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Full Name</Table.Th>
              <Table.Th>Goal</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Created At (Goal)</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {campaignCustomerQuery.data?.data?.map((row) => (
              <Table.Tr key={row._id}>
                <Table.Td
                  render={(cellProps) => (
                    <Link {...cellProps} to={`customers/${row.member.user.id}`} />
                  )}>
                  {row.member?.user?.fullName}
                </Table.Td>
                <Table.Td>{row.title}</Table.Td>
                <Table.Td>
                  <Badge
                    className="uppercase"
                    color={row.status === GoalStatusesEnum.active ? 'success' : 'grey'}>
                    {row.status}
                  </Badge>
                </Table.Td>
                <Table.Td>{formatDate(row.createdAt)}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </PageContainer>
  );
};

function ManualGranting({campaign}: {campaign: ICampaign}) {
  const {mutateAsync: grantCampaign, isLoading} = useGrantCampaign();
  return (
    <DescList.Item
      label={
        <>
          List of Targeted Users
          <div>
            <HelpText>This campaign requires manual granting</HelpText>
          </div>
        </>
      }
      value={
        <ul className="list-disc list-inside space-y-1">
          {campaign?.includeList?.map((item) => (
            <li key={item._id} className="space-x-2">
              <span>{item.filename}</span>
              {item.manualGrantingStatus !== 'triggered' && (
                <BareButton
                  disabled={isLoading}
                  onClick={() => {
                    grantCampaign({
                      campaignId: campaign?._id,
                      includeListId: item._id,
                    });
                  }}
                  className="text-brand-500 h-10">
                  Grant
                </BareButton>
              )}
            </li>
          ))}
        </ul>
      }
    />
  );
}
