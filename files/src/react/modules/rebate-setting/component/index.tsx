import * as React from 'react';
import {
  CardHeading,
  DataTable as Table,
  usePaginationState,
  PaginationNavigation,
  formatDate,
  TabButtonGroup,
  useFilter,
  Button,
  PlusIcon,
  Badge,
  Filter,
} from '@setel/portal-ui';
import {QueryErrorAlert} from '../../../components/query-error-alert';
import {useMalaysiaTime} from '../../billing-invoices/billing-invoices.helpers';
import {useRebateSettings} from '../rebate-setting.queries';
import {EmptyDataTableCaption} from '../../../components/empty-data-table-caption';
import {
  levelOptions,
  mappingRebateStatusColor,
  rebateSettingLevel,
  RebateStatusOptions,
} from '../rebate-settings.constant';
import {rebateSettingRole} from '../../../../shared/helpers/roles.type';
import {HasPermission} from '../../auth/HasPermission';
import {RebateSettingCreateModal} from './rebate-setting-create-modal';
import {CURRENT_ENTERPRISE} from '../../../../shared/const/enterprise.const';
import {IRebateSettingBase} from '../../../services/api-rebates.type';

export const RebateSettingListing = (props: {planId: number}) => {
  const paginationState = usePaginationState({initialPerPage: 10});
  const [level, setLevel] = React.useState(rebateSettingLevel.ACCOUNT);
  const [showModalCreate, setShowModalCreate] = React.useState(false);
  const filter = useFilter(
    {
      searchSPAccountsCompanies: '',
      status: undefined,
    },
    {
      components: [
        {
          key: 'status',
          type: 'select',
          props: {
            label: 'Status',
            options: RebateStatusOptions,
            placeholder: 'Any statuses',
          },
        },
        {
          key: 'searchSPAccountsCompanies',
          type: 'search',
          props: {
            label: 'Search',
            placeholder: 'Enter Smartpay account ID or name',
            wrapperClass: 'col-span-2',
          },
        },
      ],
    },
  );

  const [{values}] = filter;

  const {data, isLoading, isFetching, error} = useRebateSettings({
    page: paginationState.page,
    perPage: paginationState.perPage,
    level,
    planId: props.planId,
    searchSPAccountsCompanies: values.searchSPAccountsCompanies,
    status: values.status,
  });

  const isEmpty = isLoading || (!data?.total && +data?.total === 0);

  const webDashboardUrl = CURRENT_ENTERPRISE.dashboardUrl;
  const getDetailRebateSetting = (
    rebateSettingId: string,
    spId: string,
    level: rebateSettingLevel,
  ): string => {
    return `${webDashboardUrl}/settings?${
      level === rebateSettingLevel.ACCOUNT ? `merchantId=${spId}` : `companyId=${spId}`
    }&tab=Pricing&rebateSettingId=${rebateSettingId}&redirect-from=admin`;
  };

  return (
    <div className={'mt-8'}>
      {error && <QueryErrorAlert error={error as any} />}
      <Table
        isLoading={isLoading}
        isFetching={isFetching}
        preContent={
          <>
            <TabButtonGroup
              value={level}
              onChangeValue={(value: rebateSettingLevel) => {
                paginationState.setPage(1);
                paginationState.setPerPage(10);
                setLevel(value);
              }}
              options={levelOptions.map(({label, value}) => {
                return {label, value};
              })}
              className="px-3 sm:px-6 py-3"
            />
            <Table.FilterComponents filter={filter} />
            <Filter
              filter={filter}
              className={'pu-px-4 pu-py-5 sm:pu-px-7 pu-border-b pu-border-gray-200'}
            />
          </>
        }
        pagination={
          <PaginationNavigation
            pageSizeOptions={[10, 50, 100]}
            total={data?.total}
            hideIfSinglePage={data?.total < 10}
            perPage={paginationState.perPage}
            currentPage={paginationState.page}
            onChangePage={paginationState.setPage}
            onChangePageSize={paginationState.setPerPage}
            isFetching={isFetching}
          />
        }
        heading={
          <CardHeading title={'Rebate settings'}>
            <HasPermission accessWith={[rebateSettingRole.modify]}>
              <Button
                onClick={() => setShowModalCreate(true)}
                variant="outline"
                minWidth="none"
                leftIcon={<PlusIcon />}>
                CREATE
              </Button>
            </HasPermission>
          </CardHeading>
        }>
        <Table.Thead>
          <Table.Tr>
            <Table.Td className="w-1/5">Name</Table.Td>
            <Table.Td className="w-1/5">Status</Table.Td>
            <Table.Td className="w-1/5">Id</Table.Td>
            <Table.Td className="w-1/5">Start date</Table.Td>
            <Table.Td className="w-1/5 text-right">End date</Table.Td>
          </Table.Tr>
        </Table.Thead>
        {!isEmpty && (
          <Table.Tbody>
            {data?.rebateSettings.map((rebateSetting: IRebateSettingBase, index: number) => (
              <Table.Tr
                data-testid="rebate-setting-element"
                key={index}
                className="cursor-pointer"
                render={(props) => (
                  <a
                    target="_blank"
                    href={getDetailRebateSetting(rebateSetting.id, rebateSetting.spId, level)}
                    {...props}
                  />
                )}>
                <Table.Td>{rebateSetting.name}</Table.Td>
                <Table.Td>
                  <Badge color={mappingRebateStatusColor[rebateSetting.status]}>
                    {rebateSetting.status.toUpperCase()}
                  </Badge>
                </Table.Td>
                <Table.Td>{rebateSetting.spId}</Table.Td>
                <Table.Td>
                  {formatDate(useMalaysiaTime(rebateSetting.startDate), {
                    formatType: 'dateOnly',
                  })}
                </Table.Td>
                <Table.Td className="text-right">
                  {rebateSetting.endDate
                    ? formatDate(useMalaysiaTime(rebateSetting.endDate), {
                        formatType: 'dateOnly',
                      })
                    : '-'}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        )}
        {isEmpty && <EmptyDataTableCaption />}
      </Table>
      {showModalCreate && (
        <RebateSettingCreateModal planId={props.planId} setShowModal={setShowModalCreate} />
      )}
    </div>
  );
};
