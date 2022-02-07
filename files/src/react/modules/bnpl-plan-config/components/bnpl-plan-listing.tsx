import {
  Badge,
  Button,
  DataTable as Table,
  Filter,
  FilterControls,
  formatMoney,
  PaginationNavigation,
  titleCase,
} from '@setel/portal-ui';
import * as React from 'react';
import {Link} from 'src/react/routing/link';
import {PageContainer} from 'src/react/components/page-container';
import {
  PlanType,
  Country,
  Currency,
  PlanStatus,
  PlanStructure,
} from 'src/react/modules/bnpl-plan-config/bnpl.enum';
import {useDataTableState} from 'src/react/hooks/use-state-with-query-params';
import {bnplPlanQueryKey} from '../bnpl-plan.queries';
import {getBnplPlans} from 'src/react/services/api-bnpl.service';
import {useBnplPlanConfigDetailModal} from './modals/plan-config-detail-modal';
import {GetBnplPlanOptions, IPlan} from 'src/react/modules/bnpl-plan-config/bnpl.interface';
import {HasPermission} from 'src/react/modules/auth/HasPermission';
import {
  statusOptions,
  planTypeOptions,
  currencyOptions,
  countryOptions,
  amountOptions,
  planStructureOptions,
  statusColor,
} from '../bnpl-plan.constant';
import {adminBnplPlanConfig} from 'src/shared/helpers/roles.type';

export const BNPLPlanListing = () => {
  const {
    query: {data, isLoading, isFetching},
    pagination,
    filter,
  } = useDataTableState({
    initialFilter: {
      status: '',
      planType: '',
      currencyCode: Currency.MYR,
      country: Country.MALAYSIA,
      amount: '',
      planStructure: '' as any,
    } as unknown as FilterValues,
    queryKey: bnplPlanQueryKey.planListing,
    queryFn: (values) => getBnplPlans(transformToApiFilter(values)),
    components: [
      {
        key: 'status',
        type: 'select',
        props: {
          label: 'Status',
          wrapperClass: 'col-span-1',
          options: [{label: 'All status', value: ''}, ...statusOptions],
          placeholder: 'All status',
        },
      },
      {
        key: 'instructionInterval',
        type: 'select',
        props: {
          label: 'Plan Type',
          wrapperClass: 'col-span-1',
          options: [{label: 'All plan type', value: ''}, ...planTypeOptions],
          placeholder: 'All plan type',
        },
      },
      {
        key: 'currencyCode',
        type: 'select',
        props: {
          label: 'Currency',
          wrapperClass: 'col-span-1',
          options: currencyOptions,
          placeholder: 'All currency',
        },
      },
      {
        key: 'country',
        type: 'select',
        props: {
          label: 'Country',
          wrapperClass: 'col-span-1',
          options: countryOptions,
          placeholder: 'All country',
        },
      },
      {
        key: 'amount',
        type: 'select',
        props: {
          label: 'Amount',
          wrapperClass: 'col-span-1',
          options: [{label: 'Any amount', value: ''}, ...amountOptions],
          placeholder: 'Any amount',
        },
      },
      {
        key: 'planStructure',
        type: 'select',
        props: {
          label: 'Plan structure',
          wrapperClass: 'col-span-1',
          options: [{label: 'All plan structure', value: ''}, ...planStructureOptions],
          placeholder: 'All plan structure',
        },
      },
      {
        key: 'name',
        type: 'search',
        props: {
          label: 'Search',
          wrapperClass: 'col-span-2',
          placeholder: 'Search by plan ID or plan name',
          'data-testid': 'textbox',
        },
      },
    ],
  });

  const bnplPlanConfigDetailModal = useBnplPlanConfigDetailModal();

  return (
    <PageContainer
      heading="BNPL Plans"
      action={
        <>
          <HasPermission accessWith={[adminBnplPlanConfig.adminCreate]}>
            <Button variant="primary" onClick={bnplPlanConfigDetailModal.open}>
              CREATE
            </Button>
            {bnplPlanConfigDetailModal.component}
          </HasPermission>
        </>
      }>
      <div className="space-y-5">
        <FilterControls className="grid-cols-4" filter={filter} />
        <Filter filter={filter} />
        <Table
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={
            data &&
            (data.items.length > 0 || pagination.page > 1) && (
              <PaginationNavigation
                variant="page-list"
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
              <Table.Th>Plan Id</Table.Th>
              <Table.Th>Plan Name</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Plan Type</Table.Th>
              <Table.Th className="text-right">Min. Amount (RM)</Table.Th>
              <Table.Th className="text-right">Max. Amount (RM)</Table.Th>
              <Table.Th className="text-right">Plan Structure</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data &&
              data.items.map((plan: IPlan) => (
                <Table.Tr
                  key={plan.id}
                  render={(props) => (
                    <Link
                      to={`/buy-now-pay-later/plans/details/${plan.id}`}
                      data-testid="plan-record"
                      {...props}
                    />
                  )}>
                  <Table.Td>{plan.id}</Table.Td>

                  <Table.Td>{titleCase(plan.name) || '-'}</Table.Td>

                  <Table.Td>
                    <Badge color={statusColor[plan.status]}>{plan.status.toUpperCase()}</Badge>
                  </Table.Td>

                  <Table.Td>{titleCase(plan.instructionInterval) || '-'}</Table.Td>

                  <Table.Td className="text-right">{formatMoney(plan.minAmount)}</Table.Td>
                  <Table.Td className="text-right">{formatMoney(plan.maxAmount)}</Table.Td>
                  <Table.Td className="text-right">{titleCase(plan.planStructure) || '-'}</Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
          {data && data.items.length === 0 && (
            <Table.Caption>
              <div className="p-6 text-center">
                <span>No records found.</span>
              </div>
            </Table.Caption>
          )}
        </Table>
      </div>
    </PageContainer>
  );
};

interface FilterValues {
  status: PlanStatus;
  instructionInterval: PlanType;
  currencyCode: Currency;
  country: Country;
  amount: string;
  planStructure: PlanStructure;
  name: string;
}

const transformToApiFilter = ({...filter}: FilterValues): GetBnplPlanOptions => {
  return {
    ...filter,
  };
};
